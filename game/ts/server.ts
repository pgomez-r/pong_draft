// server/game-server.ts
import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { GameState } from './classNetwork';

const server = fastify();

server.register(fastifyWebsocket);

// Active game sessions
const gameSessions = new Map<string, GameSession>();

server.register(async (fastify) => {
	fastify.get<{
		Params: {gameId: string},
		Querystring: {playerId: string}
	}>('/games/:gameId', { websocket: true }, (connection, req) => {
		const gameId = req.params.gameId;
		const playerId = req.query.playerId;
		
		if (!gameSessions.has(gameId)) {
			gameSessions.set(gameId, new GameSession(gameId));
		}
		
		const game = gameSessions.get(gameId)!;
		game.addPlayer(playerId, connection.socket);
		
		connection.socket.on('message', (message : string) => {
			const data = JSON.parse(message.toString());
			game.handleMessage(playerId, data);
		});
		
		connection.socket.on('close', () => {
			game.removePlayer(playerId);
			if (game.isEmpty()) {
				gameSessions.delete(gameId);
			}
		});
	});
});

class GameSession
{
	private players = new Map<string, WebSocket>();
	private gameState: GameState;
	
	constructor(public gameId: string) {
		// Initialize game state
		this.gameState = {
			ball: { xPos: 0, yPos: 0 },
			// other initial state
		};
		
		// Start game loop
		setInterval(() => this.update(), 16); // ~60fps
	}
	
	addPlayer(playerId: string, socket: WebSocket) {
		this.players.set(playerId, socket);
		// Send initial state
		socket.send(JSON.stringify({
			type: 'init',
			state: this.gameState
		}));
	}
	
	removePlayer(playerId: string) {
		this.players.delete(playerId);
	}
	
	isEmpty() {
		return this.players.size === 0;
	}
	
	handleMessage(playerId: string, data: any) {
		if (data.type === 'input') {
			// Update game state based on input
			// Then broadcast to all players
			this.broadcast({
				type: 'input',
				playerId,
				yVel: data.yVel
			});
		} else if (data.type === 'score') {
			// Handle score update
		}
	}
	
	update() {
		// Update game state (ball position, etc.)
		// Then broadcast to all players
		this.broadcast({
			type: 'state',
			state: this.gameState
		});
	}
	
	broadcast(message: any) {
		const payload = JSON.stringify(message);
		this.players.forEach(socket => socket.send(payload));
	}
}

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
