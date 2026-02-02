// ===== CONFIG =====
const herName = "Alaa";

// Local GIF in repo root
const gifUrl = "yay.gif";

// Make YES grow more
const YES_GROW_STEP = 0.12;   // was 0.08 → grows faster
const YES_MAX_SCALE = 2.1;    // was 1.7 → grows bigger

const RUN_DISTANCE = 90;
// ==================

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const arena = document.getElementById("arena");
const result = document.getElementById("result");
const gif = document.getElementById("gif");

gif.src = gifUrl;

let yesScale = 1;

// Keep NO inside the arena frame
function moveNo() {
  const a = arena.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();
  const padding = 10;

  const maxX = Math.max(padding, a.width - b.width - padding);
  const maxY = Math.max(padding, a.height - b.height - padding);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function growYes() {
  yesScale = Math.min(YES_MAX_SCALE, yesScale + YES_GROW_STEP);
  yesBtn.style.transform = `scale(${yesScale})`;
}

// Mouse + touch proximity detection
arena.addEventListener("pointermove", (e) => {
  const nb = noBtn.getBoundingClientRect();
  const cx = nb.left + nb.width / 2;
  const cy = nb.top + nb.height / 2;

  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  if (dist < RUN_DISTANCE) {
    moveNo();
    growYes();
  }
});

// Absolute safety: NO can never be clicked
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNo();
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
moveNo();
