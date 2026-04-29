const ing1Input = document.getElementById("ingredient1");
const ing2Input = document.getElementById("ingredient2");
const ing3Input = document.getElementById("ingredient3");
const ing1List = document.getElementById("ingredient1List");
const ing2List = document.getElementById("ingredient2List");
const ing3List = document.getElementById("ingredient3List");
const results = document.getElementById("results");
const effectSearchInput = document.getElementById("effectSearch");
const effectList = document.getElementById("effectList");
const effectResults = document.getElementById("effectResults");
const ingredientLookupInput = document.getElementById("ingredientLookup");
const ingredientLookupList = document.getElementById("ingredientLookupList");
const ingredientLookupResults = document.getElementById("ingredientLookupResults");

function getEffectByName(name) {
  return effects.find(effect => effect.name === name);
}

function populateEffectList() {
  effectList.innerHTML = "";

  effects.forEach(effect => {
    const option = document.createElement("option");
    option.value = effect.name;
    effectList.appendChild(option);
  });
}

function getIngredientsWithEffect(effectId) {
  return ingredients.filter(ingredient =>
    ingredient.effects.includes(effectId)
  );
}

function getIngredientByName(name) {
  return ingredients.find(ingredient => ingredient.name === name);
}

function populateDatalist(listElement, ingredientOptions) {
  listElement.innerHTML = "";

  ingredientOptions.forEach(ingredient => {
    const option = document.createElement("option");
    option.value = ingredient.name;
    listElement.appendChild(option);
  });
}

function getPotionName(sharedEffects) {
  if (sharedEffects.length === 0) return "";

  const mainLabel = getPotionLabel(sharedEffects);

  const effectNames = sharedEffects.map(effectId => getEffectName(effectId));

  if (effectNames.length === 1) {
    return `${mainLabel} of ${effectNames[0]}`;
  }

  if (effectNames.length === 2) {
    return `${mainLabel} of ${effectNames[0]} and ${effectNames[1]}`;
  }

  const lastEffect = effectNames.pop();

  return `${mainLabel} of ${effectNames.join(", ")}, and ${lastEffect}`;
}

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
  populateDatalist(ing1List, ingredients);
}

function populateIngredient2() {
  const ing1 = getIngredientByName(ing1Input.value);

  if (!ing1) {
    populateDatalist(ing2List, []);
    return;
  }

  const matches = ingredients.filter(ingredient => {
    if (ingredient.id === ing1.id) return false;
    return getSharedEffects(ing1, ingredient).length > 0;
  });

  populateDatalist(ing2List, matches);
}

function populateIngredient3() {
  const ing1 = getIngredientByName(ing1Input.value);
  const ing2 = getIngredientByName(ing2Input.value);

  if (!ing1 && !ing2) {
    populateDatalist(ing3List, []);
    return;
  }

  const matches = ingredients.filter(ingredient => {
    if (ingredient.id === ing1?.id || ingredient.id === ing2?.id) return false;

    const sharesWith1 = ing1 && getSharedEffects(ing1, ingredient).length > 0;
    const sharesWith2 = ing2 && getSharedEffects(ing2, ingredient).length > 0;

    return sharesWith1 || sharesWith2;
  });

  populateDatalist(ing3List, matches);
}

function populateIngredientLookupList() {
  ingredientLookupList.innerHTML = "";

  ingredients.forEach(ingredient => {
    const option = document.createElement("option");
    option.value = ingredient.name;
    ingredientLookupList.appendChild(option);
  });
}

function getSharedEffectsAcrossSelected() {
  const selectedIngredients = [
    getIngredientByName(ing1Input.value),
    getIngredientByName(ing2Input.value),
    getIngredientByName(ing3Input.value)
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
  const potionName = getPotionName(sharedEffects);

  results.innerText =
    potionName + "\n" +
    "Shared Effects: " + effectNames.join(", ");
}

function updateEffectResults() {
  const selectedEffect = getEffectByName(effectSearchInput.value);

  if (!selectedEffect) {
    effectResults.innerText = "Select an effect to see matching ingredients.";
    return;
  }

  const matches = getIngredientsWithEffect(selectedEffect.id);

  if (matches.length === 0) {
    effectResults.innerText = "No ingredients found for this effect.";
    return;
  }

  effectResults.innerHTML =
    `<h3>${selectedEffect.name}</h3>` +
    `<p>${matches.length} ingredients found</p>` +
    `<ul>` +
    matches.map(ingredient => `<li>${ingredient.name}</li>`).join("") +
    `</ul>`;
}

function updateIngredientLookupResults() {
  const selectedIngredient = ingredients.find(
    ingredient => ingredient.name === ingredientLookupInput.value
  );

  if (!selectedIngredient) {
    ingredientLookupResults.innerText = "Select an ingredient to view details.";
    return;
  }

  const effectList = selectedIngredient.effectDetails
    .sort((a, b) => a.order - b.order)
    .map(effect =>
      `${effect.effectName} (Mag: ${effect.magnitude}, Dur: ${effect.duration})`
    )
    .join("<br>");

  ingredientLookupResults.innerHTML = `
    <h3>${selectedIngredient.name}</h3>
    <p>Weight: ${selectedIngredient.weight}</p>
    <p>Value: ${selectedIngredient.value}</p>

    <p><strong>Effects:</strong></p>
    <p>${effectList}</p>
  `;
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

ing1Input.addEventListener("input", () => {
  ing2Input.value = "";
  ing3Input.value = "";
  populateIngredient2();
  populateIngredient3();
  updateResults();
});

ing2Input.addEventListener("input", () => {
  ing3Input.value = "";
  populateIngredient3();
  updateResults();
});

ing3Input.addEventListener("input", updateResults);

effectSearchInput.addEventListener("input", updateEffectResults);

ingredientLookupInput.addEventListener("input", updateIngredientLookupResults);

populateIngredient1();
populateIngredient2();
populateIngredient3();
updateResults();
populateEffectList();
updateEffectResults();
populateIngredientLookupList();
updateIngredientLookupResults();