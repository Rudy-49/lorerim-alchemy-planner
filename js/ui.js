const ing1Select = document.getElementById("ingredient1");
const ing2Select = document.getElementById("ingredient2");
const results = document.getElementById("results");

// populate dropdowns
ingredients.forEach(ing => {
  let option1 = new Option(ing.name, ing.id);
  let option2 = new Option(ing.name, ing.id);

  ing1Select.add(option1);
  ing2Select.add(option2);
});

function updateResults() {
  const ing1 = ingredients.find(i => i.id === ing1Select.value);
  const ing2 = ingredients.find(i => i.id === ing2Select.value);

  if (!ing1 || !ing2) return;

  const shared = getSharedEffects(ing1, ing2);

  results.innerText = "Shared Effects: " + shared.join(", ");
}

ing1Select.addEventListener("change", updateResults);
ing2Select.addEventListener("change", updateResults);