const ing1Input = document.getElementById("ingredient1");
const ing2Input = document.getElementById("ingredient2");
const ing3Input = document.getElementById("ingredient3");

const ing1Dropdown = document.getElementById("ingredient1Dropdown");
const ing2Dropdown = document.getElementById("ingredient2Dropdown");
const ing3Dropdown = document.getElementById("ingredient3Dropdown");

const results = document.getElementById("results");
const savePotionBtn = document.getElementById("savePotionBtn");

const effectSearchInput = document.getElementById("effectSearch");
const effectDropdown = document.getElementById("effectDropdown");
const effectResults = document.getElementById("effectResults");

const ingredientLookupInput = document.getElementById("ingredientLookup");
const ingredientLookupDropdown = document.getElementById("ingredientLookupDropdown");
const ingredientLookupResults = document.getElementById("ingredientLookupResults");

const potionNameDisplay = document.getElementById("potionNameDisplay");
const potionNotesInput = document.getElementById("potionNotes");
const potionDatabaseList = document.getElementById("potionDatabaseList");

const potionDatabaseSearch = document.getElementById("potionDatabaseSearch");
const potionDatabaseFilter = document.getElementById("potionDatabaseFilter");

const exportPotionsBtn = document.getElementById("exportPotionsBtn");
const importPotionsInput = document.getElementById("importPotionsInput");

let activeDropdownIndex = -1;

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
  activeDropdownIndex = -1;

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

function handleDropdownKeyboard(event, inputElement, dropdownElement) {
  const items = dropdownElement.querySelectorAll(".dropdown-item");

  if (dropdownElement.style.display !== "block" || items.length === 0) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();

    activeDropdownIndex++;

    if (activeDropdownIndex >= items.length) {
      activeDropdownIndex = 0;
    }
  }

  else if (event.key === "ArrowUp") {
    event.preventDefault();

    activeDropdownIndex--;

    if (activeDropdownIndex < 0) {
      activeDropdownIndex = items.length - 1;
    }
  }

  else if (event.key === "Enter") {
    event.preventDefault();

    if (activeDropdownIndex >= 0 && items[activeDropdownIndex]) {
      items[activeDropdownIndex].dispatchEvent(new MouseEvent("mousedown"));
    }

    return;
  }

  else if (event.key === "Escape") {
    dropdownElement.style.display = "none";
    activeDropdownIndex = -1;
    return;
  }

  items.forEach(item => item.classList.remove("active"));

  if (activeDropdownIndex >= 0 && items[activeDropdownIndex]) {
    items[activeDropdownIndex].classList.add("active");
    items[activeDropdownIndex].scrollIntoView({ block: "nearest" });
  }
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
    potionNameDisplay.innerText = "No Potion Discovered";
    results.innerText = "Select at least 2 ingredients with shared effects";
    return;
  }

  const effectNames = sharedEffects.map(effectId => getEffectName(effectId));
  const potionName = getPotionName(sharedEffects);

  potionNameDisplay.innerText = potionName;
  results.innerText = "Shared Effects: " + effectNames.join(", ");
}

function getCurrentPotionData() {
  const selectedIngredients = [
    getIngredientByName(ing1Input.value),
    getIngredientByName(ing2Input.value),
    getIngredientByName(ing3Input.value)
  ].filter(Boolean);

  const sharedEffects = getSharedEffectsAcrossSelected();

  if (selectedIngredients.length < 2 || sharedEffects.length === 0) {
    return null;
  }

  return {
    id: Date.now(),
    name: getPotionName(sharedEffects),
    type: getPotionLabel(sharedEffects),
    ingredients: selectedIngredients.map(ingredient => ingredient.name.replace(/\s*\(.*?\)\s*/g, "")),
    effects: sharedEffects.map(effectId => getEffectName(effectId)),
    notes: potionNotesInput.value.trim(),
    favorite: false
  };
}

function getSavedPotions() {
  return JSON.parse(localStorage.getItem("potionDatabase")) || [];
}

function savePotionsToStorage(potions) {
  localStorage.setItem("potionDatabase", JSON.stringify(potions));
}

function getPotionIngredientKey(potion) {
  return [...potion.ingredients]
    .map(name => name.toLowerCase().trim())
    .sort()
    .join("|");
}

function updateExportButtonText() {
  const selectedCount = document.querySelectorAll(".export-checkbox:checked").length;

  exportPotionsBtn.innerText = selectedCount > 0
    ? `Export Selected (${selectedCount})`
    : "Export All";
}

function savePotion() {
  const potion = getCurrentPotionData();

  if (!potion) {
    alert("Select at least 2 ingredients with shared effects before saving.");
    return;
  }

  const potions = getSavedPotions();
  potions.unshift(potion);

  savePotionsToStorage(potions);

  ing1Input.value = "";
  ing2Input.value = "";
  ing3Input.value = "";
  potionNotesInput.value = "";

  hideAllDropdowns();
  updateResults();
  renderPotionDatabase();
}

function deletePotion(potionId) {
  const potions = getSavedPotions().filter(potion => potion.id !== potionId);

  savePotionsToStorage(potions);
  renderPotionDatabase();
}

function toggleFavorite(potionId) {
  const potions = getSavedPotions();

  const updatedPotions = potions.map(potion => {
    if (potion.id === potionId) {
      return {
        ...potion,
        favorite: !potion.favorite
      };
    }

    return potion;
  });

  savePotionsToStorage(updatedPotions);
  renderPotionDatabase();
}

function getSelectedPotionIds() {
  return Array.from(document.querySelectorAll(".export-checkbox:checked"))
    .map(cb => Number(cb.dataset.id));
}

function exportPotionsJSON() {
  const allPotions = getSavedPotions();

  if (allPotions.length === 0) {
    alert("No saved potions to export.");
    return;
  }

  const selectedIds = getSelectedPotionIds();

  // If none selected → export all (safe fallback)
  const potionsToExport = selectedIds.length > 0
    ? allPotions.filter(p => selectedIds.includes(p.id))
    : allPotions;

  if (potionsToExport.length === 0) {
    alert("No potions selected for export.");
    return;
  }

  const fileNameInput = prompt("Enter a name for your export file:", "rudys-alchemy-ledger");

  if (!fileNameInput) return;

  const exportData = {
    app: "Rudy's Alchemy Ledger",
    version: 1,
    exportedAt: new Date().toISOString(),
    count: potionsToExport.length,
    potions: potionsToExport
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileNameInput}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function normalizeImportedPotion(potion) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000000),
    name: potion.name || "Unnamed Potion",
    type: potion.type === "Poison" ? "Poison" : "Potion",
    ingredients: Array.isArray(potion.ingredients) ? potion.ingredients : [],
    effects: Array.isArray(potion.effects) ? potion.effects : [],
    notes: potion.notes || "",
    favorite: Boolean(potion.favorite)
  };
}

function importPotionsJSON(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!importedData.potions || !Array.isArray(importedData.potions)) {
        alert("Invalid potion file. Could not find a potions list.");
        return;
      }

      const currentPotions = getSavedPotions();

      const existingIngredientKeys = currentPotions.map(getPotionIngredientKey);

      const importedPotions = importedData.potions
        .map(normalizeImportedPotion)
        .filter(potion => {
          const ingredientKey = getPotionIngredientKey(potion);
          return !existingIngredientKeys.includes(ingredientKey);
        });

      const skippedCount = importedData.potions.length - importedPotions.length;
      const updatedPotions = [...importedPotions, ...currentPotions];

      savePotionsToStorage(updatedPotions);
      renderPotionDatabase();
      updateExportButtonText();

      alert(`${importedPotions.length} potions imported successfully. ${skippedCount} duplicate(s) skipped.`);
    } catch (error) {
      alert("Could not import this JSON file.");
      console.error(error);
    }

    event.target.value = "";
  };

  reader.readAsText(file);
}

function renderPotionDatabase() {
  let potions = getSavedPotions();

  const searchText = potionDatabaseSearch.value.toLowerCase();
  const filterType = potionDatabaseFilter.value;

  if (filterType === "favorites") {
    potions = potions.filter(potion => potion.favorite);
  } else if (filterType !== "all") {
    potions = potions.filter(potion => potion.type === filterType);
  }

  if (searchText) {
    potions = potions.filter(potion =>
      potion.name.toLowerCase().includes(searchText) ||
      potion.ingredients.join(" ").toLowerCase().includes(searchText) ||
      potion.effects.join(" ").toLowerCase().includes(searchText) ||
      potion.notes.toLowerCase().includes(searchText)
    );
  }

  if (potions.length === 0) {
    potionDatabaseList.innerText = "No matching potions found.";
    return;
  }

  potionDatabaseList.innerHTML = potions.map(potion => `
    <div class="database-potion ${potion.type.toLowerCase()} ${potion.favorite ? "favorited" : ""}">

      <div class="database-header">

        <input 
          type="checkbox" 
          class="export-checkbox" 
          data-id="${potion.id}"
          title="Select for export"
        >

        <h3>${potion.name}</h3>

        <button 
          class="favorite-btn ${potion.favorite ? "favorited" : ""}" 
          onclick="toggleFavorite(${potion.id})"
        >
          ${potion.favorite ? "★" : "☆"}
        </button>

      </div>

      <div class="database-body">

        <p class="database-ingredients">
          <strong>Ingredients:</strong> ${potion.ingredients.join(", ")}
        </p>

        ${potion.notes ? `
          <p class="database-notes">
            <strong>Notes:</strong> ${potion.notes}
          </p>
        ` : ""}

        <button 
          class="delete-btn" 
          onclick="deletePotion(${potion.id})"
        >
          Delete
        </button>

      </div>

    </div>
  `).join("");

    document.querySelectorAll(".export-checkbox").forEach(checkbox => {
      checkbox.addEventListener("change", updateExportButtonText);
    });

    updateExportButtonText();
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

  const ingredientList = matches
    .map(ingredient => {
      const cleanName = ingredient.name.replace(/\s*\(.*?\)\s*/g, "");
      const cleanId = ingredient.id.split("_").pop().toUpperCase();

      return `
        <div class="effect-ingredient-item">
          <div class="effect-ingredient-name">${cleanName}</div>
          <div class="effect-ingredient-meta">ID: ${cleanId}</div>
        </div>
      `;
    })
    .join("");

  effectResults.innerHTML = `
    <p class="result-count">${matches.length} ingredients found</p>
    <div class="effect-ingredient-list">
      ${ingredientList}
    </div>
  `;
}

function updateIngredientLookupResults() {
  const selectedIngredient = getIngredientByName(ingredientLookupInput.value);

  if (!selectedIngredient) {
    ingredientLookupResults.innerHTML = `
      <div class="ingredient-stats">
        <span><strong>Weight:</strong> —</span>
        <span><strong>Value:</strong> —</span>
      </div>

      <div class="ingredient-effects">
        <div class="effect-item">
          <div class="effect-name">Effect 1</div>
          <div class="effect-meta">Mag: — | Dur: —</div>
        </div>

        <div class="effect-item">
          <div class="effect-name">Effect 2</div>
          <div class="effect-meta">Mag: — | Dur: —</div>
        </div>

        <div class="effect-item">
          <div class="effect-name">Effect 3</div>
          <div class="effect-meta">Mag: — | Dur: —</div>
        </div>

        <div class="effect-item">
          <div class="effect-name">Effect 4</div>
          <div class="effect-meta">Mag: — | Dur: —</div>
        </div>
      </div>
    `;
    return;
  }

  const effectList = selectedIngredient.effectDetails
    .sort((a, b) => a.order - b.order)
    .map(effect => `
      <div class="effect-item">
        <div class="effect-name">${effect.effectName}</div>
        <div class="effect-meta">Mag: ${effect.magnitude} | Dur: ${effect.duration}</div>
      </div>
    `)
    .join("");

  ingredientLookupResults.innerHTML = `
    <div class="ingredient-stats">
      <span><strong>Weight:</strong> ${selectedIngredient.weight}</span>
      <span><strong>Value:</strong> ${selectedIngredient.value}</span>
    </div>

    <div class="ingredient-effects">
      ${effectList}
    </div>
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

ing1Input.addEventListener("click", event => {
  event.stopPropagation();

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

ing2Input.addEventListener("click", event => {
  event.stopPropagation();

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

ing3Input.addEventListener("click", event => {
  event.stopPropagation();

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

effectSearchInput.addEventListener("click", event => {
  event.stopPropagation();

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

ingredientLookupInput.addEventListener("click", event => {
  event.stopPropagation();

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

// Keyboard controls
ing1Input.addEventListener("keydown", event => {
  handleDropdownKeyboard(event, ing1Input, ing1Dropdown);
});

ing2Input.addEventListener("keydown", event => {
  handleDropdownKeyboard(event, ing2Input, ing2Dropdown);
});

ing3Input.addEventListener("keydown", event => {
  handleDropdownKeyboard(event, ing3Input, ing3Dropdown);
});

effectSearchInput.addEventListener("keydown", event => {
  handleDropdownKeyboard(event, effectSearchInput, effectDropdown);
});

ingredientLookupInput.addEventListener("keydown", event => {
  handleDropdownKeyboard(event, ingredientLookupInput, ingredientLookupDropdown);
});

// Main controls
savePotionBtn.addEventListener("click", savePotion);

potionDatabaseSearch.addEventListener("input", renderPotionDatabase);
potionDatabaseFilter.addEventListener("change", renderPotionDatabase);

exportPotionsBtn.addEventListener("click", exportPotionsJSON);
importPotionsInput.addEventListener("change", importPotionsJSON);

// Close custom dropdowns when clicking outside of them
document.addEventListener("click", function(event) {
  document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
    if (!dropdown.contains(event.target)) {
      const menu = dropdown.querySelector(".dropdown-list");

      if (menu) {
        menu.style.display = "none";
      }
    }
  });
});

// Initial page text
updateResults();
updateEffectResults();
updateIngredientLookupResults();
renderPotionDatabase();
updateExportButtonText();