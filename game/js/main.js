// app.ts
import { Game } from './classGame.js';
const playButton = document.getElementById('play-button');
if (playButton) {
    playButton.addEventListener('click', () => {
        var _a;
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 600;
        (_a = document.getElementById('game-container')) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
        const config = {
            mode: 'ai',
            canvas,
            players: {
                player1: {
                    id: 'user_123',
                    controller: 'keyboardArrows',
                    side: 'left'
                },
                player2: {
                    id: 'ai_easy',
                    controller: 'ai',
                    side: 'right'
                }
            },
            maxScore: 5
        };
        // We could (or should) replace the setup bellow for a login-config process with a form?
        playButton.style.display = 'none';
        const gameOverMsg = document.getElementById('game-over-message');
        if (gameOverMsg && gameOverMsg.parentElement)
            gameOverMsg.parentElement.removeChild(gameOverMsg);
        const scoreBoard = document.getElementById('score-board');
        if (scoreBoard && scoreBoard.parentElement)
            scoreBoard.parentElement.removeChild(scoreBoard);
        const game = new Game(config);
        game.start();
    });
}
