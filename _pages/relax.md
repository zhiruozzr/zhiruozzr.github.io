---
layout: single
title: "Pixel Maze Adventure"
permalink: /relax/
author_profile: true
---

<style>
  .relax-shell {
    max-width: 720px;
    margin: 1.2rem auto 2rem auto;
  }

  .relax-row {
    display: flex;
    gap: 18px;
    align-items: flex-start;
  }

  .relax-info {
    flex: 0 0 260px;
    max-width: 280px;
    background: #020617;
    color: #e5e7eb;
    border-radius: 14px;
    padding: 0.9rem 1rem;
    box-shadow: 0 12px 35px rgba(15,23,42,0.75);
    font-size: 0.85rem;
  }

  .relax-info h2 {
    margin: 0 0 0.4rem 0;
    font-size: 1.05rem;
  }

  .relax-info small {
    color: #9ca3af;
  }

  .relax-controls {
    margin-top: 0.8rem;
    padding: 0.6rem 0.7rem;
    border-radius: 10px;
    background: #020617;
    border: 1px solid #1f2937;
    font-size: 0.8rem;
    line-height: 1.6;
  }

  .relax-controls b {
    color: #facc15;
  }

  .relax-stats-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.8rem;
  }

  .relax-stat {
    flex: 1;
    background: #020617;
    border-radius: 10px;
    padding: 0.4rem 0.55rem;
    border: 1px solid #1f2937;
    text-align: center;
  }

  .relax-stat-label {
    color: #9ca3af;
    font-size: 0.7rem;
  }

  .relax-stat-value {
    font-size: 1.0rem;
    margin-top: 0.15rem;
    color: #fbbf24;
  }

  .relax-game {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  #game {
    display: block;
    border-radius: 14px;
    box-shadow: 0 18px 45px rgba(15,23,42,0.95);
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    background: #000;
    max-width: 420px;
    width: 100%;
    height: auto;
  }

  /* —— 排行榜弹窗样式 —— */

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
    padding: 1.1rem 1.3rem;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9);
    color: #e5e7eb;
    font-size: 0.85rem;
  }

  .modal-content h2 {
    margin: 0 0 0.8rem 0;
    text-align: center;
    font-size: 1rem;
    color: #facc15;
  }

  .leaderboard-list {
    list-style: none;
    margin: 0 0 0.8rem 0;
    padding: 0;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.45rem 0.6rem;
    border-radius: 8px;
    background: #020617;
    border: 1px solid #111827;
    margin-bottom: 0.3rem;
  }

  .leaderboard-item.current {
    border-color: #facc15;
    background: rgba(250,204,21,0.10);
  }

  .leaderboard-rank {
    width: 2rem;
    text-align: center;
    font-size: 1.05rem;
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
    padding: 0.6rem 1rem;
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

  @media (max-width: 800px) {
    .relax-row {
      flex-direction: column;
    }
    .relax-info {
      max-width: 100%;
    }
  }
</style>

<div class="relax-shell">
  <div class="relax-row">
    <section class="relax-info">
      <h2>🎮 TIME TO RELAX · Pixel Maze PRO</h2>
      <small>Little pixel maze with fog-of-war and bubble bombs.</small>

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
    </section>

    <section class="relax-game">
      <canvas id="game" width="480" height="480"></canvas>
    </section>
  </div>
</div>

<!-- 关卡结束后才出现的中间排行榜弹窗 -->
<div class="modal" id="leaderboard-modal">
  <div class="modal-content">
    <h2>🏆 Level Cleared! 🏆</h2>
    <ul class="leaderboard-list" id="leaderboard-list">
      <!-- Filled by JS -->
    </ul>
    <button class="continue-btn" onclick="closeLeaderboard()">
      Next Level
    </button>
  </div>
</div>

<script src="/assets/js/pixel-maze-game.js"></script>
