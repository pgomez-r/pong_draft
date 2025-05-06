
/**
 * Brief: ScoreManager class will store both player scores using a Record type variable
 * 	(?) Record is a container like a map but limited to simple types of variables (strings, numbers)
 */
export class	ScoreManager{
	private scores : Record<string, number>;
	private scoreDisplay : HTMLElement;

	constructor(playerIds : string[]){
		this.scores = {};
		playerIds.forEach(id => this.scores[id] = 0);
		this.scoreDisplay = this.createScoreDisplay();
		this.updateDisplay();
	}

	private createScoreDisplay() : HTMLElement {
		const display = document.createElement('div');
		display.style.position = 'absolute';
		display.style.top = '20px';
		display.style.left = '50%';
		display.style.transform = 'translateX(-50%)';
		display.style.color = 'white';
		display.style.fontFamily = 'Arial, sans-serif';
		display.style.fontSize = '24px';
		document.body.appendChild(display);
		return (display);
	}

	public	increment(playerId : string) : void {
		if (this.scores.hasOwnProperty(playerId)) {
			this.scores[playerId]++;
			this.updateDisplay();
		}
	  }
	
	public getScore(playerId : string) : number {
		return (this.scores[playerId]);
	}

	public getAllScores() : Record<string, number> {
		return ({...this.scores});
	}

	private updateDisplay() : void{
		this.scoreDisplay.textContent = Object.entries(this.scores)
			.map(([id, score]) => `${id}: ${score}`)
			.join(' | ');
	}
	// If this.scores is NULL? May need to protect that case, although it should be at least 0 when created
	
	// Draw function to display scores on canvas - alternative to HTML DOM update display function
	public draw(ctx: CanvasRenderingContext2D) : void
	{
		ctx.fillStyle = 'white';
		ctx.font = '24px Arial';
		Object.entries(this.scores).forEach(([id, score], index) => {
		  ctx.fillText(`${id}: ${score}`, 20, 40 + (30 * index));
		});
	}
}
