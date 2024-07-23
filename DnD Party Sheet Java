// Global variables
var PartyLevel = 6;
var PartyNumbers = 4;
var XPSoFar = 0;

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
    Dexterity: 10,
    Constitution: 14,
    Intelligence: 12,
    Wisdom: 16,
    Charisma: 10,
    HPStart: 8,
    HPGainperLevel: 5,
    HP: '',
    AC: 19,
    SpellAttack: '',
    SpellSave: ''
  },
  Kandryn: {
    Strength: 10,
    Dexterity: 16,
    Constitution: 14,
    Intelligence: 17,
    Wisdom: 13,
    Charisma: 13,
    HPStart: 6,
    HPGainperLevel: 4,
    HP: '',
    AC: 13,
    SpellAttack: '',
    SpellSave: ''
  },
  Eiran: {
    Strength: 12,
    Dexterity: 16,
    Constitution: 15,
    Intelligence: 8,
    Wisdom: 13,
    Charisma: 13,
    HPStart: 10,
    HPGainperLevel: 6,
    HP: '',
    AC: 16,
    SpellAttack: '',
    SpellSave: ''
  },
};

// Dictionary for proficiencies for each character
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

// Proficiency Bonuses: Level, Prof Bonus
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

// Calculate DorisSkills
var DorisSkills = {
  Acrobatics: PartyStatsDictionary.Doris.DexMod + Math.floor(charProfBonusesDictionary.Doris.Acrobatics) * levelProfBonuses[PartyLevel],
  "Animal Handling": PartyStatsDictionary.Doris.WisMod + Math.floor(charProfBonusesDictionary.Doris["Animal Handling"]) * levelProfBonuses[PartyLevel],
  Arcana: PartyStatsDictionary.Doris.IntMod + Math.floor(charProfBonusesDictionary.Doris.Arcana) * levelProfBonuses[PartyLevel],
  Athletics: PartyStatsDictionary.Doris.StrMod + Math.floor(charProfBonusesDictionary.Doris.Athletics) * levelProfBonuses[PartyLevel],
  Deception: PartyStatsDictionary.Doris.ChaMod + Math.floor(charProfBonusesDictionary.Doris.Deception) * levelProfBonuses[PartyLevel],
  History: PartyStatsDictionary.Doris.IntMod + Math.floor(charProfBonusesDictionary.Doris.History) * levelProfBonuses[PartyLevel],
  Insight: PartyStatsDictionary.Doris.WisMod + Math.floor(charProfBonusesDictionary.Doris.Insight) * levelProfBonuses[PartyLevel],
  Intimidation: PartyStatsDictionary.Doris.StrMod + Math.floor(charProfBonusesDictionary.Doris.Intimidation) * levelProfBonuses[PartyLevel],
  Investigation: PartyStatsDictionary.Doris.IntMod + Math.floor(charProfBonusesDictionary.Doris.Investigation) * levelProfBonuses[PartyLevel],
  Medicine: PartyStatsDictionary.Doris.WisMod + Math.floor(charProfBonusesDictionary.Doris.Medicine) * levelProfBonuses[PartyLevel],
  Nature: PartyStatsDictionary.Doris.IntMod + Math.floor(charProfBonusesDictionary.Doris.Nature) * levelProfBonuses[PartyLevel],
  Perception: PartyStatsDictionary.Doris.WisMod + Math.floor(charProfBonusesDictionary.Doris.Perception) * levelProfBonuses[PartyLevel],
  Performance: PartyStatsDictionary.Doris.ChaMod + Math.floor(charProfBonusesDictionary.Doris.Performance) * levelProfBonuses[PartyLevel],
  Persuasion: PartyStatsDictionary.Doris.ChaMod + Math.floor(charProfBonusesDictionary.Doris.Persuasion) * levelProfBonuses[PartyLevel],
  Religion: PartyStatsDictionary.Doris.IntMod + Math.floor(charProfBonusesDictionary.Doris.Religion) * levelProfBonuses[PartyLevel],
  "Sleight of Hand": PartyStatsDictionary.Doris.DexMod + Math.floor(charProfBonusesDictionary.Doris["Sleight of Hand"]) * levelProfBonuses[PartyLevel],
  Stealth: PartyStatsDictionary.Doris.DexMod + Math.floor(charProfBonusesDictionary.Doris.Stealth) * levelProfBonuses[PartyLevel],
  Survival: PartyStatsDictionary.Doris.WisMod + Math.floor(charProfBonusesDictionary.Doris.Survival) * levelProfBonuses[PartyLevel]
};


var DorisBonuses = {
  MeleeAttackBonus: '',
  RangedAttackBonus: '',
  SpellAttackBonus: '',
  SpellSaveBonus: 2
};


var combatEncounterDifficulty = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
};

// Multipliers: Number of monsters, x1 multiplier
var encounterMultipliers = [
  { monsters: 1, multiplier: 1 },
  { monsters: 2, multiplier: 1.5 },
  { monsters: 3, multiplier: 2 },
  { monsters: 4, multiplier: 2 },
  { monsters: 5, multiplier: 2 },
  { monsters: 6, multiplier: 2 },
  { monsters: 7, multiplier: 2.5 },
  { monsters: 8, multiplier: 2.5 },
  { monsters: 9, multiplier: 2.5 },
  { monsters: 10, multiplier: 2.5 },
  { monsters: 11, multiplier: 3 },
  { monsters: 12, multiplier: 3 },
  { monsters: 13, multiplier: 3 },
  { monsters: 14, multiplier: 3 },
  { monsters: 15, multiplier: 4 }
];

function updateSheet() {
  // Loop through DorisSkills and update the HTML elements
  
  for (var skill in DorisSkills) {

    if (DorisSkills.hasOwnProperty(skill)) {
      var elementId = 'doris-' + skill.toLowerCase().replace(/ /g, '-'); // Create the ID
      var element = document.getElementById(elementId);
      if (element) {
        element.innerText = DorisSkills[skill];
      }
    }
  }

  updateChars();

  document.getElementById("party-level").innerText = PartyLevel;

  document.getElementById("doris-passiveperc").innerText = 10 + DorisSkills.Perception;
  document.getElementById("doris-passiveins").innerText = 10 + DorisSkills.Insight;
  document.getElementById("doris-AC").innerText = PartyStatsDictionary.Doris.AC;
  document.getElementById("doris-spellsave").innerText = PartyStatsDictionary.Doris.SpellSave;
  document.getElementById("prof-bonus").innerText = levelProfBonuses[PartyLevel];
  document.getElementById("doris-note").innerText = "Reveller's Concertina +2 SpellSave";
  document.getElementById("doris-HP").innerText = PartyStatsDictionary.Doris.HP;
}

function updateChars() {
  PartyStatsDictionary.Doris.SpellCastMod = PartyStatsDictionary.Doris.ChaMod;
  PartyStatsDictionary.Doris.SpellSave = 8 + PartyStatsDictionary.Doris.SpellCastMod + 
  levelProfBonuses[PartyLevel] + DorisBonuses.SpellSaveBonus;
  PartyStatsDictionary.Doris.HP = PartyStatsDictionary.Doris.HPStart + PartyStatsDictionary.Doris.ConMod + 
  (PartyLevel-1)*(PartyStatsDictionary.Doris.HPGainperLevel + PartyStatsDictionary.Doris.ConMod);
};


window.onload = updateSheet;
