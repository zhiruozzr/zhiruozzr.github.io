---
layout: single
title: "TIME TO RELAX · Pixel Maze"
permalink: /relax/
author_profile: true
---

<style>
  .relax-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 1rem;
    margin-bottom: 2rem;
    align-items: flex-start;
  }

  .relax-left,
  .relax-right {
    box-sizing: border-box;
  }

  .relax-left {
    flex: 0 0 320px;
    max-width: 360px;
    padding: 1rem 1.25rem;
    border-radius: 14px;
    background: #020617;
    color: #e5e7eb;
    box-shadow: 0 14px 40px rgba(15,23,42,0.7);
  }

  .relax-right {
    flex: 1;
    min-width: 260px;
    display: flex;
    justify-content: center;
  }

  .relax-title {
    margin: 0 0 0.3rem 0;
    font-size: 1.25rem;
  }

  .relax-subtitle {
    margin: 0 0 0.8rem 0;
    font-size: 0.9rem;
    color: #9ca3af;
  }

  .relax-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 0.8rem;
  }

  .relax-chip {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 999px;
    background: #111827;
    color: #e5e7eb;
    border: 1px solid #1f2937;
  }

  .relax-controls {
    background: #020617;
    border-radius: 10px;
    padding: 0.7rem 0.75rem;
    font-size: 0.8rem;
    line-height: 1.6;
    border: 1px solid #1f2937;
    margin-bottom: 0.8rem;
  }

  .relax-controls b {
    color: #facc15;
  }

  .relax-stats-row {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 0.8rem;
  }

  .relax-stat {
    flex: 1;
    background: #020617;
    border-radius: 10px;
    padding: 0.4rem 0.55rem;
    border: 1px solid #1f2937;
    font-size: 0.8rem;
    text-align: center;
  }

  .relax-stat-label {
    color: #9ca3af;
    font-size: 0.7rem;
  }

  .relax-stat-value {
    font-size: 1.05rem;
    margin-top: 0.15rem;
    color: #fbbf24;
  }

  /* Scoreboard */
  #scoreboard {
    margin-top: 0.2rem;
    font-size: 0.8rem;
    padding: 0.6rem 0.7rem;
    border-radius: 10px;
    background: #020617;
    border: 1px solid #1f2937;
    color: #e5e7eb;
  }

  #scoreboard h3 {
    margin: 0 0 0.35rem 0;
    font-size: 0.85rem;
  }

  #scoreboard p {
    margin: 0;
  }

  #scoreboard ol {
    margin: 0.2rem 0 0 1rem;
    padding: 0;
  }

  #scoreboard li {
    margin-bottom: 0.15rem;
  }

  #game {
    display: block;
    border-radius: 14px;
    box-shadow: 0 18px 45px rgba(15,23,42,0.95);
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    max-width: 100%;
    background: #000;
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
    background: #020617;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9);
    color: #e5e7eb;
  }

  .modal-content h2 {
    margin: 0 0 0.9rem 0;
    text-align: center;
    font-size: 1.05rem;
    color: #facc15;
  }

  .leaderboard-list {
    list-style: none;
    margin: 0 0 0.9rem 0;
    padding: 0;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.6rem;
    border-radius: 8px;
    background: #020617;
    border: 1px solid #111827;
    font-size: 0.8rem;
    margin-bottom: 0.35rem;
  }

  .leaderboard-item.current {
    border-color: #facc15;
    background: rgba(250, 204, 21, 0.1);
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
    padding: 0.65rem 1rem;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #ecfdf5;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .continue-btn:hover {
    filter: brightness(1.06);
  }

  @media (max-width: 720px) {
    .relax-wrapper {
      flex-direction: column;
    }
    .relax-left {
      max-width: 100%;
    }
  }
</style>

<div class="relax-wrapper">
  <div class="relax-left">
    <h2 class="relax-title">🎮 TIME TO RELAX · Pixel Maze PRO</h2>
    <p class="relax-subtitle">
      Tiny pixel maze with fog-of-war, bubble bombs, and a tiny local leaderboard.
    </p>

    <div class="relax-chip-row">
      <span class="relax-chip">Pixel Art</span>
      <span class="relax-chip">Maze</span>
      <span class="relax-chip">Fog of War</span>
      <span class="relax-chip">Bubble Bomb</span>
      <span class="relax-chip">Timer & Steps</span>
    </div>

    <div class="relax-controls">
      <strong>Controls</strong><br>
      ⬆ ⬇ ⬅ ⮕ or <b>WASD</b>: move<br>
      <b>Space</b> (while playing): shoot a bubble bomb in the facing direction<br>
      Cracked walls (<code>*</code>) can be destroyed (blast radius: <b>3×3</b>)<br>
      Avoid ❌ traps, reach the 🚪 exit, and beat your own records.
    </div>

    <div class="relax-stats-row">
      <div class="relax-stat">
        <div class="relax-stat-label">Level</div>
        <div class="relax-stat-value" id="level-display">1</div>
      </div>
      <div class="relax-stat">
        <div class="relax-stat-label">Time</div>
        <div class="relax-stat-value" id="time-display">0s</div>
      </div>
      <div class="relax-stat">
        <div class="relax-stat-label">Steps</div>
        <div class="relax-stat-value" id="steps-display">0</div>
      </div>
    </div>

    <div id="scoreboard">
      <h3>Best Records for This Level</h3>
      <p>No records yet. Play a round!</p>
    </div>
  </div>

  <div class="relax-right">
    <canvas id="game" width="480" height="480"></canvas>
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
