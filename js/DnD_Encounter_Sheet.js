
// Global variables

  // #region Variable Listing Region

var partyDPS = 30.8;

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


    constructor(cr, name, hp) {
        this.monsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // eg A1
        this.monsterCr = parseFloat(cr); // Challenge Rating
        this.monsterName = name || `Mon${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`; // Default name if not provided
        this.monsterHp = parseFloat(hp);
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

function createNewMonster(encMonCr,encMonName,encMonHP){
    if (encMonName === undefined) {
        encMonName = `Mon${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`;
    } 
    if (encMonHP === undefined) {
        encMonHP = 0;
    }
    Monster.monsterObjects[EncounterGroup.groupCurrentId+Encounter.encounterCurrentId] = 
        new Monster(encMonCr,encMonName,encMonHP);
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
        this.encounterRolls = [generalDiceRoll(20,1),generalDiceRoll(20,1),generalDiceRoll(20,1)];
    }

    addMonster(monster, qty){
            this.encounterMonsters.push(monster);
            this.encounterMonQty = qty;
            this.encounterBasicXP = monster.monsterXP * qty;
            Encounter.encounterRecentBasicXP = this.encounterBasicXP;
            this.encounterHP = monster.monsterHp * qty;
    }
}

function createNewEncounter(qty){
    let encounterName = `${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}`;
    Encounter.encounterObjects[encounterName] =  new Encounter(qty);
    Encounter.encounterObjects[encounterName].addMonster(Monster.monsterObjects[encounterName], qty);
    EncounterGroup.groupObjects[EncounterGroup.groupCurrentId].addEncounter(Encounter.encounterObjects[encounterName]);
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
        this.groupBasicXP = 0;
        this.groupAdjXP = 0;
        this.groupRatioXP = 0;
        this.groupDeadliness = "";
        this.groupHP = 0;
        this.groupQty = 0;
    }

    addEncounter(encounter) {
        if (encounter !== undefined) {
            this.groupEncounters.push(encounter);
            this.groupQty += encounter.encounterMonQty;
            this.groupHP += encounter.encounterHP;
            this.roundsToBeat = Math.ceil(this.groupHP / partyDPS);
            this.calculateGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    calculateGroupXP(){
        let XPMod = encounterMultipliers.find(multiplier => multiplier.monsters === this.groupQty)?.multiplier || 1;
    
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
    
    let encMonCr = document.getElementById('js-monster-cr-input').value;
    let encMonQuantity = document.getElementById('js-monster-qty-input').value;
    let encMonName = document.getElementById('js-monster-name-input').value;
    let encMonHP = document.getElementById('js-monster-hp-input').value;

    createNewMonster(encMonCr, encMonName, encMonHP);
    createNewEncounter(encMonQuantity);

    Day1.calculateDayAdjXP();
    updateEncounterTable(encMonCr, encMonQuantity);
    newRowGroupTable("current");
    updateGroupTable("current");

    updateSheet();
    Encounter.encounterCurrentId++;
}

function addEncounterNew() {
    EncounterGroup.groupCurrentId = String.fromCharCode(EncounterGroup.groupCurrentId.charCodeAt(0) + 1);
    Encounter.encounterCurrentId = 1;
    Monster.currentMonsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // New group and encounter ID

    let encMonCr = document.getElementById('js-monster-cr-input').value;
    let encMonQuantity = document.getElementById('js-monster-qty-input').value;
    let encMonName = document.getElementById('js-monster-name-input').value;
    let encMonHP = document.getElementById('js-monster-hp-input').value;

    createNewEncounterGroup(); 
    createNewMonster(encMonCr, encMonName, encMonHP);
    createNewEncounter(encMonQuantity);

    Day1.calculateDayAdjXP();
    updateEncounterTable(encMonCr, encMonQuantity);
    newRowGroupTable("new");
    updateGroupTable("new");

    updateSheet();
    Encounter.encounterCurrentId++;

}

function updateEncounterTable(cr, qty) {
    var table = document.getElementById("EncounterTable");
    Monster.currentMonsterId = EncounterGroup.groupCurrentId + Encounter.encounterCurrentId; // Ensure correct monster is accessed

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
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);


    cell1.innerHTML = `<b>${EncounterGroup.groupCurrentId}${Encounter.encounterCurrentId}:</b> `;
    cell2.innerHTML = Monster.monsterObjects[Monster.currentMonsterId].monsterName;
    cell3.innerHTML = ` CR${cr} (`;
    cell4.innerHTML = Monster.monsterObjects[Monster.currentMonsterId].monsterXP;
    cell5.innerHTML = 'xp) x ';
    cell6.innerHTML = qty;
    cell7.innerHTML = ' = ';
    cell8.innerHTML = Encounter.encounterObjects[Monster.currentMonsterId].encounterBasicXP;
    cell9.innerHTML = 'xp    &nbsp; &nbsp';
    cell10.innerHTML = `${Encounter.encounterObjects[Monster.currentMonsterId].encounterHP}hp `;
    cell11.innerHTML = `&nbsp &nbsp Rolls: ${Encounter.encounterObjects[Monster.currentMonsterId].encounterRolls[0]}, 
        ${Encounter.encounterObjects[Monster.currentMonsterId].encounterRolls[1]}, 
        ${Encounter.encounterObjects[Monster.currentMonsterId].encounterRolls[2]}`;

} 

var tableRowCheck = 0; // Initialize this variable to keep track of whether a data row exists.

function newRowGroupTable(newness) {
    var table = document.getElementById("GroupTable");

    if (newness === "new" || tableRowCheck === 0) {
        // Insert a new row for the Group header
        var headingRow = table.insertRow(-1);
        var newCell1 = headingRow.insertCell(0);
        newCell1.colSpan = 9;  // Make the heading span across all columns
        newCell1.innerHTML = `<b>Group ${EncounterGroup.groupCurrentId}</b>`;
        
        // Insert a new row for the data (so the data doesn't overwrite the heading)
        var dataRow = table.insertRow(-1);
        for (var i = 0; i < 9; i++) {
            dataRow.insertCell(i);  // Create empty cells
        }
        
        tableRowCheck = 1; // Mark that the data row has been added
    }
}

function updateGroupTable(newness) {
    var table = document.getElementById("GroupTable");
    var idForTable = EncounterGroup.groupCurrentId;

    var row;
    if (newness === "new" || tableRowCheck === 0) {
        // If newness is "new" or no data row exists, add a new row for the data.
        row = table.insertRow(-1);
        for (var i = 0; i < 9; i++) {
            row.insertCell(i);
        }
        tableRowCheck = 1; // Mark that the row has been added
    } else if (newness === "current") {
        // If newness is "current", update the last data row.
        row = table.rows[table.rows.length - 1];
    }

    // Assuming the row now has the correct number of cells
    var cell1 = row.cells[0];
    var cell2 = row.cells[1];
    var cell3 = row.cells[2];
    var cell4 = row.cells[3];
    var cell5 = row.cells[4];
    var cell6 = row.cells[5];
    var cell7 = row.cells[6];
    var cell8 = row.cells[7];
    var cell9 = row.cells[8];

    // Update the content of the cells with the group data
    cell1.innerHTML = EncounterGroup.groupObjects[idForTable].groupDeadliness;
    cell2.innerHTML = "- Adjusted XP: ";
    cell3.innerHTML = EncounterGroup.groupObjects[idForTable].groupAdjXP;
    cell4.innerHTML = ", Ratio: ";
    cell5.innerHTML = EncounterGroup.groupObjects[idForTable].groupRatioXP;
    cell6.innerHTML = ", TotalHP: ";
    cell7.innerHTML = EncounterGroup.groupObjects[idForTable].groupHP;
    cell8.innerHTML = " , Rounds: ";
    cell9.innerHTML = EncounterGroup.groupObjects[idForTable].roundsToBeat;

    // Update other relevant elements
    document.getElementById("daily-total-xp").innerText = Day1.dayTotalAdjXP;
    document.getElementById("daily-remaining-xp").innerText = Day1.dailyRemainingXP;
    document.getElementById("daily-ratio").innerText = (Day1.dayTotalAdjXP / Party.partyDailyBudget).toFixed(2);
}



function removeEncounter() {
    var table = document.getElementById("EncounterTable");
    table.deleteRow(-1);
    Encounter.encounterCurrentId--;

};

function updateSheet() {
    Party.partyLevel = document.getElementById('js-party-levelinput').value;
    Party.partyNumber = document.getElementById('js-party-numberinput').value;
    Party.partyStartingXP = document.getElementById('js-xpgainedforcurrent').value;

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

var tableRowCheck = 0; //Check if a row has been added to the Daily Table


EncounterGroup.groupObjects[EncounterGroup.groupCurrentId] = new EncounterGroup();
EncounterGroup.groupObjects.A.groupId = "GroupA";
EncounterGroup.groupObjects.A.groupEncounters = [];
EncounterGroup.groupObjects.A.groupBasicXP = 0;