// ============================================================
// PIXEL MAZE ADVENTURE - Season & Weather Edition
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ROWS = 15;
const COLS = 15;

// ------------------------------------------------------------
// SEASONS & WEATHER
// ------------------------------------------------------------

const SEASONS = [
  {
    name: "Spring",
    sky: "#bde0fe",
    groundLight: "#d9f99d",
    groundDark: "#84cc16",
    fogMid: "rgba(15,23,42,0.35)",
    fogOuter: "rgba(15,23,42,0.9)",
    weather: "clear",
  },
  {
    name: "Summer",
    sky: "#7dd3fc",
    groundLight: "#bbf7d0",
    groundDark: "#22c55e",
    fogMid: "rgba(15,23,42,0.4)",
    fogOuter: "rgba(15,23,42,0.95)",
    weather: "clear",
  },
  {
    name: "Autumn",
    sky: "#fed7aa",
    groundLight: "#fed7aa",
    groundDark: "#ea580c",
    fogMid: "rgba(30,64,175,0.45)",
    fogOuter: "rgba(15,23,42,0.95)",
    weather: "rain",
  },
  {
    name: "Winter",
    sky: "#e0f2fe",
    groundLight: "#e5e7eb",
    groundDark: "#9ca3af",
    fogMid: "rgba(30,64,175,0.4)",
    fogOuter: "rgba(15,23,42,0.9)",
    weather: "snow", // 先当成 clear，用蓝白雾
  },
];

let currentSeason = SEASONS[0];
let currentWeather = "clear"; // "clear" | "rain" | "snow"

// 雨滴粒子
let rainDrops = [];

// ------------------------------------------------------------
// SIMPLE SOUND SYSTEM (可选：你可以先不放音频文件，也不会报错)
// ------------------------------------------------------------

const sounds = {
  move: new Audio("/assets/sfx/move.wav"),
  bomb: new Audio("/assets/sfx/bomb.wav"),
  explosion: new Audio("/assets/sfx/explosion.wav"),
  trap: new Audio("/assets/sfx/trap.wav"),
  levelComplete: new Audio("/assets/sfx/level-complete.wav"),
};

function playSound(name) {
  const s = sounds[name];
  if (!s) return;
  try {
    // 重置到开头，避免连续播放很奇怪
    s.currentTime = 0;
    s.play();
  } catch (e) {
    // 浏览器没允许自动播放就忽略，不影响游戏
  }
}

// ============================================================
// PROCEDURAL LEVEL GENERATOR
// ============================================================

function generateMaze(difficulty) {
  const maze = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill("#"));

  function carve(row, col) {
    maze[row][col] = ".";

    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of dirs) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow > 0 &&
        newRow < ROWS - 1 &&
        newCol > 0 &&
        newCol < COLS - 1 &&
        maze[newRow][newCol] === "#"
      ) {
        maze[row + dr / 2][col + dc / 2] = ".";
        carve(newRow, newCol);
      }
    }
  }

  carve(1, 1);

  // Start / Exit
  maze[1][1] = "P";
  maze[ROWS - 2][COLS - 2] = "E";

  // Cracked walls
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (maze[r][c] === "#" && Math.random() < 0.18) {
        maze[r][c] = "*";
      }
    }
  }

  // Traps
  const trapCount = 6 + Math.floor(difficulty / 2);
  let placed = 0;
  while (placed < trapCount) {
    const r = 2 + Math.floor(Math.random() * (ROWS - 4));
    const c = 2 + Math.floor(Math.random() * (COLS - 4));
    if (
      maze[r][c] === "." &&
      !(r === 1 && c === 1) &&
      !(r === ROWS - 2 && c === COLS - 2)
    ) {
      maze[r][c] = "X";
      placed++;
    }
  }

  return maze.map((row) => row.join(""));
}

// ============================================================
// GAME STATE
// ============================================================

let currentLevel = 1;
let levelMap = [];

const player = {
  row: 0,
  col: 0,
  facingRow: 0,
  facingCol: 1,
};

let exitCell = { row: 0, col: 0 };
let traps = [];
let discovered = [];
let gameState = "playing"; // "playing" | "dead" | "levelComplete"
let message = "";

let bombs = [];
let explosions = [];
let particles = [];
let frameCount = 0;

let levelStartTime = null;
let elapsedSeconds = 0;
let steps = 0;

const VISION_RADIUS = 4;
const SCORE_KEY = "pixel_maze_scores";

// ============================================================
// PARTICLE SYSTEM (爆炸火花)
// ============================================================

function createExplosionParticles(row, col, count = 30) {
  const cx = (col + 0.5) * TILE_SIZE;
  const cy = (row + 0.5) * TILE_SIZE;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const speed = 2 + Math.random() * 3;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 30 + Math.random() * 20,
      size: 2 + Math.random() * 3,
      color: ["#ff6b35", "#f97316", "#ffd700", "#fb7185"][
        Math.floor(Math.random() * 4)
      ],
    });
  }
}

function updateParticles() {
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life--;
  });

  particles = particles.filter((p) => p.life > 0);
}

function drawParticles() {
  particles.forEach((p) => {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

// ============================================================
// RAIN / WEATHER
// ============================================================

function initWeather() {
  rainDrops = [];
  if (currentWeather === "rain") {
    const count = 80;
    for (let i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: 4 + Math.random() * 3,
        len: 8 + Math.random() * 4,
      });
    }
  }
}

function updateRain() {
  if (currentWeather !== "rain") return;
  rainDrops.forEach((d) => {
    d.y += d.vy;
    if (d.y > canvas.height) {
      d.y = -10;
      d.x = Math.random() * canvas.width;
    }
  });
}

function drawRain() {
  if (currentWeather !== "rain") return;
  ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
  ctx.lineWidth = 1;
  rainDrops.forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + 2, d.y + d.len);
    ctx.stroke();
  });
}

// ============================================================
// SCORE STORAGE + UI
// ============================================================

function getScores() {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveScore(level, time, steps) {
  if (typeof localStorage === "undefined") return;
  const scores = getScores();
  scores.push({ level, time, steps, date: Date.now() });
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

function updateUI() {
  const levelEl = document.getElementById("level-display");
  const timeEl = document.getElementById("time-display");
  const stepsEl = document.getElementById("steps-display");

  if (levelEl) levelEl.textContent = currentLevel;
  if (timeEl) timeEl.textContent = `${elapsedSeconds}s`;
  if (stepsEl) stepsEl.textContent = steps;
}

function renderScoreboard() {
  const box = document.getElementById("scoreboard");
  if (!box) return;

  const scores = getScores()
    .filter((s) => s.level === currentLevel)
    .sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.steps - b.steps;
    });

  box.innerHTML = "<h3>Best Records for This Level</h3>";

  if (scores.length === 0) {
    box.innerHTML += "<p>No records yet. Play a round!</p>";
    return;
  }

  const top = scores.slice(0, 5);
  const ol = document.createElement("ol");
  top.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = `${s.time}s · ${s.steps} steps`;
    ol.appendChild(li);
  });
  box.appendChild(ol);
}

// ============================================================
// LEVEL MANAGEMENT
// ============================================================

function pickSeason(level) {
  // 简单的：关卡号循环四季
  const idx = (level - 1) % SEASONS.length;
  currentSeason = SEASONS[idx];
  currentWeather = currentSeason.weather === "snow" ? "clear" : currentSeason.weather;
}

function loadLevel(level) {
  pickSeason(level);
  levelMap = generateMaze(level);

  traps = [];
  discovered = [];
  bombs = [];
  explosions = [];
  particles = [];
  steps = 0;
  elapsedSeconds = 0;
  levelStartTime = performance.now();

  for (let r = 0; r < ROWS; r++) {
    discovered[r] = [];
    for (let c = 0; c < COLS; c++) {
      discovered[r][c] = false;
      const ch = levelMap[r][c];
      if (ch === "P") {
        player.row = r;
        player.col = c;
        player.facingRow = 0;
        player.facingCol = 1;
      } else if (ch === "E") {
        exitCell.row = r;
        exitCell.col = c;
      } else if (ch === "X") {
        traps.push({ row: r, col: c });
      }
    }
  }

  initWeather();
  gameState = "playing";
  message = "";
  updateUI();
  renderScoreboard();
}

// ============================================================
// MAP HELPERS
// ============================================================

function isWall(row, col) {
  const ch = levelMap[row][col];
  return ch === "#" || ch === "*";
}

function isTrap(row, col) {
  return levelMap[row][col] === "X";
}

function isExit(row, col) {
  return row === exitCell.row && col === exitCell.col;
}

function isBreakableWall(row, col) {
  return levelMap[row][col] === "*";
}

function breakWall(row, col) {
  const rowStr = levelMap[row];
  levelMap[row] = rowStr.substring(0, col) + "." + rowStr.substring(col + 1);
}

// ============================================================
// INPUT HANDLING
// ============================================================

window.addEventListener("keydown", (e) => {
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      " ",
      "w",
      "a",
      "s",
      "d",
      "W",
      "A",
      "S",
      "D",
    ].includes(e.key)
  ) {
    e.preventDefault();
  }

  if (e.code === "Space") {
    if (gameState === "playing") {
      shootBomb();
    } else if (gameState === "dead") {
      loadLevel(currentLevel);
    } else if (gameState === "levelComplete") {
      // 下一关通过弹窗按钮走
    }
    return;
  }

  handleMoveInput(e.key);
});

function handleMoveInput(key) {
  if (gameState !== "playing") return;

  let dRow = 0,
    dCol = 0;
  if (key === "ArrowUp" || key === "w" || key === "W") dRow = -1;
  if (key === "ArrowDown" || key === "s" || key === "S") dRow = 1;
  if (key === "ArrowLeft" || key === "a" || key === "A") dCol = -1;
  if (key === "ArrowRight" || key === "d" || key === "D") dCol = 1;

  if (dRow === 0 && dCol === 0) return;

  const newRow = player.row + dRow;
  const newCol = player.col + dCol;

  if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) return;

  if (isWall(newRow, newCol)) {
    player.facingRow = dRow;
    player.facingCol = dCol;
    return;
  }

  player.row = newRow;
  player.col = newCol;
  player.facingRow = dRow;
  player.facingCol = dCol;
  steps++;
  playSound("move");

  if (isTrap(newRow, newCol)) {
    gameState = "dead";
    message = "💀 TRAPPED! Press Space to retry.";
    playSound("trap");
  } else if (isExit(newRow, newCol)) {
    gameState = "levelComplete";
    saveScore(currentLevel, elapsedSeconds, steps);
    renderScoreboard();
    playSound("levelComplete");
    showLeaderboard();
  }

  updateUI();
}

// ============================================================
// BUBBLE BOMBS
// ============================================================

function shootBomb() {
  if (player.facingRow === 0 && player.facingCol === 0) {
    player.facingRow = 0;
    player.facingCol = 1;
  }

  const exists = bombs.some(
    (b) => b.row === player.row && b.col === player.col && b.active
  );
  if (exists) return;

  bombs.push({
    row: player.row,
    col: player.col,
    dRow: player.facingRow,
    dCol: player.facingCol,
    active: true,
    spawnFrame: frameCount,
  });

  playSound("bomb");
}

function spawnExplosion(row, col) {
  explosions.push({
    row,
    col,
    life: 15,
  });

  createExplosionParticles(row, col, 40);

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const rr = row + dr;
      const cc = col + dc;
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
      if (isBreakableWall(rr, cc)) {
        breakWall(rr, cc);
      }
    }
  }

  playSound("explosion");
}

function updateBombs() {
  bombs.forEach((b) => {
    if (!b.active) return;

    const newRow = b.row + b.dRow;
    const newCol = b.col + b.dCol;

    if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) {
      b.active = false;
      return;
    }

    const ch = levelMap[newRow][newCol];

    if (ch === "#") {
      b.active = false;
      return;
    } else if (ch === "*") {
      spawnExplosion(newRow, newCol);
      b.active = false;
      return;
    } else {
      b.row = newRow;
      b.col = newCol;
    }
  });

  bombs = bombs.filter((b) => b.active);
}

function updateExplosions() {
  explosions.forEach((ex) => ex.life--);
  explosions = explosions.filter((ex) => ex.life > 0);
}

// ============================================================
// RENDERING
// ============================================================

function drawTile(row, col, visible, seenBefore) {
  const ch = levelMap[row][col];
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  // ground background for non-wall
  if (ch !== "#" && ch !== "*") {
    ctx.fillStyle = visible
      ? currentSeason.groundLight
      : currentSeason.groundDark;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  } else {
    // darker ground under walls
    ctx.fillStyle = currentSeason.groundDark;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  // solid wall
  if (ch === "#") {
    ctx.fillStyle = visible ? "#8B4513" : "#3d2210";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

    ctx.fillStyle = visible ? "#A0522D" : "#4a2915";
    ctx.fillRect(x + 4, y + 4, 8, 8);
    ctx.fillRect(x + 14, y + 4, 8, 8);
    ctx.fillRect(x + 24, y + 4, 4, 8);

    ctx.fillRect(x + 9, y + 14, 8, 8);
    ctx.fillRect(x + 19, y + 14, 8, 8);
    ctx.fillRect(x + 4, y + 24, 8, 4);
    ctx.fillRect(x + 14, y + 24, 8, 4);
    ctx.fillRect(x + 24, y + 24, 4, 4);
  }

  // cracked wall
  if (ch === "*") {
    ctx.fillStyle = visible ? "#CD853F" : "#5a3d1f";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

    ctx.strokeStyle = visible ? "#8B4513" : "#3d2210";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 8);
    ctx.lineTo(x + 15, y + 18);
    ctx.lineTo(x + 12, y + 28);
    ctx.moveTo(x + 20, y + 10);
    ctx.lineTo(x + 28, y + 20);
    ctx.stroke();
  }

  // trap
  if (ch === "X" && (visible || seenBefore)) {
    const color = visible ? "#ef4444" : "#7f1d1d";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.fillRect(x + 12, y + 12, 3, 4);
    ctx.fillRect(x + 18, y + 12, 3, 4);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 8);
    ctx.lineTo(x + 24, y + 24);
    ctx.moveTo(x + 24, y + 8);
    ctx.lineTo(x + 8, y + 24);
    ctx.stroke();
  }

  // exit
  if (ch === "E" && (visible || seenBefore)) {
    ctx.fillStyle = visible ? "#FACC15" : "#5a4810";
    ctx.fillRect(x + 6, y + 4, TILE_SIZE - 12, TILE_SIZE - 8);

    ctx.fillStyle = visible ? "#F97316" : "#3d2e08";
    ctx.fillRect(x + 8, y + 6, TILE_SIZE - 16, TILE_SIZE - 12);

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 20, y + 16, 3, 6);
  }
}

function drawPlayer() {
  const x = player.col * TILE_SIZE;
  const y = player.row * TILE_SIZE;

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 6, y + 28, 20, 3);

  // legs
  ctx.fillStyle = "#1D4ED8";
  ctx.fillRect(x + 9, y + 18, 6, 10);
  ctx.fillRect(x + 17, y + 18, 6, 10);

  // body
  ctx.fillStyle = "#E11D48";
  ctx.fillRect(x + 8, y + 10, 16, 10);

  // arms
  ctx.fillStyle = "#F9A8D4";
  ctx.fillRect(x + 5, y + 12, 4, 8);
  ctx.fillRect(x + 23, y + 12, 4, 8);

  // head
  ctx.fillStyle = "#FCD34D";
  ctx.fillRect(x + 10, y + 2, 12, 10);

  // cap
  ctx.fillStyle = "#EC4899";
  ctx.fillRect(x + 8, y + 0, 16, 4);

  // eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 12, y + 5, 2, 2);
  ctx.fillRect(x + 18, y + 5, 2, 2);

  // smile
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + 16, y + 8, 3, 0, Math.PI);
  ctx.stroke();
}

function drawBomb(bomb) {
  const x = bomb.col * TILE_SIZE + TILE_SIZE / 2;
  const y = bomb.row * TILE_SIZE + TILE_SIZE / 2;

  const age = frameCount - bomb.spawnFrame;
  const phase = age % 20;
  const radius = 8 + Math.sin(phase / 3) * 2;

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius + 6);
  gradient.addColorStop(0, "rgba(100, 200, 255, 0.8)");
  gradient.addColorStop(1, "rgba(0, 150, 255, 0.2)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = phase < 10 ? "#80DEEA" : "#4DD0E1";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(x - 3, y - 3, radius / 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawExplosion(ex) {
  const cx = (ex.col + 0.5) * TILE_SIZE;
  const cy = (ex.row + 0.5) * TILE_SIZE;
  const progress = 1 - ex.life / 15;
  const maxRadius = TILE_SIZE * 2.5;
  const radius = maxRadius * progress;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
  gradient.addColorStop(0.3, "rgba(255, 150, 50, 0.8)");
  gradient.addColorStop(0.6, "rgba(255, 50, 0, 0.5)");
  gradient.addColorStop(1, "rgba(100, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 200, 0, ${1 - progress})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
  ctx.stroke();
}

// ============================================================
// LEADERBOARD MODAL
// ============================================================

function showLeaderboard() {
  const modal = document.getElementById("leaderboard-modal");
  const list = document.getElementById("leaderboard-list");
  if (!modal || !list) return;

  const scores = getScores()
    .filter((s) => s.level === currentLevel)
    .sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.steps - b.steps;
    });

  const currentScore = { level: currentLevel, time: elapsedSeconds, steps };
  const currentIndex = scores.findIndex(
    (s) => s.time === currentScore.time && s.steps === currentScore.steps
  );
  const currentRank = currentIndex >= 0 ? currentIndex + 1 : null;

  list.innerHTML = "";

  const top = scores.slice(0, 3);
  const rankClasses = ["gold", "silver", "bronze"];
  const rankEmojis = ["🥇", "🥈", "🥉"];

  top.forEach((s, i) => {
    const isCurrent =
      s.time === currentScore.time && s.steps === currentScore.steps;
    const li = document.createElement("li");
    li.className = "leaderboard-item" + (isCurrent ? " current" : "");

    const rankDiv = document.createElement("div");
    rankDiv.className = "leaderboard-rank " + rankClasses[i];
    rankDiv.textContent = rankEmojis[i];

    const scoreDiv = document.createElement("div");
    scoreDiv.className = "leaderboard-score";
    scoreDiv.innerHTML = `<span>${s.time}s</span><span>${s.steps} steps</span>${
      isCurrent ? ' <span class="leaderboard-you">(You)</span>' : ""
    }`;

    li.appendChild(rankDiv);
    li.appendChild(scoreDiv);
    list.appendChild(li);
  });

  if (currentRank && currentRank > 3) {
    const li = document.createElement("li");
    li.className = "leaderboard-item current";

    const rankDiv = document.createElement("div");
    rankDiv.className = "leaderboard-rank";
    rankDiv.textContent = `#${currentRank}`;

    const scoreDiv = document.createElement("div");
    scoreDiv.className = "leaderboard-score";
    scoreDiv.innerHTML = `<span>${currentScore.time}s</span><span>${currentScore.steps} steps</span> <span class="leaderboard-you">(You)</span>`;

    li.appendChild(rankDiv);
    li.appendChild(scoreDiv);
    list.appendChild(li);
  }

  modal.classList.add("show");
}

function closeLeaderboard() {
  const modal = document.getElementById("leaderboard-modal");
  if (modal) modal.classList.remove("show");
  currentLevel++;
  loadLevel(currentLevel);
}
window.closeLeaderboard = closeLeaderboard;

// ============================================================
// MAIN LOOP
// ============================================================

function gameLoop() {
  frameCount++;
  update();
  drawScene();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (gameState === "playing") {
    if (levelStartTime != null) {
      elapsedSeconds = Math.floor(
        (performance.now() - levelStartTime) / 1000
      );
      updateUI();
    }
    if (frameCount % 5 === 0) {
      updateBombs();
    }
  }
  updateExplosions();
  updateParticles();
  updateRain();
}

function drawScene() {
  // sky background
  ctx.fillStyle = currentSeason.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // tiles
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c - player.col;
      const dy = r - player.row;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const visible = dist <= VISION_RADIUS;

      if (visible) discovered[r][c] = true;
      const seenBefore = discovered[r][c];

      drawTile(r, c, visible, seenBefore);
    }
  }

  drawPlayer();
  bombs.forEach(drawBomb);
  explosions.forEach(drawExplosion);
  drawParticles();
  drawRain();

  // fog of war "spotlight"
  const cx = (player.col + 0.5) * TILE_SIZE;
  const cy = (player.row + 0.5) * TILE_SIZE;
  const maxR = TILE_SIZE * (VISION_RADIUS + 2);

  const fogGradient = ctx.createRadialGradient(
    cx,
    cy,
    TILE_SIZE * 2,
    cx,
    cy,
    maxR
  );
  fogGradient.addColorStop(0, "rgba(0,0,0,0)");
  fogGradient.addColorStop(0.5, currentSeason.fogMid);
  fogGradient.addColorStop(1, currentSeason.fogOuter);

  ctx.fillStyle = fogGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // death message
  if (gameState === "dead" && message) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, 200, 380, 80);

    ctx.fillStyle = "#ef4444";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(message, 240, 235);

    ctx.fillStyle = "#e5e7eb";
    ctx.font = "12px sans-serif";
    ctx.fillText("Press SPACE to retry", 240, 260);
  }
}

// ============================================================
// START GAME
// ============================================================

loadLevel(currentLevel);
gameLoop();
