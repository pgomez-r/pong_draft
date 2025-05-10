
export interface GameConfig {
	width: number;
	height: number;
	paddleWidth: number;
	paddleHeight: number;
	ballSize: number;
	paddleSpeed: number;
	ballSpeed: number;
	gameMode: '1vAI' | 'localMultiplayer' | 'onlineMultiplayer';
}

export interface GameState {
	ball: {
		x: number;
		y: number;
		dx: number;
		dy: number;
	};
	paddles: {
	player1: {
		y: number;
	};
	player2: {
		y: number;
	};
	};
	scores: {
		player1: number;
		player2: number;
	};
	gameOver: boolean;
	winner?: 'player1' | 'player2';
}

export interface PlayerInput {
	up: boolean;
	down: boolean;
	player: 'player1' | 'player2';
}
