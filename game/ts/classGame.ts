// game-core.ts
import { Ball } from "./classBall.js";
import { Paddle } from "./classPaddle.js";
import { checkPaddleCollision } from "./collisions.js";
import { ScoreManager } from './classScore.js';
import { PlayerInfo } from './classPlayer.js';
import { NetworkHandler, PlayerInput, GameState } from "./classNetwork.js";
// add ControllerType to import from './classPlayer.js' if/when needed

export interface GameConfig
{
	mode: 'local' | 'ai' | 'online';
	players: {
		player1: PlayerInfo;
		player2: PlayerInfo;
	};
	canvas: HTMLCanvasElement;
	maxScore: number;
}

export class Game
{
	private ctx: CanvasRenderingContext2D;
	private ball: Ball;
	private paddles: Record<string, Paddle>;
	private players: Record<string, PlayerInfo>;
	private scoreManager: ScoreManager;
	private animationFrameId: number | null = null;
	private networkHandler: NetworkHandler | null = null;

	constructor(private config: GameConfig) //Move to properties and then pass + init as argument?
	{
		this.ctx = config.canvas.getContext("2d")!;
		this.ball = new Ball();
		this.players = config.players;
		this.scoreManager = new ScoreManager(Object.values(this.players).map(p => p.id));
		this.paddles = {player1: new Paddle(30), player2: new Paddle(config.canvas.width - 50)};
		if (config.mode === 'online')
			this.setupNetwork();
		else
			this.setupInputListeners();
	}

	private setupNetwork()
	{
		this.networkHandler = new NetworkHandler({
			gameId: 'current-game-id', // This would come from matchmaking form or method
			playerId: this.players.player1.id,
			onInput: (input) => this.handleRemoteInput(input),
			onStateUpdate: (state) => this.synchronizeState(state)
		});
	}

	private setupInputListeners()
	{
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "ArrowUp")
		{	this.paddles.player1.yVel = -8;
			if (this.networkHandler)
					this.networkHandler.sendInput(-8);
		}
		if (e.key === "ArrowDown")
		{
			this.paddles.player1.yVel = 8;
			if (this.networkHandler)
				this.networkHandler.sendInput(8);
		}
	};

	private handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === "ArrowUp" || e.key === "ArrowDown")
		{
			this.paddles.player1.yVel = 0;
			if (this.networkHandler)
				this.networkHandler.sendInput(0);
		}
	};

	private handleRemoteInput(input: PlayerInput)
	{
		if (input.playerId === this.players.player2.id)
			this.paddles.player2.yVel = input.yVel;
	}

	private synchronizeState(state: GameState)
	{
		this.ball.xPos = state.ball.xPos;
		this.ball.yPos = state.ball.yPos;
	}

	private updateAI() {
		if (this.players.player2.controller !== 'ai') return;
		
		const aiCenter = this.paddles.player2.y + this.paddles.player2.height / 2;
		if (aiCenter < this.ball.yPos - 10) this.paddles.player2.yVel = 5;
		else if (aiCenter > this.ball.yPos + 10) this.paddles.player2.yVel = -5;
		else this.paddles.player2.yVel = 0;
	}

	private drawCenterLine() {
		const centerX = this.config.canvas.width / 2;
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = 2;
		this.ctx.setLineDash([10, 10]);
		this.ctx.beginPath();
		this.ctx.moveTo(centerX, 0);
		this.ctx.lineTo(centerX, this.config.canvas.height);
		this.ctx.stroke();
		this.ctx.setLineDash([]);
	}

	public start()
	{
		if (this.animationFrameId !== null)
			return ;
		this.gameLoop();
	}

	public stop()
	{
		if (this.animationFrameId)
		{
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	public cleanup()
	{
		this.stop();
		document.removeEventListener("keydown", this.handleKeyDown);
		document.removeEventListener("keyup", this.handleKeyUp);
		this.networkHandler?.disconnect(); // Ternary ? explain - change
	}


	// Method to be called by the script, which will be a loop (or loop-hook as in MLX)
	// Same idea of MLX in cub3D: clears - calculates - draws with updated values each "frame" on loop
	// Loop is guaranteed by "requestAnimationFrame", it schedules the next execution of gameLoop 
	//    to be synced with the browser's display refresh rate (usually ~60fps)
	private gameLoop = () => {
		// Clear canvas + draw center line
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.config.canvas.width, this.config.canvas.height);
		this.drawCenterLine();

		// Update objects
		this.ball.update(this.config.canvas);
		Object.values(this.paddles).forEach(paddle => paddle.update(this.config.canvas));
		this.updateAI();

		// Check collisions
		if (checkPaddleCollision(this.ball, this.paddles.player1)) this.ball.xVel = Math.abs(this.ball.xVel);
		if (checkPaddleCollision(this.ball, this.paddles.player2)) this.ball.xVel = -Math.abs(this.ball.xVel);

		// Check for ball score - if so, reset ball and update score
		const scoreResult = this.ball.checkScore(this.config.canvas);
		if (scoreResult.scoreSide)
		{
			const scoringPlayer = Object.values(this.players).find(player => player.side === scoreResult.scoreSide);
			if (scoringPlayer)
			{
				this.scoreManager.increment(scoringPlayer.id);
				if (this.networkHandler)
					this.networkHandler.sendScoreUpdate(scoringPlayer.id);
				if (this.scoreManager.getScore(scoringPlayer.id) >= this.config.maxScore)
				{
					this.stop();
    				this.showGameOverScreen(scoringPlayer.id);
					return ;
				}
			}
			this.ball.reset(this.config.canvas, scoreResult.scoreSide);
		}

		// Draw objects
		this.ball.draw(this.ctx);
		Object.values(this.paddles).forEach(paddle => paddle.draw(this.ctx));
		// this.scoreManager.draw(this.ctx);

		// Uses browser's built-in animation scheduler for smooth 60fps updates
		// (More efficient than setInterval - pauses in background tabs)
		this.animationFrameId = requestAnimationFrame(this.gameLoop);
	};
	
	private showGameOverScreen(winner: string)
	{
		this.config.canvas.style.display = 'none';
		const gameContainer = this.config.canvas.parentElement;
		if (!gameContainer)
			return;
		const gameOverMessage = document.createElement('div');
		gameOverMessage.id = 'game-over-message';
		gameOverMessage.className = 'game-over-message';
		gameOverMessage.style.textAlign = 'center';
		gameOverMessage.style.color = 'white';
		gameOverMessage.style.fontSize = '24px';
		gameOverMessage.style.marginBottom = '20px';
		gameOverMessage.textContent = `${winner} wins!`;

		gameContainer.appendChild(gameOverMessage);

		const playButton = document.getElementById('play-button');
		if (playButton)
		{
			playButton.textContent = 'Play Again';
			playButton.style.display = 'block';
		}
	}
}
