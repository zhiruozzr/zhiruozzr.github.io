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
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .relax-panel {
    max-width: 320px;
    font-size: 14px;
  }

  .relax-title {
    font-size: 22px;
    margin-top: 0;
    margin-bottom: 6px;
  }

  .relax-subtitle {
    margin-top: 0;
    margin-bottom: 12px;
    color: #888;
    font-size: 13px;
  }

  .relax-tip {
    font-size: 13px;
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

  .relax-stats {
    display: flex;
    gap: 12px;
    margin-top: 14px;
    margin-bottom: 4px;
    font-size: 13px;
    color: #ddd;
  }

  .relax-stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
  }

  .relax-stat-block span {
    display: block;
  }

  .relax-scoreboard {
    margin-top: 10px;
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

  #game {
    image-rendering: pixelated;
    border-radius: 10px;
    box-shadow: 0 0 22px rgba(0,0,0,0.6);
    background: #000;
    max-width: 100%;
  }

  /* Leaderboard modal */

  .leaderboard-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .leaderboard-modal.show {
    display: flex;
  }

  .leaderboard-card {
    background: #111827;
    border-radius: 12px;
    padding: 18px 20px 16px;
    width: 320px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.7);
    color: #e5e7eb;
    font-size: 14px;
  }

  .leaderboard-card h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  .leaderboard-card p {
    margin: 0 0 12px;
    font-size: 13px;
    color: #9ca3af;
  }

  .leaderboard-list {
    list-style: none;
    padding-left: 0;
    margin: 0 0 12px;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: #020617;
    margin-bottom: 4px;
  }

  .leaderboard-item.current {
    outline: 1px solid #f97316;
    background: #111827;
  }

  .leaderboard-rank {
    width: 28px;
    text-align: center;
    font-size: 16px;
  }

  .leaderboard-rank.gold   { color: #facc15; }
  .leaderboard-rank.silver { color: #e5e7eb; }
  .leaderboard-rank.bronze { color: #f97316; }

  .leaderboard-score {
    display: flex;
    flex-direction: column;
    font-size: 13px;
  }

  .leaderboard-score span + span {
    font-size: 11px;
    color: #9ca3af;
  }

  .leaderboard-you {
    font-size: 11px;
    color: #f97316;
  }

  .leaderboard-actions {
    display: flex;
    justify-content: flex-end;
  }

  .leaderboard-button {
    border: none;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    background: #f97316;
    color: #111827;
    font-weight: 500;
  }

  .leaderboard-button:hover {
    background: #fb923c;
  }
</style>

<div class="relax-wrapper">
  <div class="relax-panel">
    <h1 class="relax-title">🎮 TIME TO RELAX · Pixel Maze PRO</h1>
    <p class="relax-subtitle">Tiny pixel maze with fog-of-war and bubble bombs.</p>

    <p class="relax-tip">
      Controls:
      <br>⬆ ⬇ ⬅ ⮕ or WASD: move
      <br><b>Space</b> (while playing): shoot a bubble bomb in the facing direction
      <br>Cracked walls (<span style="color:#d7ccc8;">*</span>) can be destroyed (blast radius: <b>3×3</b>)
      <br>Do not step on ❌ traps
      <br>Reach the 🚪 exit to clear a level
      <br>After death / clear, press <b>Space</b> to retry / keep playing
    </p>

    <div>
      <span class="relax-tag">Pixel Art</span>
      <span class="relax-tag">Maze</span>
      <span class="relax-tag">Fog of War</span>
      <span class="relax-tag">Bubble Bomb</span>
      <span class="relax-tag">Timer & Steps</span>
    </div>

    <div class="relax-stats">
      <div class="relax-stat-block">
        <span class="relax-stat-label">Level</span>
        <span id="level-display">1</span>
      </div>
      <div class="relax-stat-block">
        <span class="relax-stat-label">Time</span>
        <span id="time-display">0s</span>
      </div>
      <div class="relax-stat-block">
        <span class="relax-stat-label">Steps</span>
        <span id="steps-display">0</span>
      </div>
    </div>

    <div id="scoreboard" class="relax-scoreboard">
      <h3>Best Records for This Level</h3>
      <p>No records yet. Play a round!</p>
    </div>
  </div>

  <canvas id="game" width="480" height="480"></canvas>
</div>

<div id="leaderboard-modal" class="leaderboard-modal">
  <div class="leaderboard-card">
    <h2>LEVEL COMPLETE!</h2>
    <p>Your best runs for this level (stored locally in your browser).</p>
    <ul id="leaderboard-list" class="leaderboard-list"></ul>
    <div class="leaderboard-actions">
      <button class="leaderboard-button" onclick="closeLeaderboard()">Continue</button>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/pixel-maze-game.js' | relative_url }}"></script>
