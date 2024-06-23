const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    color: 'blue',
    speed: 5
};

const bullets = [];
const enemies = [];
let score = 0;
let lastShootTime = 0;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, 20, 20);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 8, 20);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= 5;
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += 1;
        if (enemy.y > canvas.height) {
            enemies.splice(enemyIndex, 1);
        }

        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + 20 &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 20 &&
                bullet.y + 10 > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
            }
        });
    });

    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 20),
            y: 0
        });
    }

    requestAnimationFrame(updateGame);
}

function shoot() {
    const currentTime = Date.now();
    if (currentTime - lastShootTime > 300) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y
        });
        lastShootTime = currentTime;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    }
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (e.key === ' ') {
        shoot();
    }
});

let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const diffX = touchX - touchStartX;
    player.x += diffX / 5;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    touchStartX = touchX;
    shoot();
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    shoot();
});

function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.95;
    const ratio = canvas.width / canvas.height;

    if (maxWidth / ratio < maxHeight) {
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (maxWidth / ratio) + 'px';
    } else {
        canvas.style.height = maxHeight + 'px';
        canvas.style.width = (maxHeight * ratio) + 'px';
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

updateGame();
