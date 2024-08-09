
// Global variables

var partyLevel = 6;
var partyNumber = 4; 
var xpSoFar = 0;
var xpRecord = '';
var partyDailyBudget = '';
var partyExtraDailyBudget = '';
var partyShortRestBudget = '';
var partyBudgetRemain = '';
var currentEncounter = '';
var currentEncounterGroup = '';

var dailyBudget = {
    1: 300,
    2: 600,
    3: 1200,
    4: 1700,
    5: 3500,
    6: 4000,
    7: 5000,
    8: 6000,
    9: 7500,
    10: 9000,
    11: 10500,
    12: 11500,
    13: 13500,
    14: 15000,
    15: 18000,
    16: 20000,
    17: 25000,
    18: 27000,
    19: 30000,
    20: 40000
};

var monsterCrXp = {
    "0": 0,
    "1/8": 25,
    "1/4": 50,
    "1/2": 100,
    "1": 200,
    "2": 450,
    "3": 700,
    "4": 1100,
    "5": 1800,
    "6": 2300,
    "7": 2900,
    "8": 3900,
    "9": 5000,
    "10": 5900,
    "11": 7200,
    "12": 8400,
    "13": 10000,
    "14": 11500,
    "15": 13000,
    "16": 15000,
    "17": 18000,
    "18": 20000,
    "19": 22000,
    "20": 25000,
    "21": 33000,
    "22": 41000,
    "23": 50000,
    "24": 62000,
    "25": 75000,
    "26": 90000,
    "27": 105000,
    "28": 120000,
    "29": 135000,
    "30": 155000
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

function calculatePartyBudget(){
    partyDailyBudget = dailyBudget[partyLevel] * partyNumber;
    partyExtraDailyBudget = partyDailyBudget * 1.5;
    partyShortRestBudget = partyDailyBudget/3;
    partyBudgetRemain = partyDailyBudget-xpSoFar;
}

class Monster {

    constructor(cr, quantity) {
        this.monsterCr = cr; // Challenge Rating
        this.monsterQuantity = quantity; // Number of monsters
      }
}

class Encounter {

    // Constructor
    constructor(name) {
        this.Name = name;
        this.Monsters = [];
    }

    addMonster(monster){
        this.Monsters.push(monster);
    }

    calculateTotalXP() {
        let totalXP = 0;
        this.Monsters.forEach(monster => {
          let xpPerMonster = monsterCrXp[monster.monsterCr];
          totalXP += xpPerMonster * monster.monsterQuantity;
        });
        return totalXP;
      }
}

let A1 = new Encounter("A1");
A1.Name = "A1";
let A2 = new Encounter("A2");
let A3 = new Encounter("A3");
let A4 = new Encounter("A4");
let A5 = new Encounter("A5");

currentEncounter = A1;

class EncounterGroup {
    constructor(){
        this.groupName = "GroupA";
        this.encounters = [];
    }

    addEncounter(encounter){
        this.encounters.push(encounter);
    }

    calculateGroupXP(){
        return this.encounters.reduce((total, encounter) => total + encounter.calculateTotalXP(), 0);
    }
}

let GroupA = new EncounterGroup("A");
let GroupB = new EncounterGroup("B");
let GroupC = new EncounterGroup("C");
let GroupD = new EncounterGroup("D");
let GroupE = new EncounterGroup("E");
let GroupF = new EncounterGroup("F");
let GroupG = new EncounterGroup("G");
let GroupH = new EncounterGroup("H");
let GroupI = new EncounterGroup("I");
let GroupJ = new EncounterGroup("J");

currentEncounterGroup = GroupA;
GroupA.groupName = "A";
GroupA.addEncounter(A1);

// Fight A1, Monster CR A1, Monster Number A1, XP
// Fight A2, Monster CR A2, Monster Number A2, XP
// Times A together for first encounter for TotalXP, multi by encounterMultiplier for AdjXP
// Add all A B C together for DayTotalXP

function addEncounterCurrent() {  
    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let monster = new Monster(encMonCr, encMonQuantity);
    
    currentEncounter.addMonster(monster);
    updateEncounterTable("Current", currentEncounter.Name, encMonCr, encMonQuantity);
};

function addEncounterNew() {
    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let monster = new Monster(encMonCr, encMonQuantity);

    currentEncounter = new Encounter("B1");
    currentEncounterGroup = GroupB;
    currentEncounterGroup.addEncounter(currentEncounter);

    // Create a new Encounter instance, e.g., "A2", "A3"
    let newEncounterName = generateEncounterName();
    let newEncounter = new Encounter(newEncounterName);
    currentEncounterGroup.addEncounter(newEncounter);
    newEncounter.addMonster(monster);
    
    updateEncounterTable("New", newEncounterName, encMonCr, encMonQuantity);
}
  
function generateEncounterName() {
// Logic to generate new encounter name, e.g., "A1", "A2"
let count = currentEncounterGroup.encounters.length + 1;
  return currentEncounterGroup.groupName + count;

}

function updateEncounterTable(NewOrCurrent,encounterName, cr, qty) {
    var table = document.getElementById("EncounterTable");
    if (NewOrCurrent === "New") {
        var row = table.insertRow(-1);
        row.id = encounterName; // Assign an ID to the row for easier updates
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = `Fight ${encounterName}:`;
        cell2.innerHTML = `CR ${cr}`;
        cell3.innerHTML = " x ";
        cell4.innerHTML = qty;
        cell5.innerHTML = calculateXPForEncounter(encounterName);

    } else if (NewOrCurrent === "Current") {
        var row = document.getElementById(encounterName);
        if (row) {
            var cells = row.cells;
            cells[1].innerHTML = `CR ${cr}`;
            cells[3].innerHTML = qty;
            cells[4].innerHTML = calculateXPForEncounter(encounterName);
        } else {
            console.error(`Row with ID ${encounterName} not found.`);
        }
    }
}

function calculateXPForEncounter(encounterName) {
    let encounter = currentEncounterGroup.encounters.find(enc => enc.Name === encounterName);
    if (encounter) {
        return encounter.calculateTotalXP();
    }
    return 0;
}

function removeEncounter() {
    var table = document.getElementById("EncounterTable");
    table.deleteRow(-1);

};

function updateSheet() {
    partyLevel = document.getElementById('party-levelinput').value;
    partyNumber = document.getElementById('party-numberinput').value;
    xpSoFar = document.getElementById('xpgainedforcurrent').value;

    document.getElementById("party-level").innerText = partyLevel;
    document.getElementById("party-number").innerText = partyNumber;

    calculatePartyBudget();    
    document.getElementById("dailybudget").innerText = partyDailyBudget;
    document.getElementById("partyshortbudget").innerText = Math.floor(partyShortRestBudget);
    document.getElementById("partybudgetremain").innerText = Math.floor(partyBudgetRemain);

}

window.onload = updateSheet;

/*
CR's great, you just need to also consider the number of party members, 
consider the max HP of the party members, 
consider the party members saving throws 
and how they line up with the monsters abilities, 
consider what magical items they have, 
calculate the maximum damage each party member can do in a round and 
compare it to each monsters max HP, calculate the cumulative damage 
the party members can do together and compare that to the monsters max HP, 
calculate the maximum damage the monster can do in a single round and 
compare that to each party members max HP, think about the location the 
fight will take place in and how that will affect the party, 
consider the monsters movement type and compare that to the parties mobility options, 
consider any situational abilities the monster has and how that might impact the fight, 
consider how far into the adventuring day the encounter will take place*/
