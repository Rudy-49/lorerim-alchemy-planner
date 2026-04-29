const ing1Select = document.getElementById("ingredient1");
const ing2Select = document.getElementById("ingredient2");
const results = document.getElementById("results");

function getIngredientById(id) {
  return ingredients.find(ingredient => ingredient.id === id);
}

function populateIngredient1() {
  ing1Select.innerHTML = "";

  ingredients.forEach(ingredient => {
    const option = new Option(ingredient.name, ingredient.id);
    ing1Select.add(option);
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
    const option = new Option(ingredient.name, ingredient.id);
    ing2Select.add(option);
  });
}

function updateResults() {
  const ing1 = getIngredientById(ing1Select.value);
  const ing2 = getIngredientById(ing2Select.value);

  if (!ing1 || !ing2) {
    results.innerText = "Shared Effects: None";
    return;
  }

  const sharedEffects = getSharedEffects(ing1, ing2);

  if (sharedEffects.length === 0) {
    results.innerText = "Shared Effects: None";
  } else {
    results.innerText = "Shared Effects: " + sharedEffects.join(", ");
  }
}

function handleIngredient1Change() {
  populateIngredient2();
  updateResults();
}

ing1Select.addEventListener("change", handleIngredient1Change);
ing2Select.addEventListener("change", updateResults);

populateIngredient1();
populateIngredient2();
updateResults();