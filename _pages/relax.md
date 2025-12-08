---
layout: single
title: "Pixel Maze Adventure"
permalink: /relax/
author_profile: true
---

<style>
  .relax-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    margin-top: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .relax-panel {
    max-width: 320px;
  }

  .relax-panel h1 {
    margin-top: 0;
    font-size: 22px;
  }

  .relax-tip {
    font-size: 14px;
    color: #777;
    line-height: 1.6;
  }

  .relax-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    background: #333;
    color: #eee;
    margin-right: 6px;
    margin-top: 4px;
  }

  #game {
    image-rendering: pixelated;
    border-radius: 8px;
    box-shadow: 0 0 18px rgba(0,0,0,0.4);
    background: #000;
    max-width: 100%;
    display: block;
  }

  .relax-scoreboard {
    margin-top: 16px;
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #1b1b1b;
    border: 1px solid #333;
    color: #eee;
  }

  .relax-scoreboard h3 {
    margin: 0 0 6px;
    font-size: 14px;
  }

  .relax-scoreboard ol {
    margin: 0;
    padding-left: 18px;
  }

  .relax-scoreboard li {
    margin-bottom: 2px;
  }

  .stats {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1 1 90px;
    background: #1b1b1b;
    border-radius: 8px;
    padding: 6px 8px;
    border: 1px solid #333;
    font-size: 12px;
    color: #ccc;
  }

  .stat-item div:first-child {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 10px;
    opacity: 0.8;
  }

  .stat-value {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .relax-game-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  /* Leaderboard modal */

  .lb-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .lb-modal.show {
    display: flex;
  }

  .lb-content {
    background: #111827;
    border-radius: 12px;
    padding: 18px 20px;
    width: 320px;
    max-width: 90vw;
    box-shadow: 0 16px 30px rgba(0,0,0,0.6);
    border: 1px solid #374151;
    color: #f9fafb;
  }

  .lb-content h2 {
    margin: 0 0 10px;
    font-size: 18px;
    text-align: center;
  }

  .lb-content p {
    margin: 0 0 10px;
    font-size: 13px;
    text-align: center;
    color: #9ca3af;
  }

  .leaderboard-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 180px;
    overflow-y: auto;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 4px;
    background: #020617;
  }

  .leaderboard-item.current {
    background: #111827;
    border: 1px solid #fbbf24;
  }

  .leaderboard-rank {
    width: 32px;
    text-align: center;
    margin-right: 8px;
  }

  .leaderboard-rank.gold {
    color: #fbbf24;
  }

  .leaderboard-rank.silver {
    color: #e5e7eb;
  }

  .leaderboard-rank.bronze {
    color: #f97316;
  }

  .leaderboard-score {
    flex: 1;
  }

  .leaderboard-score span {
    display: inline-block;
    min-width: 80px;
  }

  .leaderboard-you {
    font-size: 11px;
    color: #9ca3af;
  }

  .lb-button-row {
    margin-top: 10px;
    text-align: center;
  }

  .lb-btn {
    display: inline-block;
    border: none;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    background: #22c55e;
    color: #05101c;
    font-weight: 600;
  }

  .lb-btn:hover {
    background: #16a34a;
  }

  @media (max-width: 800px) {
    .relax-wrapper {
      flex-direction: column;
      align-items: center;
    }

    .relax-panel {
      max-width: 480px;
      width: 100%;
    }
  }
</style>

<div class="relax-wrapper">
  <div class="relax-panel">
    <h1>🎮 TIME TO RELAX</h1>
    <p class="relax-tip">
      Controls:
      <br>⬆ ⬇ ⬅ ⮕ or WASD: move
      <br><b>Space:</b> shoot a bubble bomb in the facing direction
      <br>Cracked walls (<span style="color:#d7ccc8;">*</span>) can be destroyed (blast radius: <b>3×3</b>)
      <br>Do not step on ❌ traps
      <br>Reach the 🚪 exit to clear a level
    </p>
    <div>
      <span class="relax-tag">Pixel Art</span>
      <span class="relax-tag">Maze</span>
      <span class="relax-tag">Fog of War</span>
      <span class="relax-tag">Bubble Bomb</span>
      <span class="relax-tag">Timer & Steps</span>
    </div>

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

    <div id="scoreboard" class="relax-scoreboard">
      <h3>Best Records for This Level</h3>
      <p>No records yet. Play a round!</p>
    </div>
  </div>

  <div class="relax-game-column">
    <canvas id="game" width="480" height="480"></canvas>
  </div>
</div>

<!-- Leaderboard modal -->
<div id="leaderboard-modal" class="lb-modal">
  <div class="lb-content">
    <h2>🏆 LEVEL COMPLETE! 🏆</h2>
    <p>Your best runs for this level (local only).</p>
    <ul id="leaderboard-list" class="leaderboard-list"></ul>
    <div class="lb-button-row">
      <button class="lb-btn" onclick="closeLeaderboard()">Continue to next level</button>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/pixel-maze-game.js' | relative_url }}"></script>
