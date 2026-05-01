const fs = require("fs");

// ===== FILES =====
const INGREDIENTS_FILE = "data/processed/ingredients.json";
const DUPES_FILE = "data/processed/duplicateReview.csv";
const OUTPUT = "data/processed/ingredients_clean.json";

// ===== LOAD DATA =====
const ingredients = JSON.parse(fs.readFileSync(INGREDIENTS_FILE, "utf-8"));
const dupeLines = fs.readFileSync(DUPES_FILE, "utf-8")
  .split(/\r?\n/)
  .filter(l => l.trim());

// remove header
dupeLines.shift();

// ===== PARSE CSV =====
function parse(line) {
  return line
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map(p => p.replace(/^"|"$/g, "").trim());
}

// ===== BUILD DELETE SET =====
const deleteSet = new Set();

dupeLines.forEach(line => {
  const parts = parse(line);

  const ingredientName = parts[0];
  const plugin = parts[1];
  const formId = parts[2];
  const action = parts[4];

  if (action === "DELETE") {
    const key = `${plugin}|${formId}`;
    deleteSet.add(key);
  }
});

// ===== FILTER INGREDIENTS =====
const cleaned = ingredients.filter(ing => {
  return !deleteSet.has(ing.identityKey);
});

// ===== SAVE =====
fs.writeFileSync(
  OUTPUT,
  JSON.stringify(cleaned, null, 2),
  "utf-8"
);

console.log("✅ Cleaned data created");
console.log(`Original: ${ingredients.length}`);
console.log(`Removed: ${deleteSet.size}`);
console.log(`Final: ${cleaned.length}`);