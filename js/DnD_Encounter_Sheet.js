
// Global variables

  // #region Variable Listing Region

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

var monsterCrXP = {
    "0": 0,
    "0.125": 25,
    "1/8": 25,
    "0.25": 50,
    "1/4": 50,
    "0.5": 100,
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

// #endregion

class Party {
    static partyLevel = 6;
    static partyNumber = 4; 
    static partyStartingXP = 0;
    static partyXPRecord = 0;
    static partyDailyBudget = 0;
    static partyExtraDailyBudget = 0;
    static partyShortRestBudget = 0;
    static partyInitialBudgetRemain = 0;

    static calculatePartyBudget(){
        Party.partyDailyBudget = dailyBudget[Party.partyLevel] * Party.partyNumber;
        Party.partyExtraDailyBudget = Party.partyDailyBudget * 1.5;
        Party.partyShortRestBudget = Party.partyDailyBudget/3;
        Party.partyInitialBudgetRemain = Party.partyDailyBudget-Party.partyStartingXP;
    }
}

// Individual Monster Class
class Monster {

    static currentMonsterId = "A1";
    static monsterObjects = {};


    constructor(cr, name) {
        this.monsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // eg A1
        this.monsterCr = parseFloat(cr); // Challenge Rating
        this.monsterName = name || `Mon${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`; // Default name if not provided
        this.monsterXP = undefined;
        this.checkMonsterXP(); // Calculate XP during initialization
    }

    checkMonsterXP() {
        if (monsterCrXP.hasOwnProperty(this.monsterCr)) {
            this.monsterXP = monsterCrXP[this.monsterCr]; //Single xp for this monster
        } else {
            this.monsterXP = 0;
            var table = document.getElementById("EncounterTable");
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "Invalid CR. Valid CR are 0.125, 1/8, 0.25, 1/4, 0.5, 1/2, and whole numbers 1-30"; 
        }
    }
}

function createNewMonster(encMonCr,encMonName){
    if (encMonName === undefined) {
        encMonName = `Mon${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`;
    } 
    Monster.monsterObjects[EncounterGroup.groupCurrentId+Encounter.encounterCurrentId] = 
        new Monster(encMonCr,encMonName);
};

// Individual Encounter Class (eg 2xGiant Apes as part of a larger group)
class Encounter {

    static encounterCurrentId = 1;
    static encounterObjects = {};
    static encounterRecentQty;
    static encounterRecentBasicXP;


    // Constructor
    constructor(qty) {
        this.encounterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId;
        this.encounterMonsters = []; 
        this.encounterMonQty = qty;
        Encounter.encounterRecentQty = qty;
    }

    addMonster(monster, qty){
            this.encounterMonsters.push(monster);
            this.encounterMonQty = qty;
            this.encounterBasicXP = monster.monsterXP * qty;
            Encounter.encounterRecentBasicXP = this.encounterBasicXP;
    }
}

function createNewEncounter(qty){
    let encounterName = `${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`;
    Encounter.encounterObjects[encounterName] = new Encounter(qty);
    Encounter.encounterObjects[encounterName].addMonster(Monster.monsterObjects[EncounterGroup.groupCurrentId+Encounter.encounterCurrentId],qty);
    console.log(`Created Encounter ${encounterName}`);

    EncounterGroup.groupObjects[EncounterGroup.groupCurrentId] = new EncounterGroup();
    EncounterGroup.groupObjects[EncounterGroup.groupCurrentId].addEncounter(Encounter.encounterObjects[Monster.currentMonsterId]);
}

// Group of Encounters Class
class EncounterGroup {
    static groupCurrentId = "A";
    static groupObjects = {};
    static groupRecentBasicXP;
    static groupRecentAdjXP;

    constructor(){
        this.groupId = `Group${EncounterGroup.groupCurrentId}`;
        this.groupEncounters = [];
        this.groupBasicXP;
        this.groupAdjXP;
        this.groupRatioXP;
        this.groupDeadliness;
    }

    addEncounter(encounter) {
        if (encounter !== undefined) {
            this.groupEncounters.push(encounter);
            this.groupQty = Encounter.encounterRecentQty++;
            this.calculateGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    calculateGroupXP(){
        let XPMod = encounterMultipliers.find(multiplier => multiplier.monsters === this.groupQty)?.multiplier || 1;
    
        // Ensure groupBasicXP and groupAdjXP are initialized
        this.groupBasicXP = 0;
        this.groupAdjXP = 0;
    
        // Calculate total group XP
        this.groupEncounters.forEach(encounter => {
            this.groupBasicXP += encounter.encounterBasicXP;
        });
    
        EncounterGroup.groupRecentBasicXP = this.groupBasicXP;
        this.groupAdjXP = this.groupBasicXP * XPMod;
        EncounterGroup.groupRecentAdjXP = this.groupAdjXP;

        this.groupDeadliness = this.determineGroupDeadliness(Party.partyLevel, EncounterGroup.groupRecentAdjXP);
        this.groupDeadlyXP = combatEncounterDifficulty[Party.partyLevel].deadly * Party.partyNumber;
        this.groupRatioXP = Number((this.groupAdjXP / this.groupDeadlyXP).toFixed(2));
    }

    determineGroupDeadliness(partyLevel, groupAdjXP) {
        var difficultyThresholds = combatEncounterDifficulty[partyLevel] ;
        if (groupAdjXP < (difficultyThresholds.easy * Party.partyNumber)) {
            return "Trivial"; 
        } else if (groupAdjXP < difficultyThresholds.medium * Party.partyNumber) {
            return "Easy";
        } else if (groupAdjXP < difficultyThresholds.hard * Party.partyNumber) {
            return "Medium";
        } else if (groupAdjXP < difficultyThresholds.deadly * Party.partyNumber) {
            return "Hard";
        } else {
            return "Deadly";
        }
    }
}

function createNewEncounterGroup(){
    let groupName = EncounterGroup.groupCurrentId;
    EncounterGroup.groupObjects[groupName] = new EncounterGroup();

    let currentEncounterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId;
    let currentEncounter = Encounter.encounterObjects[currentEncounterId];


    EncounterGroup.groupObjects[groupName].addEncounter(currentEncounter);
    console.log(`Created Encounter Group ${groupName}`);
    console.log(`Added current encounter to group`);

    Day1.addEncounterGroup(EncounterGroup.groupObjects[groupName]);
}

// Individual Day Class
class Day {

    static dayId = 0;
    static dayName = "Day" + Day.dayId;
    static dayObjects = {};
    static dayTotalAdjXP = 0;
    static dailyRemainingXP = 0;

    constructor() {
        this.dayId ++;
        this.dayGroups = []; // Array to hold all encounter groups
        this.dayTotalAdjXP = 0;
    }

    addEncounterGroup(encounterGroup) {
        if (encounterGroup !== undefined) {
            this.dayGroups.push(encounterGroup);
        } else {
            console.error("Invalid encounter group:", encounterGroup);
        }
        Day1.calculateDayAdjXP();
    }

    calculateDayAdjXP() {
        this.dayTotalAdjXP += EncounterGroup.groupRecentAdjXP;
        this.dailyRemainingXP = Party.partyDailyBudget - this.dayTotalAdjXP;
    }
}

function addEncounterCurrent() {
    Monster.currentMonsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // Store current ID before incrementing
    
    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let encMonName = document.getElementById('monsternameinput').value;

    createNewMonster(encMonCr, encMonName);
    createNewEncounter(encMonQuantity);

    EncounterGroup.currentEncounterGroup = EncounterGroup.groupObjects[EncounterGroup.groupCurrentId];
    console.log(`Current Encounter Group is ${EncounterGroup.currentEncounterGroup.groupId}`);

    Day1.calculateDayAdjXP();
    updateEncounterTable(encMonCr, encMonQuantity);
    //Update rows with current xp
    updateSheet();
    Encounter.encounterCurrentId++;
}

function addEncounterNew() {
    EncounterGroup.groupCurrentId = String.fromCharCode(EncounterGroup.groupCurrentId.charCodeAt(0) + 1);
    Encounter.encounterCurrentId = 1;
    Monster.currentMonsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // New group and encounter ID

    let encMonCr = document.getElementById('monsterCRinput').value;
    let encMonQuantity = document.getElementById('monsterqtyinput').value;
    let encMonName = document.getElementById('monsternameinput').value;

    createNewMonster(encMonCr, encMonName);
    createNewEncounter(encMonQuantity);
    EncounterGroup.groupObjects[EncounterGroup.groupCurrentId] = new EncounterGroup();

    createNewEncounterGroup();

    Day1.calculateDayAdjXP();
    updateEncounterTable(encMonCr, encMonQuantity);
    updateSheet();
    Encounter.encounterCurrentId++;

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

        Monster.currentMonsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // Ensure correct monster is accessed
        cell1.innerHTML = `<b>${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}:</b> `;
        cell2.innerHTML = Monster.monsterObjects[Monster.currentMonsterId].monsterName;
        cell3.innerHTML = ` CR${cr} (`;
        cell4.innerHTML = Monster.monsterObjects[Monster.currentMonsterId].monsterXP;
        cell5.innerHTML = 'xp) x ';
        cell6.innerHTML = qty;
        cell7.innerHTML = ' = ';
        cell8.innerHTML = Encounter.encounterObjects[Monster.currentMonsterId].encounterBasicXP;
        cell9.innerHTML = 'xp';

        document.getElementById("daily-total-xp").innerText = Day1.dayTotalAdjXP;
        document.getElementById("groupA-xp").innerText = EncounterGroup.groupObjects.A.groupAdjXP;
        document.getElementById("groupA-ratio").innerText = EncounterGroup.groupObjects.A.groupRatioXP;
        document.getElementById("groupA-deadliness").innerText = EncounterGroup.groupObjects.A.groupDeadliness;
        document.getElementById("daily-remaining-xp").innerText = Day1.dailyRemainingXP;

        
} 

function removeEncounter() {
    var table = document.getElementById("EncounterTable");
    table.deleteRow(-1);
    Encounter.encounterCurrentId--;

};

function updateSheet() {
    Party.partyLevel = document.getElementById('party-levelinput').value;
    Party.partyNumber = document.getElementById('party-numberinput').value;
    Party.partyStartingXP = document.getElementById('xpgainedforcurrent').value;

    document.getElementById("party-level").innerText = Party.partyLevel;
    document.getElementById("party-number").innerText = Party.partyNumber;

    Party.calculatePartyBudget();    
    document.getElementById("dailybudget").innerText = Party.partyDailyBudget;
    document.getElementById("partyshortbudget").innerText = Math.floor(Party.partyShortRestBudget);
    document.getElementById("partyinitialbudgetremain").innerText = Math.floor(Party.partyInitialBudgetRemain);
    

}

// Initialise Day 1 and Group A
let Day1 = new Day();
Day1.dayId = 1;
Day1.dayGroups = [];
Day1.dayTotalAdjXP = 0;

EncounterGroup.groupObjects[EncounterGroup.groupCurrentId] = new EncounterGroup();
EncounterGroup.groupObjects.A.groupId = "GroupA";
EncounterGroup.groupObjects.A.groupEncounters = [];
EncounterGroup.groupObjects.A.groupBasicXP = 0;