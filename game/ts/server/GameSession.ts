
import { GameConfig, GameState, PlayerInput } from '../shared/types.js';

export class GameSession
{
	private config: GameConfig;
	private state: GameState;
	private lastUpdateTime: number;
	private activeInputs: {
		player1: PlayerInput;
		player2: PlayerInput;
	};

	constructor(config: GameConfig)
	{
		this.config = config;
		this.lastUpdateTime = Date.now();
		// Initialize game state
		this.state = {
	  		ball: {
				x: config.width / 2,
				y: config.height / 2,
				dx: config.ballSpeed,
				dy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
			},
	 		paddles: {
				player1: {
					y: config.height / 2 - config.paddleHeight / 2
				},
				player2: {
					y: config.height / 2 - config.paddleHeight / 2
				}
			},
			scores: {
				player1: 0,
				player2: 0
			},
			gameOver: false
		};
		this.activeInputs = {
			player1: { up: false, down: false, player: 'player1' },
			player2: { up: false, down: false, player: 'player2' }
		};
	}

	public update(deltaTime: number)
	{
		if (this.state.gameOver)
			return;

		// Update all elements positions and values
		this.updatePaddles(deltaTime);
		this.updateBall(deltaTime);
		this.checkCollisions();
		this.checkScoring();
		
		// AI logic for 1vAI mode
		if (this.config.gameMode === '1vAI')
			this.updateAI(deltaTime);
	}

	private updatePaddles(deltaTime: number)
	{
		// Player 1 movement
		if (this.activeInputs.player1.up)
		{
			this.state.paddles.player1.y = Math.max(0, 
				this.state.paddles.player1.y - this.config.paddleSpeed * deltaTime);
		}
		if (this.activeInputs.player1.down)
		{
			this.state.paddles.player1.y = Math.min(this.config.height - this.config.paddleHeight,
				this.state.paddles.player1.y + this.config.paddleSpeed * deltaTime);
		}

		// Player 2 movement (or AI in 1vAI mode)
		if (this.config.gameMode !== '1vAI')
		{
			if (this.activeInputs.player2.up)
			{
				this.state.paddles.player2.y = Math.max(0,
					this.state.paddles.player2.y - this.config.paddleSpeed * deltaTime);
			}
			if (this.activeInputs.player2.down)
			{
				this.state.paddles.player2.y = Math.min(this.config.height - this.config.paddleHeight,
					this.state.paddles.player2.y + this.config.paddleSpeed * deltaTime);
			}
		}
	}

	private updateAI(deltaTime: number)
	{
		const paddleCenter = this.state.paddles.player2.y + this.config.paddleHeight / 2;
		const ballY = this.state.ball.y;
		const aiSpeed = this.config.paddleSpeed * 0.7;
		// TODO add a difficulty setting that could be used to modify aiSpeed + ball speed
		if (paddleCenter < ballY - 10)
		{
			this.state.paddles.player2.y = Math.min(this.config.height - this.config.paddleHeight,
				this.state.paddles.player2.y + aiSpeed * deltaTime);
		}
		else if (paddleCenter > ballY + 10)
		{
			this.state.paddles.player2.y = Math.max(0, this.state.paddles.player2.y
				- aiSpeed * deltaTime);
		}
	}

	private updateBall(deltaTime: number)
	{
		this.state.ball.x += this.state.ball.dx * deltaTime;
		this.state.ball.y += this.state.ball.dy * deltaTime;
	}

	private checkCollisions()
	{
		// Ball collision with top and bottom walls
		if (this.state.ball.y <= 0 || this.state.ball.y >= this.config.height - this.config.ballSize)
			this.state.ball.dy *= -1;

		// Ball collision with Player 1 paddle (left)
		if (this.state.ball.x <= this.config.paddleWidth &&
				this.state.ball.y + this.config.ballSize >= this.state.paddles.player1.y &&
				this.state.ball.y <= this.state.paddles.player1.y + this.config.paddleHeight)
		{
			this.state.ball.dx = Math.abs(this.state.ball.dx) * 1.05;
			this.state.ball.dy = this.calculateBallAngle(this.state.ball.y,this.state.paddles.player1.y,
				this.config.paddleHeight);
		}

		// Ball collision with player 2 paddle (right)
		if (this.state.ball.x >= this.config.width - this.config.paddleWidth - this.config.ballSize &&
				this.state.ball.y + this.config.ballSize >= this.state.paddles.player2.y &&
				this.state.ball.y <= this.state.paddles.player2.y + this.config.paddleHeight)
		{
			this.state.ball.dx = -Math.abs(this.state.ball.dx) * 1.05;
			this.state.ball.dy = this.calculateBallAngle(this.state.ball.y,	this.state.paddles.player2.y,
				this.config.paddleHeight);
		}
	}

	private calculateBallAngle(ballY: number, paddleY: number, paddleHeight: number): number
	{
		// Calculate relative position of ball to paddle (0 to 1)
		const relativeIntersect = (ballY - paddleY) / paddleHeight;
		// Normalize to -1 to 1
		const normalized = (relativeIntersect * 2) - 1;
		// Return angle (clamped to prevent too steep angles)
		return Math.max(-1, Math.min(1, normalized)) * this.config.ballSpeed;
	}

	private checkScoring()
	{
		// Player 2 scores
		if (this.state.ball.x <= 0) {
		this.state.scores.player2++;
		this.resetBall();
		}
		// Player 1 scores
		else if (this.state.ball.x >= this.config.width - this.config.ballSize) {
		this.state.scores.player1++;
		this.resetBall();
		}

		// Check win condition (first to 11 points)
		if (this.state.scores.player1 >= 11 || this.state.scores.player2 >= 11) {
		this.state.gameOver = true;
		this.state.winner = this.state.scores.player1 >= 11 ? 'player1' : 'player2';
		}
	}

	private resetBall()
	{
		this.state.ball = {
			x: this.config.width / 2,
			y: this.config.height / 2,
			dx: this.config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
			dy: this.config.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
			// Change this to get the ball going through the not scoring player
		};
	}

	public setPlayerInput(input: PlayerInput)
	{
		this.activeInputs[input.player] = input;
	}

	public getState(): GameState
	{
		return (this.state);
	}

	public getConfig(): GameConfig
	{
		return (this.config);
	}
}
