function getSharedEffects(ing1, ing2) {
  return ing1.effects.filter(effect =>
    ing2.effects.includes(effect)
  );
}