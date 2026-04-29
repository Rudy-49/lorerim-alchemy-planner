const fs = require("fs");

const raw = fs.readFileSync("data.csv", "utf-8");

const lines = raw.split(/\r?\n/);

if (lines[0] && lines[0].includes("ingredient_id")) {
  lines.shift();
}

const ingredientsMap = {};
const effectsMap = {};

lines.forEach(line => {
  if (!line.trim()) return;

  const parts = line
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map(p => p.replace(/"/g, "").trim());

  const [
    baseIngredientId,
    ingredientName,
    ingredientFormId,
    effectId,
    effectName,
    effectFormId,
    effectType,
    effectOrder,
    magnitude,
    duration,
    weight,
    value
  ] = parts;

  if (!baseIngredientId || !ingredientName || !ingredientFormId || !effectId) {
    console.log("Skipped bad row:", line);
    return;
  }

  const ingredientId = `${baseIngredientId}_${ingredientFormId.toLowerCase()}`;

  if (!ingredientsMap[ingredientId]) {
    ingredientsMap[ingredientId] = {
      id: ingredientId,
      name: `${ingredientName} (${ingredientFormId})`,
      baseName: ingredientName,
      formId: ingredientFormId,
      weight: Number(weight),
      value: Number(value),
      effects: [],
      effectDetails: []
    };
  }

  if (!ingredientsMap[ingredientId].effects.includes(effectId)) {
    ingredientsMap[ingredientId].effects.push(effectId);
  }

  ingredientsMap[ingredientId].effectDetails.push({
    effectId: effectId,
    effectName: effectName,
    effectType: effectType,
    magnitude: Number(magnitude),
    duration: Number(duration),
    order: Number(effectOrder)
  });

  if (!effectsMap[effectId]) {
    effectsMap[effectId] = {
      id: effectId,
      name: effectName,
      formId: effectFormId,
      type: effectType
    };
  }
});

const ingredients = Object.values(ingredientsMap).sort((a, b) =>
  a.baseName.localeCompare(b.baseName)
);

ingredients.forEach(ingredient => {
  ingredient.effects.sort((a, b) => a.localeCompare(b));

  ingredient.effectDetails.sort((a, b) => a.order - b.order);
});

const effects = Object.values(effectsMap).sort((a, b) =>
  a.name.localeCompare(b.name)
);

fs.writeFileSync(
  "ingredients.js",
  "const ingredients = " + JSON.stringify(ingredients, null, 2) + ";"
);

fs.writeFileSync(
  "effects.js",
  "const effects = " + JSON.stringify(effects, null, 2) + ";"
);

console.log("Done!");