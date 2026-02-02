// ===== CONFIG =====
const gifUrl = "yay.gif?v=3";   // local GIF, cache-busted

// YES behavior (very aggressive growth)
const YES_GROW_STEP = 0.12;     // grows a lot each time
const YES_MAX_SCALE = 3.2;      // VERY big, near full takeover

// NO behavior
const RUN_DISTANCE = 100;       // when NO reacts
const NO_MOVE_DURATION = 300;   // smooth, calm movement (ms)
// ==================

const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const arena  = document.getElementById("arena");
const result = document.getElementById("result");
const gif    = document.getElementById("gif");

// Force GIF load
gif.src = gifUrl;
gif.loading = "eager";
gif.decoding = "async";

let yesScale = 1;

// Smooth movement for NO
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

// ---------- NO RUNS BUT STAYS IN FRAME ----------
function moveNoSmooth() {
  const a = arena.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();
  const padding = 16;

  const maxX = Math.max(padding, a.width - b.width - padding);
  const maxY = Math.max(padding, a.height - b.height - padding);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

// ---------- YES GROWS AND GROWS ----------
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

// ---------- ABSOLUTE SAFETY ----------
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoSmooth();
  growYes();
});

// ---------- YES CLICK ----------
yesBtn.addEventListener("click", () => {
  arena.style.display = "none";
  const hint = document.querySelector(".hint");
  if (hint) hint.style.display = "none";
  result.classList.remove("hidden");
});

// ---------- START ----------
placeInitialButtons();
