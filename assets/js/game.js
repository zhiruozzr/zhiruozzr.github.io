(function () {
  const canvas = document.getElementById("mini-game");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 
  const gravity = 0.4;
  const maxCharge = 20;

  const player = {
    x: 80,
    y: 190,
    size: 26,
    vy: 0,
    jumping: false
  };

  let platforms = [];
  let charging = false;
  let chargePower = 0;
  let gameOver = false;
  let score = 0;
  let cameraX = 0;
  let t = 0;             
  let tipMessage = "";    
  let tipTimer = 0;       
  let maxMilestone = 0;  

  const platformColors = ["#ffd6a5", "#ffcad4", "#bde0fe", "#caffbf"];

  // 
  function initPlatforms() {
    platforms = [
      { x: 40,  y: 210, w: 90,  h: 12, type: "home",    visited: false },
      { x: 170, y: 205, w: 80,  h: 12, type: "plain",   visited: false },
      { x: 290, y: 200, w: 80,  h: 12, type: "paper",   visited: false } 
    ];
  }

  initPlatforms();

  // 
  function showTip(msg, frames) {
    tipMessage = msg;
    tipTimer = frames || 180; 
  }

  //-
  function drawCapCharacter(x, y, size) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);

    // 
    ctx.fillStyle = "#ffe0f0";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // 
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.1, 2.2, 0, Math.PI * 2);
    ctx.arc(size * 0.2, -size * 0.1, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, size * 0.12, 4, 0, Math.PI, false);
    ctx.stroke();

    //
    ctx.translate(0, -size * 0.6);
    ctx.fillStyle = "#343a40";
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, 0);
    ctx.lineTo(0, -size * 0.35);
    ctx.lineTo(size * 0.5, 0);
    ctx.lineTo(0, size * 0.12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#495057";
    ctx.fillRect(-size * 0.22, 0, size * 0.44, size * 0.18);

    // 
    ctx.strokeStyle = "#ffd43b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.35, -size * 0.05);
    ctx.lineTo(size * 0.35, size * 0.5);
    ctx.stroke();

    ctx.fillStyle = "#ffd43b";
    ctx.beginPath();
    ctx.arc(size * 0.35, size * 0.5, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  //
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
      player.vy = -8 - chargePower * 0.25;
    }
  });

  // 
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
    tipMessage = "";
    tipTimer = 0;
    maxMilestone = 0;
    initPlatforms();
  }

  // 
  function randomPlatformType() {
    const r = Math.random();
    if (r < 0.18) return "record"; 
    if (r < 0.36) return "cup";    
    if (r < 0.5)  return "cloud";  
    if (r < 0.65) return "paper";  
    if (r < 0.8)  return "coffee"; // Coffee bonus
    return "plain";               
  }

  // 
  function generatePlatform() {
    const last = platforms[platforms.length - 1];
    const distance = 110 + Math.random() * 90;      
    const yVariation = (Math.random() - 0.5) * 45;  
    const newY = Math.max(150, Math.min(220, last.y + yVariation));
    const newW = 60 + Math.random() * 60;

    platforms.push({
      x: last.x + distance,
      y: newY,
      w: newW,
      h: 12,
      type: randomPlatformType(),
      visited: false
    });
  }

  // 
  function checkMilestones() {
    if (score >= 10 && maxMilestone < 10) {
      maxMilestone = 10;
      showTip("Time for coding! 💻", 220);
    } else if (score >= 6 && maxMilestone < 6) {
      maxMilestone = 6;
      showTip("Time for paper! 📄", 220);
    } else if (score >= 3 && maxMilestone < 3) {
      maxMilestone = 3;
      showTip("Nice warm-up jump ✨", 200);
    }
  }

  // 
  function update() {
    if (gameOver) return;

    if (charging) {
      chargePower += 0.5;
      if (chargePower > maxCharge) chargePower = maxCharge;
    }

    if (player.jumping) {
      player.x += chargePower * 0.35;
    }

    player.vy += gravity;
    player.y += player.vy;

    if (player.x > canvas.width * 0.4) {
      cameraX = player.x - canvas.width * 0.4;
    }

    if (player.y > canvas.height) {
      gameOver = true;
      // 
      if (score >= 10) {
        showTip("Amazing run – now really time for coding! 💻", 260);
      } else if (score >= 5) {
        showTip("Good job – maybe open that paper draft? 📄", 260);
      } else {
        showTip("Short break over – back to work 😉", 260);
      }
      return;
    }

    // 
    platforms.forEach((p) => {
      const onTop =
        player.y + player.size >= p.y &&
        player.y + player.size <= p.y + 12 &&
        player.x + player.size * 0.6 > p.x &&
        player.x + player.size * 0.4 < p.x + p.w &&
        player.vy >= 0;

      if (onTop) {
        player.y = p.y - player.size;
        player.vy = 0;
        player.jumping = false;

        // 
        if (!p.visited && p.type !== "home") {
          p.visited = true;
          score += 1;

          // Coffee bonus
          if (p.type === "coffee") {
            score += 2;
            showTip("Coffee bonus +2! ☕️", 180);
          } else if (p.type === "paper") {
            showTip("Careful, that’s a stack of papers… 📚", 180);
          }

          checkMilestones();
        }
      }
    });

    if (platforms[platforms.length - 1].x < cameraX + canvas.width + 200) {
      generatePlatform();
    }

    platforms = platforms.filter(p => p.x > cameraX - 220);
  }

  // 
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "#ffb5a7");
    g.addColorStop(0.5, "#fcd5ce");
    g.addColorStop(1, "#f8edeb");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX * 0.2, 0); 
    drawHill(-80, 210, 220, "#b5838d");
    drawHill(120, 215, 260, "#6d6875");
    drawHill(320, 205, 240, "#9d8189");
    ctx.restore();
  }

  function drawHill(cx, baseY, width, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, baseY);
    ctx.quadraticCurveTo(cx, baseY - width * 0.4, cx + width / 2, baseY);
    ctx.lineTo(cx + width / 2, canvas.height);
    ctx.lineTo(cx - width / 2, canvas.height);
    ctx.closePath();
    ctx.fill();
  }

  // 
  function drawCloud(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + r, y - r, r, Math.PI * 1, Math.PI * 2);
    ctx.arc(x + r * 2, y, r, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  function drawSkyDecor() {
    ctx.save();
    ctx.translate(-(cameraX * 0.15), 0);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (let i = 0; i < 4; i++) {
      const baseX = (i * 150 + t * 0.3) % (canvas.width + 220) - 110;
      const baseY = 40 + (i % 2) * 18;
      drawCloud(baseX, baseY, 24);
    }
    ctx.restore();
  }

  // 
  function drawRoundedRect(x, y, w, h, r, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  }

  function drawSpeakerAndTurntable(x, y) {
    // 
    ctx.fillStyle = "#343a40";
    ctx.fillRect(x, y, 26, 22);
    ctx.fillStyle = "#adb5bd";
    ctx.beginPath();
    ctx.arc(x + 13, y + 13, 7, 0, Math.PI * 2);
    ctx.fill();

    // 
    const wobble = Math.sin(t * 0.12) * 2;
    const tx = x + 32;
    const ty = y + wobble;
    ctx.fillStyle = "#ffe8cc";
    ctx.fillRect(tx, ty + 6, 30, 8);
    ctx.fillStyle = "#212529";
    ctx.beginPath();
    ctx.arc(tx + 15, ty + 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(tx + 15, ty + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCup(x, y) {
    //
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, 18, 16);
    ctx.fillStyle = "#e5989b";
    ctx.fillRect(x + 2, y + 2, 14, 8);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 18, y + 8, 4, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
  }

  function drawCoffeeBonus(x, y) {
    // 
    drawCup(x, y);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 2);
    ctx.quadraticCurveTo(x + 4, y - 8, x + 8, y - 12);
    ctx.moveTo(x + 12, y - 2);
    ctx.quadraticCurveTo(x + 10, y - 10, x + 14, y - 14);
    ctx.stroke();
  }

  function drawPaperStack(x, y) {
    // 
    const w = 26;
    const h = 6;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(x + 2, y - 6, w, h);
    ctx.fillStyle = "#cddafd";
    ctx.fillRect(x + 4, y - 12, w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(x + 4, y - 9, w - 8, 1);
  }

  function drawCloudPlatform(x, y, w) {
    ctx.fillStyle = "#ffffff";
    const r = 10;
    const cx = x + w / 2;
    drawCloud(cx - r * 2, y + 6, r);
    drawCloud(cx, y + 2, r);
    drawCloud(cx + r * 2, y + 6, r);
  }

  function drawPlatforms() {
    platforms.forEach((p, index) => {
      let color = platformColors[index % platformColors.length];

      if (p.type === "cloud") {
        drawCloudPlatform(p.x, p.y, p.w);
      } else {
        drawRoundedRect(p.x, p.y, p.w, p.h + 8, 6, color, "#ffffff60");
      }

      if (p.type === "home") {
        // 
        ctx.fillStyle = "#fff3b0";
        ctx.fillRect(p.x + 10, p.y - 22, 18, 18);
        ctx.fillStyle = "#ffb703";
        ctx.fillRect(p.x + 16, p.y - 22, 6, 10);
      } else if (p.type === "record") {
        drawSpeakerAndTurntable(p.x + p.w / 2 - 30, p.y - 28);
      } else if (p.type === "cup") {
        drawCup(p.x + p.w / 2 - 10, p.y - 18);
      } else if (p.type === "coffee") {
        drawCoffeeBonus(p.x + p.w / 2 - 10, p.y - 20);
      } else if (p.type === "paper") {
        drawPaperStack(p.x + p.w / 2 - 13, p.y - 16);
      }
    });
  }

  // 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawSkyDecor();

    ctx.save();
    ctx.translate(-cameraX, 0);
    drawPlatforms();
    drawCapCharacter(player.x, player.y, player.size);
    ctx.restore();

    //
    const scoreText = score.toString().padStart(3, "0");
    ctx.fillStyle = "#6d6875";
    ctx.font = "18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(scoreText, canvas.width - 10, 28);

    ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#9d8189";
    ctx.fillText("Score", canvas.width - 10, 42);

    ctx.textAlign = "left";
    if (!gameOver) {
      ctx.fillStyle = "#6d6875";
      ctx.fillText("Hold Space to charge, release to jump", 10, 24);

      //
      ctx.strokeStyle = "#adb5bd";
      ctx.strokeRect(10, 46, 120, 10);
      ctx.fillStyle = "#ffadad";
      ctx.fillRect(10, 46, (chargePower / maxCharge) * 120, 10);
    } else {
      // 
      drawGameOverOverlay();
    }

    // 
    if (tipTimer > 0 && tipMessage) {
      drawTipBubble(tipMessage);
    }

    ctx.textAlign = "left";
  }

  function drawGameOverOverlay() {
    const w = 260;
    const h = 90;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#f7ede2";
    ctx.strokeStyle = "#e0afa0";
    ctx.lineWidth = 2;
    roundRectPath(x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#6d6875";
    ctx.font = "15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Final Score: " + score.toString().padStart(3, "0"), canvas.width / 2, y + 30);

    ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    let line = "Press Space to try again ♻️";
    if (score >= 10) {
      line = "Amazing run – time for coding! 💻";
    } else if (score >= 5) {
      line = "Nice jumps – time for paper! 📄";
    }
    ctx.fillText(line, canvas.width / 2, y + 54);

    ctx.textAlign = "left";
  }

  function roundRectPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawTipBubble(text) {
    const w = canvas.width - 40;
    const h = 32;
    const x = 20;
    const y = canvas.height - h - 10;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#e0afa0";
    ctx.lineWidth = 1.5;
    roundRectPath(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#6d6875";
    ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y + 21);
    ctx.textAlign = "left";
  }

  // 
  function loop() {
    t += 1;
    if (tipTimer > 0) tipTimer--;
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
