const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#a0a0a0";

let eliminatedCount = 0;

class Circle {
    constructor(x, y, radius, color, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.dy = speedY;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    update(context) {
        this.posY += this.dy;
        console.log(`Circle updated: posX=${this.posX}, posY=${this.posY}, dy=${this.dy}`);
        this.draw(context);
    }

    isPointInside(x, y) {
        const dx = x - this.posX;
        const dy = y - this.posY;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
}

let circles = [];

function generateCircle() {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = -radius; // Start from the top
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speedY = Math.random() * 2 + 1; // Falling speed
    circles.push(new Circle(x, y, radius, color, speedY));
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);

    // Generate a circle at random intervals
    if (Math.random() < 0.05) { // Adjust for more or less frequency
        generateCircle();
    }

    // Update and draw circles
    for (let i = circles.length - 1; i >= 0; i--) {
        circles[i].update(ctx);

        // Remove if it touches the bottom edge
        if (circles[i].posY - circles[i].radius > window_height) {
            circles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isPointInside(mouseX, mouseY)) {
            console.log(`Circle removed: posX=${circles[i].posX}, posY=${circles[i].posY}`);
            circles.splice(i, 1);  // Remove the circle

            eliminatedCount++;
            document.getElementById("counter").textContent = `Eliminados: ${eliminatedCount}`;
            break; // Only remove one per click
        }
    }
});

// Adjust if the window size changes
window.addEventListener('resize', () => {
    window_height = window.innerHeight;
    window_width = window.innerWidth;
    canvas.height = window_height;
    canvas.width = window_width;
});

animate();
