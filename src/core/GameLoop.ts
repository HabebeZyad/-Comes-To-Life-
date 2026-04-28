export class GameLoop {
    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    private updateFn: (delta: number) => void;
    private renderFn: () => void;
    public isRunning: boolean = false;

    constructor(update: (delta: number) => void, render: () => void) {
        this.updateFn = update;
        this.renderFn = render;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private loop = (time: number) => {
        if (!this.isRunning) return;

        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Cap delta time to prevent massive jumps when switching tabs or lagging
        const safeDelta = Math.min(delta, 0.1);

        this.updateFn(safeDelta);
        this.renderFn();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }
}
