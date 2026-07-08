const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");

canvas.width = 480;
canvas.height = 640;

const FALL_SPEED = 180; // px per second, fixed
const SPAWN_INTERVAL = 0.8; // seconds, fixed
const SQUARE_MIN = 20;
const SQUARE_MAX = 40;
const PLAYER_SPEED = 320;

let state;
function resetState() {
  state = {
    player: {
      x: canvas.width / 2 - 25,
      y: canvas.height - 40,
      w: 50,
      h: 20,
      dir: 1,
    },
    squares: [],
    score: 0,
    lives: 3,
    spawnTimer: 0,
    running: true,
  };
  gameOverEl.style.display = "none";
}

function spawnSquare() {
  const size = SQUARE_MIN + Math.random() * (SQUARE_MAX - SQUARE_MIN);
  const x = Math.random() * (canvas.width - size);
  state.squares.push({ x, y: -size, size, speed: FALL_SPEED });
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function update(dt) {
  const p = state.player;
  p.x += PLAYER_SPEED * p.dir * dt;
  if (p.x <= 0) {
    p.x = 0;
    p.dir = 1;
  }
  if (p.x >= canvas.width - p.w) {
    p.x = canvas.width - p.w;
    p.dir = -1;
  }
  p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnSquare();
    state.spawnTimer = SPAWN_INTERVAL;
  }

  for (let i = state.squares.length - 1; i >= 0; i--) {
    const s = state.squares[i];
    s.y += s.speed * dt;

    const sqRect = { x: s.x, y: s.y, w: s.size, h: s.size };
    if (rectsOverlap(sqRect, p)) {
      state.squares.splice(i, 1);
      state.score += 1;
      continue;
    }

    if (s.y > canvas.height) {
      state.squares.splice(i, 1);
      state.lives -= 1;
      if (state.lives <= 0) {
        endGame();
      }
    }
  }

  scoreEl.textContent = "Score: " + state.score + "  Lives: " + state.lives;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);

  ctx.fillStyle = "#e94b3c";
  for (const s of state.squares) {
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
}

function endGame() {
  state.running = false;
  gameOverEl.innerHTML =
    "Game Over<br>Score: " +
    state.score +
    '<br><button id="restartBtn">Restart</button>';
  gameOverEl.style.display = "block";
  document.getElementById("restartBtn").addEventListener("click", startGame);
}

let lastTime = 0;
function loop(timestamp) {
  if (!state.running) return;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  update(dt);
  render();

  requestAnimationFrame(loop);
}

function startGame() {
  resetState();
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "o" && state && state.running) state.player.dir *= -1;
});

startGame();
