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
}