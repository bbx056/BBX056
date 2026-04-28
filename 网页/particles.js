class ParticleEffect {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.initialize();
    }

    initialize() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.container.appendChild(this.canvas);

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 3000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() * 2 + 1) * 0.8,
                speedY: (Math.random() * 1 - 0.5) * 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.8 + 0.2,
                glow: Math.random() * 20 + 10
            });
        }
    }

    getRandomColor() {
        const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF85C2', '#FF99CC', '#FFB3D9', '#FFC0CB', '#FFD1DC'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.glow
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.5, particle.color + '80');
            gradient.addColorStop(1, 'transparent');

            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x > this.canvas.width) {
                particle.x = -10;
                particle.y = Math.random() * this.canvas.height;
            }
            if (particle.y < 0) {
                particle.y = this.canvas.height;
            }
            if (particle.y > this.canvas.height) {
                particle.y = 0;
            }

            particle.opacity = (Math.sin(Date.now() * 0.001 + index) + 1) * 0.4 + 0.3;
            particle.glow = (Math.sin(Date.now() * 0.002 + index) + 1) * 10 + 10;

            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.x += (dx / distance) * force * 3;
                    particle.y += (dy / distance) * force * 3;
                    particle.opacity = 1;
                    particle.glow = 30;
                }
            }

            // 移除线条连接，改为个性化的粒子效果
            if (Math.random() > 0.98) {
                this.ctx.globalAlpha = particle.opacity * 0.5;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x + (Math.random() - 0.5) * 20, 
                           particle.y + (Math.random() - 0.5) * 20, 
                           particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}
