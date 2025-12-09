// ============================================================
// PIXEL MAZE ADVENTURE - Path-safe + Stardew-ish background
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ROWS = 15;
const COLS = 15;

function getSeasonPalette(level) {
  const idx = (level - 1) % 4;
  switch (idx) {
    // Spring
    case 0:
      return {
        skyTop: "#9ad0ff",
        skyBottom: "#cfe9ff",
        groundTop: "#7cd37f",
        groundBottom: "#3b6e3f",
      };
    // Summer
    case 1:
      return {
        skyTop: "#71bfff",
        skyBottom: "#a9ddff",
        groundTop: "#5fb94f",
        groundBottom: "#2f6a33",
      };
    // Autumn
    case 2:
      return {
        skyTop: "#ffcf9a",
        skyBottom: "#ffd8b5",
        groundTop: "#f4a259",
        groundBottom: "#8c4c2e",
      };
    // Winter
    case 3:
    default:
      return {
        skyTop: "#dbeafe",
        skyBottom: "#e5f0ff",
        groundTop: "#c4d7f5",
        groundBottom: "#5b6f96",
      };
  }
}


function generateMaze(difficulty) {
  const maze = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill("#"));

  // 1. 挖迷宫（递归回溯）
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

  const startR = 1;
  const startC = 1;
  carve(startR, startC);

  // 2. BFS 找到“离起点最远”的可走格子，当作出口；同时记录 parent 链
  const dist = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(Infinity));
  const visited = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(false));
  const parent = {}; // key: "r,c" -> "pr,pc"

  const q = [];
  q.push([startR, startC]);
  visited[startR][startC] = true;
  dist[startR][startC] = 0;
  parent[`${startR},${startC}`] = null;

  let farthest = { row: startR, col: startC, d: 0 };

  const dirs4 = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (q.length) {
    const [r, c] = q.shift();
    const curD = dist[r][c];

    if (curD > farthest.d) {
      farthest = { row: r, col: c, d: curD };
    }

    for (const [dr, dc] of dirs4) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !visited[nr][nc] &&
        maze[nr][nc] === "."
      ) {
        visited[nr][nc] = true;
        dist[nr][nc] = curD + 1;
        parent[`${nr},${nc}`] = `${r},${c}`;
        q.push([nr, nc]);
      }
    }
  }

  const exitR = farthest.row;
  const exitC = farthest.col;

  maze[startR][startC] = "P";
  maze[exitR][exitC] = "E";

  const safePath = new Set();
  let curKey = `${exitR},${exitC}`;
  while (curKey) {
    safePath.add(curKey);
    curKey = parent[curKey];
  }

  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (maze[r][c] === "#" && Math.random() < 0.18) {
        maze[r][c] = "*";
      }
    }
  }

  const trapCount = 6 + Math.floor(difficulty / 2);
  let placed = 0;
  const candidates = [];

  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (maze[r][c] === ".") {
        const key = `${r},${c}`;
        const manStart = Math.abs(r - startR) + Math.abs(c - startC);
        const manExit = Math.abs(r - exitR) + Math.abs(c - exitC);
        if (
          !safePath.has(key) && // 不破坏至少一条通路
          manStart > 2 && // 起点附近留点安全区
          !(r === exitR && c === exitC) &&
          manExit > 0
        ) {
          candidates.push({ r, c });
        }
      }
    }
  }

  while (placed < trapCount && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    const { r, c } = candidates.splice(idx, 1)[0];
    maze[r][c] = "X";
    placed++;
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
// PARTICLES
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
      color: ["#ff6b35", "#f7931e", "#ffd700", "#ff4d4d"][
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
  return;
}

// ============================================================
// LEVEL MANAGEMENT
// ============================================================

function loadLevel(level) {
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
// INPUT
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
      const modal = document.getElementById("leaderboard-modal");
      if (modal && modal.classList.contains("show")) {
        closeLeaderboard(); 
      } else {
        currentLevel++;
        loadLevel(currentLevel);
      }
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

  if (isTrap(newRow, newCol)) {
    gameState = "dead";
    message = "💀 TRAPPED! Press Space to retry.";
  } else if (isExit(newRow, newCol)) {
    gameState = "levelComplete";
    saveScore(currentLevel, elapsedSeconds, steps);
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
// 替换版：drawTile（草地 + 小路 + 亮一点的墙）
// ============================================================
function drawTile(row, col, visible, seenBefore) {
  const ch = levelMap[row][col];
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  const season = getSeasonPalette(currentLevel);

  // --- 1. 底层：草地 ---
  // 明亮一点的草坪，不再是纯深色
  ctx.fillStyle = visible ? season.groundTop : season.groundBottom;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // 做一点棋盘纹理，让草地更像像素
  if ((row + col) % 2 === 0) {
    ctx.fillStyle = visible
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  // 如果完全没见过、又不在视野里，就盖一层柔和的迷雾
  if (!visible && !seenBefore) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    return;
  }

  // --- 2. 小路：可走格子（包括起点/终点/陷阱下的地面） ---
  if (ch === "." || ch === "P" || ch === "E" || ch === "X") {
    // 土路：比草地稍微偏黄一点
    ctx.fillStyle = visible ? "#e3c28f" : "#b89b6e";
    ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);

    // 小路边缘加一点阴影
    ctx.strokeStyle = visible ? "rgba(128,90,50,0.6)" : "rgba(55,40,20,0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 4.5, y + 4.5, TILE_SIZE - 9, TILE_SIZE - 9);
  }

  // --- 3. 墙体：更偏“砖墙/树篱”，不再是下水道 ---
  if (ch === "#") {
    ctx.fillStyle = visible ? "#d49a6a" : "#915c35";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    // 砖块纹理
    ctx.fillStyle = visible ? "#f0c49b" : "#b47b4c";
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

    ctx.fillStyle = "rgba(120,72,40,0.45)";
    ctx.fillRect(x + 2, y + TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE / 2 - 4);
  }

  // --- 4. 可炸的裂墙：颜色更浅，像石块 ---
  if (ch === "*") {
    ctx.fillStyle = visible ? "#e0b58b" : "#a77a4f";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = visible ? "#f5dec0" : "#c59863";
    ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);

    ctx.strokeStyle = visible ? "#8b5a2b" : "#5a3818";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 7);
    ctx.lineTo(x + 14, y + 18);
    ctx.lineTo(x + 10, y + 27);
    ctx.moveTo(x + 19, y + 9);
    ctx.lineTo(x + 26, y + 19);
    ctx.stroke();
  }

  // --- 5. 陷阱：依然亮红色，但是在小路上 ---
  if (ch === "X" && (visible || seenBefore)) {
    ctx.fillStyle = visible ? "#f97373" : "#b54545";
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 9, 0, Math.PI * 2);
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

  // --- 6. 出口：更亮一点的金色门 ---
  if (ch === "E" && (visible || seenBefore)) {
    ctx.fillStyle = visible ? "#ffe27a" : "#c7a94c";
    ctx.fillRect(x + 6, y + 4, TILE_SIZE - 12, TILE_SIZE - 8);

    ctx.fillStyle = visible ? "#fbbf24" : "#b3741b";
    ctx.fillRect(x + 8, y + 6, TILE_SIZE - 16, TILE_SIZE - 12);

    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(x + 20, y + 16, 3, 6);
  }
}


// ============================================================
// 替换版：drawPlayer（保持你原来的像素人，只是背景变亮）
// ============================================================
function drawPlayer() {
  const x = player.col * TILE_SIZE;
  const y = player.row * TILE_SIZE;

  // 影子
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 6, y + 28, 20, 3);

  // 腿（蓝）
  ctx.fillStyle = "#1E88E5";
  ctx.fillRect(x + 9, y + 18, 6, 10);
  ctx.fillRect(x + 17, y + 18, 6, 10);

  // 身体（红）
  ctx.fillStyle = "#E53935";
  ctx.fillRect(x + 8, y + 10, 16, 10);

  // 手臂
  ctx.fillStyle = "#FFAB91";
  ctx.fillRect(x + 5, y + 12, 4, 8);
  ctx.fillRect(x + 23, y + 12, 4, 8);

  // 头
  ctx.fillStyle = "#FFCC80";
  ctx.fillRect(x + 10, y + 2, 12, 10);

  // 帽子
  ctx.fillStyle = "#D32F2F";
  ctx.fillRect(x + 8, y + 0, 16, 4);

  // 眼睛
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 12, y + 5, 2, 2);
  ctx.fillRect(x + 18, y + 5, 2, 2);

  // 微笑
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
// LEADERBOARD POPUP
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
}

// ============================================================
// 替换版：drawScene（季节背景 + 更柔和的迷雾）
// ============================================================
function drawScene() {
  // --- 背景：季节渐变，尽量亮 ---
  const palette = getSeasonPalette(currentLevel);
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, palette.skyTop);
  bgGrad.addColorStop(0.35, palette.skyBottom);
  bgGrad.addColorStop(0.55, palette.groundTop);
  bgGrad.addColorStop(1, palette.groundBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- 地图 + 角色 + 特效 ---
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

  // --- 迷雾：中心亮、边缘半透明，不再是全黑下水道 ---
  const cx = (player.col + 0.5) * TILE_SIZE;
  const cy = (player.row + 0.5) * TILE_SIZE;
  const maxR = TILE_SIZE * (VISION_RADIUS + 3);

  const fogGradient = ctx.createRadialGradient(
    cx,
    cy,
    TILE_SIZE * 1.2,
    cx,
    cy,
    maxR
  );
  fogGradient.addColorStop(0, "rgba(0,0,0,0)");      // 脚下完全不遮
  fogGradient.addColorStop(0.55, "rgba(0,0,0,0.25)"); // 中环轻微暗
  fogGradient.addColorStop(1, "rgba(0,0,0,0.55)");    // 边缘半透明，不是纯黑

  ctx.fillStyle = fogGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- 死亡提示 ---
  if (gameState === "dead" && message) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(50, 200, 380, 80);

    ctx.fillStyle = "#ef4444";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(message, 240, 235);

    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText("Press SPACE to retry", 240, 260);
  }
}


// ============================================================
// START
// ============================================================

loadLevel(currentLevel);
gameLoop();
