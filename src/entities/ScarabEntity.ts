import { Entity } from './Entity';

export type ScarabType = 'gold' | 'silver' | 'cursed' | 'sacred' | 'time' | 'bonus';

export class ScarabEntity extends Entity {
    public type: ScarabType;
    public emoji: string;
    public points: number;
    public color: string;
    public expirationTime: number; // in seconds

    private initialY: number;
    private floatOffset: number;
    private timeAlive: number = 0;

    constructor(x: number, y: number, type: ScarabType, emoji: string, points: number, color: string, duration: number) {
        super(x, y);
        this.type = type;
        this.emoji = emoji;
        this.points = points;
        this.color = color;
        this.expirationTime = duration;

        this.initialY = y;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.width = 40; // hit radius
    }

    public update(delta: number) {
        this.timeAlive += delta;

        // Smooth flying animation depending on type
        if (this.type === 'cursed') {
            // Scorpions move aggressively and erratically
            this.x += Math.sin(this.timeAlive * 10 + this.floatOffset) * 2;
            this.y += Math.cos(this.timeAlive * 8 + this.floatOffset) * 2;
        } else if (this.type === 'bonus' || this.type === 'sacred') {
            // Bonus items float upward majestically
            this.y -= 20 * delta;
            this.x += Math.sin(this.timeAlive * 3) * 1;
        } else {
            // Normal bugs just hover
            this.y = this.initialY + Math.sin(this.timeAlive * 4 + this.floatOffset) * 10;
        }

        // Scale up slightly on spawn and fade out near death
        const timeLeft = this.expirationTime - this.timeAlive;
        if (timeLeft <= 0.5) {
            this.alpha = Math.max(0, timeLeft * 2);
            this.scale = Math.max(0, timeLeft * 2);
        } else if (this.timeAlive < 0.2) {
            this.scale = this.timeAlive * 5; // pop in
        } else {
            this.scale = 1;
        }

        if (this.timeAlive >= this.expirationTime) {
            this.isActive = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add glow effects based on type
        if (this.type === 'sacred' || this.type === 'bonus' || this.type === 'time' || this.type === 'cursed') {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.font = '36px Arial';
        ctx.fillText(this.emoji, this.x, this.y);

        // Draw little time indicator for time scarab
        if (this.type === 'time') {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#32ff32';
            ctx.font = '12px bold Arial';
            ctx.fillText('+5s', this.x + 15, this.y - 15);
        }

        ctx.shadowBlur = 0; // reset
    }
}
