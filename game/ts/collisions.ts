import { Ball } from "./classBall";
import { Paddle } from "./classPaddle";

// Function to check if a ball collides with a paddle, by comparing their positions and dimensions
export function checkPaddleCollision(ball: Ball, paddle: Paddle): boolean
{
  return(
    ball.xPos + ball.radius > paddle.x &&
    ball.xPos - ball.radius < paddle.x + paddle.width &&
    ball.yPos + ball.radius > paddle.y &&
    ball.yPos - ball.radius < paddle.y + paddle.height
  );

    // More precise alternative TODO: check if it could be a better approach

    // // Find the closest point on the paddle to the ball
    // const closestX = Math.max(paddle.x, Math.min(ball.xPos, paddle.x + paddle.width));
    // const closestY = Math.max(paddle.y, Math.min(ball.yPos, paddle.y + paddle.height));

    // // Calculate distance between ball and closest paddle point
    // const distanceX = ball.xPos - closestX;
    // const distanceY = ball.yPos - closestY;
    // return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
}


// Paddle:                        Ball:
// +-------------------+          ○
// |                   |       (radius: r)
// |                   |    xPos: ball.xPos
// +-------------------+    yPos: ball.yPos
// x: paddle.x                
// y: paddle.y