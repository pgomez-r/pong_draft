import { Ball } from "./classBall.js";
import { Paddle } from "./classPaddle.js";
import { checkPaddleCollision } from "./collisions.js";
import { ScoreManager } from './classScore.js';
// add ControllerType to import from './classPlayer.js' if/when needed
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Declare game objects and elements
const ball = new Ball();
const playerPaddle = new Paddle(30);
const aiPaddle = new Paddle(canvas.width - 50);
// Players are declared here using the PlayerInfo interface, maybe later we could use a class instead?
const players = {
    player1: {
        id: 'user_123', // Later from DB, API, websocket... (Not sure, but that's the idea)
        controller: 'keyboardArrows',
        side: 'left'
    },
    player2: {
        id: 'ai_easy',
        controller: 'ai',
        side: 'right'
    }
};
const scoreManager = new ScoreManager(Object.values(players).map(p => p.id));
// Listeners to handle keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp")
        playerPaddle.yVel = -8;
    if (e.key === "ArrowDown")
        playerPaddle.yVel = 8;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
        playerPaddle.yVel = 0;
});
// Simple AI - designed by AI - need to understand by PLI(PedroLowIntelligence) later
function updateAI() {
    const aiCenter = aiPaddle.y + aiPaddle.height / 2;
    if (aiCenter < ball.yPos - 10)
        aiPaddle.yVel = 5;
    else if (aiCenter > ball.yPos + 10)
        aiPaddle.yVel = -5;
    else
        aiPaddle.yVel = 0;
}
// Function to draw the dashed center line - designed by AI, need to understand better
function drawCenterLine(ctx, canvas) {
    const centerX = canvas.width / 2;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}
// Function to be called by the script, which will be a loop (or loop-hook as in MLX)
// Same idea of MLX in cub3D: clears - calculates - draws with updated values each "frame" on loop
// Loop is guaranteed by "requestAnimationFrame", it schedules the next execution of gameLoop 
//    to be synced with the browser's display refresh rate (usually ~60fps)
function gameLoop() {
    // Clear
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the center line
    drawCenterLine(ctx, canvas);
    // Update objects values - positions
    ball.update(canvas);
    playerPaddle.update(canvas);
    updateAI();
    aiPaddle.update(canvas);
    // Check paddle-ball collisions
    if (checkPaddleCollision(ball, playerPaddle))
        ball.xVel = Math.abs(ball.xVel);
    if (checkPaddleCollision(ball, aiPaddle))
        ball.xVel = -Math.abs(ball.xVel);
    // Check ball score - if so, reset ball and update score, then render objects here
    const scoreResult = ball.checkScore(canvas);
    if (scoreResult.scoreSide) {
        const scoringPlayer = Object.values(players).find(player => player.side === scoreResult.scoreSide);
        if (scoringPlayer)
            scoreManager.increment(scoringPlayer.id);
        ball.reset(canvas, scoreResult.scoreSide);
        // Optional - to_test: Skip rendering this frame for a "pause" effect
        // requestAnimationFrame(gameLoop);
        // return;
    }
    // Draw updated objects
    ball.draw(ctx);
    playerPaddle.draw(ctx);
    aiPaddle.draw(ctx);
    //scoreManager.draw(ctx);
    // Uses browser's built-in animation scheduler for smooth 60fps updates
    // (More efficient than setInterval - pauses in background tabs)
    requestAnimationFrame(gameLoop);
}
gameLoop();
// Start → gameLoop() → Update/Render → requestAnimationFrame(gameLoop) 
//    ↑_________________________________________|
