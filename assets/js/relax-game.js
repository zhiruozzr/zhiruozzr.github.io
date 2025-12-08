const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ROWS = 15;
const COLS = 15;

// Map legend:
// # = solid wall (indestructible)
// * = cracked wall (bomb can destroy)
// . = floor
// P = player spawn
// E = exit
// X = trap
const levels = [
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
];

let currentLevelIndex = 0;

const player = {
  row: 0,
  col: 0,
  facingRow: 0, // facing direction (row delta)
  facingCol: 1  // facing direction (col delta), default right
};

let exitCell = { row: 0, col: 0 };
let traps = [];  // {row, col}
const VISION_RADIUS = 3;

let discovered = [];        // tiles that have been seen at least once
let gameState = "playing";  // "playing" | "dead" | "levelComplete" | "allComplete"
let message = "";
let bombs = [];             // active bubble bombs
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

  // Sort by time first, then by steps
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
  message = `Level ${index + 1}`;
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
    message = "💀 You stepped on a trap! Press Space to retry.";
  } else if (isExit(newRow, newCol)) {
    const levelNumber = currentLevelIndex + 1;
    recordRun(levelNumber, elapsedSeconds, steps);

    if (currentLevelIndex < levels.length - 1) {
      gameState = "levelComplete";
      message = "✅ Level cleared! Press Space for the next level.";
    } else {
      gameState = "allComplete";
      message = "🏆 All levels cleared! Press Space to restart.";
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
      message = "🏆 All levels cleared!";
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

function explode(row, col) {
  // 3×3 explosion area centered on (row, col)
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
      b.active = false;
      return;
    } else if (ch === "*") {
      explode(newRow, newCol);
      b.active = false;
      return;
    } else {
      b.row = newRow;
      b.col = newCol;
    }
  });

  bombs = bombs.filter(b => b.active);
}

// ---------- Drawing ----------
function drawTile(row, col, visible, seenBefore) {
  const map = levels[currentLevelIndex];
  const ch = map[row][col];
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  if (!visible && !seenBefore) {
    ctx.fillStyle = "#02030a";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    return;
  }

  if (visible) {
    ctx.fillStyle = "#1d1d24";
  } else {
    ctx.fillStyle = "#111116";
  }
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Solid wall
  if (ch === "#") {
    ctx.fillStyle = visible ? "#555b77" : "#2a2f40";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  }

  // Cracked wall
  if (ch === "*") {
    ctx.fillStyle = visible ? "#786c4f" : "#3a3424";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
    ctx.strokeStyle = visible ? "#d7ccc8" : "#6d4c41";
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
      ctx.fillStyle = visible ? "#d32f2f" : "#5b1d1d";
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
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
      ctx.fillStyle = visible ? "#ffeb3b" : "#5a5220";
      ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
      ctx.fillStyle = visible ? "#333" : "#111";
      ctx.fillRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
    }
  }
}

function drawPlayer() {
  const x = player.col * TILE_SIZE;
  const y = player.row * TILE_SIZE;

  ctx.fillStyle = "#4fc3f7";
  ctx.fillRect(x + 8, y + 12, TILE_SIZE - 16, TILE_SIZE - 12);

  ctx.fillStyle = "#ffe082";
  ctx.fillRect(x + 10, y + 2, TILE_SIZE - 20, TILE_SIZE - 16);

  ctx.fillStyle = "#000";
  ctx.fillRect(x + 13, y + 6, 3, 4);
  ctx.fillRect(x + TILE_SIZE - 16, y + 6, 3, 4);

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(x + 8, y + TILE_SIZE - 4, TILE_SIZE - 16, 3);
}

// Bubble bomb shimmer animation
function drawBomb(bomb) {
  const x = bomb.col * TILE_SIZE + TILE_SIZE / 2;
  const y = bomb.row * TILE_SIZE + TILE_SIZE / 2;

  const age = frameCount - bomb.spawnFrame;
  const phase = age % 20;
  const radiusBase = TILE_SIZE / 4;
  const radius = radiusBase + (phase < 10 ? 2 : -2);

  // Outer glow
  ctx.beginPath();
  ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
  ctx.fillStyle = phase < 10 ? "rgba(129,212,250,0.35)" : "rgba(0,150,136,0.4)";
  ctx.fill();

  // Inner bubble
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = phase < 10 ? "#80deea" : "#b3e5fc";
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.arc(x - 4, y - 4, radius / 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
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
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fog of war + tiles
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

  // Player
  drawPlayer();

  // Bombs
  bombs.forEach(drawBomb);

  // HUD
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(`Level: ${currentLevelIndex + 1}/${levels.length}`, 12, 12);
  ctx.fillText(`Time: ${elapsedSeconds}s`, 150, 12);
  ctx.fillText(`Steps: ${steps}`, 270, 12);

  if (message) {
    ctx.textAlign = "right";
    ctx.fillText(message, canvas.width - 12, 12);
    ctx.textAlign = "left";
  }
}

// Start
loadLevel(currentLevelIndex);
gameLoop();
