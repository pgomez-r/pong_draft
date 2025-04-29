import { Ball } from "./classBall";
import { Paddle } from "./classPaddle";
import { checkPaddleCollision } from "./collisions";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Declare game objects
const ball = new Ball();
const playerPaddle = new Paddle(30);
const aiPaddle = new Paddle(canvas.width - 50);
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
// Function to be called by the script, which will be a loop (or loop-hook as in MLX)
// Same idea of MLX in cub3D: clears - calculates - draws with updated values each "frame" on loop
// Loop is guaranteed by "requestAnimationFrame", it schedules the next execution of gameLoop 
//    to be synced with the browser's display refresh rate (usually ~60fps)
function gameLoop() {
    // Clear
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    // Draw updated objects
    ball.draw(ctx);
    playerPaddle.draw(ctx);
    aiPaddle.draw(ctx);
    // Uses browser's built-in animation scheduler for smooth 60fps updates
    // (More efficient than setInterval - pauses in background tabs)
    requestAnimationFrame(gameLoop);
}
gameLoop();
// Start → gameLoop() → Update/Render → requestAnimationFrame(gameLoop) 
//    ↑_________________________________________|
