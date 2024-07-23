// Global variables
var PartyLevel = 6;

// PartyStats
var PartyStatsDictionary = {
  Doris: {
    Strength: 8,
    StrMod: -1,
    Dexterity: 14,
    DexMod: 2,
    Constitution: 12,
    ConMod: 1,
    Intelligence: 14,
    IntMod: 2,
    Wisdom: 10,
    WisMod: 0,
    Charisma: 17,
    ChaMod: 3,
    HPStart: 8,
    HPGainperLevel: 5,
    HP: '',
    AC: 14,
    SpellAttack: ' ',
    SpellSave: ' ',
    SpellCastMod: ''
  },
  Faelar: {
    Strength: 14,
    StrMod: 2,
    Dexterity: 10,
    DexMod: 0,
    Constitution: 14,
    ConMod: 2,
    Intelligence: 12,
    IntMod: 1,
    Wisdom: 16,
    WisMod: 3,
    Charisma: 10,
    ChaMod: 0,
    HPStart: 8,
    HPGainperLevel: 5,
    HP: '',
    AC: 19,
    SpellAttack: '',
    SpellSave: '',
    SpellCastMod: ''
  },
  Kandryn: {
    Strength: 10,
    StrMod: 0,
    Dexterity: 16,
    DexMod: 3,
    Constitution: 14,
    ConMod: 2,
    Intelligence: 17,
    IntMod: 3,
    Wisdom: 13,
    WisMod: 1,
    Charisma: 13,
    ChaMod: 1,
    HPStart: 6,
    HPGainperLevel: 4,
    HP: '',
    AC: 13,
    SpellAttack: '',
    SpellSave: '',
    SpellCastMod: ''
  },
  Eiran: {
    Strength: 12,
    StrMod: 1,
    Dexterity: 16,
    DexMod: 3,
    Constitution: 15,
    ConMod: 2,
    Intelligence: 8,
    IntMod: -1,
    Wisdom: 13,
    WisMod: 1,
    Charisma: 13,
    ChaMod: 1,
    HPStart: 10,
    HPGainperLevel: 6,
    HP: '',
    AC: 16,
    SpellAttack: '',
    SpellSave: '',
    SpellCastMod: ''
  },
};

// Character Proficiency Listing
var charProfBonusesDictionary = {
  Doris: { Acrobatics: 1, "Animal Handling": 0.5, Arcana: 0.5, Athletics: 0.5, Deception: 2, History: 0.5,
    Insight: 1, Intimidation: 0.5, Investigation: 0.5, Medicine: 1, Nature: 0.5, Perception: 0.5, 
    Performance: 1, Persuasion: 2, Religion: 0.5, "Sleight of Hand": 1, Stealth: 1, Survival: 0.5
  },
  Faelar: {Acrobatics: 0, "Animal Handling": 0, Arcana: 1, Athletics: 0, Deception:0, History:1,
    Insight:1, Intimidation:0, Investigation:1, Medicine:1, Nature: 1, Perception: 1, 
    Performance: 0, Persuasion: 0, Religion: 1, "Sleight of Hand": 0, Stealth: 0, Survival: 0
  },
  Kandryn: {Acrobatics: 0, "Animal Handling": 0, Arcana: 1, Athletics: 0, Deception:0, History:1,
    Insight:1, Intimidation:0, Investigation:1, Medicine:0, Nature: 0, Perception: 1, 
    Performance: 0, Persuasion: 0, Religion: 0, "Sleight of Hand": 0, Stealth: 0, Survival: 0
  },
  Eiran: {Acrobatics: 0, "Animal Handling": 1, Arcana: 1, Athletics: 1, Deception:0, History:0,
    Insight:0, Intimidation:0, Investigation:1, Medicine:0, Nature: 0, Perception: 0, 
    Performance: 0, Persuasion: 0, Religion: 1, "Sleight of Hand": 0, Stealth: 1, Survival: 1
  }
};

// Proficiency Bonus Listing
var levelProfBonuses = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6
};

// Bonuses Listing
  // #region Bonuses Listing Region
var charBonusesDictionary = {
  Doris: {
    MeleeAttackBonus: '',
    RangedAttackBonus: '',
    SpellAttackBonus: '',
    SpellSaveBonus: 2
  },
  Faelar: {
    MeleeAttackBonus: 1,
    RangedAttackBonus: '',
    SpellAttackBonus: '',
    SpellSaveBonus: 2
  },
  Kandryn: {
    MeleeAttackBonus: '',
    RangedAttackBonus: '',
    SpellAttackBonus: 2,
    SpellSaveBonus: ''
  },
  Eiran: {
    MeleeAttackBonus: 1,
    RangedAttackBonus: 2,
    SpellAttackBonus: '',
    SpellSaveBonus: ''
  }
};
// #endregion

function calculateSkills(character) {
  // Calculate Skills
  return {
    Acrobatics: PartyStatsDictionary[character].DexMod + Math.floor(charProfBonusesDictionary[character].Acrobatics) * 
    levelProfBonuses[PartyLevel],
    "Animal Handling": PartyStatsDictionary[character].WisMod + Math.floor(charProfBonusesDictionary[character]["Animal Handling"]) * 
    levelProfBonuses[PartyLevel],
    Arcana: PartyStatsDictionary[character].IntMod + Math.floor(charProfBonusesDictionary[character].Arcana) * 
    levelProfBonuses[PartyLevel],
    Athletics: PartyStatsDictionary[character].StrMod + Math.floor(charProfBonusesDictionary[character].Athletics) * 
    levelProfBonuses[PartyLevel],
    Deception: PartyStatsDictionary[character].ChaMod + Math.floor(charProfBonusesDictionary[character].Deception) * 
    levelProfBonuses[PartyLevel],
    History: PartyStatsDictionary[character].IntMod + Math.floor(charProfBonusesDictionary[character].History) * 
    levelProfBonuses[PartyLevel],
    Insight: PartyStatsDictionary[character].WisMod + Math.floor(charProfBonusesDictionary[character].Insight) * 
    levelProfBonuses[PartyLevel],
    Intimidation: PartyStatsDictionary[character].StrMod + Math.floor(charProfBonusesDictionary[character].Intimidation) * 
    levelProfBonuses[PartyLevel],
    Investigation: PartyStatsDictionary[character].IntMod + Math.floor(charProfBonusesDictionary[character].Investigation) * 
    levelProfBonuses[PartyLevel],
    Medicine: PartyStatsDictionary[character].WisMod + Math.floor(charProfBonusesDictionary[character].Medicine) * 
    levelProfBonuses[PartyLevel],
    Nature: PartyStatsDictionary[character].IntMod + Math.floor(charProfBonusesDictionary[character].Nature) * 
    levelProfBonuses[PartyLevel],
    Perception: PartyStatsDictionary[character].WisMod + Math.floor(charProfBonusesDictionary[character].Perception) * 
    levelProfBonuses[PartyLevel],
    Performance: PartyStatsDictionary[character].ChaMod + Math.floor(charProfBonusesDictionary[character].Performance) * 
    levelProfBonuses[PartyLevel],
    Persuasion: PartyStatsDictionary[character].ChaMod + Math.floor(charProfBonusesDictionary[character].Persuasion) * 
    levelProfBonuses[PartyLevel],
    Religion: PartyStatsDictionary[character].IntMod + Math.floor(charProfBonusesDictionary[character].Religion) * 
    levelProfBonuses[PartyLevel],
    "Sleight of Hand": PartyStatsDictionary[character].DexMod + Math.floor(charProfBonusesDictionary[character]["Sleight of Hand"]) * 
    levelProfBonuses[PartyLevel],
    Stealth: PartyStatsDictionary[character].DexMod + Math.floor(charProfBonusesDictionary[character].Stealth) * 
    levelProfBonuses[PartyLevel],
    Survival: PartyStatsDictionary[character].WisMod + Math.floor(charProfBonusesDictionary[character].Survival) * 
    levelProfBonuses[PartyLevel]
  };
}

function calculateHP(character) {
  // Calculate HP
  return PartyStatsDictionary[character].HPStart + PartyStatsDictionary[character].ConMod + 
    (PartyLevel-1)*(PartyStatsDictionary[character].HPGainperLevel + 
      PartyStatsDictionary[character].ConMod);
}

function calculateSpellSave(character) {
  // Calculate SpellSave
  return  8 + PartyStatsDictionary[character].SpellCastMod + 
    levelProfBonuses[PartyLevel] + charBonusesDictionary[character].SpellSaveBonus;
}

function updateSheet() {
  var characters = ["Doris", "Faelar", "Kandryn", "Eiran"];

  PartyStatsDictionary.Doris.SpellCastMod = PartyStatsDictionary.Doris.ChaMod;
  PartyStatsDictionary.Faelar.SpellCastMod = PartyStatsDictionary.Faelar.WisMod;
  PartyStatsDictionary.Kandryn.SpellCastMod = PartyStatsDictionary.Kandryn.IntMod;
  PartyStatsDictionary.Eiran.SpellCastMod = PartyStatsDictionary.Eiran.WisMod;

  // Loop through each character and update
  characters.forEach(function(character) {
    var skills = calculateSkills(character);
    PartyStatsDictionary[character].HP = calculateHP(character);
    PartyStatsDictionary[character].SpellSave = calculateSpellSave(character);

    // Loop through each skill and update the HTML elements
    for (var skill in skills) {
      if (skills.hasOwnProperty(skill)) {
        var elementId = character.toLowerCase() + '-' + skill.toLowerCase().replace(/ /g, '-'); // Create the ID
        var element = document.getElementById(elementId);
        if (element) {
          element.innerText = skills[skill];
        }
      }
    }

    document.getElementById(character.toLowerCase() + "-ac").innerText = PartyStatsDictionary[character].AC;
    document.getElementById(character.toLowerCase() + "-spellsave").innerText = PartyStatsDictionary[character].SpellSave;
    document.getElementById(character.toLowerCase() + "-hp").innerText = PartyStatsDictionary[character].HP;

    document.getElementById(character.toLowerCase() + "-passiveperc").innerText = 10 + skills.Perception;
    document.getElementById(character.toLowerCase() + "-passiveins").innerText = 10 + skills.Insight;

  });

  document.getElementById("party-level").innerText = PartyLevel;
  document.getElementById("prof-bonus").innerText = levelProfBonuses[PartyLevel];

  document.getElementById("doris-note").innerText = "Reveller's Concertina +2 SpellSave";
  document.getElementById("faelar-note").innerText = "Book of Martial Techniques +1, Stone of Good Luck on saving throws and abilities";
  document.getElementById("kandryn-note").innerText = "Wizardry Hat + SpellAttacks";
  document.getElementById("eiran-note").innerText = "Great Scythe + 1";
}

function updatePartyLevel() {
  document.getElementById("party-level").innerText = PartyLevel;
}

window.onload = updateSheet;
window.onload = updatePartyLevel;
