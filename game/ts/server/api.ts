import { FastifyInstance } from 'fastify';
import { GameConfig } from '../shared/types';
import { GameSession } from './GameSession';
import websocketPlugin from '@fastify/websocket';

// TODO: Encapsulate 'INIT' and 'PLAYER_INPUT' in aux functions for better readability
export function setupGameRoutes(fastify: FastifyInstance)
{
	let gameSession: GameSession | null = null;
	const clients = new Set<WebSocket>();
	fastify.get('/game', { websocket: true }, (connection, req) => {
		clients.add(connection.socket);
		connection.socket.on('message', (message) => {
			const data = JSON.parse(message.toString());
			if (data.type === 'INIT')
			{
				// Initialize game if not already done
				if (!gameSession)
				{
					gameSession = new GameSession(data.config as GameConfig);
					// Start game loop
					setInterval(() => {
						if (!gameSession)
							return;
						const now = Date.now();
						const deltaTime = (now - lastUpdateTime) / 1000; // Convert to seconds
						lastUpdateTime = now;
						gameSession.update(deltaTime);
						// Broadcast state to all clients
						const state = gameSession.getState();
						clients.forEach(client => {
							if (client.readyState === client.OPEN)
							{
								client.send(JSON.stringify({
									type: 'GAME_STATE',
									state
								}));
							}		
						});
					}, 16); // ~60fps
					let lastUpdateTime = Date.now();
				}

				// Assign player number based on game mode
				let playerNumber: 'player1' | 'player2' | null = null;
				
				if (gameSession)
				{
					const config = gameSession.getState(); // Not state, but config!
					if (config.gameMode === '1vAI')
						playerNumber = 'player1';
					else // For multiplayer, assign first as player1, second as player2
						playerNumber = clients.size === 1 ? 'player1' : 'player2';
				}

				connection.socket.send(JSON.stringify({
					type: 'INIT_RESPONSE',
					playerNumber
				}));
			}
			else if (data.type === 'PLAYER_INPUT' && gameSession)
			{
				gameSession.setPlayerInput(data.input);
			}
		});

		connection.socket.on('close', () => {
			clients.delete(connection.socket);
			if (clients.size === 0)
				gameSession = null;
		});
	});
}	
