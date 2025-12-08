---
layout: single
title: "TIME TO RELAX"
permalink: /relax/
author_profile: true
---

<style>
  .relax-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
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
</style>

<div class="relax-wrapper">
  <div class="relax-panel">
    <h1>🎮 TIME TO RELAX · Pixel Maze PRO</h1>
    <p class="relax-tip">
      Controls:
      <br>⬆ ⬇ ⬅ ⮕ or WASD: move
      <br><b>Space:</b> while playing = shoot a bubble bomb (in the facing direction)
      <br>Cracked walls (<span style="color:#d7ccc8;">*</span>) can be destroyed by bombs (explosion radius: <b>3×3</b>)
      <br>Do not step on ❌ traps
      <br>Reach the 🚪 exit to clear the level
      <br>After death / clear, press <b>Space</b> to retry / go to the next level
    </p>
    <div>
      <span class="relax-tag">Pixel Art</span>
      <span class="relax-tag">Maze</span>
      <span class="relax-tag">Fog of War</span>
      <span class="relax-tag">Bubble Bomb</span>
      <span class="relax-tag">Timer & Steps</span>
    </div>

    <div id="scoreboard" class="relax-scoreboard">
      <h3>Best Records for This Level</h3>
      <p>No records yet. Play a round!</p>
    </div>
  </div>

  <canvas id="game" width="480" height="480"></canvas>
</div>

<script src="{{ '/assets/js/relax-game.js' | relative_url }}"></script>
