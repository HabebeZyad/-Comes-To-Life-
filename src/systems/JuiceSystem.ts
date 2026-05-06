import { Entity } from '../entities/Entity';

export class Particle extends Entity {
    public life: number = 1;
    public decay: number;
    public color: string;

    constructor(x: number, y: number, color: string = '#d4af37') {
        super(x, y);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 200 + 50; // Random explosive force

        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;

        this.decay = Math.random() * 1.5 + 0.5; // Controls lifetime
        this.color = color;
        this.width = Math.random() * 4 + 2;
    }

    public update(delta: number) {
        this.x += this.speedX * delta;
        this.y += this.speedY * delta;
        this.alpha -= this.decay * delta;

        // Add simple gravity or drag over time
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        if (this.alpha <= 0) {
            this.isActive = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class JuiceSystem {
    public particles: Particle[] = [];
    public screenShakeTime: number = 0;
    public isShaking: boolean = false;

    public spawnExplosion(x: number, y: number, color: string, count: number = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    public triggerScreenShake(duration: number = 0.2) {
        this.screenShakeTime = duration;
        this.isShaking = true;
    }

    public update(delta: number) {
        if (this.screenShakeTime > 0) {
            this.screenShakeTime -= delta;
            if (this.screenShakeTime <= 0) {
                this.isShaking = false;
            }
        }

        // Process particles in reverse to safely splice
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(delta);
            if (!p.isActive) {
                this.particles.splice(i, 1);
            }
        }
    }

    public applyScreenShake(ctx: CanvasRenderingContext2D) {
        if (this.isShaking && this.screenShakeTime > 0) {
            // Violent sharp shakes
            const intensity = (this.screenShakeTime / 0.2) * 10;
            const dx = (Math.random() - 0.5) * intensity;
            const dy = (Math.random() - 0.5) * intensity;
            ctx.translate(dx, dy);
        }
    }
}
