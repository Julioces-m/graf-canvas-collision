const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#a0a0a0";

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.dx = speedX;
        this.dy = speedY;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.posX += this.dx;
        this.posY += this.dy;
        
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        this.draw(context);
    }

    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    resolveCollision(otherCircle) {
        const dx = otherCircle.posX - this.posX;
        const dy = otherCircle.posY - this.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        const overlap = this.radius + otherCircle.radius - distance;
        const angle = Math.atan2(dy, dx);
        
        const moveX = Math.cos(angle) * (overlap / 2);
        const moveY = Math.sin(angle) * (overlap / 2);
        
        this.posX -= moveX;
        this.posY -= moveY;
        otherCircle.posX += moveX;
        otherCircle.posY += moveY;
        
        // Intercambiar velocidades para simular rebote
        const tempDx = this.dx;
        const tempDy = this.dy;
        this.dx = otherCircle.dx;
        this.dy = otherCircle.dy;
        otherCircle.dx = tempDx;
        otherCircle.dy = tempDy;
        
        // Cambiar color a azul temporalmente
        this.color = "blue";
        otherCircle.color = "blue";

        setTimeout(() => {
            this.color = this.originalColor;
            otherCircle.color = otherCircle.originalColor;
        }, 200);
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speedX = Math.random() * 4 + 1;
        let speedY = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        
        circles.push(new Circle(x, y, radius, color, text, speedX, speedY));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
    }
    
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].checkCollision(circles[j])) {
                circles[i].resolveCollision(circles[j]);
            }
        }
    }
    
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
