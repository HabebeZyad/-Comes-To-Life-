export class InputManager {
    private keys: Set<string> = new Set();
    public mousePos = { x: 0, y: 0 };
    public mouseSpeed = { x: 0, y: 0 };
    public isMouseDown: boolean = false;
    public clicks: { x: number, y: number }[] = [];

    private lastMousePos = { x: 0, y: 0 };

    constructor(private canvas: HTMLCanvasElement) {
        this.setupListeners();
    }

    private setupListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);

        // Touch support for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouch, { passive: false });
        this.canvas.addEventListener('touchend', this.handleMouseUp);
    }

    public cleanup() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
        this.canvas.removeEventListener('touchmove', this.handleTouch);
        this.canvas.removeEventListener('touchend', this.handleMouseUp);
    }

    public update(delta: number) {
        // Reset transient states per frame
        this.clicks = [];
        this.mouseSpeed = { x: 0, y: 0 };
    }

    private handleKeyDown = (e: KeyboardEvent) => this.keys.add(e.code);
    private handleKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);

    private updateMousePos = (clientX: number, clientY: number) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const newX = (clientX - rect.left) * scaleX;
        const newY = (clientY - rect.top) * scaleY;

        this.mouseSpeed = {
            x: newX - this.mousePos.x,
            y: newY - this.mousePos.y
        };

        this.mousePos = { x: newX, y: newY };
    }

    private handleMouseMove = (e: MouseEvent) => {
        this.updateMousePos(e.clientX, e.clientY);
    }

    private handleTouch = (e: TouchEvent) => {
        e.preventDefault(); // Prevent scrolling while playing
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.updateMousePos(touch.clientX, touch.clientY);

            if (e.type === 'touchstart') {
                this.isMouseDown = true;
                this.clicks.push({ ...this.mousePos });
            }
        }
    }

    private handleMouseDown = (e: MouseEvent) => {
        this.isMouseDown = true;
        this.updateMousePos(e.clientX, e.clientY);
        this.clicks.push({ ...this.mousePos });
    }

    private handleMouseUp = () => {
        this.isMouseDown = false;
    }

    public isKeyDown(code: string): boolean {
        return this.keys.has(code);
    }
}
