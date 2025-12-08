const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ROWS = 15;
const COLS = 15;

// --- LEVEL DATA (easy to move to JSON later) ---
// If you want JSON later, you can copy this structure
// into a file like /assets/levels/maze-levels.json as:
// { "levels": [ [ "###############", ... ], [ ... ] ] }
const LEVEL_DATA = {
  levels: [
    [
      "###############",
      "#P....#....*..#",
      "###.#.#.#####.#",
      "#...#.#.....#.#",
      "#.###.###.#.#.#",
      "#.....#...#.#.#",
      "#####.#.###.#.#",
      "#.....#...#.#.#",
      "#.###.###.#.#.#",
      "#.#...#.*.#.#.#",
      "#.#.###.###.#.#",
      "#.#.....#...#.#",
      "#.#####.#.###.#",
      "#.....X...E...#",
      "###############",
    ],
    [
      "###############",
      "#P....#...X..*#",
      "#.###.#.#####.#",
      "#...#.#.....#.#",
      "###.#.###.#.#.#",
      "#...#.....#.#.#",
      "#.#.#####.#.#.#",
      "#.#..*..#.#...#",
      "#.#.###.#.###.#",
      "#.#.#...#...#.#",
      "#.#.#.#####.#.#",
      "#.#.#.....#.#.#",
      "#.#.#####.#.#.#",
      "#...X...E.*...#",
      "###############",
    ]
  ]
};

let levels = LEVEL_DATA.levels;

let currentLevelIndex = 0;

const player = {
  row: 0,
  col: 0,
  facingRow: 0, // facing direction (row delta)
  facingCol: 1  // facing direction (col delta), default right
};

let exitCell = { row: 0, col: 0 };
let traps = [];  // {row, col}
const VISION_RADIUS = 3.5; // slightly larger spotlight

let discovered = [];        // tiles that have been seen at least once
let gameState = "playing";  // "playing" | "dead" | "levelComplete" | "allComplete"
let message = "";
let bombs = [];             // active bubble bombs
let explosions = [];        // active explosion rings
let frameCount = 0;

// Timer & steps
let levelStartTime = null;  // performance.now()
let elapsedSeconds = 0;
let steps = 0;

// ---------- Local "leaderboard" using localStorage ----------
const SCORE_KEY = "pixel_maze_scores";

function getScoreData() {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveScoreData(data) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SCORE_KEY, JSON.stringify(data));
}

function recordRun(levelNumber, timeSec, stepCount) {
  const data = getScoreData();
  data.push({
    level: levelNumber,
    time: timeSec,
    steps: stepCount
  });
  saveScoreData(data);
  renderScoreboard();
}

function renderScoreboard() {
  const box = document.getElementById("scoreboard");
  if (!box) return;

  const levelNumber = currentLevelIndex + 1;
  const data = getScoreData().filter(r => r.level === levelNumber);

  box.innerHTML = "<h3>Best Records for This Level</h3>";

  if (data.length === 0) {
    box.innerHTML += "<p>No records yet. Play a round!</p>";
    return;
  }

  data.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.steps - b.steps;
  });

  const top = data.slice(0, 5);
  const list = document.createElement("ol");
  top.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${r.time}s · ${r.steps} steps`;
    list.appendChild(li);
  });

  box.appendChild(list);
}

// ---------- Level initialization ----------
function loadLevel(index) {
  const map = levels[index];
  traps = [];
  discovered = [];
  bombs = [];
  explosions = [];
  steps = 0;
  elapsedSeconds = 0;
  levelStartTime = performance.now();

  for (let r = 0; r < ROWS; r++) {
    discovered[r] = [];
    for (let c = 0; c < COLS; c++) {
      discovered[r][c] = false;
      const ch = map[r][c];
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
  renderScoreboard();
}

// ---------- Map helpers ----------
function isWall(row, col) {
  const map = levels[currentLevelIndex];
  const ch = map[row][col];
  return ch === "#" || ch === "*";
}

function isTrap(row, col) {
  const map = levels[currentLevelIndex];
  const ch = map[row][col];
  return ch === "X";
}

function isExit(row, col) {
  return row === exitCell.row && col === exitCell.col;
}

function isBreakableWall(row, col) {
  const map = levels[currentLevelIndex];
  return map[row][col] === "*";
}

function breakWall(row, col) {
  const map = levels[currentLevelIndex];
  const rowStr = map[row];
  levels[currentLevelIndex][row] =
    rowStr.substring(0, col) + "." + rowStr.substring(col + 1);
}

// ---------- Keyboard controls ----------
const keyState = {};
window.addEventListener("keydown", (e) => {
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key) ||
    ["w","a","s","d","W","A","S","D"].includes(e.key)
  ) {
    e.preventDefault();
  }

  if (e.code === "Space") {
    if (gameState === "playing") {
      shootBomb();
    } else if (gameState === "dead" || gameState === "levelComplete") {
      goNext();
    } else if (gameState === "allComplete") {
      currentLevelIndex = 0;
      loadLevel(currentLevelIndex);
    }
    return;
  }

  keyState[e.key] = true;
  handleMoveInput(e.key);
});

window.addEventListener("keyup", (e) => {
  keyState[e.key] = false;
});

function handleMoveInput(key) {
  if (gameState !== "playing") return;

  let dRow = 0, dCol = 0;
  if (key === "ArrowUp" || key === "w" || key === "W") dRow = -1;
  if (key === "ArrowDown" || key === "s" || key === "S") dRow = 1;
  if (key === "ArrowLeft" || key === "a" || key === "A") dCol = -1;
  if (key === "ArrowRight" || key === "d" || key === "D") dCol = 1;

  if (dRow === 0 && dCol === 0) return;

  const newRow = player.row + dRow;
  const newCol = player.col + dCol;

  if (
    newRow < 0 || newRow >= ROWS ||
    newCol < 0 || newCol >= COLS
  ) {
    return;
  }

  if (isWall(newRow, newCol)) {
    // Hit a wall: don't move but update facing direction
    player.facingRow = dRow;
    player.facingCol = dCol;
    return;
  }

  // Move
  player.row = newRow;
  player.col = newCol;
  player.facingRow = dRow;
  player.facingCol = dCol;
  steps++;

  if (isTrap(newRow, newCol)) {
    gameState = "dead";
    message = "You stepped on a trap! Press Space to retry.";
  } else if (isExit(newRow, newCol)) {
    const levelNumber = currentLevelIndex + 1;
    recordRun(levelNumber, elapsedSeconds, steps);

    if (currentLevelIndex < levels.length - 1) {
      gameState = "levelComplete";
      message = "Level cleared! Press Space for the next level.";
    } else {
      gameState = "allComplete";
      message = "All levels cleared! Press Space to restart.";
    }
  }
}

function goNext() {
  if (gameState === "dead") {
    loadLevel(currentLevelIndex);
  } else if (gameState === "levelComplete") {
    currentLevelIndex++;
    if (currentLevelIndex >= levels.length) {
      gameState = "allComplete";
      message = "All levels cleared!";
    } else {
      loadLevel(currentLevelIndex);
    }
  }
}

// ---------- Bubble bombs ----------
function shootBomb() {
  if (player.facingRow === 0 && player.facingCol === 0) {
    player.facingRow = 0;
    player.facingCol = 1;
  }

  const exists = bombs.some(
    b => b.row === player.row && b.col === player.col && b.active
  );
  if (exists) return;

  bombs.push({
    row: player.row,
    col: player.col,
    dRow: player.facingRow,
    dCol: player.facingCol,
    active: true,
    spawnFrame: frameCount
  });
}

function spawnExplosion(row, col) {
  explosions.push({
    row,
    col,
    life: 12 // frames
  });
  // 3×3 blast area
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
  bombs.forEach(b => {
    if (!b.active) return;

    const newRow = b.row + b.dRow;
    const newCol = b.col + b.dCol;

    if (
      newRow < 0 || newRow >= ROWS ||
      newCol < 0 || newCol >= COLS
    ) {
      b.active = false;
      return;
    }

    const map = levels[currentLevelIndex];
    const ch = map[newRow][newCol];

    if (ch === "#") {
      // solid wall: vanish
      b.active = false;
      return;
    } else if (ch === "*") {
      // cracked wall: explode with 3×3 blast
      spawnExplosion(newRow, newCol);
      b.active = false;
      return;
    } else {
      // fly through floor, traps, etc.
      b.row = newRow;
      b.col = newCol;
    }
  });

  bombs = bombs.filter(b => b.active);
}

function updateExplosions() {
  explosions.forEach(ex => {
    ex.life--;
  });
  explosions = explosions.filter(ex => ex.life > 0);
}

// ---------- Drawing tiles (Mario-ish-ish colors) ----------
function drawTile(row, col, visible, seenBefore) {
  const map = levels[currentLevelIndex];
  const ch = map[row][col];
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  // background
  if (visible) {
    ctx.fillStyle = "#1c2430"; // dark blue floor
  } else {
    ctx.fillStyle = "#0d1117";
  }
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Solid wall (brick-like)
  if (ch === "#") {
    ctx.fillStyle = visible ? "#8d4b32" : "#3f2015";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    ctx.fillStyle = "rgba(255, 220, 180, 0.2)";
    ctx.fillRect(x + 5, y + 5, TILE_SIZE - 10, 4);
  }

  // Cracked wall
  if (ch === "*") {
    ctx.fillStyle = visible ? "#b05a3c" : "#4d2920";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    ctx.strokeStyle = visible ? "#ffd7b3" : "#7a4b34";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 8);
    ctx.lineTo(x + TILE_SIZE - 6, y + TILE_SIZE - 10);
    ctx.moveTo(x + 12, y + TILE_SIZE - 6);
    ctx.lineTo(x + TILE_SIZE - 10, y + 10);
    ctx.stroke();
  }

  // Trap
  if (ch === "X") {
    if (visible || seenBefore) {
      ctx.fillStyle = visible ? "#ff5252" : "#5b1d1d";
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x+8, y+8);
      ctx.lineTo(x+TILE_SIZE-8, y+TILE_SIZE-8);
      ctx.moveTo(x+TILE_SIZE-8, y+8);
      ctx.lineTo(x+8, y+TILE_SIZE-8);
      ctx.stroke();
    }
  }

  // Exit
  if (ch === "E") {
    if (visible || seenBefore) {
      ctx.fillStyle = visible ? "#ffd54f" : "#5a4a1f";
      ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
      ctx.fillStyle = visible ? "#333" : "#111";
      ctx.fillRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
    }
  }
}

// ---------- Player (Mario-ish colors) ----------
function drawPlayer() {
  const x = player.col * TILE_SIZE;
  const y = player.row * TILE_SIZE;

  // legs
  ctx.fillStyle = "#1565c0";
  ctx.fillRect(x + 10, y + 18, TILE_SIZE - 20, TILE_SIZE - 6);

  // body
  ctx.fillStyle = "#e53935"; // red shirt
  ctx.fillRect(x + 8, y + 10, TILE_SIZE - 16, 10);

  // head
  ctx.fillStyle = "#ffcc80";
  ctx.fillRect(x + 9, y + 2, TILE_SIZE - 18, 10);

  // hat
  ctx.fillStyle = "#c62828";
  ctx.fillRect(x + 8, y + 0, TILE_SIZE - 16, 4);

  // eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 13, y + 5, 2, 3);
  ctx.fillRect(x + TILE_SIZE - 17, y + 5, 2, 3);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(x + 8, y + TILE_SIZE - 4, TILE_SIZE - 16, 3);
}

// Bubble bomb shimmer animation
function drawBomb(bomb) {
  const x = bomb.col * TILE_SIZE + TILE_SIZE / 2;
  const y = bomb.row * TILE_SIZE + TILE_SIZE / 2;

  const age = frameCount - bomb.spawnFrame;
  const phase = age % 16;
  const radiusBase = TILE_SIZE / 4;
  const radius = radiusBase + (phase < 8 ? 2 : -2);

  // Outer glow
  ctx.beginPath();
  ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
  ctx.fillStyle = phase < 8 ? "rgba(129,212,250,0.45)" : "rgba(0,150,136,0.5)";
  ctx.fill();

  // Inner bubble
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = phase < 8 ? "#80deea" : "#b3e5fc";
  ctx.fill();

  // highlight
  ctx.beginPath();
  ctx.arc(x - 4, y - 4, radius / 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fill();
}

// Explosion fire ring
function drawExplosion(ex) {
  const cx = (ex.col + 0.5) * TILE_SIZE;
  const cy = (ex.row + 0.5) * TILE_SIZE;
  const progress = 1 - ex.life / 12; // 0 -> 1
  const maxRadius = TILE_SIZE * 2;
  const radius = maxRadius * progress;

  const gradient = ctx.createRadialGradient(
    cx, cy, radius * 0.2,
    cx, cy, radius
  );
  gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
  gradient.addColorStop(0.4, "rgba(255, 140, 0, 0.7)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

// ---------- Main loop ----------
function gameLoop() {
  frameCount++;
  update();
  drawScene();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (gameState === "playing") {
    if (levelStartTime != null) {
      elapsedSeconds = Math.floor((performance.now() - levelStartTime) / 1000);
    }
    if (frameCount % 6 === 0) {
      updateBombs();
    }
  }
  updateExplosions();
}

// ---------- Fog-of-war: spotlight style ----------
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) draw tiles with discovered info
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c - player.col;
      const dy = r - player.row;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const visible = dist <= VISION_RADIUS;
      if (visible) discovered[r][c] = true;
      const seenBefore = discovered[r][c];
      drawTile(r, c, visible, seenBefore);
    }
  }

  // 2) player and bombs
  drawPlayer();
  bombs.forEach(drawBomb);

  // 3) explosion effects on top
  explosions.forEach(drawExplosion);

  // 4) fog overlay (spotlight)
  const cx = (player.col + 0.5) * TILE_SIZE;
  const cy = (player.row + 0.5) * TILE_SIZE;
  const maxR = TILE_SIZE * (VISION_RADIUS + 1.5);

  const fogGradient = ctx.createRadialGradient(
    cx, cy, TILE_SIZE * 1.0,
    cx, cy, maxR
  );
  fogGradient.addColorStop(0, "rgba(0,0,0,0)");
  fogGradient.addColorStop(0.6, "rgba(0,0,0,0.4)");
  fogGradient.addColorStop(1, "rgba(0,0,0,0.95)");

  ctx.fillStyle = fogGradient;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 5) HUD
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(`Level: ${currentLevelIndex + 1}/${levels.length}`, 12, 12);
  ctx.fillText(`Time: ${elapsedSeconds}s`, 150, 12);
  ctx.fillText(`Steps: ${steps}`, 270, 12);

  // 6) big center message when not playing
  if (gameState !== "playing" && message) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(40, canvas.height / 2 - 40, canvas.width - 80, 80);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.strokeRect(40, canvas.height / 2 - 40, canvas.width - 80, 80);

    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 8);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ddd";
    ctx.fillText("Press Space to continue", canvas.width / 2, canvas.height / 2 + 18);
  }
}

// Start
loadLevel(currentLevelIndex);
gameLoop();
