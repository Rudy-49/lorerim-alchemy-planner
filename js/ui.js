const ing1Select = document.getElementById("ingredient1");
const ing2Select = document.getElementById("ingredient2");
const ing3Select = document.getElementById("ingredient3");
const results = document.getElementById("results");

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

  ingredients.forEach(ingredient => {
    ing1Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function populateIngredient2() {
  ing2Select.innerHTML = "";

  const ing1 = getIngredientById(ing1Select.value);
  if (!ing1) return;

  const matchingIngredients = ingredients.filter(ingredient => {
    if (ingredient.id === ing1.id) return false;

    const sharedEffects = getSharedEffects(ing1, ingredient);
    return sharedEffects.length > 0;
  });

  matchingIngredients.forEach(ingredient => {
    ing2Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function populateIngredient3() {
  ing3Select.innerHTML = "";

  const ing1 = getIngredientById(ing1Select.value);
  const ing2 = getIngredientById(ing2Select.value);

  if (!ing1 || !ing2) return;

  const matchingIngredients = ingredients.filter(ingredient => {
    if (ingredient.id === ing1.id || ingredient.id === ing2.id) return false;

    const sharesWithIng1 = getSharedEffects(ing1, ingredient).length > 0;
    const sharesWithIng2 = getSharedEffects(ing2, ingredient).length > 0;

    return sharesWithIng1 || sharesWithIng2;
  });

  matchingIngredients.forEach(ingredient => {
    ing3Select.add(new Option(ingredient.name, ingredient.id));
  });
}

function getSharedEffectsAcrossSelected() {
  const selectedIngredients = [
    getIngredientById(ing1Select.value),
    getIngredientById(ing2Select.value),
    getIngredientById(ing3Select.value)
  ].filter(Boolean);

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
    results.innerText = "No valid potion/poison";
    return;
  }

  const effectNames = sharedEffects.map(effectId => getEffectName(effectId));
  const label = getPotionLabel(sharedEffects);

  results.innerText =
    label + "\n" +
    "Shared Effects: " + effectNames.join(", ");
}

function handleIngredient1Change() {
  populateIngredient2();
  populateIngredient3();
  updateResults();
}

function handleIngredient2Change() {
  populateIngredient3();
  updateResults();
}

ing1Select.addEventListener("change", handleIngredient1Change);
ing2Select.addEventListener("change", handleIngredient2Change);
ing3Select.addEventListener("change", updateResults);

populateIngredient1();
populateIngredient2();
populateIngredient3();
updateResults();