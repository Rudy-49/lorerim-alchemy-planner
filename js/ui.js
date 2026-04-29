const ing1Select = document.getElementById("ingredient1");
const ing2Select = document.getElementById("ingredient2");
const ing3Select = document.getElementById("ingredient3");
const results = document.getElementById("results");

function addPlaceholder(selectElement, text) {
  const placeholder = new Option(text, "");
  placeholder.dataset.placeholder = "true";
  selectElement.add(placeholder);
}

function removePlaceholder(selectElement) {
  const placeholder = selectElement.querySelector('option[data-placeholder="true"]');
  if (placeholder && selectElement.value !== "") {
    placeholder.remove();
  }
}

function getEffectName(effectId) {
  const effect = effects.find(e => e.id === effectId);
  return effect ? effect.name : effectId;
}

function getEffectType(effectId) {
  const effect = effects.find(e => e.id === effectId);
  return effect ? effect.type : "unknown";
}

function getPotionLabel(sharedEffects) {
  const positiveCount = sharedEffects.filter(effectId => getEffectType(effectId) === "positive").length;
  const negativeCount = sharedEffects.filter(effectId => getEffectType(effectId) === "negative").length;

  if (negativeCount > positiveCount) {
    return "Poison";
  }

  return "Potion";
}

function getIngredientById(id) {
  return ingredients.find(ingredient => ingredient.id === id);
}

function populateIngredient1() {
  ing1Select.innerHTML = "";

  addPlaceholder(ing1Select, "Ingredient 1");

  ingredients.forEach(ingredient => {
    ing1Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function populateIngredient2() {
  ing2Select.innerHTML = "";

  addPlaceholder(ing2Select, "Ingredient 2");

  const ing1 = getIngredientById(ing1Select.value);
  if (!ing1) return;

  const matches = ingredients.filter(ingredient => {
    if (ingredient.id === ing1.id) return false;
    return getSharedEffects(ing1, ingredient).length > 0;
  });

  matches.forEach(ingredient => {
    ing2Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function populateIngredient3() {
  ing3Select.innerHTML = "";

  addPlaceholder(ing3Select, "Ingredient 3");

  const ing1 = getIngredientById(ing1Select.value);
  const ing2 = getIngredientById(ing2Select.value);

  if (!ing1 && !ing2) return;

  const matches = ingredients.filter(ingredient => {
    if (ingredient.id === ing1?.id || ingredient.id === ing2?.id) return false;

    const sharesWith1 = ing1 && getSharedEffects(ing1, ingredient).length > 0;
    const sharesWith2 = ing2 && getSharedEffects(ing2, ingredient).length > 0;

    return sharesWith1 || sharesWith2;
  });

  matches.forEach(ingredient => {
    ing3Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function getSharedEffectsAcrossSelected() {
  const selectedIngredients = [
    getIngredientById(ing1Select.value),
    getIngredientById(ing2Select.value),
    getIngredientById(ing3Select.value)
  ].filter(Boolean);

  if (selectedIngredients.length < 2) return [];

  const effectCounts = {};

  selectedIngredients.forEach(ingredient => {
    ingredient.effects.forEach(effect => {
      effectCounts[effect] = (effectCounts[effect] || 0) + 1;
    });
  });

  return Object.keys(effectCounts).filter(effect => effectCounts[effect] >= 2);
}

function updateResults() {
  const sharedEffects = getSharedEffectsAcrossSelected();

  if (sharedEffects.length === 0) {
    results.innerText = "Select at least 2 ingredients with shared effects";
    return;
  }

  const effectNames = sharedEffects.map(effectId => getEffectName(effectId));
  const label = getPotionLabel(sharedEffects);

  results.innerText =
    label + "\n" +
    "Shared Effects: " + effectNames.join(", ");
}

function handleIngredient1Change() {
  removePlaceholder(ing1Select);
  populateIngredient2();
  populateIngredient3();
  updateResults();
}

function handleIngredient2Change() {
  removePlaceholder(ing2Select);
  populateIngredient3();
  updateResults();
}

function handleIngredient3Change() {
  removePlaceholder(ing3Select);
  updateResults();
}

ing1Select.addEventListener("change", handleIngredient1Change);
ing2Select.addEventListener("change", handleIngredient2Change);
ing3Select.addEventListener("change", handleIngredient3Change);

populateIngredient1();
populateIngredient2();
populateIngredient3();
updateResults();