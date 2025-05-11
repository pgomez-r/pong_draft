import { GameConfig, GameState } from '../shared/types.js';

export function setupRenderer(getState: () => GameState | null, config: GameConfig)
{
	const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
	canvas.width = config.width;
	canvas.height = config.height;
	const ctx = canvas.getContext('2d')!;

	function render()
	{
		const state = getState();
		if (!state)
		{
			requestAnimationFrame(render);
			return;
		}
		ctx.clearRect(0, 0, config.width, config.height);
		// Draw paddles
		ctx.fillStyle = 'white';
		ctx.fillRect(0, state.paddles.player1.y, config.paddleWidth, config.paddleHeight);
		ctx.fillRect(config.width - config.paddleWidth,	state.paddles.player2.y,
			config.paddleWidth,config.paddleHeight);
		// Draw ball
		ctx.fillRect(state.ball.x, state.ball.y, config.ballSize, config.ballSize);
		// Draw scores - change later for display score div + class/method
		ctx.font = '32px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(state.scores.player1.toString(), config.width / 4, 50);
		ctx.fillText(state.scores.player2.toString(), (config.width / 4) * 3, 50);

		// Draw game over message - change later for a div as well
		if (state.gameOver)
		{
			ctx.font = '48px Arial';
			ctx.fillText(`Player ${state.winner === 'player1' ? '1' : '2'} wins!`,
				config.width / 2, config.height / 2);
		}
		requestAnimationFrame(render);
	}
	render();
}
