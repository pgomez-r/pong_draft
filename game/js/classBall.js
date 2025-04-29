export class Ball {
    constructor() {
        this.xPos = 400;
        this.yPos = 250;
        this.xVel = 5;
        this.yVel = 5;
        this.radius = 10;
    }
    update(canvas) {
        this.xPos += this.xVel;
        this.yPos += this.yVel;
        // Wall vertical collision (top/bottom) - TODO: what about horizontally? Maybe on collisions or scoring files?
        if (this.yPos <= this.radius || this.yPos >= canvas.height - this.radius)
            this.yVel *= -1;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}
