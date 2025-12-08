---
permalink: /
title: "About"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div style="font-size:1.15rem; line-height:1.65;">
Hi! I’m <strong>Zhiruo (Rachel) Zhang (张芷若)</strong>, a final-year Ph.D. candidate in Economics and Econometrics at 
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
<p>Just for fun: press and hold <strong>Space</strong> to charge, release to jump to the next platform. Don’t fall!</p>

<div style="max-width:480px;padding:16px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <canvas id="mini-game" width="400" height="260" style="display:block;margin:0 auto;background:#222;border-radius:8px;"></canvas>
</div>

<script>
(function () {
  const canvas = document.getElementById("mini-game");
  if (!canvas) return; //
  const ctx = canvas.getContext("2d");

  const player = { x: 80, y: 190, size: 20, vy: 0, jumping: false };
  let platforms = [
    { x: 50,  y: 210, w: 80, h: 10 },
    { x: 170, y: 205, w: 80, h: 10 },
    { x: 290, y: 200, w: 80, h: 10 }
  ];
  const gravity = 0.4;
  let charging = false;
  let chargePower = 0; // 
  let gameOver = false;

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
      player.vy = -8 - chargePower * 0.25; //
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
  }

  function update() {
    if (gameOver) return;

    //
    if (charging) {
      chargePower += 0.5;
      if (chargePower > 20) chargePower = 20;
    }

    // 
    if (player.jumping) {
      player.x += chargePower * 0.4;
    }

    // 
    player.vy += gravity;
    player.y += player.vy;

    // 
    if (player.y > canvas.height) {
      gameOver = true;
    }

    // 
    platforms.forEach(p => {
      const onTop = player.y + player.size >= p.y &&
                    player.y + player.size <= p.y + 10 &&
                    player.x + player.size > p.x &&
                    player.x < p.x + p.w &&
                    player.vy >= 0;
      if (onTop) {
        player.y = p.y - player.size;
        player.vy = 0;
        player.jumping = false;
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 
    ctx.fillStyle = "#4caf50";
    platforms.forEach(p => {
      ctx.fillRect(p.x, p.y, p.w, p.h);
    });

    // 
    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // 
    if (!gameOver) {
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText("Hold Space to charge, release to jump.", 10, 20);

      ctx.strokeStyle = "#fff";
      ctx.strokeRect(10, 30, 100, 10);
      ctx.fillStyle = "#ff9800";
      ctx.fillRect(10, 30, (chargePower / 20) * 100, 10);
    } else {
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText("Game Over – press Space to restart", 15, 140);
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



