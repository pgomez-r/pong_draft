
export interface PlayerInput
{
	playerId: string;
	yVel: number;
}

export interface GameState
{
	ball: {
		xPos: number;
		yPos: number;
	};
}

export class NetworkHandler
{
	private socket: WebSocket;

	constructor(private config: {
		gameId: string;
		playerId: string;
		onInput: (input: PlayerInput) => void;
		onStateUpdate: (state: GameState) => void;
	}) {
		this.socket = new WebSocket(`ws://your-server.com/games/${config.gameId}`);
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'input') {
				config.onInput(data);
			} else if (data.type === 'state') {
				config.onStateUpdate(data.state);
			}
		};
	}

	sendInput(yVel: number) {
		this.socket.send(JSON.stringify({
			type: 'input',
			playerId: this.config.playerId,
			yVel
		}));
	}

	sendScoreUpdate(playerId: string) {
		this.socket.send(JSON.stringify({
			type: 'score',
			playerId
		}));
	}

	disconnect() {
		this.socket.close();
	}
}
