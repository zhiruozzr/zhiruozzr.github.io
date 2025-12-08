// ============================================================
// PIXEL MAZE ADVENTURE - Enhanced Edition
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ROWS = 15;
const COLS = 15;

// ============================================================
// PROCEDURAL LEVEL GENERATOR
// ============================================================

function generateMaze(seed) {
  // Initialize grid with walls
  const maze = Array(ROWS).fill(null).map(() => Array(COLS).fill('#'));
  
  // Recursive backtracking algorithm
  function carve(row, col) {
    maze[row][col] = '.';
    
    // Randomize directions
    const dirs = [
      [-2, 0], [2, 0], [0, -2], [0, 2]
    ].sort(() => Math.random() - 0.5);
    
    for (const [dr, dc] of dirs) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow > 0 && newRow < ROWS - 1 && 
          newCol > 0 && newCol < COLS - 1 && 
          maze[newRow][newCol] === '#') {
        maze[row + dr/2][col + dc/2] = '.';
        carve(newRow, newCol);
      }
    }
  }
  
  // Start carving from (1,1)
  carve(1, 1);
  
  // Place player start
  maze[1][1] = 'P';
  
  // Place exit (far from start)
  maze[ROWS - 2][COLS - 2] = 'E';
  
  // Add cracked walls (breakable)
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (maze[r][c] === '#' && Math.random() < 0.15) {
        maze[r][c] = '*';
      }
    }
  }
  
  // Add traps
  const trapCount = 8 + Math.floor(seed / 3);
  let placed = 0;
  while (placed < trapCount) {
    const r = 2 + Math.floor(Math.random() * (ROWS - 4));
    const c = 2 + Math.floor(Math.random() * (COLS - 4));
    if (maze[r][c] === '.' && Math.abs(r - 1) + Math.abs(c - 1) > 4) {
      maze[r][c] = 'X';
      placed++;
    }
  }
  
  // Convert to string array
  return maze.map(row => row.join(''));
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
  facingCol: 1
};

let exitCell = { row: 0, col: 0 };
let traps = [];
let discovered = [];
let gameState = "playing";
let message = "";

let bombs = [];
let explosions = [];
let particles = [];
let frameCount = 0;

let levelStartTime = null;
let elapsedSeconds = 0;
let steps = 0;

// ============================================================
// PARTICLE SYSTEM
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
      color: ['#ff6b35', '#f7931e', '#ffd700', '#ff4d4d'][Math.floor(Math.random() * 4)]
    });
  }
}

function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15; // gravity
    p.life--;
  });
  
  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  particles.forEach(p => {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
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
}

function updateUI() {
  document.getElementById('level-display').textContent = currentLevel;
  document.getElementById('time-display').textContent = elapsedSeconds + 's';
  document.getElementById('steps-display').textContent = steps;
}

// ============================================================
// MAP HELPERS
// ============================================================

function isWall(row, col) {
  const ch = levelMap[row][c];
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
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "a", "s", "d"].includes(e.key)) {
    e.preventDefault();
  }

  if (e.code === "Space") {
    if (gameState === "playing") {
      shootBomb();
    } else if (gameState === "dead") {
      loadLevel(currentLevel);
    }
    return;
  }

  handleMoveInput(e.key);
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
    showLeaderboard();
  }
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
    life: 15
  });
  
  createExplosionParticles(row, col, 40);
  
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

  bombs = bombs.filter(b => b.active);
}

function updateExplosions() {
  explosions.forEach(ex => ex.life--);
  explosions = explosions.filter(ex => ex.life > 0);
}

// ============================================================
// RENDERING - MARIO-STYLE PIXELS
// ============================================================

function drawTile(row, col, visible, seenBefore) {
  const ch = levelMap[row][col];
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  // Background
  if (visible) {
    ctx.fillStyle = "#1c2430";
  } else {
    ctx.fillStyle = "#0a0e14";
  }
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Solid wall (brick pattern)
  if (ch === "#") {
    ctx.fillStyle = visible ? "#8B4513" : "#3d2210";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    
    // Brick texture
    ctx.fillStyle = "rgba(0,0,0,0.3)";
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

  // Cracked wall
  if (ch === "*") {
    ctx.fillStyle = visible ? "#CD853F" : "#5a3d1f";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    
    // Cracks
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

  // Trap (skull)
  if (ch === "X" && (visible || seenBefore)) {
    const color = visible ? "#ff0000" : "#5a0000";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Skull eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(x + 12, y + 12, 3, 4);
    ctx.fillRect(x + 18, y + 12, 3, 4);
    
    // Crossbones
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 8);
    ctx.lineTo(x + 24, y + 24);
    ctx.moveTo(x + 24, y + 8);
    ctx.lineTo(x + 8, y + 24);
    ctx.stroke();
  }

  // Exit (golden door)
  if (ch === "E" && (visible || seenBefore)) {
    ctx.fillStyle = visible ? "#FFD700" : "#5a4810";
    ctx.fillRect(x + 6, y + 4, TILE_SIZE - 12, TILE_SIZE - 8);
    
    ctx.fillStyle = visible ? "#FFA500" : "#3d2e08";
    ctx.fillRect(x + 8, y + 6, TILE_SIZE - 16, TILE_SIZE - 12);
    
    // Door handle
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 20, y + 16, 3, 6);
  }
}

function drawPlayer() {
  const x = player.col * TILE_SIZE;
  const y = player.row * TILE_SIZE;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x + 6, y + 28, 20, 3);

  // Legs (blue)
  ctx.fillStyle = "#1E88E5";
  ctx.fillRect(x + 9, y + 18, 6, 10);
  ctx.fillRect(x + 17, y + 18, 6, 10);

  // Body (red)
  ctx.fillStyle = "#E53935";
  ctx.fillRect(x + 8, y + 10, 16, 10);

  // Arms
  ctx.fillStyle = "#FFAB91";
  ctx.fillRect(x + 5, y + 12, 4, 8);
  ctx.fillRect(x + 23, y + 12, 4, 8);

  // Head
  ctx.fillStyle = "#FFCC80";
  ctx.fillRect(x + 10, y + 2, 12, 10);

  // Cap
  ctx.fillStyle = "#D32F2F";
  ctx.fillRect(x + 8, y + 0, 16, 4);

  // Eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 12, y + 5, 2, 2);
  ctx.fillRect(x + 18, y + 5, 2, 2);

  // Smile
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

  // Outer glow
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius + 6);
  gradient.addColorStop(0, "rgba(100, 200, 255, 0.8)");
  gradient.addColorStop(1, "rgba(0, 150, 255, 0.2)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
  ctx.fill();

  // Bubble
  ctx.fillStyle = phase < 10 ? "#80DEEA" : "#4DD0E1";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
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

  // Fire gradient
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
  gradient.addColorStop(0.3, "rgba(255, 150, 50, 0.8)");
  gradient.addColorStop(0.6, "rgba(255, 50, 0, 0.5)");
  gradient.addColorStop(1, "rgba(100, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Ring effect
  ctx.strokeStyle = `rgba(255, 200, 0, ${1 - progress})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
  ctx.stroke();
}

// ============================================================
// MAIN GAME LOOP
// ============================================================

const VISION_RADIUS = 4;

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
      updateUI();
    }
    
    if (frameCount % 5 === 0) {
      updateBombs();
    }
  }
  
  updateExplosions();
  updateParticles();
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw tiles
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

  // Spotlight fog
  const cx = (player.col + 0.5) * TILE_SIZE;
  const cy = (player.row + 0.5) * TILE_SIZE;
  const maxR = TILE_SIZE * (VISION_RADIUS + 2);

  const fogGradient = ctx.createRadialGradient(cx, cy, TILE_SIZE * 2, cx, cy, maxR);
  fogGradient.addColorStop(0, "rgba(0,0,0,0)");
  fogGradient.addColorStop(0.5, "rgba(0,0,0,0.5)");
  fogGradient.addColorStop(1, "rgba(0,0,0,0.95)");

  ctx.fillStyle = fogGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Death message
  if (gameState === "dead" && message) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, 200, 380, 80);
    
    ctx.fillStyle = "#ff0000";
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(message, 240, 235);
    
    ctx.fillStyle = "#fff";
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillText("Press SPACE to retry", 240, 260);
  }
}

// ============================================================
// LEADERBOARD
// ============================================================

const SCORE_KEY = "pixel_maze_scores";

function getScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveScore(level, time, steps) {
  const scores = getScores();
  scores.push({ level, time, steps, date: Date.now() });
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

function showLeaderboard() {
  saveScore(currentLevel, elapsedSeconds, steps);
  
  const scores = getScores()
    .filter(s => s.level === currentLevel)
    .sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.steps - b.steps;
    });

  const currentScore = { level: currentLevel, time: elapsedSeconds, steps };
  const currentRank = scores.findIndex(s => 
    s.time === currentScore.time && s.steps === currentScore.steps
  ) + 1;

  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';

  // Top 3
  const top3 = scores.slice(0, 3);
  top3.forEach((s, i) => {
    const isCurrent = s.time === currentScore.time && s.steps === currentScore.steps;
    const li = document.createElement('li');
    li.className = 'leaderboard-item' + (isCurrent ? ' current' : '');
    
    const rankColors = ['gold', 'silver', 'bronze'];
    li.innerHTML = `
      <div class="rank ${rankColors[i]}">${['🥇', '🥈', '🥉'][i]}</div>
      <div class="score-details">
        ${s.time}s · ${s.steps} steps
      </div>
    `;
    list.appendChild(li);
  });

  // Current rank if not in top 3
  if (currentRank > 3) {
    const li = document.createElement('li');
    li.className = 'leaderboard-item current';
    li.innerHTML = `
      <div class="rank">#${currentRank}</div>
      <div class="score-details">
        ${currentScore.time}s · ${currentScore.steps} steps (You)
      </div>
    `;
    list.appendChild(li);
  }

  document.getElementById('leaderboard-modal').classList.add('show');
}

function closeLeaderboard() {
  document.getElementById('leaderboard-modal').classList.remove('show');
  currentLevel++;
  loadLevel(currentLevel);
}

// ============================================================
// START GAME
// ============================================================

loadLevel(currentLevel);
gameLoop();
