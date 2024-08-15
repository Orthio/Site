
// Global variables

var partyLevel = 6;
var partyNumber = 4; 
var xpSoFar = 0;
var xpRecord = '';
var partyDailyBudget = '';
var partyExtraDailyBudget = '';
var partyShortRestBudget = '';
var partyInitialBudgetRemain = '';
var currentMonster = 'A1';
var currentEncounterGroup = 'GroupA';
var currentEncGroupId = "A";
var currentEncId = 1;
var currentMonsterId = "A1";
let monsterObjects = {};
let encounterObjects = {};
let encounterGroupsObjects = {};
var dailyTotalXP = 0;
var dailyRemainingXP = 0;
var groupXPArray = [];
var groupRatioArray = [];

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
    "0.125": 25,
    "0.25": 50,
    "0.5": 100,
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

const CRInputAllowedValues = [0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

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
    partyInitialBudgetRemain = partyDailyBudget-xpSoFar;
}

class Monster {
    constructor(cr, quantity, name) {
        this.monsterId = currentEncGroupId + currentEncId; // eg A1
        this.monsterCr = parseFloat(cr); // Challenge Rating
        this.monsterQuantity = parseInt(quantity,10); // Number of monsters
        this.monsterName = name || `${currentEncGroupId}${currentEncId}`; // Default name if not provided
        this.calculateMonsterXP(); // Calculate XP during initialization
    }

    calculateMonsterXP() {
        if (monsterCrXp.hasOwnProperty(this.monsterCr)) {
            this.monsterXP = monsterCrXp[this.monsterCr] * this.monsterQuantity; //Total xp for this group of monsters
        } else {
            this.monsterXP = 0;
            var table = document.getElementById("EncounterTable");
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "Invalid CR. Valid CR are 0.125, 0.25, 0.5, and whole numbers 1-30"; 
        }
    }
}

function createNewMonster(encMonCr, encMonQuantity,encMonName){
    if (encMonName === undefined) {
        encMonName = `Mon${currentEncGroupId}${currentEncId}`;
    } 
    monsterObjects[currentEncGroupId+currentEncId] = 
        new Monster(encMonCr, encMonQuantity,encMonName);
    currentMonster = monsterObjects[currentEncGroupId + currentEncId].monsterId;
    console.log(`Created Monster ${encMonName} at ${currentEncGroupId}${currentEncId}`);
    console.log(`Current Monster is  ${currentMonster}`);
};

class Encounter {

    // Constructor
    constructor() {
        this.encounterId = currentEncGroupId + currentEncId;
        this.Monsters = []; 
        this.EncMonQty = 0;
        this.calculateEncounterXP();
        this.encounterBasicXp = 0;
        this.encounterAdjXp = 0;
    }

    calculateEncounterXP() {
        let totalXP = 0;
        this.Monsters.forEach(monster => {
                totalXP += monster.monsterXp;
            
        });

        /* this.Monsters.forEach(monster => {
            if (monster && typeof monster.monsterXp != 'undefined') {
                totalXP += monster.monsterXp * monster.monsterQuantity;
            } else {
                console.error("Invalid monster object:", monster);
            }
        }); */

        this.encounterBasicXp = totalXP;
        let XPMod = encounterMultipliers.find(multiplier => multiplier.monsters === this.EncMonQty)?.multiplier || 1;
        totalXP *= XPMod;
        this.encountersAdjXp = totalXP;
        return totalXP;
    }

    addMonster(monster){
        
            this.Monsters.push(monster);
            this.EncMonQty += monster.monsterQuantity;
            this.calculateEncounterXP();
      
    }

  /*   addMonster(monster){
        if (monster && typeof monster.monsterXp !== 'undefined') {
            this.Monsters.push(monster);
            this.EncMonQty += monster.monsterQuantity;
            this.encounterAdjXp = this.calculateEncounterXP();
        } else {
            console.error("Cannot add invalid monster object:", monster);
        }
    } */

}

function createNewEncounter(){
    let encounterName = `${currentEncGroupId}${currentEncId}`;
    encounterObjects[encounterName] = new Encounter();
    console.log(`Created Encounter ${encounterName}`);
}

class EncounterGroup {
    constructor(){
        this.groupId = `Group${currentEncGroupId}`;
        this.encounters = [];
        this.groupXP = 0;
    }

    addEncounter(encounter) {
        if (encounter && encounter.encounterAdjXp !== undefined) {
            this.encounters.push(encounter);
            this.groupXP = this.calculateGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    calculateGroupXP(){
        let totalXP = 0;
        this.encounters.forEach(encounter => {
            totalXP += encounter.encounterAdjXp;
        });
        return totalXP;
    }

}

function createNewEncounterGroup(){
    let groupName = currentEncGroupId;
    encounterGroupsObjects[groupName] = new EncounterGroup();
    console.log(`Created Encounter Group ${groupName}`);
}

createNewEncounterGroup();


class EncounterManager {
    constructor() {
        this.encounterGroups = []; // Array to hold all encounter groups
    }

    addEncounterGroup(encounterGroup) {
        if (encounterGroup && encounterGroup.groupXP !== undefined) {
            this.encounterGroups.push(encounterGroup);
        } else {
            console.error("Invalid encounter group:", encounterGroup);
        }
    }

    calculateTotalXP() {
        let grandTotalXP = 0;

        this.encounterGroups.forEach(group => {
            grandTotalXP += group.groupXP;
        });

        return grandTotalXP;
    }

    logGroupTotals() {
        this.encounterGroups.forEach((group, index) => {
            console.log(`Group ${index + 1} Total XP: ${group.groupXP}`);
        });
        console.log(`Grand Total XP: ${this.calculateTotalXP()}`);
    }
}

function addEncounterCurrent() {
    currentMonsterId = currentEncGroupId + currentEncId; // Store current ID before incrementing
    
    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let encMonName = document.getElementById('monsternameinput').value;

    createNewMonster(encMonCr, encMonQuantity, encMonName);
    createNewEncounter();

    encounterObjects[currentMonsterId].addMonster(monsterObjects[currentMonsterId]);
    encounterGroupsObjects[currentEncGroupId].addEncounter(encounterObjects[currentMonsterId]);

    currentEncounterGroup = encounterGroupsObjects[currentEncGroupId];
    console.log(`Current Encounter Group is ${currentEncounterGroup.groupId}`);

    updateEncounterTable(encMonCr, encMonQuantity);
    //Update rows with current xp
    updateSheet();
    currentEncId++;
}

function addEncounterNew() {
    currentEncGroupId = String.fromCharCode(currentEncGroupId.charCodeAt(0) + 1);
    currentEncId = 1;
    currentMonsterId = currentEncGroupId + currentEncId; // New group and encounter ID

    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let encMonName = document.getElementById('monsternameinput').value;

    createNewMonster(encMonCr, encMonQuantity, encMonName);
    createNewEncounter();

    encounterObjects[currentMonsterId].addMonster(monsterObjects[currentMonsterId]);
    createNewEncounterGroup();
    encounterGroupsObjects[currentEncGroupId].addEncounter(encounterObjects[currentMonsterId]);

    currentEncounterGroup = encounterGroupsObjects[currentEncGroupId];
    console.log(`Current Encounter Group is ${currentEncounterGroup.groupId}`);

    updateEncounterTable(encMonCr, encMonQuantity);
    updateSheet();
    currentEncId++;

}

function updateEncounterTable(cr, qty) {
    var table = document.getElementById("EncounterTable");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);

        let currentMonsterId = currentEncGroupId + currentEncId; // Ensure correct monster is accessed
        cell1.innerHTML = `${currentEncGroupId}${currentEncId}: `;
        cell2.innerHTML = monsterObjects[currentMonsterId].monsterName;
        cell3.innerHTML = ` CR${cr} (`;
        cell4.innerHTML = monsterObjects[currentMonsterId].monsterXp;
        cell5.innerHTML = 'xp) x ';
        cell6.innerHTML = qty;
        cell7.innerHTML = ' = ';
        cell8.innerHTML = encounterObjects[currentMonsterId].encounterBasicXp;
        cell9.innerHTML = 'xp';
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
    document.getElementById("partyinitialbudgetremain").innerText = Math.floor(partyInitialBudgetRemain);

}
