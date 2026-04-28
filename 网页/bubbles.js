class BubbleEffect {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bubbles = [];
        this.initialize();
    }

    initialize() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.container.appendChild(this.canvas);

        this.resize();
        this.createBubbles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    createBubbles() {
        this.bubbles = [];
        const bubbleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);

        for (let i = 0; i < bubbleCount; i++) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                size: Math.random() * 30 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['rgba(255, 105, 180, ', 'rgba(255, 20, 147, ', 'rgba(255, 182, 193, '];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bubbles.forEach(bubble => {
            this.ctx.globalAlpha = bubble.opacity;
            this.ctx.fillStyle = bubble.color + bubble.opacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();

            bubble.y -= bubble.speed;

            if (bubble.y < -bubble.size) {
                bubble.y = this.canvas.height + bubble.size;
                bubble.x = Math.random() * this.canvas.width;
                bubble.opacity = Math.random() * 0.5 + 0.1;
            }

            bubble.opacity = Math.sin(Date.now() * 0.001 + bubble.size) * 0.2 + 0.3;
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}