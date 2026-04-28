// Abstract base game state that individual games can extend
export class GameState {
    public score: number = 0;
    public health: number = 100;
    public isGameOver: boolean = false;
    public timeElapsed: number = 0;
    public multiplier: number = 1;
    public difficultyScalar: number = 1;

    public addScore(points: number) {
        this.score += points * this.multiplier;
    }

    public reset() {
        this.score = 0;
        this.health = 100;
        this.isGameOver = false;
        this.timeElapsed = 0;
        this.multiplier = 1;
        this.difficultyScalar = 1;
    }
}
