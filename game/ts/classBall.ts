
export class Ball
{
	public xPos: number;
	public yPos: number;
	public xVel: number;
	public yVel: number;
	public radius: number;
  
	constructor()
	{
		this.xPos = 400;
		this.yPos = 250;
		this.xVel = 5;
		this.yVel = 5;
		this.radius = 10;
	}
  
	public update(canvas: HTMLCanvasElement)
	{
		this.xPos += this.xVel;
		this.yPos += this.yVel;

		if (this.yPos <= this.radius || this.yPos >= canvas.height - this.radius)
			this.yVel *= -1;
	}
  
	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.beginPath();
		ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	public checkScore(canvas : HTMLCanvasElement) : { scorer?: string, side?: 'left' | 'right' } {
		if (this.xPos <= -this.radius)
			return { side: 'left' };
		if (this.xPos >= canvas.width + this.radius)
			return { side: 'right' };
		return {};
	  }
}
