const book = document.getElementById("book");
const coverButton = document.getElementById("coverButton");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const flipOverlay = document.getElementById("pageFlipOverlay");

const leftPageContent = document.getElementById("leftPageContent");
const rightPageContent = document.getElementById("rightPageContent");

let currentSpread = 0;
let isTurningPage = false;

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
  { left: ``, right: `` },
  { left: ``, right: `` },
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

  if (currentSpread === 1) {
    renderPotionBuilderPage();
    renderPotionDatabasePage();
  }

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

  await loadAlchemyData();

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

/* ===== POTION BUILDER ===== */

function renderPotionBuilderPage() {
  leftPageContent.innerHTML = `
    <section class="lookup-panel potion-builder-panel">
      <h2>Potion Builder</h2>

      <div id="potionResultBox" class="potion-result-box">
        <div class="potion-result-text">
          <div id="generatedPotionName" class="generated-potion-name">
            No potion created
          </div>

          <div id="sharedEffectsDisplay" class="shared-effects-box">
            Select at least 2 ingredients
          </div>
        </div>

        <button id="savePotionBtn" class="book-button save-potion-btn" type="button">
          Save Potion
        </button>
      </div>

      <div class="ingredient-search-card potion-builder-card">
        <div class="potion-ingredient-stack">

          <div class="potion-ingredient-card">
            <label for="ingredient1Input">Ingredient 1</label>
            <div class="custom-dropdown">
              <input id="ingredient1Input" class="book-input" type="text" placeholder="Search ingredient..." autocomplete="off" />
              <div id="ingredient1Dropdown" class="dropdown-menu"></div>
            </div>
          </div>

          <div class="potion-ingredient-card">
            <label for="ingredient2Input">Ingredient 2</label>
            <div class="custom-dropdown">
              <input id="ingredient2Input" class="book-input" type="text" placeholder="Matching ingredient..." autocomplete="off" />
              <div id="ingredient2Dropdown" class="dropdown-menu"></div>
            </div>
          </div>

          <div class="potion-ingredient-card">
            <label for="ingredient3Input">Ingredient 3</label>
            <div class="custom-dropdown">
              <input id="ingredient3Input" class="book-input" type="text" placeholder="Optional..." autocomplete="off" />
              <div id="ingredient3Dropdown" class="dropdown-menu"></div>
            </div>
          </div>

          <div class="potion-notes-card">
            <label for="potionNotesInput">Notes</label>
            <textarea
              id="potionNotesInput"
              class="potion-notes-input"
              placeholder="Add notes for this potion..."
            ></textarea>
          </div>

        </div>
      </div>
    </section>
  `;

  initPotionBuilder();
}

function initPotionBuilder() {
  const input1 = document.getElementById("ingredient1Input");
  const input2 = document.getElementById("ingredient2Input");
  const input3 = document.getElementById("ingredient3Input");

  const dropdown1 = document.getElementById("ingredient1Dropdown");
  const dropdown2 = document.getElementById("ingredient2Dropdown");
  const dropdown3 = document.getElementById("ingredient3Dropdown");

  const nameBox = document.getElementById("generatedPotionName");
  const effectsBox = document.getElementById("sharedEffectsDisplay");
  const savePotionBtn = document.getElementById("savePotionBtn");
  const notesInput = document.getElementById("potionNotesInput");

  if (!input1 || !input2 || !input3 || !dropdown1 || !dropdown2 || !dropdown3 || !savePotionBtn) return;

  let selectedIngredient1 = null;
  let selectedIngredient2 = null;
  let selectedIngredient3 = null;

  input2.disabled = true;
  input3.disabled = true;
  input2.placeholder = "Choose Ingredient 1 first...";
  input3.placeholder = "Choose Ingredient 2 first...";

  const sortedIngredients = [...ingredients].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  function getEffectNames(ingredient) {
    return (ingredient.effects || []).map(effect => effect.name);
  }

  function sharesEffect(a, b) {
    const effectsA = getEffectNames(a);
    const effectsB = getEffectNames(b);

    return effectsA.some(effect => effectsB.includes(effect));
  }

  function getSharedEffects(selectedIngredients) {
    const validIngredients = selectedIngredients.filter(Boolean);

    if (validIngredients.length < 2) return [];

    const effectCounts = new Map();

    validIngredients.forEach(ingredient => {
      const uniqueEffects = [...new Set(getEffectNames(ingredient))];

      uniqueEffects.forEach(effectName => {
        effectCounts.set(effectName, (effectCounts.get(effectName) || 0) + 1);
      });
    });

    return [...effectCounts.entries()]
      .filter(([, count]) => count >= 2)
      .map(([effectName]) => effectName)
      .sort((a, b) => a.localeCompare(b));
  }

function getEffectType(effectName) {
  const selectedIngredients = [
    selectedIngredient1,
    selectedIngredient2,
    selectedIngredient3
  ].filter(Boolean);

  for (const ingredient of selectedIngredients) {
    const matchingEffect = ingredient.effects.find(effect =>
      effect.name === effectName
    );

    if (matchingEffect?.type) {
      return matchingEffect.type.toLowerCase();
    }
  }

  return "positive";
}

function getPotionLabel(sharedEffects) {
  let positiveCount = 0;
  let negativeCount = 0;

  sharedEffects.forEach(effectName => {
    const type = getEffectType(effectName);

    if (type === "negative") {
      negativeCount++;
    } else {
      positiveCount++;
    }
  });

  return negativeCount > positiveCount ? "Poison" : "Potion";
}

function generatePotionName(sharedEffects) {
  if (sharedEffects.length === 0) {
    return "No valid potion created";
  }

  const label = getPotionLabel(sharedEffects);

  if (sharedEffects.length === 1) {
    return `${label} of ${sharedEffects[0]}`;
  }

  if (sharedEffects.length === 2) {
    return `${label} of ${sharedEffects[0]} and ${sharedEffects[1]}`;
  }

  const lastEffect = sharedEffects[sharedEffects.length - 1];
  const firstEffects = sharedEffects.slice(0, -1);

  return `${label} of ${firstEffects.join(", ")}, and ${lastEffect}`;
}

  function updatePotionPreview() {
    const sharedEffects = getSharedEffects([
      selectedIngredient1,
      selectedIngredient2,
      selectedIngredient3
    ]);

    nameBox.textContent = generatePotionName(sharedEffects);

    effectsBox.textContent = sharedEffects.length
      ? `Shared Effects: ${sharedEffects.join(", ")}`
      : "Select at least 2 ingredients with a shared effect";
  }

  function getCurrentPotionData() {
    const selectedIngredients = [
      selectedIngredient1,
      selectedIngredient2,
      selectedIngredient3
    ].filter(Boolean);

    const sharedEffects = getSharedEffects(selectedIngredients);

    if (selectedIngredients.length < 2 || sharedEffects.length === 0) {
      return null;
    }

    return {
      id: Date.now(),
      name: generatePotionName(sharedEffects),
      type: getPotionLabel(sharedEffects),
      ingredients: selectedIngredients.map(ingredient => ingredient.name),
      notes: notesInput ? notesInput.value.trim() : "",
      favorite: false
    };
  }

  function saveCurrentPotion() {
    const potion = getCurrentPotionData();

    if (!potion) {
      alert("Select at least 2 ingredients with shared effects before saving.");
      return;
    }

    const potions = getSavedPotions();
    const newPotionKey = getPotionIngredientKey(potion);

    const duplicatePotion = potions.find(savedPotion =>
      getPotionIngredientKey(savedPotion) === newPotionKey
    );

    if (duplicatePotion) {
      alert("A potion with this same ingredient combination is already saved.");
      return;
    }

    potions.unshift(potion);
    savePotionsToStorage(potions);

    input1.value = "";
    input2.value = "";
    input3.value = "";

    if (notesInput) notesInput.value = "";

    selectedIngredient1 = null;
    selectedIngredient2 = null;
    selectedIngredient3 = null;

    input2.disabled = true;
    input3.disabled = true;
    input2.placeholder = "Choose Ingredient 1 first...";
    input3.placeholder = "Choose Ingredient 2 first...";

    updatePotionPreview();
    renderPotionDatabasePage();
  }

  function getMatchingIngredientsForIngredient2() {
    if (!selectedIngredient1) return [];

    return sortedIngredients.filter(ingredient =>
      ingredient !== selectedIngredient1 &&
      sharesEffect(ingredient, selectedIngredient1)
    );
  }

  function getMatchingIngredientsForIngredient3() {
    if (!selectedIngredient1 || !selectedIngredient2) return [];

    return sortedIngredients.filter(ingredient =>
      ingredient !== selectedIngredient1 &&
      ingredient !== selectedIngredient2 &&
      (
        sharesEffect(ingredient, selectedIngredient1) ||
        sharesEffect(ingredient, selectedIngredient2)
      )
    );
  }

  function renderDropdown(dropdown, list, filterText = "") {
    const filtered = list.filter(ingredient =>
      ingredient.name.toLowerCase().includes(filterText.toLowerCase())
    );

    dropdown.currentList = filtered;

    dropdown.innerHTML = filtered.map((ingredient, index) => `
      <button class="dropdown-option" type="button" data-index="${index}">
        ${ingredient.name}
      </button>
    `).join("");

    dropdown.classList.add("show");
  }

  function closeDropdowns() {
    dropdown1.classList.remove("show");
    dropdown2.classList.remove("show");
    dropdown3.classList.remove("show");
  }

  function setupDropdown(input, dropdown, getList, onSelect) {
    input.addEventListener("focus", () => {
      if (input.disabled) return;

      input.select();
      renderDropdown(dropdown, getList(), "");
    });

    input.addEventListener("click", () => {
      if (input.disabled) return;

      input.select();
      renderDropdown(dropdown, getList(), "");
    });

    input.addEventListener("input", () => {
      if (input.disabled) return;

      renderDropdown(dropdown, getList(), input.value);
    });

    dropdown.addEventListener("pointerdown", event => {
      const option = event.target.closest(".dropdown-option");
      if (!option) return;

      event.preventDefault();
      event.stopPropagation();

      const ingredient = dropdown.currentList[Number(option.dataset.index)];
      if (!ingredient) return;

      input.value = ingredient.name;
      dropdown.classList.remove("show");

      onSelect(ingredient);
      updatePotionPreview();
    });
  }

  setupDropdown(input1, dropdown1, () => sortedIngredients, ingredient => {
    selectedIngredient1 = ingredient;
    selectedIngredient2 = null;
    selectedIngredient3 = null;

    input2.disabled = false;
    input3.disabled = true;

    input2.value = "";
    input3.value = "";

    input2.placeholder = "Select matching ingredient...";
    input3.placeholder = "Choose Ingredient 2 first...";
  });

  setupDropdown(input2, dropdown2, getMatchingIngredientsForIngredient2, ingredient => {
    selectedIngredient2 = ingredient;
    selectedIngredient3 = null;

    input3.disabled = false;
    input3.value = "";
    input3.placeholder = "Optional third ingredient...";
  });

  setupDropdown(input3, dropdown3, getMatchingIngredientsForIngredient3, ingredient => {
    selectedIngredient3 = ingredient;
  });

  savePotionBtn.addEventListener("click", saveCurrentPotion);

  document.addEventListener("click", event => {
    if (!event.target.closest(".custom-dropdown")) {
      closeDropdowns();
    }
  });

  updatePotionPreview();
}

/* ===== INGREDIENT LOOKUP ===== */

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

  ingredients.forEach(ingredient => {
    const key = ingredient.name.trim().toLowerCase();

    if (!ingredientMap.has(key)) {
      ingredientMap.set(key, ingredient);
    }
  });

  const sortedIngredients = [...ingredientMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  function showDropdown(filterText = "") {
    const filtered = sortedIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(filterText.toLowerCase())
    );

    dropdown.innerHTML = filtered.map(ingredient => `
      <button class="dropdown-option" type="button" data-name="${escapeHTML(ingredient.name)}">
        ${escapeHTML(ingredient.name)}
      </button>
    `).join("");

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

  dropdown.addEventListener("pointerdown", event => {
    const option = event.target.closest(".dropdown-option");
    if (!option) return;

    event.preventDefault();
    selectIngredient(option.dataset.name);
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".custom-dropdown")) {
      dropdown.classList.remove("show");
    }
  });
}

function renderIngredientDetails(ingredient, imageBox, result) {
  const imageKey = ingredient.imageKey || ingredient.id;
  const imagePath = imageKey ? `assets/ingredients/${imageKey}.png` : "";

  imageBox.innerHTML = imagePath
    ? `
      <img
        src="${imagePath}"
        alt="${escapeHTML(ingredient.name)}"
        onerror="this.style.display='none'; this.parentElement.innerHTML='<span>No image found</span>';"
      >
    `
    : `<span>No image found</span>`;

  const weight = formatIngredientNumber(ingredient.weight);
  const cost = formatIngredientNumber(ingredient.cost ?? ingredient.value);
  const ingredientEffects = ingredient.effects || [];

  result.className = "ingredient-result";

  result.innerHTML = `
    <div class="ingredient-stats-row">
      <div class="info-box">
        <strong>Weight</strong>
        <span>${escapeHTML(weight)}</span>
      </div>

      <div class="info-box">
        <strong>Cost</strong>
        <span>${escapeHTML(cost)}</span>
      </div>
    </div>

    <div class="ingredient-effects-grid">
      ${[0, 1, 2, 3].map(index => `
        <div class="effect-box">
          ${escapeHTML(ingredientEffects[index]?.name || "")}
        </div>
      `).join("")}
    </div>
  `;
}

/* ===== EFFECT LOOKUP ===== */

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

  ingredients.forEach(ingredient => {
    ingredient.effects.forEach(effect => {
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
    const filtered = sortedEffects.filter(effect =>
      effect.name.toLowerCase().includes(filterText.toLowerCase())
    );

    dropdown.innerHTML = filtered.map(effect => `
      <button class="dropdown-option" type="button" data-name="${escapeHTML(effect.name)}">
        ${escapeHTML(effect.name)}
      </button>
    `).join("");

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

  dropdown.addEventListener("pointerdown", event => {
    const option = event.target.closest(".dropdown-option");
    if (!option) return;

    event.preventDefault();
    selectEffect(option.dataset.name);
  });

  sortButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentSort = button.dataset.sort;

      sortButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      if (selectedEffect) {
        renderEffectDetails(selectedEffect, result, currentSort);
      }
    });
  });

  document.addEventListener("click", event => {
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
          <span>${escapeHTML(item.ingredientName)}</span>
          <span>${escapeHTML(formatIngredientNumber(item.magnitude))}</span>
          <span>${escapeHTML(formatIngredientNumber(item.duration))}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ===== EVENTS ===== */

coverButton.addEventListener("click", openBook);
nextPageButton.addEventListener("click", nextSpread);
prevPageButton.addEventListener("click", previousSpread);