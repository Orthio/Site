
const globalVariables = (function() {
    var partyDPS = 30.8;

    var tableRowCheck = 0; //Check if a row has been added to the Daily Table
    // This is for the first row showing Group A or Group B on the Deadly stats row at bottom

    var dailyBudget = {
        1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500, 6: 4000,
        7: 5000, 8: 6000, 9: 7500, 10: 9000, 11: 10500,
        12: 11500, 13: 13500, 14: 15000, 15: 18000, 16: 20000,
        17: 25000, 18: 27000, 19: 30000, 20: 40000
    };
    
    var monsterCrXP = {
        "0": 0, "0.125": 25, "1/8": 25, "0.25": 50, "1/4": 50, 
        "0.5": 100, "1/2": 100, "1": 200, "2": 450, "3": 700,
        "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900,
        "9": 5000, "10": 5900, "11": 7200, "12": 8400, "13": 10000,
        "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000,
        "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000,
        "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000,
        "29": 135000, "30": 155000
    };
    
    const CRInputAllowedValues = [0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    
    var combatEncounterDifficulty = {
        1: { Easy: 25, Medium: 50, Hard: 75, Deadly: 100 },
        2: { Easy: 50, Medium: 100, Hard: 150, Deadly: 200 },
        3: { Easy: 75, Medium: 150, Hard: 225, Deadly: 400 },
        4: { Easy: 125, Medium: 250, Hard: 375, Deadly: 500 },
        5: { Easy: 250, Medium: 500, Hard: 750, Deadly: 1100 },
        6: { Easy: 300, Medium: 600, Hard: 900, Deadly: 1400 },
        7: { Easy: 350, Medium: 750, Hard: 1100, Deadly: 1700 },
        8: { Easy: 450, Medium: 900, Hard: 1400, Deadly: 2100 },
        9: { Easy: 550, Medium: 1100, Hard: 1600, Deadly: 2400 },
        10: { Easy: 600, Medium: 1200, Hard: 1900, Deadly: 2800 },
        11: { Easy: 800, Medium: 1600, Hard: 2400, Deadly: 3600 },
        12: { Easy: 1000, Medium: 2000, Hard: 3000, Deadly: 4500 },
        13: { Easy: 1100, Medium: 2200, Hard: 3400, Deadly: 5100 },
        14: { Easy: 1250, Medium: 2500, Hard: 3800, Deadly: 5700 },
        15: { Easy: 1400, Medium: 2800, Hard: 4300, Deadly: 6400 },
        16: { Easy: 1600, Medium: 3200, Hard: 4800, Deadly: 7200 },
        17: { Easy: 2000, Medium: 3900, Hard: 5900, Deadly: 8800 },
        18: { Easy: 2100, Medium: 4200, Hard: 6300, Deadly: 9500 },
        19: { Easy: 2400, Medium: 4900, Hard: 7300, Deadly: 10900 },
        20: { Easy: 2800, Medium: 5700, Hard: 8500, Deadly: 12700 }
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
    
    var groupIdLetter = {
        1: "A",
        2: "B",
        3: "C",
        4: "D",
        5: "E",
        6: "F",
        7: "G",
        8: "H",
        9: "I",
        10: "J",
        11: "K",
        12: "L",
        13: "M",
        14: "N"
    }
    
    return {
        getPartyDPS: function() {
            return partyDPS;
        },
        getDailyBudget: function(level) {
            return dailyBudget[level]   ;
        }, 
        getMonsterCrXP: function(number) {
            return monsterCrXP[number];
        },
        checkMonsterCrXP: function(check) {
            return monsterCrXP.hasOwnProperty(check) ? "True" : "False";
            // Returns True if the array has the check cr
        },
        getCRInputAllowedValues: function() {
            return CRInputAllowedValues;
        },
        getCombatEncounterDifficulty: function(level, deadlyness) {
            return combatEncounterDifficulty[level][deadlyness];
        },
        getEncounterMultipliers: function(groupQty){
            let XPmod = encounterMultipliers.find(
                multiplier => multiplier.monsters === groupQty)?.multiplier || 1;
                return XPmod;
        },
        getGroupIdLetter: function(id){
            return groupIdLetter[id];
        },
        getTableRowCheck: function(){
            return tableRowCheck;
        },
        setTableRowCheck: function(number){
            tableRowCheck = number;
        }
};
})();

class EventListeners {
    constructor() {
    }

    // Generic method to add event listeners
    addListenerToElement(elementId, eventType, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, callback);
        } else {
            console.error(`Element with ID ${elementId} not found.`);
        }
    }

    // Method specifically for adding input event listeners
    addInputListener(elementId, callback) {
        this.addListenerToElement(elementId, 'change', callback);
    }
}

const eventListeners = new EventListeners();

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
        Party.partyDailyBudget = globalVariables.getDailyBudget(Party.partyLevel) * Party.partyNumber;
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
        this.monsterId = Group.groupCurrentLetter + Encounter.encounterCurrentId; // eg A1
        this.monsterCr = parseFloat(cr); // Challenge Rating
        this.monsterName = name || `Mon${Group.groupCurrentLetter}${Encounter.encounterCurrentId}`; // Default name if not provided
        this.monsterHp = parseFloat(hp);
        this.monsterXP = undefined;
        this.checkMonsterXP(); // Calculate XP during initialization
    }

    checkMonsterXP() {
        if (globalVariables.checkMonsterCrXP(this.monsterCr) === "True") {
            this.monsterXP = globalVariables.getMonsterCrXP(this.monsterCr); //Single xp for this monster
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
        encMonName = `Mon${Group.groupCurrentLetter}${Encounter.encounterCurrentId}`;
    } 
    if (encMonHP === undefined) {
        encMonHP = 0;
    }
    Monster.monsterObjects[Group.groupCurrentLetter+Encounter.encounterCurrentId] = 
        new Monster(encMonCr,encMonName,encMonHP);
};

// Individual Encounter Class (eg 2xGiant Apes as part of a larger group)
class Encounter {

    static encounterCurrentId = 0;
    static encounterPreviousId = 99;
    static encounterCurrentName = "Z1";
    static encounterObjects = {};
    static encounterRecentQty;
    static encounterRecentBasicXP;


    // Constructor
    constructor(qty) {
        this.encounterId = Group.groupCurrentLetter + Encounter.encounterCurrentId;
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

    removeMonster(){
        this.encounterMonsters.pop();
    }

    static updateCurrentId(){
        Encounter.encounterCurrentName = Group.groupCurrentLetter + Encounter.encounterCurrentId;
    }

}

function createNewEncounter(qty){
    Encounter.encounterCurrentName = `${Group.groupCurrentLetter}${Encounter.encounterCurrentId}`;
    Encounter.encounterObjects[Encounter.encounterCurrentName] =  new Encounter(qty);
}


// Group of Encounters Class
class Group {
    static groupCurrentId = 0;
    static groupPreviousId = 99;
    static groupCurrentLetter = "A";
    static groupObjects = {};
    static groupRecentBasicXP = 0;
    static groupRecentAdjXP = 0;

    constructor(){
        this.groupId = `Group${Group.groupCurrentLetter}`;
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
            this.roundsToBeat = Math.ceil(this.groupHP / globalVariables.getPartyDPS());
            this.groupBasicXP += encounter.encounterBasicXP;
            this.calculateGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    removeEncounter(encounter) {
        this.groupEncounters.pop();
        this.groupQty -= encounter.encounterMonQty;
        this.groupHP -= encounter.encounterHP;
        this.roundsToBeat = Math.ceil(this.groupHP / globalVariables.getPartyDPS());
        this.groupBasicXP -= encounter.encounterBasicXP;
        this.calculateNegGroupXP()
        Encounter.encounterCurrentId--
        Encounter.encounterPreviousId = 99;
    }


    calculateGroupXP(){
        let XPMod = globalVariables.getEncounterMultipliers(this.groupQty);
    
        Group.groupRecentBasicXP = this.groupBasicXP;
        this.groupAdjXP = this.groupBasicXP * XPMod;
        Group.groupRecentAdjXP = this.groupAdjXP;

        this.groupDeadliness = this.determineGroupDeadliness(Party.partyLevel, Group.groupRecentAdjXP);
        this.groupDeadlyXP = globalVariables.getCombatEncounterDifficulty(Party.partyLevel,this.groupDeadliness) * Party.partyNumber;
        this.groupRatioXP = Number((this.groupAdjXP / this.groupDeadlyXP).toFixed(2));
    }

    calculateNegGroupXP(){
        let XPMod = globalVariables.getEncounterMultipliers(this.groupQty);
    
        Group.groupRecentBasicXP = this.groupBasicXP;
        this.groupAdjXP = this.groupBasicXP * XPMod;
        Group.groupRecentAdjXP = this.groupAdjXP;

        this.groupDeadliness = this.determineGroupDeadliness(Party.partyLevel, Group.groupRecentAdjXP);
        this.groupDeadlyXP = globalVariables.getCombatEncounterDifficulty(Party.partyLevel,this.groupDeadliness) * Party.partyNumber;
        this.groupRatioXP = Number((this.groupAdjXP / this.groupDeadlyXP).toFixed(2));
    }


    determineGroupDeadliness(level, groupAdjXP) {
        var partyNumber = Party.partyNumber;

        // Fetch thresholds for each difficulty level using the party level (cr)
        var easyThreshold = globalVariables.getCombatEncounterDifficulty(level, "Easy") * partyNumber;
        var mediumThreshold = globalVariables.getCombatEncounterDifficulty(level, "Medium") * partyNumber;
        var hardThreshold = globalVariables.getCombatEncounterDifficulty(level, "Hard") * partyNumber;
        var deadlyThreshold = globalVariables.getCombatEncounterDifficulty(level, "Deadly") * partyNumber;
    
        // Compare the adjusted XP against the thresholds
        if (groupAdjXP < easyThreshold) {
            return "Trivial";
        } else if (groupAdjXP < mediumThreshold) {
            return "Easy";
        } else if (groupAdjXP < hardThreshold) {
            return "Medium";
        } else if (groupAdjXP < deadlyThreshold) {
            return "Hard";
        } else {
            return "Deadly";
        }
    }
}    

function createNewGroup(){
    // Creates a new encounter group for encounters to go in
    Group.groupPreviousId = Group.groupCurrentId;
    Group.groupCurrentId++;
    Group.groupCurrentLetter = globalVariables.getGroupIdLetter(Group.groupCurrentId);
    // Checks which letter the Id is at
    Group.groupObjects[Group.groupCurrentLetter] = new Group();

    Day1.addGroup(Group.groupObjects[Group.groupCurrentLetter]);
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

    addGroup(encounterGroup) {
        if (encounterGroup !== undefined) {
            this.dayGroups.push(encounterGroup);
        } else {
            console.error("Invalid encounter group:", encounterGroup);
        }
        Day1.calculateDayAdjXP();
    }

    removeGroup() {
        this.dayGroups.pop();
        this.dayTotalAdjXP -= Group.groupObjects[Group.groupCurrentLetter].groupAdjXP;
        this.dailyRemainingXP = Party.partyDailyBudget + this.dayTotalAdjXP; 
    }

    calculateDayAdjXP() {
        this.dayTotalAdjXP += Group.groupObjects[Group.groupCurrentLetter].groupAdjXP;
        this.dailyRemainingXP = Party.partyDailyBudget - this.dayTotalAdjXP;
    }

    calculateNegDayAdjXP() {
        this.dayTotalAdjXP -= Group.groupObjects[Group.groupCurrentLetter].groupAdjXP;
        this.dailyRemainingXP = Party.partyDailyBudget + this.dayTotalAdjXP;
    }
}

function addEncounterCurrent() {
    // Adds a new encounter to the current group
    Encounter.encounterPreviousId = Encounter.encounterCurrentId;
    Encounter.encounterCurrentId++;
    Encounter.updateCurrentId();
    if (Group.groupCurrentId === 0 || Group.groupCurrentId === undefined){
        createNewGroup();
        Group.groupCurrentLetter = globalVariables.getGroupIdLetter(Group.groupCurrentId);
    }
   
    Monster.currentMonsterId = Group.groupCurrentLetter + Encounter.encounterCurrentId; 
    // Store current ID before incrementing 
    let encMonCr = document.getElementById('js-monster-cr-input').value;
    let encMonQuantity = document.getElementById('js-monster-qty-input').value;
    let encMonName = document.getElementById('js-monster-name-input').value;
    let encMonHP = document.getElementById('js-monster-hp-input').value;

    
    createNewMonster(encMonCr, encMonName, encMonHP);
    createNewEncounter(encMonQuantity);
    Encounter.encounterObjects[Group.groupCurrentLetter+Encounter.encounterCurrentId]
        .addMonster(Monster.monsterObjects[Encounter.encounterCurrentName], encMonQuantity);
    Group.groupObjects[Group.groupCurrentLetter].addEncounter(Encounter.encounterObjects[Encounter.encounterCurrentName]);


    Day1.calculateDayAdjXP();
    updateEncounterTable();
    newRowGroupTable("current");
    updateGroupTable("current");

    updateSheet();
}

function addEncounterNew() {
    // Adds a new encounter to the day
    Encounter.encounterPreviousId = Encounter.encounterCurrentId;
    Encounter.encounterCurrentId = 1;
    createNewGroup(); 
    Group.groupCurrentLetter = globalVariables.getGroupIdLetter(Group.groupCurrentId);

    Monster.currentMonsterId = Group.groupCurrentLetter + Encounter.encounterCurrentId; 
    // New group and encounter ID
    let encMonCr = document.getElementById('js-monster-cr-input').value;
    let encMonQuantity = document.getElementById('js-monster-qty-input').value;
    let encMonName = document.getElementById('js-monster-name-input').value;
    let encMonHP = document.getElementById('js-monster-hp-input').value;

    createNewMonster(encMonCr, encMonName, encMonHP);
    createNewEncounter(encMonQuantity);
    Encounter.encounterObjects[Encounter.encounterCurrentName].addMonster(Monster.monsterObjects[Encounter.encounterCurrentName], encMonQuantity);
    Group.groupObjects[Group.groupCurrentLetter].addEncounter(Encounter.encounterObjects[Encounter.encounterCurrentName]);


    Day1.calculateDayAdjXP();
    updateEncounterTable();
    newRowGroupTable("new");
    updateGroupTable("new");

    updateSheet();
}

function removeRow() {
    var encounterTable = document.getElementById("EncounterTable");
    var groupTable = document.getElementById("GroupTable");

    if (Encounter.encounterCurrentId === 1){
        // If it's the first encounter in a group
        // Remove the group and undo the encounter stats
        Group.groupObjects[Group.groupCurrentLetter].removeEncounter(Encounter.encounterObjects[Encounter.encounterCurrentName]);
        Encounter.encounterObjects[Encounter.encounterCurrentName].removeMonster[Encounter.encounterCurrentId];
        Day1.removeGroup(Group.groupCurrentId);
        Day1.calculateNegDayAdjXP();
        Group.groupCurrentId--
        Encounter.updateCurrentId();
        encounterTable.deleteRow(-1);
        groupTable.deleteRow(-1);
        groupTable.deleteRow(-1); 
        // groupTable.deleteRow(-1); 

/*          var lastRow = groupTable.querySelector("tr:last-child");
        var secondLastRow = groupTable.querySelector("tr:nth-last-child(2)");

        // Remove the last row and second-to-last row
        if (secondLastRow) {
            secondLastRow.remove();
        } 
        if (lastRow) {
            lastRow.remove();
        } */
        globalVariables.setTableRowCheck(0);
        updateGroupTable("new");

    } else {
        // If it's the second encounter in a group
        // Remove the encounter and undo that encounter stats
        Group.groupObjects[Group.groupCurrentLetter].removeEncounter(Encounter.encounterObjects[Encounter.encounterCurrentName]);
        Encounter.encounterObjects[Encounter.encounterCurrentName].removeMonster[Encounter.encounterCurrentId];
        // No day remove group
        Day1.calculateNegDayAdjXP();
        Encounter.updateCurrentId();
        encounterTable.deleteRow(-1);
        updateGroupTable("current");

    }
};

function updateEncounterTable() {
    // Updates the encounter table
    var encounterTable = document.getElementById("EncounterTable");
    Monster.currentMonsterId = Group.groupCurrentLetter + Encounter.encounterCurrentId; // Ensure correct monster is accessed
    var cr = Monster.monsterObjects[Monster.currentMonsterId].monsterCr;
    var qty = Encounter.encounterObjects[Encounter.encounterCurrentName].encounterMonQty;

    var row = encounterTable.insertRow(-1);
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

    cell1.innerHTML = `<b>${Group.groupCurrentLetter}${Encounter.encounterCurrentId}:</b> `;
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

function newRowGroupTable(newness) {
    var groupTable = document.getElementById("GroupTable");
    var check = globalVariables.getTableRowCheck();

    if (newness === "new" || check === 0) {
        // Insert a new row for the Group header
        var headingRow = groupTable.insertRow(-1);
        
        var headingCell1 = headingRow.insertCell(0);
        headingCell1.innerHTML = `<b>Group ${Group.groupCurrentLetter}</b>`;
        
        // Insert empty cells for the rest of the row, so it spans across all columns
        for (var i = 1; i < 9; i++) {
            var emptyCell = headingRow.insertCell(i);
            emptyCell.innerHTML = "";  // Empty content to ensure it doesn't overwrite
        }

/*         // Insert a new row for the data
        var dataRow = groupTable.insertRow(-1);
        for (var i = 0; i < 9; i++) {
            dataRow.insertCell(i);  // Create empty cells
        } */

    }
     else if (newness === "current") {
        // If newness is "current", update the last data row.
    } 

}


function updateGroupTable(newness) {
    var groupTable = document.getElementById("GroupTable");
    var idForTable = Group.groupCurrentLetter;
    var check = globalVariables.getTableRowCheck();

    var groupRow;
    if (newness === "new" || check === 0) {
        // Add a new row for the data if it's "new" or no data row exists
        groupRow = groupTable.insertRow(-1);
        for (var i = 0; i < 9; i++) {
            groupRow.insertCell(i);  // Create empty cells
        }
        globalVariables.setTableRowCheck(1); // Mark that the row has been added
    } else if (newness === "current") {
        // Update the last data row if "current" is passed
        let rowLength = groupTable.rows.length-1;
        groupRow = groupTable.rows[rowLength];
        for (var i = 1; i < 8; i++) {
            groupRow.insertCell(i);  // Create empty cells
        }
        globalVariables.setTableRowCheck(1); // Mark that the row has been added
    }

    // Now update the individual cells
    var cell1 = groupRow.cells[0];
    var cell2 = groupRow.cells[1];
    var cell3 = groupRow.cells[2];
    var cell4 = groupRow.cells[3];
    var cell5 = groupRow.cells[4];
    var cell6 = groupRow.cells[5];
    var cell7 = groupRow.cells[6];
    var cell8 = groupRow.cells[7];
    var cell9 = groupRow.cells[8];

    cell1.innerHTML = Group.groupObjects[idForTable].groupDeadliness;
    cell2.innerHTML = "- Adjusted XP: ";
    cell3.innerHTML = Group.groupObjects[idForTable].groupAdjXP;
    cell4.innerHTML = ", Ratio: ";
    cell5.innerHTML = Group.groupObjects[idForTable].groupRatioXP;
    cell6.innerHTML = ", TotalHP: ";
    cell7.innerHTML = Group.groupObjects[idForTable].groupHP;
    cell8.innerHTML = " , Rounds: ";
    cell9.innerHTML = Group.groupObjects[idForTable].roundsToBeat;

    // Update other elements
    document.getElementById("daily-total-xp").innerText = Day1.dayTotalAdjXP;
    document.getElementById("daily-remaining-xp").innerText = Day1.dailyRemainingXP;
    document.getElementById("daily-ratio").innerText = (Day1.dayTotalAdjXP / Party.partyDailyBudget).toFixed(2);
}



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

eventListeners.addInputListener('js-party-levelinput', updateSheet);
eventListeners.addInputListener('js-party-numberinput', updateSheet);
eventListeners.addInputListener('js-xpgainedforcurrent',updateSheet)