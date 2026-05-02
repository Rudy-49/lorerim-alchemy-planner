function getSavedPotions() {
  try {
    return JSON.parse(localStorage.getItem("potionDatabase")) || [];
  } catch {
    return [];
  }
}

function savePotionsToStorage(potions) {
  localStorage.setItem("potionDatabase", JSON.stringify(potions));
}