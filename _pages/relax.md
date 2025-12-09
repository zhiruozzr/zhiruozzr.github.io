---
layout: single
title: "Pixel Maze Adventure"
permalink: /relax/
author_profile: true
---

## Pixel Maze Adventure

Tiny pixel maze with fog-of-war, bubble bombs, and a tiny local leaderboard.

**Controls**

- ⬆ ⬇ ⬅ ⮕ or **WASD** – move  
- **Space** (while playing) – shoot a bubble bomb in the facing direction  
- Cracked walls `*` can be destroyed (blast radius: **3×3**)  
- Avoid ❌ traps  
- Reach the 🚪 exit to clear the level  
- After death / clear, press **Space** to retry / keep playing  

---

<style>
  .game-container {
    max-width: 640px;
    margin: 1.5rem auto 2rem auto;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    background: #0f172a;
    color: #e5e7eb;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.4);
  }

  .game-container h1 {
    font-size: 1.4rem;
    margin: 0 0 0.75rem 0;
    text-align: center;
  }

  .controls-info {
    background: rgba(15, 23, 42, 0.9);
    border-radius: 8px;
    padding: 0.75rem 0.9rem;
    font-size: 0.8rem;
    line-height: 1.6;
    margin-bottom: 0.9rem;
  }

  .controls-info strong {
    color: #facc15;
  }

  #game {
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    max-width: 100%;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 0.9rem;
    font-size: 0.8rem;
    text-align: center;
    gap: 0.5rem;
  }

  .stat-item {
    flex: 1;
    background: rgba(15, 23, 42, 0.9);
    border-radius: 8px;
    padding: 0.4rem 0.6rem;
  }

  .stat-value {
    color: #fbbf24;
    font-size: 1.1rem;
    margin-top: 0.2rem;
  }

  /* Scoreboard box under the game */
  #scoreboard {
    margin-top: 1rem;
    font-size: 0.8rem;
    padding: 0.75rem 0.9rem;
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid #1f2937;
  }

  #scoreboard h3 {
    margin: 0 0 0.4rem 0;
    font-size: 0.9rem;
  }

  #scoreboard p {
    margin: 0;
  }

  #scoreboard ol {
    margin: 0.25rem 0 0 1.1rem;
    padding: 0;
  }

  #scoreboard li {
    margin-bottom: 0.15rem;
  }

  /* Leaderboard modal */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 999;
    align-items: center;
    justify-content: center;
  }

  .modal.show {
    display: flex;
  }

  .modal-content {
    background: #0f172a;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 18px 50px rgba(0,0,0,0.8);
  }

  .modal-content h2 {
    margin: 0 0 1rem 0;
    text-align: center;
    font-size: 1.1rem;
    color: #facc15;
  }

  .leaderboard-list {
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.9);
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
  }

  .leaderboard-item.current {
    border: 1px solid #facc15;
    background: rgba(250, 204, 21, 0.15);
  }

  .leaderboard-rank {
    width: 2rem;
    text-align: center;
    font-size: 1.1rem;
  }

  .leaderboard-rank.gold { color: #facc15; }
  .leaderboard-rank.silver { color: #e5e7eb; }
  .leaderboard-rank.bronze { color: #f97316; }

  .leaderboard-score {
    flex: 1;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .leaderboard-you {
    color: #facc15;
    font-size: 0.75rem;
  }

  .continue-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #ecfdf5;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .continue-btn:hover {
    filter: brightness(1.05);
  }
</style>

<div class="game-container">
  <h1>🎮 TIME TO RELAX · Pixel Maze</h1>

  <div class="controls-info">
    <strong>Controls</strong><br>
    ⬆ ⬇ ⬅ ⮕ or <strong>WASD</strong>: move<br>
    <strong>Space</strong>: shoot a bubble bomb in the facing direction<br>
    Avoid traps, find the exit, and beat your own records.
  </div>

  <canvas id="game" width="480" height="480"></canvas>

  <div class="stats">
    <div class="stat-item">
      <div>Level</div>
      <div class="stat-value" id="level-display">1</div>
    </div>
    <div class="stat-item">
      <div>Time</div>
      <div class="stat-value" id="time-display">0s</div>
    </div>
    <div class="stat-item">
      <div>Steps</div>
      <div class="stat-value" id="steps-display">0</div>
    </div>
  </div>

  <div id="scoreboard">
    <h3>Best Records for This Level</h3>
    <p>No records yet. Play a round!</p>
  </div>
</div>

<!-- Leaderboard Modal -->
<div class="modal" id="leaderboard-modal">
  <div class="modal-content">
    <h2>🏆 Level Cleared! 🏆</h2>
    <ul class="leaderboard-list" id="leaderboard-list">
      <!-- Filled by JS -->
    </ul>
    <button class="continue-btn" onclick="closeLeaderboard()">
      Continue to Next Level
    </button>
  </div>
</div>

<script src="/assets/js/pixel-maze-game.js"></script>
