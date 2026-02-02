// ===== CONFIG =====
const herName = "Alaa";

// Local GIF in repo root
const gifUrl = "yay.gif";

// YES behavior
const YES_GROW_STEP = 0.06;   // slower, smoother growth
const YES_MAX_SCALE = 2.4;    // clearly maxed out, big button

// NO behavior
const RUN_DISTANCE = 90;      // when it reacts
const NO_MOVE_DURATION = 250; // ms → smooth movement speed
// ==================

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const arena = document.getElementById("arena");
const result = document.getElementById("result");
const gif = document.getElementById("gif");

gif.src = gifUrl;

let yesScale = 1;

// Smooth transition for NO movement
noBtn.style.transition = `left ${NO_MOVE_DURATION}ms ease, top ${NO_MOVE_DURATION}ms ease`;

function moveNoSmooth() {
  const a = arena.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();
  const padding = 14;

  const maxX = Math.max(padding, a.width - b.width - padding);
  const maxY = Math.max(padding, a.height - b.height - padding);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function growYes() {
  if (yesScale < YES_MAX_SCALE) {
    yesScale = Math.min(YES_MAX_SCALE, yesScale + YES_GROW_STEP);
    yesBtn.style.transform = `scale(${yesScale})`;
  }
}

// Pointer proximity logic (smooth + controlled)
arena.addEventListener("pointermove", (e) => {
  const nb = noBtn.getBoundingClientRect();
  const cx = nb.left + nb.width / 2;
  const cy = nb.top + nb.height / 2;

  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  if (dist < RUN_DISTANCE) {
    moveNoSmooth();
    growYes();
  }
});

// Absolute safety: NO is never clickable
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoSmooth();
  growYes();
});

// YES click → success screen
yesBtn.addEventListener("click", () => {
  arena.style.display = "none";
  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";
  result.classList.remove("hidden");
});

// Initial placement
moveNoSmooth();
