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

<h1>Just a tiny canvas test</h1>
<p>If you see a blue square moving left and right, the game code is working ✅</p>

<div style="max-width:480px;padding:16px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-top:12px;">
  <canvas id="mini-game" width="400" height="260" style="display:block;margin:0 auto;background:#222;border-radius:8px;"></canvas>
</div>

<script>
(function () {
  var canvas = document.getElementById("mini-game");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var x = 50;
  var y = 120;
  var size = 30;
  var vx = 2;

  function update() {
    x += vx;
    if (x < 10 || x + size > canvas.width - 10) {
      vx = -vx;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = "#10121d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // simple platform
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(40, 200, 320, 10);

    // blue square
    ctx.fillStyle = "#4da3ff";
    ctx.fillRect(x, y, size, size);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
</script>
