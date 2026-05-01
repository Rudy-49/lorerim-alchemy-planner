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
    left: ``,
    right: `<h2>Effect Lookup</h2><p>Placeholder for searching effects.</p>`
  },
  {
    left: `<h2>Notable Gear</h2><p>Placeholder for useful alchemy gear, enchantments, and locations.</p>`,
    right: `<h2>Extra Tips</h2><p>Placeholder for tips, tricks, reminders, and value-generation notes.</p>`
  }
];

let ingredients = [];
let effects = [];

async function loadAlchemyData() {
  const response = await fetch("data/processed/ingredients_clean.json");

  if (!response.ok) {
    throw new Error("Could not load ingredients_clean.json");
  }

  ingredients = await response.json();

  effects = [...new Set(
    ingredients.flatMap(ingredient =>
      ingredient.effects.map(effect => effect.name)
    )
  )].sort();

  console.log("Ingredients loaded:", ingredients.length);
  console.log("Effects loaded:", effects.length);
}

/* ===== RENDER ===== */

function renderSpread() {
  const spread = spreads[currentSpread];

  leftPageContent.innerHTML = spread.left;
  rightPageContent.innerHTML = spread.right;

  if (currentSpread === 2) {
    renderIngredientLookupPage();
    renderEffectLookupPage();
 }

  prevPageButton.querySelector("span").textContent =
    currentSpread === 0 ? "⤺" : "‹";

  nextPageButton.disabled = currentSpread === spreads.length - 1;
}

/* ===== BOOK STATE ===== */

async function openBook() {
  book.classList.remove("closed");
  book.classList.add("open");

  currentSpread = 0;

  if (ingredients.length === 0) {
    await loadAlchemyData();
  }

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

/* ==== FUNCTIONALITY ==== */

function renderIngredientLookupPage() {
  leftPageContent.innerHTML = `
    <section class="lookup-panel ingredient-lookup-panel">
      <h2>Ingredient Lookup</h2>

      <div id="ingredientImageBox" class="ingredient-image-box">
        <span>No ingredient selected</span>
      </div>

      <div class="ingredient-search-card">
        <label class="ingredient-search-label" for="ingredientLookupInput">
          Search Ingredient
        </label>

        <div class="custom-dropdown">
          <input
            id="ingredientLookupInput"
            class="book-input"
            type="text"
            placeholder="Search or select an ingredient..."
            autocomplete="off"
          />

          <div id="ingredientDropdownMenu" class="dropdown-menu"></div>
        </div>

        <div id="ingredientLookupResult" class="ingredient-result empty">
          <div class="ingredient-stats-row">
            <div class="info-box">
              <strong>Weight</strong>
              <span>-</span>
            </div>

            <div class="info-box">
              <strong>Cost</strong>
              <span>-</span>
            </div>
          </div>

          <div class="ingredient-effects-grid">
            <div class="effect-box"></div>
            <div class="effect-box"></div>
            <div class="effect-box"></div>
            <div class="effect-box"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  initIngredientLookup(ingredients);
}

function initIngredientLookup(ingredients) {
  const input = document.getElementById("ingredientLookupInput");
  const dropdown = document.getElementById("ingredientDropdownMenu");
  const result = document.getElementById("ingredientLookupResult");
  const imageBox = document.getElementById("ingredientImageBox");

  if (!input || !dropdown || !result || !imageBox) return;

  const ingredientMap = new Map();

  ingredients.forEach((ingredient) => {
    const key = ingredient.name.trim().toLowerCase();

    if (!ingredientMap.has(key)) {
      ingredientMap.set(key, ingredient);
    }
  });

  const sortedIngredients = [...ingredientMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  function showDropdown(filterText = "") {
    const filtered = sortedIngredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(filterText.toLowerCase())
    );

    dropdown.innerHTML = filtered
      .map(
        (ingredient) => `
          <button class="dropdown-option" type="button" data-name="${ingredient.name}">
            ${ingredient.name}
          </button>
        `
      )
      .join("");

    dropdown.classList.add("show");
  }

  function selectIngredient(name) {
    const key = name.trim().toLowerCase();
    const ingredient = ingredientMap.get(key);

    input.value = name;
    dropdown.classList.remove("show");

    if (!ingredient) return;

    renderIngredientDetails(ingredient, imageBox, result);
  }

  input.addEventListener("focus", () => {
    input.select();
    showDropdown("");
});

  input.addEventListener("click", () => {
    input.select();
    showDropdown("");
  });

  input.addEventListener("input", () => {
    showDropdown(input.value);

    const exactMatch = ingredientMap.get(input.value.trim().toLowerCase());

    if (exactMatch) {
      renderIngredientDetails(exactMatch, imageBox, result);
    }
  });

  dropdown.addEventListener("click", (event) => {
    const option = event.target.closest(".dropdown-option");
    if (!option) return;

    selectIngredient(option.dataset.name);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-dropdown")) {
      dropdown.classList.remove("show");
    }
  });
}

function formatIngredientNumber(value) {
  if (value === undefined || value === null || value === "") {
    return "Unknown";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return parseFloat(number.toFixed(4)).toString();
}

function renderIngredientDetails(ingredient, imageBox, result) {
  const imageKey = ingredient.imageKey || ingredient.id;
  const imagePath = imageKey ? `assets/ingredients/${imageKey}.png` : "";

  imageBox.innerHTML = imagePath
    ? `
      <img
        src="${imagePath}"
        alt="${ingredient.name}"
        onerror="this.style.display='none'; this.parentElement.innerHTML='<span>No image found</span>';"
      >
    `
    : `<span>No image found</span>`;

  const weight = formatIngredientNumber(ingredient.weight);
  const cost = formatIngredientNumber(ingredient.cost ?? ingredient.value);
  const effects = ingredient.effects || [];

  result.className = "ingredient-result";

  result.innerHTML = `
    <div class="ingredient-stats-row">
      <div class="info-box">
        <strong>Weight</strong>
        <span>${weight}</span>
      </div>

      <div class="info-box">
        <strong>Cost</strong>
        <span>${cost}</span>
      </div>
    </div>

    <div class="ingredient-effects-grid">
      ${[0, 1, 2, 3].map(index => `
        <div class="effect-box">
          ${effects[index]?.name || ""}
        </div>
      `).join("")}
    </div>
  `;
}

function renderEffectLookupPage() {
  rightPageContent.innerHTML = `
    <section class="lookup-panel effect-lookup-panel">
      <h2>Effect Lookup</h2>

      <div class="effect-search-row">
        <div class="custom-dropdown">
          <input
            id="effectLookupInput"
            class="book-input"
            type="text"
            placeholder="Search or select an effect..."
            autocomplete="off"
          />

          <div id="effectDropdownMenu" class="dropdown-menu"></div>
        </div>

        <div class="effect-sort-controls">
          <button type="button" class="effect-sort-btn active" data-sort="alphabetical">A-Z</button>
          <button type="button" class="effect-sort-btn" data-sort="magnitude">Mag</button>
          <button type="button" class="effect-sort-btn" data-sort="duration">Dur</button>
        </div>
      </div>

      <div id="effectLookupResult" class="effect-result empty">
        <div class="effect-result-row header-row">
          <span>Ingredient</span>
          <span>Magnitude</span>
          <span>Duration</span>
        </div>

        <div class="effect-result-list">
          <p>Select an effect to view matching ingredients.</p>
        </div>
      </div>
    </section>
  `;

  initEffectLookup(ingredients);
}

function initEffectLookup(ingredients) {
  const input = document.getElementById("effectLookupInput");
  const dropdown = document.getElementById("effectDropdownMenu");
  const result = document.getElementById("effectLookupResult");
  const sortButtons = document.querySelectorAll(".effect-sort-btn");

  if (!input || !dropdown || !result) return;

  let selectedEffect = null;
  let currentSort = "alphabetical";

  const effectMap = new Map();

  ingredients.forEach((ingredient) => {
    ingredient.effects.forEach((effect) => {
      const effectName = effect.name.trim();
      const key = effectName.toLowerCase();

      if (!effectMap.has(key)) {
        effectMap.set(key, {
          name: effectName,
          ingredients: []
        });
      }

      effectMap.get(key).ingredients.push({
        ingredientName: ingredient.name,
        magnitude: effect.magnitude ?? "-",
        duration: effect.duration ?? "-"
      });
    });
  });

  const sortedEffects = [...effectMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  function showDropdown(filterText = "") {
    const filtered = sortedEffects.filter((effect) =>
      effect.name.toLowerCase().includes(filterText.toLowerCase())
    );

    dropdown.innerHTML = filtered
      .map(effect => `
        <button class="dropdown-option" type="button" data-name="${effect.name}">
          ${effect.name}
        </button>
      `)
      .join("");

    dropdown.classList.add("show");
  }

  function selectEffect(name) {
    const key = name.trim().toLowerCase();
    const effect = effectMap.get(key);

    input.value = name;
    dropdown.classList.remove("show");

    if (!effect) return;

    selectedEffect = effect;
    renderEffectDetails(selectedEffect, result, currentSort);
  }

  input.addEventListener("focus", () => {
    input.select();
    showDropdown("");
  });

  input.addEventListener("click", () => {
    input.select();
    showDropdown("");
  });

  input.addEventListener("input", () => {
    showDropdown(input.value);

    const exactMatch = effectMap.get(input.value.trim().toLowerCase());

    if (exactMatch) {
      selectedEffect = exactMatch;
      renderEffectDetails(selectedEffect, result, currentSort);
    }
  });

  dropdown.addEventListener("click", (event) => {
    const option = event.target.closest(".dropdown-option");
    if (!option) return;

    selectEffect(option.dataset.name);
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentSort = button.dataset.sort;

      sortButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      if (selectedEffect) {
        renderEffectDetails(selectedEffect, result, currentSort);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-dropdown")) {
      dropdown.classList.remove("show");
    }
  });
}

function renderEffectDetails(effect, result, sortBy = "alphabetical") {
  const sortedIngredients = [...effect.ingredients];

  if (sortBy === "alphabetical") {
    sortedIngredients.sort((a, b) =>
      a.ingredientName.localeCompare(b.ingredientName)
    );
  }

  if (sortBy === "magnitude") {
    sortedIngredients.sort((a, b) =>
      Number(b.magnitude) - Number(a.magnitude)
    );
  }

  if (sortBy === "duration") {
    sortedIngredients.sort((a, b) =>
      Number(b.duration) - Number(a.duration)
    );
  }

  result.className = "effect-result";

  result.innerHTML = `
    <div class="effect-result-row header-row">
      <span>Ingredient</span>
      <span>Magnitude</span>
      <span>Duration</span>
    </div>

    <div class="effect-result-list">
      ${sortedIngredients.map(item => `
        <div class="effect-result-row">
          <span>${item.ingredientName}</span>
          <span>${formatIngredientNumber(item.magnitude)}</span>
          <span>${formatIngredientNumber(item.duration)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ===== EVENTS ===== */

coverButton.addEventListener("click", openBook);
nextPageButton.addEventListener("click", nextSpread);
prevPageButton.addEventListener("click", previousSpread);