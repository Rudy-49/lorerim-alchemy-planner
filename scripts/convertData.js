const fs = require("fs");

// paste your CSV into a file called data.csv
const raw = fs.readFileSync("data.csv", "utf-8");

const lines = raw.split("\n").slice(1); // skip header

const ingredientsMap = {};
const effectsMap = {};

lines.forEach(line => {
  if (!line.trim()) return;

  const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

const [
  baseIngredientId,
  ingredientName,
  ingredientFormId,
  effectId,
  effectName,
  effectFormId,
  effectType
] = parts.map(p => p.replace(/"/g, "").trim());

// make ingredient ID unique using FormID
const ingredientId = `${baseIngredientId}_${ingredientFormId.toLowerCase()}`;

  // build ingredients
if (!ingredientsMap[ingredientId]) {
  ingredientsMap[ingredientId] = {
    id: ingredientId,
    name: `${ingredientName} (${ingredientFormId})`, // helps differentiate duplicates
    effects: []
  };
}

  if (!ingredientsMap[ingredientId].effects.includes(effectId)) {
    ingredientsMap[ingredientId].effects.push(effectId);
  }

  // build effects
  if (!effectsMap[effectId]) {
    effectsMap[effectId] = {
      id: effectId,
      name: effectName,
      type: effectType
    };
  }
});

// convert to arrays
const ingredients = Object.values(ingredientsMap);
const effects = Object.values(effectsMap);

// write files
fs.writeFileSync(
  "ingredients.js",
  "const ingredients = " + JSON.stringify(ingredients, null, 2)
);

fs.writeFileSync(
  "effects.js",
  "const effects = " + JSON.stringify(effects, null, 2)
);

console.log("Done!");