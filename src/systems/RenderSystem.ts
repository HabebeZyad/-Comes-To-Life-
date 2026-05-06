import { Entity } from '../entities/Entity';

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public clear(width: number, height: number) {
        this.ctx.clearRect(0, 0, width, height);
    }

    public render(entities: Entity[]) {
        // Sort entities by specific Z-index logic if needed, otherwise raw loop
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (!entity.isActive) continue;

            this.ctx.save();

            // Handle transform properties universally
            if (entity.alpha !== 1) this.ctx.globalAlpha = entity.alpha;

            this.ctx.translate(entity.x, entity.y);
            if (entity.scale !== 1) this.ctx.scale(entity.scale, entity.scale);
            this.ctx.translate(-entity.x, -entity.y);

            entity.render(this.ctx);

            this.ctx.restore();
        }
    }
}
