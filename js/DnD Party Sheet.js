// Global variables 

// #region Variable Region
var PartyLevel = 6;

var fireboltDamage = {
  // By level
  1: {dice:"1d10", damage: 5.5},
  2: {dice:"1d10", damage: 5.5},
  3: {dice:"1d10", damage: 5.5},
  4: {dice:"1d10", damage: 5.5},
  5: {dice:"2d10", damage: 11},
  6: {dice:"2d10", damage: 11},
  7: {dice:"2d10", damage: 11},
  8: {dice:"2d10", damage: 11},
  9: {dice:"2d10", damage: 11},
  10: {dice:"2d10", damage: 11},
  11: {dice:"3d10", damage: 16.5},
  12: {dice:"3d10", damage: 16.5},
  13: {dice:"3d10", damage: 16.5},
  14: {dice:"3d10", damage: 16.5},
  15: {dice:"3d10", damage: 16.5},
  16: {dice:"3d10", damage: 16.5},
  17: {dice:"4d10", damage: 22},
  18: {dice:"4d10", damage: 22},
  19: {dice:"4d10", damage: 22},
  20: {dice:"4d10", damage: 22},
};

var SacredFlameDamage = {
  // By level
  1: {dice:"1d8", damage: 4.5},
  2: {dice:"1d8", damage: 4.5},
  3: {dice:"1d8", damage: 4.5},
  4: {dice:"1d8", damage: 4.5},
  5: {dice:"2d8", damage: 9},
  6: {dice:"2d8", damage: 9},
  7: {dice:"2d8", damage: 9},
  8: {dice:"2d8", damage: 9},
  9: {dice:"2d8", damage: 9},
  10: {dice:"2d8", damage: 9},
  11: {dice:"3d8", damage: 13.5},
  12: {dice:"3d8", damage: 13.5},
  13: {dice:"3d8", damage: 13.5},
  14: {dice:"3d8", damage: 13.5},
  15: {dice:"3d8", damage: 13.5},
  16: {dice:"3d8", damage: 13.5},
  17: {dice:"4d8", damage: 18},
  18: {dice:"4d8", damage: 18},
  19: {dice:"4d8", damage: 18},
  20: {dice:"4d8", damage: 18},
};

var dieDamageAverage = {
d4:	2.5, // 1 2 3 4 -> 10 / 4 = 2.5
d6:	3.5,
d8:	4.5,
d10:	5.5,
d12:	6.5
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

// #endregion Region

// PartyStats
class PartyMember {

  constructor(name){
    this.Name = name;
    this.Strength;
    this.StrMod;
    this.Dexterity;
    this.DexMod;
    this.Constitution;
    this.ConMod;
    this.Intelligence;
    this.IntMod;
    this.Wisdom;
    this.WisMod;
    this.Charisma = 0;
    this.ChaMod = 0;
    this.HPStart = 0;
    this.HPGainPerLevel = 0;
    this.HP = 0;
    this.AC = 0;
    this.SpellAttack = 0;
    this.SpellSave = 0;
    this.SpellCastMod = 0;
    this.Acrobatics = 0;
    this.AnimalHandling = 0;
    this.Arcana = 0;
    this.Athletics = 0;
    this.Deception = 0;
    this.History = 0;
    this.Insight = 0;
    this.Intimidation = 0;
    this.Investigation = 0;
    this.Medicine = 0;
    this.Nature = 0;
    this.Perception = 0;
    this.Performance = 0;
    this.Persuasion = 0;
    this.Religion = 0;
    this.SleightOfHand = 0;
    this.Stealth = 0;
    this.Survival = 0;
    this.PassivePerception = 0;
    this.PassiveInsight = 0;
    this.GearNote = "";
    this.MeleeAttackBonus = 0;
    this.RangedAttackBonus = 0;
    this.SpellAttackBonus = 0;
    this.SpellSaveBonus = 0;
    this.StandardToHit = 0;
    this.StandardDamage = 0; 
    this.StandardAttack = "";
  }

  calculateHP(character) {
    return character.HPStart + character.ConMod + (PartyLevel - 1) * (character.HPGainPerLevel + character.ConMod);
  }
  
  calculateSpellSave(character) {
    return 8 + character.SpellCastMod + levelProfBonuses[PartyLevel] + (character.SpellSaveBonus || 0);
  }
  
  calculatePassivePerc(character) {
    return 10 + character.Perception;
  }
  
  calculatePassiveIns(character) {
    return 10 + character.Insight;
  }
}

/* function createPartyMember(person){
let person = new PartyMember(person);
person.Name = person;
}

// Create instances of PartyMember
createPartyMember(Doris);
createPartyMember(Faelar);
createPartyMember(Kandryn);
createPartyMember(Eiran);
createPartyMember(OldBreiar);
createPartyMember(NewBreiar); */

let Doris = new PartyMember("Doris");
let Faelar = new PartyMember("Faelar");
let Kandryn = new PartyMember("Kandryn");
let Eiran = new PartyMember("Eiran");
let OldBreiar = new PartyMember("OldBreiar");
let NewBreiar = new PartyMember("NewBreiar"); 

// Initialize character stats
Doris.Strength = 8;
Doris.StrMod = -1;
Doris.Dexterity = 14;
Doris.DexMod = 2;
Doris.Constitution = 12;
Doris.ConMod = 1;
Doris.Intelligence = 14;
Doris.IntMod = 2;
Doris.Wisdom = 10;
Doris.WisMod = 0;
Doris.Charisma = 17;
Doris.ChaMod = 3;
Doris.HPStart = 8;
Doris.HPGainPerLevel = 5;
Doris.AC = 14;
Doris.GearNote = "Reveller's Concertina +2 SpellSave";
Doris.SpellCastMod = Doris.ChaMod;
Doris.StandardAttack = "Firebolt";
Doris.MeleeAttackBonus = '';
Doris.RangedAttackBonus = '';
Doris.SpellAttackBonus = '';
Doris.SpellSaveBonus = 2;
Doris.StandardToHit = 3;
Doris.StandardDamage; 

Faelar.Strength = 14;
Faelar.StrMod = 2;
Faelar.Dexterity = 10;
Faelar.DexMod = 0;
Faelar.Constitution = 14;
Faelar.ConMod = 2;
Faelar.Intelligence = 12;
Faelar.IntMod = 1;
Faelar.Wisdom = 16;
Faelar.WisMod = 3;
Faelar.Charisma = 10;
Faelar.ChaMod = 0;
Faelar.HPStart = 8;
Faelar.HPGainPerLevel = 5;
Faelar.AC = 19;
Faelar.GearNote = "Book of Martial Techniques +1, Stone of Good Luck on saving throws and abilities";
Faelar.SpellCastMod = Faelar.WisMod;
Faelar.StandardAttack1 = "Sacred Flame";
Faelar.StandardAttack2 = "Spiritual Weapon";
Faelar.MeleeAttackBonus = 1;
Faelar.RangedAttackBonus = '';
Faelar.SpellAttackBonus = '';
Faelar.SpellSaveBonus = 2;

Kandryn.Strength = 10;
Kandryn.StrMod = 0;
Kandryn.Dexterity = 16;
Kandryn.DexMod = 3;
Kandryn.Constitution = 14;
Kandryn.ConMod = 2;
Kandryn.Intelligence = 17;
Kandryn.IntMod = 3;
Kandryn.Wisdom = 13;
Kandryn.WisMod = 1;
Kandryn.Charisma = 13;
Kandryn.ChaMod = 1;
Kandryn.HPStart = 6;
Kandryn.HPGainPerLevel = 4;
Kandryn.AC = 13;
Kandryn.GearNote = "Wizardry Hat + SpellAttacks";
Kandryn.SpellCastMod = Kandryn.IntMod;
Kandryn.StandardAttack = "Firebolt";
Kandryn.MeleeAttackBonus = '';
Kandryn.RangedAttackBonus = '';
Kandryn.SpellAttackBonus = 2;
Kandryn.SpellSaveBonus = '';

Eiran.Strength = 12;
Eiran.StrMod = 1;
Eiran.Dexterity = 16;
Eiran.DexMod = 3;
Eiran.Constitution = 15;
Eiran.ConMod = 2;
Eiran.Intelligence = 8;
Eiran.IntMod = -1;
Eiran.Wisdom = 13;
Eiran.WisMod = 1;
Eiran.Charisma = 13;
Eiran.ChaMod = 1;
Eiran.HPStart = 10;
Eiran.HPGainPerLevel = 6;
Eiran.AC = 16;
Eiran.GearNote = "Great Scythe + 1";
Eiran.SpellCastMod = Eiran.WisMod;
Eiran.StandardAttack = "Longbow Multiattack";
Eiran.MeleeAttackBonus = 1;
Eiran.RangedAttackBonus = 2;
Eiran.SpellAttackBonus = '';
Eiran.SpellSaveBonus = '';

OldBreiar.Strength = 14;
OldBreiar.StrMod = 2;
OldBreiar.Dexterity = 14;
OldBreiar.DexMod = 2;
OldBreiar.Constitution = 15;
OldBreiar.ConMod = 2;
OldBreiar.Intelligence = 8;
OldBreiar.IntMod = -1;
OldBreiar.Wisdom = 14;
OldBreiar.WisMod = 2;
OldBreiar.Charisma = 11;
OldBreiar.ChaMod = 0;
OldBreiar.HPStart = 10;
OldBreiar.HPGainPerLevel = 5;
OldBreiar.AC = "";
OldBreiar.GearNote = "";
OldBreiar.SpellCastMod = "";
OldBreiar.StandardAttack = "Maul";

NewBreiar.Strength = 14;
NewBreiar.StrMod = 2;
NewBreiar.Dexterity = 14;
NewBreiar.DexMod = 2;
NewBreiar.Constitution = 15;
NewBreiar.ConMod = 2;
NewBreiar.Intelligence = 8;
NewBreiar.IntMod = -1;
NewBreiar.Wisdom = 14;
NewBreiar.WisMod = 2;
NewBreiar.Charisma = 11;
NewBreiar.ChaMod = 0;
NewBreiar.HPStart = 10;
NewBreiar.HPGainPerLevel = 5;
NewBreiar.AC = 13+ Eiran.WisMod;
NewBreiar.GearNote = "";
NewBreiar.SpellCastMod = "";
NewBreiar.StandardAttack = "Maul";

// Character Proficiency Listing
var charProfBonusesDictionary = {
  Doris: { Acrobatics: 1, AnimalHandling: 0.5, Arcana: 0.5, Athletics: 0.5, Deception: 2, History: 0.5,
    Insight: 1, Intimidation: 0.5, Investigation: 0.5, Medicine: 1, Nature: 0.5, Perception: 0.5, 
    Performance: 1, Persuasion: 2, Religion: 0.5, SleightOfHand: 1, Stealth: 1, Survival: 0.5 },
  Faelar: { Acrobatics: 0, AnimalHandling: 0, Arcana: 1, Athletics: 0, Deception: 0, History: 1,
    Insight: 1, Intimidation: 0, Investigation: 1, Medicine: 1, Nature: 1, Perception: 1, 
    Performance: 0, Persuasion: 0, Religion: 1, SleightOfHand: 0, Stealth: 0, Survival: 0 },
  Kandryn: { Acrobatics: 0, AnimalHandling: 0, Arcana: 1, Athletics: 0, Deception: 0, History: 1,
    Insight: 1, Intimidation: 0, Investigation: 1, Medicine: 0, Nature: 0, Perception: 1, 
    Performance: 0, Persuasion: 0, Religion: 0, SleightOfHand: 0, Stealth: 0, Survival: 0 },
  Eiran: { Acrobatics: 0, AnimalHandling: 1, Arcana: 1, Athletics: 1, Deception: 0, History: 0,
    Insight: 0, Intimidation: 0, Investigation: 1, Medicine: 0, Nature: 0, Perception: 0, 
    Performance: 0, Persuasion: 0, Religion: 1, SleightOfHand: 0, Stealth: 1, Survival: 1 }
};

class Monster{
  constructor(){
  this.MonsterId;
  this.CR;
  this.AC;
  this.HP;
  this.SpellSaveDC;
  }
}

Typical8 = new Monster();
Typical8.MonsterId = 1;
Typical8.CR = 8;
Typical8.AC = 16;
Typical8.SpellSaveDC = 16;

var levelToCR = {
  4: 8
};

function calculateSkills(character) {
  const skills = {
    Acrobatics: 'DexMod',
    AnimalHandling: 'WisMod',
    Arcana: 'IntMod',
    Athletics: 'StrMod',
    Deception: 'ChaMod',
    History: 'IntMod',
    Insight: 'WisMod',
    Intimidation: 'StrMod',
    Investigation: 'IntMod',
    Medicine: 'WisMod',
    Nature: 'IntMod',
    Perception: 'WisMod',
    Performance: 'ChaMod',
    Persuasion: 'ChaMod',
    Religion: 'IntMod',
    SleightOfHand: 'DexMod',
    Stealth: 'DexMod',
    Survival: 'WisMod'
  };

  for (const [skill, mod] of Object.entries(skills)) {
    if (charProfBonusesDictionary[character.Name] && charProfBonusesDictionary[character.Name][skill] !== undefined) {
      character[skill] = character[mod] + Math.floor(charProfBonusesDictionary[character.Name][skill] * levelProfBonuses[PartyLevel]);
    } else {
      console.error(`No proficiency bonus found for ${skill} on character ${character.Name}`);
    }
  }
}



function updateSheet() {
  document.getElementById("party-level").innerText = PartyLevel;
  document.getElementById("prof-bonus").innerText = levelProfBonuses[PartyLevel];

  var characters = [Doris, Faelar, Kandryn, Eiran];

  characters.forEach(character => {
    calculateSkills(character);
    character.HP = character.calculateHP(character);
    character.SpellSave = character.calculateSpellSave(character);
    character.PassivePerception = character.calculatePassivePerc(character);
    character.PassiveInsight = character.calculatePassiveIns(character);

    document.getElementById(character.Name.toLowerCase() + "-ac").innerText = character.AC;
    document.getElementById(character.Name.toLowerCase() + "-spellsave").innerText = character.SpellSave;
    document.getElementById(character.Name.toLowerCase() + "-hp").innerText = character.HP;
    document.getElementById(character.Name.toLowerCase() + "-strength").innerText = character.Strength;
    document.getElementById(character.Name.toLowerCase() + "-dexterity").innerText = character.Dexterity;
    document.getElementById(character.Name.toLowerCase() + "-constitution").innerText = character.Constitution;
    document.getElementById(character.Name.toLowerCase() + "-intelligence").innerText = character.Intelligence;
    document.getElementById(character.Name.toLowerCase() + "-wisdom").innerText = character.Wisdom;
    document.getElementById(character.Name.toLowerCase() + "-charisma").innerText = character.Charisma;
    document.getElementById(character.Name.toLowerCase() + "-passiveperc").innerText = character.PassivePerception;
    document.getElementById(character.Name.toLowerCase() + "-passiveins").innerText = character.PassiveInsight;
    document.getElementById(character.Name.toLowerCase() + "-note").innerText = character.GearNote;
  });
  
  OldBreiar.AC = 13+ levelProfBonuses[PartyLevel];
}

window.onload = function() {
  updateSheet();
};
