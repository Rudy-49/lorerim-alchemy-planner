const ing1Input = document.getElementById("ingredient1");
const ing2Input = document.getElementById("ingredient2");
const ing3Input = document.getElementById("ingredient3");

const ing1Dropdown = document.getElementById("ingredient1Dropdown");
const ing2Dropdown = document.getElementById("ingredient2Dropdown");
const ing3Dropdown = document.getElementById("ingredient3Dropdown");

const results = document.getElementById("results");

const effectSearchInput = document.getElementById("effectSearch");
const effectDropdown = document.getElementById("effectDropdown");
const effectResults = document.getElementById("effectResults");

const ingredientLookupInput = document.getElementById("ingredientLookup");
const ingredientLookupDropdown = document.getElementById("ingredientLookupDropdown");
const ingredientLookupResults = document.getElementById("ingredientLookupResults");

function getIngredientByName(name) {
  return ingredients.find(ingredient => ingredient.name === name);
}

function getEffectByName(name) {
  return effects.find(effect => effect.name === name);
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

  return negativeCount > positiveCount ? "Poison" : "Potion";
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

function renderDropdown(inputElement, dropdownElement, options, onSelect, showFullList = false) {
  dropdownElement.innerHTML = "";

  const filterText = inputElement.value.toLowerCase();

  const matches = showFullList
    ? options
    : options.filter(option =>
        option.name.toLowerCase().includes(filterText)
      );

  matches.forEach(option => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.innerText = option.name;

    item.addEventListener("mousedown", event => {
      event.preventDefault();

      inputElement.value = option.name;
      dropdownElement.style.display = "none";
      onSelect(option);
    });

    dropdownElement.appendChild(item);
  });

  dropdownElement.style.display = matches.length > 0 ? "block" : "none";
}

function hideAllDropdowns() {
  ing1Dropdown.style.display = "none";
  ing2Dropdown.style.display = "none";
  ing3Dropdown.style.display = "none";
  effectDropdown.style.display = "none";
  ingredientLookupDropdown.style.display = "none";
}

function getIngredient2Matches() {
  const ing1 = getIngredientByName(ing1Input.value);

  if (!ing1) return [];

  return ingredients.filter(ingredient => {
    if (ingredient.id === ing1.id) return false;
    return getSharedEffects(ing1, ingredient).length > 0;
  });
}

function getIngredient3Matches() {
  const ing1 = getIngredientByName(ing1Input.value);
  const ing2 = getIngredientByName(ing2Input.value);

  if (!ing1 && !ing2) return [];

  return ingredients.filter(ingredient => {
    if (ingredient.id === ing1?.id || ingredient.id === ing2?.id) return false;

    const sharesWith1 = ing1 && getSharedEffects(ing1, ingredient).length > 0;
    const sharesWith2 = ing2 && getSharedEffects(ing2, ingredient).length > 0;

    return sharesWith1 || sharesWith2;
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

function getIngredientsWithEffect(effectId) {
  return ingredients.filter(ingredient =>
    ingredient.effects.includes(effectId)
  );
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
  const selectedIngredient = getIngredientByName(ingredientLookupInput.value);

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

// Ingredient 1
ing1Input.addEventListener("focus", () => {
  renderDropdown(ing1Input, ing1Dropdown, ingredients, () => {
    ing2Input.value = "";
    ing3Input.value = "";
    updateResults();
  }, true);
});

ing1Input.addEventListener("input", () => {
  renderDropdown(ing1Input, ing1Dropdown, ingredients, () => {
    ing2Input.value = "";
    ing3Input.value = "";
    updateResults();
  }, false);

  ing2Input.value = "";
  ing3Input.value = "";
  updateResults();
});

// Ingredient 2
ing2Input.addEventListener("focus", () => {
  renderDropdown(ing2Input, ing2Dropdown, getIngredient2Matches(), () => {
    ing3Input.value = "";
    updateResults();
  }, true);
});

ing2Input.addEventListener("click", () => {
  renderDropdown(ing2Input, ing2Dropdown, getIngredient2Matches(), () => {
    ing3Input.value = "";
    updateResults();
  }, true);
});

ing2Input.addEventListener("input", () => {
  renderDropdown(ing2Input, ing2Dropdown, getIngredient2Matches(), () => {
    ing3Input.value = "";
    updateResults();
  }, false);

  ing3Input.value = "";
  updateResults();
});

// Ingredient 3
ing3Input.addEventListener("focus", () => {
  renderDropdown(ing3Input, ing3Dropdown, getIngredient3Matches(), () => {
    updateResults();
  }, true);
});

ing3Input.addEventListener("click", () => {
  renderDropdown(ing3Input, ing3Dropdown, getIngredient3Matches(), () => {
    updateResults();
  }, true);
});

ing3Input.addEventListener("input", () => {
  renderDropdown(ing3Input, ing3Dropdown, getIngredient3Matches(), () => {
    updateResults();
  }, false);

  updateResults();
});

// Effect search
effectSearchInput.addEventListener("focus", () => {
  renderDropdown(effectSearchInput, effectDropdown, effects, () => {
    updateEffectResults();
  }, true);
});

effectSearchInput.addEventListener("click", () => {
  renderDropdown(effectSearchInput, effectDropdown, effects, () => {
    updateEffectResults();
  }, true);
});

effectSearchInput.addEventListener("input", () => {
  renderDropdown(effectSearchInput, effectDropdown, effects, () => {
    updateEffectResults();
  }, false);

  updateEffectResults();
});

// Ingredient lookup
ingredientLookupInput.addEventListener("focus", () => {
  renderDropdown(ingredientLookupInput, ingredientLookupDropdown, ingredients, () => {
    updateIngredientLookupResults();
  }, true);
});

ingredientLookupInput.addEventListener("click", () => {
  renderDropdown(ingredientLookupInput, ingredientLookupDropdown, ingredients, () => {
    updateIngredientLookupResults();
  }, true);
});

ingredientLookupInput.addEventListener("input", () => {
  renderDropdown(ingredientLookupInput, ingredientLookupDropdown, ingredients, () => {
    updateIngredientLookupResults();
  }, false);

  updateIngredientLookupResults();
});

// Initial page text
updateResults();
updateEffectResults();
updateIngredientLookupResults();