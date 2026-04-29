const ingredients = [
  {
    id: "blue_mountain_flower",
    name: "Blue Mountain Flower",
    effects: ["restore_health", "fortify_health"]
  },
  {
    id: "wheat",
    name: "Wheat",
    effects: ["restore_health", "fortify_health"]
  },
  {
    id: "giants_toe",
    name: "Giant's Toe",
    effects: ["fortify_health", "damage_stamina"]
  },

  // 🔥 shares only ONE effect with Blue Mountain Flower
  {
    id: "hanging_moss",
    name: "Hanging Moss",
    effects: ["fortify_health", "damage_magicka"]
  },

  // ❌ shares NOTHING with the above
  {
    id: "void_salts",
    name: "Void Salts",
    effects: ["fortify_magicka", "resist_magic"]
  },

  // ❌ shares NOTHING with anyone
  {
    id: "daedra_heart",
    name: "Daedra Heart",
    effects: ["fear", "damage_health"]
  }
];