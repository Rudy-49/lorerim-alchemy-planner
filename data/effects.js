const effects = [
  {
    "id": "beast_form",
    "name": "Beast Form",
    "formId": "00092C45",
    "type": "positive"
  },
  {
    "id": "cure_disease",
    "name": "Cure Disease",
    "formId": "000AE722",
    "type": "positive"
  },
  {
    "id": "cure_poison",
    "name": "Cure Poison",
    "formId": "00109ADD",
    "type": "positive"
  },
  {
    "id": "damage_health",
    "name": "Damage Health",
    "formId": "0003EB42",
    "type": "negative"
  },
  {
    "id": "damage_magicka",
    "name": "Damage Magicka",
    "formId": "0003A2B6",
    "type": "negative"
  },
  {
    "id": "damage_magicka_regen",
    "name": "Damage Magicka Regen",
    "formId": "00073F2B",
    "type": "negative"
  },
  {
    "id": "damage_magicka_regeneration",
    "name": "Damage Magicka Regeneration",
    "formId": "00073F2B",
    "type": "negative"
  },
  {
    "id": "damage_maximum_health",
    "name": "Damage Maximum Health",
    "formId": "00073F26",
    "type": "negative"
  },
  {
    "id": "damage_maximum_magicka",
    "name": "Damage Maximum Magicka",
    "formId": "00073F27",
    "type": "negative"
  },
  {
    "id": "damage_maximum_stamina",
    "name": "Damage Maximum Stamina",
    "formId": "00073F23",
    "type": "negative"
  },
  {
    "id": "damage_stamina",
    "name": "Damage Stamina",
    "formId": "0003A2C6",
    "type": "negative"
  },
  {
    "id": "damage_stamina_regen",
    "name": "Damage Stamina Regen",
    "formId": "00073F2C",
    "type": "negative"
  },
  {
    "id": "damage_stamina_regeneration",
    "name": "Damage Stamina Regeneration",
    "formId": "00073F2C",
    "type": "negative"
  },
  {
    "id": "damage_strength",
    "name": "Damage Strength",
    "formId": "FE6B4816",
    "type": "negative"
  },
  {
    "id": "dispel",
    "name": "Dispel",
    "formId": "8AAD3A55",
    "type": "positive"
  },
  {
    "id": "drugged",
    "name": "Drugged",
    "formId": "FE759819",
    "type": "positive"
  },
  {
    "id": "fear",
    "name": "Fear",
    "formId": "00073F20",
    "type": "negative"
  },
  {
    "id": "fortify_alteration",
    "name": "Fortify Alteration",
    "formId": "0003EB24",
    "type": "positive"
  },
  {
    "id": "fortify_armor_rating",
    "name": "Fortify Armor Rating",
    "formId": "0003EB1E",
    "type": "positive"
  },
  {
    "id": "fortify_barter",
    "name": "Fortify Barter",
    "formId": "0003EB23",
    "type": "positive"
  },
  {
    "id": "fortify_block",
    "name": "Fortify Block",
    "formId": "0003EB1C",
    "type": "positive"
  },
  {
    "id": "fortify_carry_weight",
    "name": "Fortify Carry Weight",
    "formId": "0003EB01",
    "type": "positive"
  },
  {
    "id": "fortify_conjuration",
    "name": "Fortify Conjuration",
    "formId": "0003EB25",
    "type": "positive"
  },
  {
    "id": "fortify_destruction",
    "name": "Fortify Destruction",
    "formId": "0003EB26",
    "type": "positive"
  },
  {
    "id": "fortify_enchanting",
    "name": "Fortify Enchanting",
    "formId": "0003EB29",
    "type": "positive"
  },
  {
    "id": "fortify_health",
    "name": "Fortify Health",
    "formId": "0003EAF3",
    "type": "positive"
  },
  {
    "id": "fortify_health_regeneration",
    "name": "Fortify Health Regeneration",
    "formId": "0003EB06",
    "type": "positive"
  },
  {
    "id": "fortify_illusion",
    "name": "Fortify Illusion",
    "formId": "0003EB27",
    "type": "positive"
  },
  {
    "id": "fortify_jump",
    "name": "Fortify Jump",
    "formId": "0003EB29",
    "type": "positive"
  },
  {
    "id": "fortify_lockpicking",
    "name": "Fortify Lockpicking",
    "formId": "0003EB21",
    "type": "positive"
  },
  {
    "id": "fortify_magicka",
    "name": "Fortify Magicka",
    "formId": "0003EAF8",
    "type": "positive"
  },
  {
    "id": "fortify_magicka_regeneration",
    "name": "Fortify Magicka Regeneration",
    "formId": "0003EB07",
    "type": "positive"
  },
  {
    "id": "fortify_marksman",
    "name": "Fortify Marksman",
    "formId": "0003EB1B",
    "type": "positive"
  },
  {
    "id": "fortify_one_handed",
    "name": "Fortify One-Handed",
    "formId": "0003EB19",
    "type": "positive"
  },
  {
    "id": "fortify_pickpocket",
    "name": "Fortify Pickpocket",
    "formId": "0003EB20",
    "type": "positive"
  },
  {
    "id": "fortify_restoration",
    "name": "Fortify Restoration",
    "formId": "0003EB28",
    "type": "positive"
  },
  {
    "id": "fortify_smithing",
    "name": "Fortify Smithing",
    "formId": "0003EB1D",
    "type": "positive"
  },
  {
    "id": "fortify_sneak",
    "name": "Fortify Sneak",
    "formId": "0003EB22",
    "type": "positive"
  },
  {
    "id": "fortify_speech",
    "name": "Fortify Speech",
    "formId": "000D6947",
    "type": "positive"
  },
  {
    "id": "fortify_speed",
    "name": "Fortify Speed",
    "formId": "0003EB1F",
    "type": "positive"
  },
  {
    "id": "fortify_stamina",
    "name": "Fortify Stamina",
    "formId": "0003EAF9",
    "type": "positive"
  },
  {
    "id": "fortify_stamina_regeneration",
    "name": "Fortify Stamina Regeneration",
    "formId": "0003EB08",
    "type": "positive"
  },
  {
    "id": "fortify_two_handed",
    "name": "Fortify Two-Handed",
    "formId": "0003EB1A",
    "type": "positive"
  },
  {
    "id": "fortify_unarmed",
    "name": "Fortify Unarmed",
    "formId": "8A020E2B",
    "type": "positive"
  },
  {
    "id": "frenzy",
    "name": "Frenzy",
    "formId": "00073F29",
    "type": "negative"
  },
  {
    "id": "invisibility",
    "name": "Invisibility",
    "formId": "0003EB3D",
    "type": "positive"
  },
  {
    "id": "lesser_corpus",
    "name": "Lesser Corpus",
    "formId": "8F173397",
    "type": "positive"
  },
  {
    "id": "light",
    "name": "Light",
    "formId": "FE016846",
    "type": "positive"
  },
  {
    "id": "lingering_damage_health",
    "name": "Lingering Damage Health",
    "formId": "0010AA4A",
    "type": "negative"
  },
  {
    "id": "lingering_damage_magicka",
    "name": "Lingering Damage Magicka",
    "formId": "0010DE5F",
    "type": "negative"
  },
  {
    "id": "lingering_damage_stamina",
    "name": "Lingering Damage Stamina",
    "formId": "0010DE5E",
    "type": "negative"
  },
  {
    "id": "moon_sugar",
    "name": "Moon Sugar",
    "formId": "3522EEE8",
    "type": "positive"
  },
  {
    "id": "night_eye",
    "name": "Night Eye",
    "formId": "0006B10C",
    "type": "positive"
  },
  {
    "id": "paralysis",
    "name": "Paralysis",
    "formId": "00073F30",
    "type": "negative"
  },
  {
    "id": "profane_divinity",
    "name": "Profane Divinity",
    "formId": "8F64E168",
    "type": "positive"
  },
  {
    "id": "ravage_magicka",
    "name": "Ravage Magicka",
    "formId": "00073F27",
    "type": "positive"
  },
  {
    "id": "reflect_damage",
    "name": "Reflect Damage",
    "formId": "0003EB1D",
    "type": "positive"
  },
  {
    "id": "regenerate_magicka",
    "name": "Regenerate Magicka",
    "formId": "0003EB07",
    "type": "positive"
  },
  {
    "id": "regenerate_stamina",
    "name": "Regenerate Stamina",
    "formId": "0003EB08",
    "type": "positive"
  },
  {
    "id": "resist_fall_damage",
    "name": "Resist Fall Damage",
    "formId": "FE7CEA36",
    "type": "negative"
  },
  {
    "id": "resist_fire",
    "name": "Resist Fire",
    "formId": "0003EAEA",
    "type": "positive"
  },
  {
    "id": "resist_frost",
    "name": "Resist Frost",
    "formId": "0003EAEB",
    "type": "positive"
  },
  {
    "id": "resist_magic",
    "name": "Resist Magic",
    "formId": "00039E51",
    "type": "positive"
  },
  {
    "id": "resist_poison",
    "name": "Resist Poison",
    "formId": "00090041",
    "type": "positive"
  },
  {
    "id": "resist_shock",
    "name": "Resist Shock",
    "formId": "0003EAEC",
    "type": "positive"
  },
  {
    "id": "restore_health",
    "name": "Restore Health",
    "formId": "0003EB15",
    "type": "positive"
  },
  {
    "id": "restore_magicka",
    "name": "Restore Magicka",
    "formId": "0003EB17",
    "type": "positive"
  },
  {
    "id": "restore_stamina",
    "name": "Restore Stamina",
    "formId": "0003EB16",
    "type": "positive"
  },
  {
    "id": "sanguinare_vampiris",
    "name": "Sanguinare Vampiris",
    "formId": "8A4F6D1D",
    "type": "positive"
  },
  {
    "id": "silence",
    "name": "Silence",
    "formId": "FE6B4815",
    "type": "positive"
  },
  {
    "id": "slow",
    "name": "Slow",
    "formId": "00073F25",
    "type": "negative"
  },
  {
    "id": "soul_trap",
    "name": "Soul Trap",
    "formId": "8A20B30F",
    "type": "positive"
  },
  {
    "id": "spell_absorption",
    "name": "Spell Absorption",
    "formId": "FE016812",
    "type": "positive"
  },
  {
    "id": "tardiness",
    "name": "Tardiness",
    "formId": "00073F25",
    "type": "negative"
  },
  {
    "id": "waterbreathing",
    "name": "Waterbreathing",
    "formId": "0003AC2D",
    "type": "positive"
  },
  {
    "id": "waterwalking",
    "name": "Waterwalking",
    "formId": "040390E1",
    "type": "positive"
  },
  {
    "id": "weakness_to_fire",
    "name": "Weakness to Fire",
    "formId": "00073F2D",
    "type": "negative"
  },
  {
    "id": "weakness_to_frost",
    "name": "Weakness to Frost",
    "formId": "00073F2E",
    "type": "negative"
  },
  {
    "id": "weakness_to_magic",
    "name": "Weakness to Magic",
    "formId": "00073F51",
    "type": "negative"
  },
  {
    "id": "weakness_to_poison",
    "name": "Weakness to Poison",
    "formId": "00090042",
    "type": "negative"
  },
  {
    "id": "weakness_to_shock",
    "name": "Weakness to Shock",
    "formId": "00073F2F",
    "type": "negative"
  }
];