export class Paddle {
    constructor(x) {
        this.x = x;
        this.y = 200;
        this.width = 20;
        this.height = 100;
        this.yVel = 0;
    }
    update(canvas) {
        this.y += this.yVel;
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
