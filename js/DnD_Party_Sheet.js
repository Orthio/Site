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
d10: 5.5,
d12: 6.5,
d20: 10.5
};

// Proficiency Bonus Listing
var proficiencyBonus = {
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

var levelToCR = {
  4: 8
};

var abilityToBonus = {
  1: -5,
  2: -4,
  3: -4,
  4: -3,
  5: -3,
  6: -2,
  7: -2,
  8: -1,
  9: -1,
  10: 0,
  11: 0,
  12: 1,
  13: 1,
  14: 2,
  15: 2,
  16: 3,
  17: 3,
  18: 4,
  19: 4,
  20: 5,
  21: 5,
  22: 6,
  23: 6,
  24: 7,
  25: 7,
  26: 8,
  27: 8,
  28: 9,
  29: 9,
  30: 10 
};

function abilityToText(abilityScore) {
  if (abilityScore <0){
    return "" + abilityScore;
  } else {
    return "+" + abilityScore;
  }
}


// #endregion Variable Region

// PartyStats
class PartyMember {

  // Character Proficiency Listing
  static charProfBonusesDictionary = {
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
      Performance: 0, Persuasion: 0, Religion: 1, SleightOfHand: 0, Stealth: 1, Survival: 1 },
    Breiar: { Acrobatics: 0, AnimalHandling: 0, Arcana: 0, Athletics: 0, Deception: 0, History: 0,
      Insight: 0, Intimidation: 0, Investigation: 0, Medicine: 0, Nature: 0, Perception: 0, 
      Performance: 0, Persuasion: 0, Religion: 0, SleightOfHand: 0, Stealth: 0, Survival: 0 }
    };

  constructor(name){
    this.Name = name;
    this.Strength;
    this.StrMod = 0;
    this.Dexterity;
    this.DexMod = 0;
    this.Constitution;
    this.ConMod = 0;
    this.Intelligence;
    this.IntMod = 0;
    this.Wisdom;
    this.WisMod = 0;
    this.Charisma = 0;
    this.HPStart = 0;
    this.HPGainPerLevel = 0;
    this.HP = 0;
    this.AC = 0;
    this.SpellCastMod = 0;
    this.SpellAttack = 0;
    this.SpellSave = 0;
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
    this.Encumbered = 0;
    this.HeavilyEncumbered = 0;
    this.CarryingCapacity = 0;
    this.GearNote = "";
    this.MeleeAttackBonus = 0;
    this.RangedAttackBonus = 0;
    this.SpellAttackBonus = 0;
    this.SpellSaveBonus = 0;
    this.StandardToHit = 0;
    this.StandardToHitBonus = 0;
    this.StandardDamage = 0; 
    this.StandardDamageBonus = 0;
    this.StandardAttack = "";
  }

  calculateAbilityBonus() {
    this.StrMod = abilityToBonus[this.Strength];
    this.DexMod = abilityToBonus[this.Dexterity];
    this.ConMod = abilityToBonus[this.Constitution];
    this.IntMod = abilityToBonus[this.Intelligence];
    this.WisMod = abilityToBonus[this.Wisdom];
    this.ChaMod = abilityToBonus[this.Charisma];
  }

  calculateHP(character) {
    return character.HPStart + character.ConMod + (PartyLevel - 1) * (character.HPGainPerLevel + character.ConMod);
  }
  
  calculatePassivePerc(character) {
    return 10 + character.Perception;
  }
  
  calculatePassiveIns(character) {
    return 10 + character.Insight;
  }

  calculateSkills(character) {
    const skills = {
      Acrobatics: 'DexMod',
      AnimalHandling: 'WisMod',
      Arcana: 'IntMod',
      Athletics: 'StrMod',
      History: 'IntMod',
      Insight: 'WisMod',
      Intimidation: 'StrMod',
      Investigation: 'IntMod',
      Medicine: 'WisMod',
      Nature: 'IntMod',
      Perception: 'WisMod',
      Religion: 'IntMod',
      SleightOfHand: 'DexMod',
      Stealth: 'DexMod',
      Survival: 'WisMod'
    }
    
  for (const [skill, mod] of Object.entries(skills)) {
    if (PartyMember.charProfBonusesDictionary[character.Name] && PartyMember.charProfBonusesDictionary[character.Name][skill] !== undefined) {
      character[skill] = character[mod] + Math.floor(PartyMember.charProfBonusesDictionary[character.Name][skill] * proficiencyBonus[PartyLevel]);
    } else {
      console.error(`No proficiency bonus found for ${skill} on character ${character.Name}`);
    }
    }

  character.PassivePerception = character.calculatePassivePerc(character);
  character.PassiveInsight = character.calculatePassiveIns(character);
  }

  calculateEncumberance() {
    this.CarryingCapacity = [this.Strength]*15;
  }

}



let Doris = new PartyMember("Doris", "Charisma");
let Faelar = new PartyMember("Faelar", "Wisdom");
let Kandryn = new PartyMember("Kandryn", "Intelligence");
let Eiran = new PartyMember("Eiran", "Wisdom");
let Breiar = new PartyMember("Breiar");

// Initialize character stats
Doris.Strength = 8;
Doris.Dexterity = 14;
Doris.Constitution = 12;
Doris.Intelligence = 14;
Doris.Wisdom = 10;
Doris.Charisma = 17;
Doris.calculateAbilityBonus();
Doris.calculateSkills(Doris);
Doris.calculateEncumberance();
Doris.HPStart = 8;
Doris.HPGainPerLevel = 5;
Doris.HP = Doris.calculateHP(Doris)
Doris.AC = 14;
Doris.GearNote = "Reveller's Concertina +2 SpellSave";
Doris.MeleeAttackBonus = 0;
Doris.RangedAttackBonus = 0;
Doris.SpellAttackBonus = 0;
Doris.SpellSaveBonus = 2;
Doris.SpellAttack = Doris.SpellCastMod + proficiencyBonus[PartyLevel] + Doris.SpellAttackBonus; //3+3+0=6
Doris.SpellSave = 8 + Doris.SpellCastMod + proficiencyBonus[PartyLevel] + Doris.SpellSaveBonus; //8+3+3+2=16
Doris.StandardAttack = "Firebolt";
Doris.StandardToHit = Doris.SpellAttack; //+6
// +6 to hit against AC16
// 65% average against typical CR
// to hit AC16, Doris needs to roll a 10 or higher, 0.5
Doris.StandardDamage = Math.round((fireboltDamage[PartyLevel].damage * (1-0.5) *10 )/10); 

Faelar.Strength = 14;
Faelar.Dexterity = 10;
Faelar.Constitution = 14;
Faelar.Intelligence = 12;
Faelar.Wisdom = 16;
Faelar.Charisma = 10;
Faelar.calculateAbilityBonus();
Faelar.calculateSkills(Faelar);
Faelar.calculateEncumberance();
Faelar.HPStart = 8;
Faelar.HPGainPerLevel = 5;
Faelar.HP = Faelar.calculateHP(Faelar);
Faelar.AC = 19;
Faelar.GearNote = "Book of Martial Techniques +1, Stone of Good Luck on saving throws and abilities";
Faelar.SpellCastMod = Faelar.WisMod;
Faelar.MeleeAttackBonus = 1;
Faelar.RangedAttackBonus = 0;
Faelar.SpellAttackBonus = 0;
Faelar.SpellSaveBonus = 0;
Faelar.SpellAttack = Faelar.SpellCastMod + + proficiencyBonus[PartyLevel] + Faelar.SpellAttackBonus; //3+3+0=6
Faelar.SpellSave = 8 + Faelar.SpellCastMod + proficiencyBonus[PartyLevel] + Faelar.SpellSaveBonus; //8+3+3+0=14
Faelar.StandardAttack = "Sacred Flame and Spiritual Weapon";
Faelar.StandardToHit = "DC14";
// DC14 to hit against Spell Save DC16
// to hit DC16, Faelar needs to roll a 12 or higher, 0.6
Faelar.StandardToHitBonus = Faelar.StrMod + 1; // With Spiritual Weapon. +3, 0.65 to hit
Faelar.StandardDamage = SacredFlameDamage[PartyLevel].damage * (1-0.6);
Faelar.StandardDamageBonus = 8.5 * (1-0.65);
// 1d8 + Faelar.SpellCastMod + 1;  Spiritual Weapon
// 4.5 + 3 + 1 = 8.5 
Faelar.StandardDamage = Math.round(((Faelar.StandardDamage + Faelar.StandardDamageBonus)*10)/10);

Kandryn.Strength = 10;
Kandryn.Dexterity = 16;
Kandryn.Constitution = 14;
Kandryn.Intelligence = 17;
Kandryn.Wisdom = 13;
Kandryn.Charisma = 13;
Kandryn.calculateAbilityBonus();
Kandryn.calculateSkills(Kandryn);
Kandryn.calculateEncumberance();
Kandryn.HPStart = 6;
Kandryn.HPGainPerLevel = 4;
Kandryn.HP = Kandryn.calculateHP(Kandryn);
Kandryn.AC = 13;
Kandryn.GearNote = "Wizardry Hat + SpellAttacks";
Kandryn.SpellCastMod = Kandryn.IntMod;
Kandryn.MeleeAttackBonus = 0;
Kandryn.RangedAttackBonus = 0;
Kandryn.SpellAttackBonus = 2;
Kandryn.SpellSaveBonus = 0;
Kandryn.SpellAttack = Kandryn.SpellCastMod + + proficiencyBonus[PartyLevel] + Kandryn.SpellAttackBonus; //3+3+2=8
Kandryn.SpellSave = 8 + Kandryn.SpellCastMod + proficiencyBonus[PartyLevel] + Kandryn.SpellSaveBonus; //8+3+3+0=14
Kandryn.StandardAttack = "Firebolt";
Kandryn.StandardToHit = Kandryn.SpellAttack; //+8
// +8 to hit against AC16, 0.4
Kandryn.StandardDamage = Math.round((fireboltDamage[PartyLevel].damage * (1-0.4) *10)/10);

Eiran.Strength = 12;
Eiran.Dexterity = 16;
Eiran.Constitution = 15;
Eiran.Intelligence = 8;
Eiran.Wisdom = 13;
Eiran.Charisma = 13;
Eiran.calculateAbilityBonus();
Eiran.calculateSkills(Eiran);
Eiran.calculateEncumberance();
Eiran.HPStart = 10;
Eiran.HPGainPerLevel = 6;
Eiran.HP = Eiran.calculateHP(Eiran);
Eiran.AC = 16;
Eiran.GearNote = "Great Scythe + 1";
Eiran.SpellCastMod = Eiran.WisMod;
Eiran.MeleeAttackBonus = 1;
Eiran.RangedAttackBonus = 2;
Eiran.SpellAttackBonus = 0;
Eiran.SpellSaveBonus = 0;
Eiran.SpellAttack = Eiran.SpellCastMod + proficiencyBonus[PartyLevel] + Eiran.SpellAttackBonus; //1+3+0=4
Eiran.SpellSave = 8 + Eiran.SpellCastMod + proficiencyBonus[PartyLevel] + Eiran.SpellSaveBonus; //8+1+3+0=12
Eiran.StandardAttack = "Longbow Multiattack";
Eiran.StandardToHit = Eiran.DexMod + Eiran.RangedAttackBonus + 2; // +3 +2 +2 = +7
// Against AC16, 0.45
Eiran.StandardDamage = Math.round(((2*(4.5)+6) * (1-0.45) *10)/10); // 11*0.55
Eiran.ScytheToHit = Eiran.DexMod + proficiencyBonus[PartyLevel] + Eiran.MeleeAttackBonus; // +3 +3 +1 = +7
Eiran.ScytheDamage = 8.5 //1d8 + (3+1)
Eiran.DaggersToHit = Eiran.DexMod + proficiencyBonus[PartyLevel] ; // +3 +3 = +6 (Twice)
// +6 Adv to hit against AC16
// 0.5 * 0.5 = 0.25 Chance of not happening, so chance of happening is 0.75
Eiran.DaggersDamage = (2*(2.5+3))*0.75; // 2*(1d4+ 3dex)   = 10.5  

Breiar.Strength = 14;
Breiar.Dexterity = 14;
Breiar.Constitution = 15;
Breiar.Intelligence = 8;
Breiar.Wisdom = 14;
Breiar.Charisma = 11;
Breiar.calculateAbilityBonus();
Breiar.calculateSkills(Breiar);
Breiar.calculateEncumberance();
Breiar.HPStart = 10;
Breiar.HPGainPerLevel = 5;
Breiar.HP = Breiar.calculateHP(Breiar);
Breiar.AC = 13+ Eiran.WisMod;
Breiar.GearNote = "";
Breiar.SpellCastMod = 0;
Breiar.StandardAttack = "Maul";
Breiar.StandardToHit = Eiran.SpellAttack; //+4
// 0.6 to hit against AC16
Breiar.StandardDamage = Math.round(((4.5 + 2 + Eiran.WisMod) * (1-0.6) *10)/10);
// 1d8 + 2 + Wis(1) = 4.5 + 2 + 1 = 7.5


class Party {
  static totalHP = Doris.HP + Faelar.HP + Kandryn.HP + Eiran.HP;
  static minHP = Math.min(Doris.HP, Faelar.HP, Kandryn.HP, Eiran.HP);
  static partyDPR = Math.round((Doris.StandardDamage + Faelar.StandardDamage + Kandryn.StandardDamage + 
  Eiran.StandardDamage + Breiar.StandardDamage )*10)/10 ;
  static partyDPR3 = Party.partyDPR * 3;
  static partyCarryingCapacity = Doris.CarryingCapacity + Faelar.CarryingCapacity + Kandryn.CarryingCapacity + Eiran.CarryingCapacity;
}

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


function updateSheet() {
  document.getElementById("party-level").innerText = PartyLevel;
  document.getElementById("prof-bonus").innerText = proficiencyBonus[PartyLevel];

  var characters = [Doris, Faelar, Kandryn, Eiran, Breiar];

  characters.forEach(character => {

    document.getElementById(character.Name.toLowerCase() + "-ac").innerText = character.AC;
    document.getElementById(character.Name.toLowerCase() + "-spellsave").innerText = character.SpellSave;
    document.getElementById(character.Name.toLowerCase() + "-hp").innerText = character.HP;
    document.getElementById(character.Name.toLowerCase() + "-strength").innerText = character.Strength;
    document.getElementById(character.Name.toLowerCase() + "-strmod").innerText = abilityToText(character.StrMod);
    document.getElementById(character.Name.toLowerCase() + "-dexterity").innerText = character.Dexterity;
    document.getElementById(character.Name.toLowerCase() + "-dexmod").innerText = abilityToText(character.DexMod);
    document.getElementById(character.Name.toLowerCase() + "-constitution").innerText = character.Constitution;
    document.getElementById(character.Name.toLowerCase() + "-conmod").innerText = abilityToText(character.ConMod);
    document.getElementById(character.Name.toLowerCase() + "-intelligence").innerText = character.Intelligence;
    document.getElementById(character.Name.toLowerCase() + "-intmod").innerText = abilityToText(character.IntMod);
    document.getElementById(character.Name.toLowerCase() + "-wisdom").innerText = character.Wisdom;
    document.getElementById(character.Name.toLowerCase() + "-wismod").innerText = abilityToText(character.WisMod);
    document.getElementById(character.Name.toLowerCase() + "-charisma").innerText = character.Charisma;
    document.getElementById(character.Name.toLowerCase() + "-chamod").innerText = abilityToText(character.ChaMod);
    document.getElementById(character.Name.toLowerCase() + "-passiveperc").innerText = character.PassivePerception;
    document.getElementById(character.Name.toLowerCase() + "-passiveins").innerText = character.PassiveInsight;
    document.getElementById(character.Name.toLowerCase() + "-note").innerText = character.GearNote;
    document.getElementById(character.Name.toLowerCase() + "-DPR").innerText = character.StandardDamage;
  });
  
  document.getElementById("party-hp").innerText = Party.totalHP;
  document.getElementById("party-minhp").innerText = Party.minHP;
  document.getElementById("party-DPR").innerText = Party.partyDPR;
  document.getElementById("party-DPR3").innerText = Party.partyDPR3;
  document.getElementById("party-carrying-capacity").innerText = Party.partyCarryingCapacity;
  document.getElementById("party-carrying-after").innerText = Party.partyCarryingCapacity - 60 - 50;
}

window.onload = function() {
  updateSheet();
};
