import { FastifyInstance, FastifyRequest } from 'fastify';
import { GameConfig, PlayerInput, GameState } from '../shared/types.js';
import { GameSession } from './GameSession.js';

// Define WebSocket handler interface
interface WebSocketHandler {
    (connection: WebSocket, request: FastifyRequest): void;
}

// Augment Fastify types to include WebSocket
declare module 'fastify' {
    interface FastifyInstance {
        websocketServer: any;
    }
}

export function setupGameRoutes(server: FastifyInstance) {
    let gameSession: GameSession | null = null;
    const clients = new Set<WebSocket>();

    server.get('/game', { websocket: true }, (connection, req) => {
        // TypeScript now recognizes this as a WebSocket connection
        const socket = connection as unknown as WebSocket;
        clients.add(socket);

        const messageHandler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data.toString());

                if (data.type === 'INIT') {
                    if (!gameSession) {
                        gameSession = new GameSession(data.config as GameConfig);
                        
                        let lastUpdateTime = Date.now();
                        const gameLoop = setInterval(() => {
                            if (!gameSession) {
                                clearInterval(gameLoop);
                                return;
                            }
                            
                            const now = Date.now();
                            const deltaTime = (now - lastUpdateTime) / 1000;
                            lastUpdateTime = now;
                            
                            gameSession.update(deltaTime);
                            
                            const state = gameSession.getState();
                            clients.forEach(client => {
                                if (client.readyState === client.OPEN) {
                                    client.send(JSON.stringify({
                                        type: 'GAME_STATE',
                                        state
                                    }));
                                }
                            });
                        }, 16);
                    }

                    let playerNumber: 'player1' | 'player2' | null = null;
                    if (gameSession) {
                        const config = gameSession.getConfig();
                        playerNumber = config.gameMode === '1vAI' 
                            ? 'player1' 
                            : clients.size === 1 ? 'player1' : 'player2';
                    }

                    socket.send(JSON.stringify({
                        type: 'INIT_RESPONSE',
                        playerNumber
                    }));
                } else if (data.type === 'PLAYER_INPUT' && gameSession) {
                    gameSession.setPlayerInput(data.input as PlayerInput);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        const closeHandler = () => {
            clients.delete(socket);
            if (clients.size === 0) {
                gameSession = null;
            }
        };

        // Proper WebSocket event handlers
        socket.addEventListener('message', messageHandler);
        socket.addEventListener('close', closeHandler);

        // Cleanup on connection close
        socket.addEventListener('close', () => {
            socket.removeEventListener('message', messageHandler);
            socket.removeEventListener('close', closeHandler);
        });
    });
}
