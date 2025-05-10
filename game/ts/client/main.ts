import { GameConfig, GameState } from '../shared/types';
import { setupInput } from './input';
import { setupRenderer } from './renderer';

class PongClient
{
	private config: GameConfig;
	private gameState: GameState | null = null;
	private ws: WebSocket | null = null;
	private playerNumber: 'player1' | 'player2' | null = null;

	constructor(config: GameConfig) {
		this.config = config;
		this.initConnection();
		setupInput(this.handleInput.bind(this));
		setupRenderer(this.getCurrentState.bind(this), config);
	}

	private initConnection()
	{
		this.ws = new WebSocket('ws://localhost:5050/game'); // Adjust the URL:port as needed
		this.ws.onopen = () => {
			this.ws?.send(JSON.stringify({
			type: 'INIT',
			config: this.config
			}));
		};

		this.ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		if (data.type === 'INIT_RESPONSE')
			this.playerNumber = data.playerNumber;
		else if (data.type === 'GAME_STATE')
			this.gameState = data.state;
		};
	}

	private handleInput(input: { up: boolean; down: boolean })
	{
		if (!this.playerNumber)
			return;
		this.ws?.send(JSON.stringify({
			type: 'PLAYER_INPUT',
			input: {
				...input,
				player: this.playerNumber
			}
		}));
	}

	private getCurrentState(): GameState | null
	{
		return (this.gameState);
	}
}

// Hardcoded config for now
const gameConfig: GameConfig = {
	width: 800,
	height: 600,
	paddleWidth: 15,
	paddleHeight: 100,
	ballSize: 10,
	paddleSpeed: 8,
	ballSpeed: 5,
	gameMode: '1vAI' // Can be changed to other modes
};

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
	new PongClient(gameConfig);
});