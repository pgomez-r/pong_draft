export class Paddle
{
	x: number;
	y: number;
	width: number;
	height: number;
	yVel: number;
  
	constructor(x: number) {
	  this.x = x;
	  this.y = 200;
	  this.width = 20;
	  this.height = 100;
	  this.yVel = 0;
	}
  
	update(canvas: HTMLCanvasElement)
	{
	  this.y += this.yVel;
	  this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
	}
  
	draw(ctx: CanvasRenderingContext2D)
	{
	  ctx.fillStyle = "white";
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
