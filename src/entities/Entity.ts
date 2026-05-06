export abstract class Entity {
    public id: string;
    public x: number = 0;
    public y: number = 0;
    public width: number = 32;
    public height: number = 32;
    public speedX: number = 0;
    public speedY: number = 0;
    public isActive: boolean = true;
    public alpha: number = 1;
    public scale: number = 1;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.id = Math.random().toString(36).substring(2, 9);
    }

    // To be implemented by children objects
    public abstract update(delta: number): void;
    public abstract render(ctx: CanvasRenderingContext2D): void;
}
