const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// general settings
let gamePlaying = false;
const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

<<<<<<< HEAD
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
=======
// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // make the pipe and bird moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;

// start game
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
>>>>>>> 2f76e29 (da)
