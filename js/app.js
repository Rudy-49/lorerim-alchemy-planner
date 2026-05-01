const book = document.getElementById("book");
const coverButton = document.getElementById("coverButton");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const flipOverlay = document.getElementById("pageFlipOverlay");

const leftPageContent = document.getElementById("leftPageContent");
const rightPageContent = document.getElementById("rightPageContent");

let currentSpread = 0;
let isTurningPage = false;

/* ===== PAGE DATA ===== */

const spreads = [
  {
    left: `
      <h2>Table of Contents</h2>
      <p><strong>Page 2:</strong> Preamble / How to Use This Book</p>
      <p><strong>Pages 3–4:</strong> Potion Builder and Potion Database</p>
      <p><strong>Pages 5–6:</strong> Ingredient Lookup and Effect Lookup</p>
      <p><strong>Pages 7–8:</strong> Notable Gear and Extra Tips</p>
    `,
    right: `
      <h2>How to Use This Book</h2>
      <p>This book is designed as a LoreRim alchemy planner.</p>
      <p>Use the potion builder to combine ingredients, check shared effects, and save useful recipes.</p>
      <p>The lookup pages will help you search ingredients and effects quickly.</p>
    `
  },
  {
    left: `<h2>Potion Builder</h2><p>Placeholder for selecting ingredients and generating potions.</p>`,
    right: `<h2>Potion Database</h2><p>Placeholder for saved potions, notes, favorites, and filters.</p>`
  },
  {
    left: `<h2>Ingredient Lookup</h2><p>Placeholder for searching ingredients.</p>`,
    right: `<h2>Effect Lookup</h2><p>Placeholder for searching effects.</p>`
  },
  {
    left: `<h2>Notable Gear</h2><p>Placeholder for useful alchemy gear, enchantments, and locations.</p>`,
    right: `<h2>Extra Tips</h2><p>Placeholder for tips, tricks, reminders, and value-generation notes.</p>`
  }
];

/* ===== RENDER ===== */

function renderSpread() {
  const spread = spreads[currentSpread];

  leftPageContent.innerHTML = spread.left;
  rightPageContent.innerHTML = spread.right;

  prevPageButton.querySelector("span").textContent =
    currentSpread === 0 ? "⤺" : "‹";

  nextPageButton.disabled = currentSpread === spreads.length - 1;
}

/* ===== BOOK STATE ===== */

function openBook() {
  book.classList.remove("closed");
  book.classList.add("open");

  currentSpread = 0;
  renderSpread();
}

function closeBook() {
  book.classList.remove("open");
  book.classList.add("closed");

  currentSpread = 0;
  isTurningPage = false;
}

/* ===== NAVIGATION ===== */

function nextSpread() {
  if (isTurningPage || currentSpread >= spreads.length - 1) return;

  isTurningPage = true;

  flipOverlay.classList.remove("flip-prev");
  flipOverlay.classList.add("flip-next");

  setTimeout(() => {
    currentSpread++;
    renderSpread();
  }, 350);

  setTimeout(() => {
    flipOverlay.classList.remove("flip-next");
    isTurningPage = false;
  }, 700);
}

function previousSpread() {
  if (isTurningPage) return;

  if (currentSpread === 0) {
    closeBook();
    return;
  }

  isTurningPage = true;

  flipOverlay.classList.remove("flip-next");
  flipOverlay.classList.add("flip-prev");

  setTimeout(() => {
    currentSpread--;
    renderSpread();
  }, 350);

  setTimeout(() => {
    flipOverlay.classList.remove("flip-prev");
    isTurningPage = false;
  }, 700);
}

/* ===== EVENTS ===== */

coverButton.addEventListener("click", openBook);
nextPageButton.addEventListener("click", nextSpread);
prevPageButton.addEventListener("click", previousSpread);