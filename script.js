const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

const BIRD_SIZE = 120;
const PIPE_WIDTH = 200;
const GAP = 200;
const PIPE_SPEED = 5;
const GRAVITY = 0.6;
const JUMP = -10;

let bird = { x: 200, y: canvas.height / 2, vy: 0 };
let pipes = [];

// --- LOAD IMAGES ---
let birdImg = new Image();
birdImg.src = "https://27maita.github.io/kodiflap/assets/bird.svg";

let pipeGreenImg = new Image();
pipeGreenImg.src = "https://27maita.github.io/kodiflap/assets/pipegreen.svg";

let pipePinkImg = new Image();
pipePinkImg.src = "https://27maita.github.io/kodiflap/assets/pipepink.svg";

let loadedImages = 0;
function onImgLoad() {
    loadedImages++;
    if (loadedImages === 3) { // all images loaded
        spawnPipe();
        gameLoop();
    }
}

birdImg.onload = onImgLoad;
pipeGreenImg.onload = onImgLoad;
pipePinkImg.onload = onImgLoad;

// --- PIPE FUNCTIONS ---
function spawnPipe() {
    const height = Math.floor(Math.random() * (canvas.height - GAP - 240)) + 120;
    const colors = ["green", "pink"];
    const topColor = colors[Math.floor(Math.random() * colors.length)];
    const bottomColor = colors[Math.floor(Math.random() * colors.length)];
    pipes.push({ x: canvas.width, height, topColor, bottomColor });
}

function drawPipe(pipe) {
    const topImg = pipe.topColor === "green" ? pipeGreenImg : pipePinkImg;
    const bottomImg = pipe.bottomColor === "green" ? pipeGreenImg : pipePinkImg;

    // Top pipe (flipped)
    ctx.save();
    ctx.translate(pipe.x + PIPE_WIDTH / 2, pipe.height / 2);
    ctx.scale(1, -1);
    ctx.drawImage(topImg, -PIPE_WIDTH / 2, -pipe.height / 2, PIPE_WIDTH, pipe.height);
    ctx.restore();

    // Bottom pipe
    ctx.drawImage(bottomImg, pipe.x, pipe.height + GAP, PIPE_WIDTH, canvas.height - pipe.height - GAP);
}

// --- COLLISION ---
function checkCollision(pipe) {
    if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.height || bird.y + BIRD_SIZE > pipe.height + GAP)
    ) return true;

    if (bird.y < 0 || bird.y + BIRD_SIZE > canvas.height) return true;

    return false;
}

// --- GAME CONTROL ---
function resetGame() {
    bird.y = canvas.height / 2;
    bird.vy = 0;
    pipes = [];
    spawnPipe();
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") bird.vy = JUMP;
});

// --- GAME LOOP ---
function gameLoop() {
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    for (let pipe of pipes) pipe.x -= PIPE_SPEED;

    // Spawn new pipe when needed
    if (pipes[pipes.length - 1].x < canvas.width - 400) spawnPipe();

    // Remove off-screen pipes
    pipes = pipes.filter(p => p.x > -PIPE_WIDTH);

    // Collision detection
    if (pipes.some(checkCollision)) resetGame();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);

    // Draw pipes
    for (let pipe of pipes) drawPipe(pipe);

    requestAnimationFrame(gameLoop);
}
