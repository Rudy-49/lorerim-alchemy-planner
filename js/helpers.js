function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatIngredientNumber(value) {
  if (value === undefined || value === null || value === "") {
    return "Unknown";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return parseFloat(number.toFixed(4)).toString();
}

function getPotionIngredientKey(potion) {
  return [...potion.ingredients]
    .map(name => name.toLowerCase().trim())
    .sort()
    .join("|");
}