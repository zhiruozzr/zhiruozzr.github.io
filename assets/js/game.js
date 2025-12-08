(function () {
  const canvas = document.getElementById("mini-game");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const player = { x: 80, y: 190, size: 24, vy: 0, jumping: false };
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
  let cameraX = 0;

  const cloudImage = new Image();
  cloudImage.src = 'https://i.imgur.com/S7Q0eWD.png';

  function drawCap(x, y, size) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.fillStyle = "#ffb6c1";
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
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
      player.vy = -8 - chargePower * 0.25;
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

  function generatePlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const distance = 100 + Math.random() * 80;
    const yVariation = (Math.random() - 0.5) * 40;
    const newY = Math.max(150, Math.min(220, lastPlatform.y + yVariation));
    const newW = 60 + Math.random() * 40;
    platforms.push({ x: lastPlatform.x + distance, y: newY, w: newW, h: 10 });
  }

  function update() {
    if (gameOver) return;
    if (charging) {
      chargePower += 0.5;
      if (chargePower > 20) chargePower = 20;
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
    }
    platforms.forEach((p, index) => {
      const onTop = player.y + player.size >= p.y &&
        player.y + player.size <= p.y + 10 &&
        player.x + player.size > p.x &&
        player.x < p.x + p.w &&
        player.vy >= 0;
      if (onTop) {
        player.y = p.y - player.size;
        player.vy = 0;
        player.jumping = false;
        if (index > score) score = index;
      }
    });
    if (platforms[platforms.length - 1].x < cameraX + canvas.width + 200) {
      generatePlatform();
    }
    platforms = platforms.filter(p => p.x > cameraX - 150);
  }

  function drawBackground() {
    ctx.fillStyle = "#bde0fe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (cloudImage.complete) {
      ctx.drawImage(cloudImage, -cameraX % canvas.width, 0, canvas.width, 60);
      ctx.drawImage(cloudImage, canvas.width - (cameraX % canvas.width), 0, canvas.width, 60);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    ctx.save();
    ctx.translate(-cameraX, 0);
    ctx.fillStyle = "#ffd166";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
    drawCap(player.x, player.y, player.size);
    ctx.restore();
    if (!gameOver) {
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText("Hold Space to charge, release to jump.", 10, 20);
      ctx.fillText("Score: " + score, 10, 250);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(10, 30, 100, 10);
      ctx.fillStyle = "#ff69b4";
      ctx.fillRect(10, 30, (chargePower / 20) * 100, 10);
    } else {
      ctx.fillStyle = "#d62828";
      ctx.font = "20px sans-serif";
      ctx.fillText("Game Over! Score: " + score, 70, 120);
      ctx.font = "14px sans-serif";
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
