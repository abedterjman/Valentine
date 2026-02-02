// ===== CONFIG =====
const gifUrl = "yay.gif?v=5";   // local GIF, cache-busted

// YES behavior (grows bigger and bigger)
const YES_GROW_STEP = 0.12;
const YES_MAX_SCALE = 3.2;

// NO behavior (smooth, not too fast)
const RUN_DISTANCE = 100;
const NO_MOVE_DURATION = 300;

// Hearts / Confetti
const HEARTS_DURATION_MS = 6000;
const CONFETTI_DURATION_MS = 4500;
// ==================

const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const arena  = document.getElementById("arena");
const result = document.getElementById("result");
const gif    = document.getElementById("gif");

const heartsLayer = document.getElementById("heartsLayer");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let yesScale = 1;

// Smooth NO movement
noBtn.style.transition = `left ${NO_MOVE_DURATION}ms ease, top ${NO_MOVE_DURATION}ms ease`;

// ---------- INITIAL NORMAL ALIGNMENT ----------
function placeInitialButtons() {
  const a = arena.getBoundingClientRect();
  const gap = 18;

  const yesRect = yesBtn.getBoundingClientRect();
  const noRect  = noBtn.getBoundingClientRect();

  const totalWidth = yesRect.width + noRect.width + gap;
  const startX = (a.width - totalWidth) / 2;
  const centerY = (a.height - yesRect.height) / 2;

  yesBtn.style.position = "absolute";
  yesBtn.style.left = `${startX}px`;
  yesBtn.style.top  = `${centerY}px`;

  noBtn.style.position = "absolute";
  noBtn.style.left = `${startX + yesRect.width + gap}px`;
  noBtn.style.top  = `${centerY}px`;
}

// ---------- NO RUNS SMOOTHLY ----------
function moveNoSmooth() {
  const a = arena.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();
  const padding = 16;

  const maxX = Math.max(padding, a.width - b.width - padding);
  const maxY = Math.max(padding, a.height - b.height - padding);

  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top  = `${Math.random() * maxY}px`;
}

// ---------- YES GROWS ----------
function growYes() {
  yesScale = Math.min(YES_MAX_SCALE, yesScale + YES_GROW_STEP);
  yesBtn.style.transform = `scale(${yesScale})`;
}

// ---------- POINTER LOGIC ----------
arena.addEventListener("pointermove", (e) => {
  const nb = noBtn.getBoundingClientRect();
  const cx = nb.left + nb.width / 2;
  const cy = nb.top  + nb.height / 2;

  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  if (dist < RUN_DISTANCE) {
    moveNoSmooth();
    growYes();
  }
});

// ---------- NO NEVER CLICKS ----------
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoSmooth();
  growYes();
});

// ---------- CONFETTI ----------
function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function rand(min, max) { return Math.random() * (max - min) + min; }

let confettiPieces = [];
let confettiAnimating = false;

function startConfetti(durationMs) {
  const start = performance.now();
  confettiPieces = Array.from({ length: 160 }).map(() => ({
    x: rand(0, window.innerWidth),
    y: rand(-window.innerHeight, 0),
    vx: rand(-1.2, 1.2),
    vy: rand(2.5, 5.5),
    size: rand(3, 7),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.12, 0.12)
  }));

  confettiAnimating = true;

  function frame(t) {
    if (!confettiAnimating) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Using a single fill style and varying alpha keeps it lightweight.
    for (const p of confettiPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      // wrap
      if (p.y > window.innerHeight + 20) {
        p.y = rand(-80, -10);
        p.x = rand(0, window.innerWidth);
      }
      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "white";
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      ctx.restore();
    }

    if (t - start < durationMs) {
      requestAnimationFrame(frame);
    } else {
      confettiAnimating = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  requestAnimationFrame(frame);
}

// ---------- HEARTS ----------
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤️";

  const left = rand(0, window.innerWidth - 20);
  const drift = rand(-80, 80);
  const duration = rand(2200, 4200);
  const size = rand(18, 34);

  heart.style.left = `${left}px`;
  heart.style.setProperty("--drift", `${drift}px`);
  heart.style.animationDuration = `${duration}ms`;
  heart.style.fontSize = `${size}px`;

  heartsLayer.appendChild(heart);

  // cleanup
  setTimeout(() => heart.remove(), duration + 200);
}

function startHearts(durationMs) {
  const start = Date.now();
  const timer = setInterval(() => {
    // spawn a small burst each tick
    spawnHeart();
    if (Math.random() < 0.6) spawnHeart();
    if (Math.random() < 0.25) spawnHeart();

    if (Date.now() - start > durationMs) {
      clearInterval(timer);
    }
  }, 180);
}

// ---------- YES CLICK (LOAD GIF AFTER SHOWING RESULT) ----------
yesBtn.addEventListener("click", () => {
  arena.style.display = "none";
  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";

  result.classList.remove("hidden");

  // Load GIF only now (best for iOS reliability)
  gif.src = gifUrl;
  gif.loading = "eager";

  // Romantic effects
  startConfetti(CONFETTI_DURATION_MS);
  startHearts(HEARTS_DURATION_MS);
});

// ---------- START ----------
placeInitialButtons();
