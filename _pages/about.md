---
permalink: /
title: "About"
layout: single
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div style="font-size:1.15rem; line-height:1.65;">
Hi! I'm <strong>Zhiruo (Rachel) Zhang (张芷若)</strong>, a final-year Ph.D. candidate in Economics and Econometrics at 
<strong>The University of Adelaide</strong>, supervised by 
<a href="https://sites.google.com/view/firmindokotchatoka/home" target="_blank"><strong>Prof. Firmin Doko Tchatoka</strong></a> 
and 
<a href="https://sites.google.com/site/qazigmziaulhaque/" target="_blank"><strong>Dr. Qazi Haque</strong></a>.
</div>

<div style="font-size:1.1rem; line-height:1.6; margin-top:14px;">
My research primarily focuses on <strong>Bayesian econometrics</strong>, <strong>time-series analysis</strong>, <strong>panel data methods</strong>, and their intersections with <strong>machine learning</strong>.
</div>

<div style="background:#f7f7f7; padding:14px 18px; border-left:4px solid #1f628d; margin:22px 0; font-size:1.1rem;">
  <strong>Job Market Status:</strong> Available for interviews in 2025–2026.<br>
  <em>CV, research statements, and working papers can be found in the menu above.</em>
</div>

## 🔥 News

- <em>2025.11</em>: 🎉 Presented at the Ph.D. Conference in Economics at UNSW.

<div style="text-align:center; margin-top:36px; font-size:1.2rem; color:#444;">
  <em>
    <span style="color:#c8a951; font-weight:650;">E</span>arth 
    <span style="color:#c8a951; font-weight:650;">N</span>eeds 
    <span style="color:#c8a951; font-weight:650;">T</span>alented 
    <span style="color:#c8a951; font-weight:650;">P</span>eople.
  </em><br>
  <em>人生到处知何似？应似飞鸿踏雪泥。</em>
</div>

<hr>

<h2>🎮 A tiny little game</h2>
<p>
  Just for fun: help the <strong>graduation cap</strong> jump from platform to platform!<br>
  <strong>How to play:</strong> press and hold <code>Space</code> to charge, release to jump. Don’t fall!
</p>

<div style="max-width:480px;padding:16px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-top:12px;">
  <canvas id="mini-game" width="400" height="260" style="display:block;margin:0 auto;background:#222;border-radius:8px;"></canvas>
</div>

<script>
(function () {
  const canvas = document.getElementById("mini-game");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Player: little graduation cap
  const player = { x: 80, y: 190, size: 24, vy: 0, jumping: false };

  // Initial platforms
  let platforms = [
    { x: 50,  y: 210, w: 80, h: 10 },
    { x: 170, y: 205, w: 80, h: 10 },
    { x: 290, y: 200, w: 80, h: 10 }
  ];

  const gravity = 0.4;
  let charging = false;
  let chargePower = 0;
  let gameOver = false;
  let score = 0;
  let cameraX = 0; // simple camera following the cap

  // Draw a small graduation cap
  function drawCap(x, y, size) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);

    // board (rhombus)
    ctx.fillStyle = "#20222a";
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(0, -size * 0.5);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size * 0.5);
    ctx.closePath();
    ctx.fill();

    // cap body
    ctx.fillStyle = "#2c2f39";
    ctx.fillRect(-size * 0.5, 0, size, size * 0.4);

    // tassel
    ctx.strokeStyle = "#ffeb3b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.35, -size * 0.05);
    ctx.lineTo(size * 0.35, size * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size * 0.35, size * 0.8, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffeb3b";
    ctx.fill();

    ctx.restore();
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!charging && !player.jumping && !gameOver) {
        charging = true;
        chargePower = 0;
      } else if (gameOver) {
        resetGame();
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space" && charging) {
      e.preventDefault();
      charging = false;
      player.jumping = true;
      player.vy = -8 - chargePower * 0.25; // higher charge => higher jump
    }
  });

  function resetGame() {
    player.x = 80;
    player.y = 190;
    player.vy = 0;
    player.jumping = false;
    charging = false;
    chargePower = 0;
    gameOver = false;
    score = 0;
    cameraX = 0;
    platforms = [
      { x: 50,  y: 210, w: 80, h: 10 },
      { x: 170, y: 205, w: 80, h: 10 },
      { x: 290, y: 200, w: 80, h: 10 }
    ];
  }

  // Create a new platform ahead
  function generatePlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const distance = 100 + Math.random() * 80;    // horizontal gap
    const yVariation = (Math.random() - 0.5) * 40; // vertical randomness
    const newY = Math.max(150, Math.min(220, lastPlatform.y + yVariation));
    const newW = 60 + Math.random() * 40;

    platforms.push({
      x: lastPlatform.x + distance,
      y: newY,
      w: newW,
      h: 10
    });
  }

  function update() {
    if (gameOver) return;

    // Charging
    if (charging) {
      chargePower += 0.5;
      if (chargePower > 20) chargePower = 20;
    }

    // Horizontal movement while in the air
    if (player.jumping) {
      player.x += chargePower * 0.35; // not too fast
    }

    // Gravity
    player.vy += gravity;
    player.y += player.vy;

    // Camera follow
    if (player.x > canvas.width * 0.4) {
      cameraX = player.x - canvas.width * 0.4;
    }

    // Fell down
    if (player.y > canvas.height) {
      gameOver = true;
    }

    // Landing on platforms
    platforms.forEach((p, index) => {
      const onTop =
        player.y + player.size >= p.y &&
        player.y + player.size <= p.y + 10 &&
        player.x + player.size > p.x &&
        player.x < p.x + p.w &&
        player.vy >= 0;

      if (onTop) {
        player.y = p.y - player.size;
        player.vy = 0;
        player.jumping = false;

        // Count how many platforms you've passed as score
        if (index > score) {
          score = index;
        }
      }
    });

    // Generate more platforms ahead of camera
    if (platforms[platforms.length - 1].x < cameraX + canvas.width + 200) {
      generatePlatform();
    }

    // Remove old platforms behind
    platforms = platforms.filter(p => p.x > cameraX - 150);
  }

  function drawBackground() {
    // dark blue-ish background
    ctx.fillStyle = "#10121d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // simple "stars"
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 30; i++) {
      const sx = (i * 37) % canvas.width;
      const sy = ((i * 53) % canvas.height) * 0.6;
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    // Move everything with camera
    ctx.save();
    ctx.translate(-cameraX, 0);

    // Platforms
    ctx.fillStyle = "#4caf50";
    platforms.forEach(p => {
      ctx.fillRect(p.x, p.y, p.w, p.h);
    });

    // Player (graduation cap)
    drawCap(player.x, player.y, player.size);

    ctx.restore();

    // UI
    if (!gameOver) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Hold Space to charge, release to jump.", 10, 20);
      ctx.fillText("Score: " + score, 10, 250);

      // Charge bar
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(10, 30, 100, 10);
      ctx.fillStyle = "#ff9800";
      ctx.fillRect(10, 30, (chargePower / 20) * 100, 10);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Game Over! Score: " + score, 70, 120);
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Press Space to restart.", 120, 150);
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
</script>
