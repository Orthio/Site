
import { generalDiceRoll, partyLevel } from './DnD_General.js';

let encounterTable = document.getElementById("encounter-table");
let groupTable = document.getElementById("group-table");

const globalVariables = (function () {
    let partyDPS = 30.8;

    let tableRowCheck = 0; //Check if a row has been added to the Daily Table
    // This is for the first row showing Group A or Group B on the High stats row at bottom

    let dailyBudget = {
        1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500, 6: 4000,
        7: 5000, 8: 6000, 9: 7500, 10: 9000, 11: 10500,
        12: 11500, 13: 13500, 14: 15000, 15: 18000, 16: 20000,
        17: 25000, 18: 27000, 19: 30000, 20: 40000
    };

    let monsterCrXP = {
        "0": 0, "0.125": 25, "1-8": 25, "0.25": 50, "1-4": 50,
        "0.5": 100, "1-2": 100, "1": 200, "2": 450, "3": 700,
        "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900,
        "9": 5000, "10": 5900, "11": 7200, "12": 8400, "13": 10000,
        "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000,
        "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000,
        "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000,
        "29": 135000, "30": 155000
    };

    const CRInputAllowedValues = [0.125, 1 / 8, 1 - 8, 0.25, 1 / 4, 1 - 4, 0.5, 1 / 2, 1 - 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

    let combatEncounterDifficulty = {
        1: { Low: 50, Moderate: 75, High: 100 },
        2: { Low: 100, Moderate: 150, High: 200 },
        3: { Low: 150, Moderate: 225, High: 400 },
        4: { Low: 250, Moderate: 375, High: 500 },
        5: { Low: 500, Moderate: 750, High: 1100 },
        6: { Low: 600, Moderate: 1000, High: 1400 },
        7: { Low: 750, Moderate: 1300, High: 1700 },
        8: { Low: 1000, Moderate: 1700, High: 2100 },
        9: { Low: 1300, Moderate: 2000, High: 2600 },
        10: { Low: 1600, Moderate: 2300, High: 3100 },
        11: { Low: 1900, Moderate: 2900, High: 4100 },
        12: { Low: 2200, Moderate: 3700, High: 4700 },
        13: { Low: 2600, Moderate: 4200, High: 5400 },
        14: { Low: 2900, Moderate: 4900, High: 6200 },
        15: { Low: 3300, Moderate: 5400, High: 7800 },
        16: { Low: 3800, Moderate: 6100, High: 9800 },
        17: { Low: 4500, Moderate: 7200, High: 11700 },
        18: { Low: 5000, Moderate: 8700, High: 14200 },
        19: { Low: 5500, Moderate: 10700, High: 17200 },
        20: { Low: 6400, Moderate: 13200, High: 22000 }
    };

    // Multipliers: Number of monsters, x1 multiplier
    // No longer used
    let encounterMultipliers = [
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

    let groupIdLetter = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G",
        7: "H",
        8: "I",
        9: "J",
        10: "K",
        11: "L",
        12: "M",
        13: "N"
    }

    return {
        getPartyDPS: function () {
            return partyDPS;
        },
        getDailyBudget: function (level) {
            return dailyBudget[level];
        },
        getMonsterCrXP: function (number) {
            return monsterCrXP[number];
        },
        checkMonsterCrXP: function (check) {
            return monsterCrXP.hasOwnProperty(check) ? "True" : "False";
            // Returns True if the array has the check cr
        },
        getCRInputAllowedValues: function () {
            return CRInputAllowedValues;
        },
        getCombatEncounterDifficulty: function (level, deadlyness) {
            return combatEncounterDifficulty[level][deadlyness];
        },
        getGroupIdLetter: function (id) {
            return groupIdLetter[id];
        },
        /*       getTableRowCheck: function () {
                  return tableRowCheck;
              },
              setTableRowCheck: function (number) {
                  tableRowCheck = number;
              } */
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
    static partyListedLevel = partyLevel;
    static partyNumber = 4;
    static partyStartingXP = 0;
    static partyXPRecord = 0;
    static partyDailyBudget = 0;
    static partyExtraDailyBudget = 0;
    static partyShortRestBudget = 0;
    static partyInitialBudgetRemain = 0;
    static lowThreshold = 0;
    static moderateThreshold = 0;
    static highThreshold = 0;

    static calculatePartyBudget() {
        Party.partyDailyBudget = globalVariables.getDailyBudget(Party.partyListedLevel) * Party.partyNumber;
        Party.partyExtraDailyBudget = Party.partyDailyBudget * 1.5;
        Party.partyShortRestBudget = Party.partyDailyBudget / 3;
        Party.partyInitialBudgetRemain = Party.partyDailyBudget - Party.partyStartingXP;
    }
    static calculatePartyDifficulties() {
        // Fetch thresholds for each difficulty level using the party level (cr)
        Party.lowThreshold = globalVariables.getCombatEncounterDifficulty(Party.partyListedLevel, "Low") * Party.partyNumber;
        Party.moderateThreshold = globalVariables.getCombatEncounterDifficulty(Party.partyListedLevel, "Moderate") * Party.partyNumber;
        Party.highThreshold = globalVariables.getCombatEncounterDifficulty(Party.partyListedLevel, "High") * Party.partyNumber;
    }
}

class Monster {
    // Individual Monster Class

    static monsterCurrentId = -1;
    static monsterObjects = {};


    constructor(cr, name, hp) {
        this.monsterId = Monster.monsterCurrentId;
        this.monsterCr = parseFloat(cr); // Challenge Rating
        this.monsterCrText = this.monsterCr;
        if (this.monsterCrText === 0.125) {
            this.monsterCrText = "1/8"
        }
        if (this.monsterCrText === 0.25) {
            this.monsterCrText = "1/4"
        }
        if (this.monsterCrText === 0.5) {
            this.monsterCrText = "1/2"
        }
        this.monsterName = name || `Mon${Monster.monsterCurrentId}`; // Default name if not provided
        this.monsterHP = parseFloat(hp);
        this.monsterXP = undefined;
        this.checkMonsterXP();
    }

    checkMonsterXP() {
        if (globalVariables.checkMonsterCrXP(this.monsterCr) === "True") {
            this.monsterXP = globalVariables.getMonsterCrXP(this.monsterCr); //Single xp for this monster
        } else {
            this.monsterXP = 0;
            console.log("Invalid CR. Valid CR are 0.125, 1/8, 0.25, 1/4, 0.5, 1/2, and whole numbers 1-30");
        }
    }

    monsterUpdate() {
        this.checkMonsterXP();
        this.monsterCrText = this.monsterCr;
        if (this.monsterCrText === 0.125) {
            this.monsterCrText = "1/8"
        }
        if (this.monsterCrText === 0.25) {
            this.monsterCrText = "1/4"
        }
        if (this.monsterCrText === 0.5) {
            this.monsterCrText = "1/2"
        }
    }

    monstersReset() {
        Monster.monsterCurrentId = -1;
        Monster.monsterObjects = {};
    }

}

function createNewMonster(encMonCr, encMonName, encMonHP) {
    Monster.monsterCurrentId++;
    if (encMonName === undefined) {
        encMonName = `Mon${Monster.monsterCurrentId}`;
    }
    if (encMonHP === undefined) {
        encMonHP = 0;
    }
    Monster.monsterObjects[Monster.monsterCurrentId] = new Monster(encMonCr, encMonName, encMonHP);
};

function removeLastMonster() {
    if (Monster.monsterCurrentId < 0) {
        console.log("No monsters left to remove.");
        return;
    }

    delete Monster.monsterObjects[Monster.monsterCurrentId];
    Monster.monsterCurrentId--;
}


class Encounter {
    // Individual Encounter Class (eg 2xGiant Apes as part of a larger group)

    static encounterCurrentId = -1;  // Overall id number for encounters
    static encounterCurrentGroupNo = 0;   // Group id for the number of the encounter in group eg A1
    static encounterCurrentTag = "Z0";
    static encounterObjects = {};

    constructor(qty) {
        this.encounterTag = Encounter.encounterCurrentTag;
        this.encounterGroupId = Encounter.encounterCurrentGroupNo;
        this.encounterMonsters = [];
        this.encounterMonQty = qty;
        this.encounterRolls = [generalDiceRoll(20, 1), generalDiceRoll(20, 1), generalDiceRoll(20, 1)];
        this.encounterBasicXP = 0;
        this.encounterHP = 0;
    }

    addMonster(monster, qty) {
        this.encounterMonsters.push(monster);
        this.encounterMonQty = qty;
        this.encounterBasicXP = monster.monsterXP * qty;
        this.encounterHP = monster.monsterHP * qty;
    }

    removeMonster() {
        this.encounterMonsters.pop();
    }

    encounterUpdateXP() {
        this.encounterBasicXP =
            this.encounterMonsters[0].monsterXP * this.encounterMonQty;
        this.encounterHP = this.encounterMonsters[0].monsterHP * this.encounterMonQty;
    }

    encountersReset() {
        Encounter.CurrentId = -1;
        Encounter.encounterCurrentId = -1;
        Encounter.encounterCurrentGroupNo = 0;
        Encounter.encounterCurrentTag = "Z0";
        Encounter.encounterObjects = {};

    }
}

function createNewEncounter(qty) {
    Encounter.encounterCurrentId++;
    Encounter.encounterCurrentGroupNo++;
    Encounter.encounterCurrentTag = Group.groupCurrentLetter + Encounter.encounterCurrentGroupNo;
    Encounter.encounterObjects[Encounter.encounterCurrentId] = new Encounter(qty);
    // console.log(`Encounter Tag ${Encounter.encounterCurrentTag} has been added at Id ${Encounter.encounterCurrentId}`);

}

function removeLastEncounter() {
    if (Encounter.encounterCurrentId < 0) {
        console.log("No encounters left to remove.");
        return;
    }

    let lastEncounter = Encounter.encounterObjects[Encounter.encounterCurrentId];

    if (Group.groupObjects[Group.groupCurrentId]) {
        Group.groupObjects[Group.groupCurrentId].removeEncounterFromGroup(lastEncounter);
    }

    delete Encounter.encounterObjects[Encounter.encounterCurrentId];

    // Handle monster removal — this assumes each encounter only has 1 type of monster for now
    for (let i = 0; i < lastEncounter.encounterMonsters.length; i++) {
        removeLastMonster();
    }

    Encounter.encounterCurrentId--;
    Encounter.encounterCurrentGroupNo--;

    // If no encounters remain in this group, you could also call removeLastGroup() here if wanted.
}


class Group {
    // Group of Encounters Class

    static groupCurrentId = -1;
    static groupCurrentLetter = "Z";
    static groupObjects = {};

    constructor() {
        this.groupLetter = `Group${Group.groupCurrentLetter}`;
        this.groupEncounters = [];
        this.groupXP = 0;
        this.groupRatioXP = 0;
        this.groupDeadliness = "";
        this.groupHP = 0;
        this.groupQty = 0;
        this.roundsToBeat = 0;
        this.groupHighXP = 0;

    }

    addEncounterToGroup(encounter) {
        if (encounter !== undefined) {
            this.groupEncounters.push(encounter);
            this.calculateGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    removeEncounterFromGroup(encounter) {
        this.groupEncounters = this.groupEncounters.filter(e => e !== encounter);
        this.calculateGroupXP();
    }

    calculateGroupXP() {
        this.groupXP = 0;
        this.groupHP = 0;
        this.groupQty = 0;

        this.groupEncounters.forEach(encounter => {
            this.groupXP += encounter.encounterBasicXP;
            this.groupHP += encounter.encounterHP;
            this.groupQty += parseFloat(encounter.encounterMonQty);
        });

        this.roundsToBeat = Math.ceil(this.groupHP / globalVariables.getPartyDPS());

        this.groupHighXP = globalVariables.getCombatEncounterDifficulty(Party.partyListedLevel, "High") * Party.partyNumber;

        this.groupDeadliness = this.determineGroupDeadliness(this.groupXP);

        this.groupRatioXP = Number((this.groupXP / this.groupHighXP).toFixed(2));
    }

    determineGroupDeadliness(groupXP) {
        if (groupXP < Party.moderateThreshold) {
            return "Low";
        } else if (groupXP < Party.highThreshold) {
            return "Moderate";
        } else {
            return "High";
        }
    }

    groupsReset() {
        Group.groupCurrentId = -1;
        Group.groupCurrentLetter = "Z";
        Group.groupObjects = {};
    }
}


function createNewGroup() {
    Group.groupCurrentId++;
    Group.groupCurrentLetter = globalVariables.getGroupIdLetter(Group.groupCurrentId);
    Group.groupObjects[Group.groupCurrentId] = new Group();
    Encounter.encounterCurrentGroupNo = 0;
    Day.dayObjects[Day.dayCurrentId].addGroupToDay(Group.groupObjects[Group.groupCurrentId]);
}

function removeLastGroup() {
    delete Group.groupObjects[Group.groupCurrentId];
    Group.groupCurrentId--;
    Group.groupCurrentLetter = globalVariables.getGroupIdLetter(Group.groupCurrentId);
    Encounter.encounterCurrentGroupNo = 0;
}

class Day {
    // Individual Day Class

    static dayCurrentId = -1;
    static dayObjects = {};

    constructor() {
        this.dayTag = "Day" + (Day.dayCurrentId + 1);
        this.dayGroups = []; // Array to hold all encounter groups
        this.dayTotalXP = 0;
        this.dailyRemainingXP = 0;
        this.dailyBasicXP = 0;
    }

    addGroupToDay(encounterGroup) {
        if (encounterGroup !== undefined) {
            this.dayGroups.push(encounterGroup);
        } else {
            console.error("Invalid encounter group:", encounterGroup);
        }
    }

    removeGroupFromDay() {
        this.dayGroups.pop();
        this.dayTotalXP -= Group.groupObjects[Group.groupCurrentId].groupXP;
        this.dailyRemainingXP = Party.partyDailyBudget + this.dayTotalXP;
        this.dailyBasicXP -= parseFloat(Group.groupObjects[Group.groupCurrentId].groupXP);
    }

    calculateDayAdjXP() {
        let totalXP = 0;
        this.dayGroups.forEach(group => {
            totalXP += group.groupXP;
        });
        this.dayTotalXP = totalXP;
        this.dailyRemainingXP = Party.partyDailyBudget - this.dayTotalXP;
        this.dailyBasicXP = this.dayGroups.reduce((acc, group) => acc + parseFloat(group.groupXP), 0);

    }

    calculateNegDayAdjXP() {
        let totalXP = 0;
        this.dayGroups.forEach(group => {
            totalXP += group.groupXP;
        });
        this.dayTotalXP = totalXP;
        this.dailyRemainingXP = Party.partyDailyBudget + this.dayTotalXP;
        this.dailyBasicXP = this.dayGroups.reduce((acc, group) => acc + parseFloat(group.groupXP), 0);

    }
}

function createNewDay() {
    Day.dayCurrentId++;
    Day.dayObjects[Day.dayCurrentId] = new Day();
};

function removeLastDay() {
    delete Day.dayObjects[Day.dayCurrentId];
    Day.dayCurrentId--;
};

function addEncounter(current) {
    // Adds a new encounter to the current group
    // current shows whether the group is "New" or "Current"

    let encMonCr = document.getElementById('js-monster-cr-input').value;
    let encMonQuantity = document.getElementById('js-monster-qty-input').value;
    let encMonName = document.getElementById('js-monster-name-input').value;
    let encMonHP = document.getElementById('js-monster-hp-input').value;

    if (current == "New") {
        createNewGroup();
    } else if (Group.groupCurrentId === -1 || Group.groupCurrentId === undefined) {
        createNewGroup();
    }

    createNewEncounter(encMonQuantity);

    createNewMonster(encMonCr, encMonName, encMonHP);

    Encounter.encounterObjects[Encounter.encounterCurrentId]
        .addMonster(Monster.monsterObjects[Monster.monsterCurrentId], encMonQuantity);
    Group.groupObjects[Group.groupCurrentId].addEncounterToGroup
        (Encounter.encounterObjects[Encounter.encounterCurrentId]);

    Day.dayObjects[Day.dayCurrentId].calculateDayAdjXP();

    updateSheet();
}

function resetTables() {
    encounterTable.innerHTML = "";
    groupTable.innerHTML = "";
    encountersReset();
    Monster.monstersReset();
    Group.groupsReset();

}

function CRUp() {
    let currentMonsterCr = Monster.monsterObjects[Monster.monsterCurrentId].monsterCr;
    if (currentMonsterCr == 0.125) {
        Monster.monsterObjects[Monster.monsterCurrentId].monsterCr = 0.25
    }
    else if (currentMonsterCr == 0.25) {
        Monster.monsterObjects[Monster.monsterCurrentId].monsterCr = 0.5
    }
    else if (currentMonsterCr == 0.5) {
        Monster.monsterObjects[Monster.monsterCurrentId].monsterCr = 1
    }
    else { Monster.monsterObjects[Monster.monsterCurrentId].monsterCr++ }

    Monster.monsterObjects[Monster.monsterCurrentId].monsterUpdate();
    Encounter.encounterObjects[Encounter.encounterCurrentId].encounterUpdateXP();
    Group.groupObjects[Group.groupCurrentId].calculateGroupXP();
    updateSheet();
}


function CRDown() {
    let currentMonsterCr = Monster.monsterObjects[Monster.monsterCurrentId].monsterCr;
    if (currentMonsterCr == 0.125) {
        console.log("Can't lower CR below 1/8")
    }
    else if (currentMonsterCr == 0.25) {
        Monster.monsterObjects[Monster.monsterCurrentId].monsterCr = 0.125
    }
    else if (currentMonsterCr == 0.5) {
        Monster.monsterObjects[Monster.monsterCurrentId].monsterCr = 0.25
    }
    else { Monster.monsterObjects[Monster.monsterCurrentId].monsterCr-- }

    Monster.monsterObjects[Monster.monsterCurrentId].monsterUpdate();
    Encounter.encounterObjects[Encounter.encounterCurrentId].encounterUpdateXP();
    Group.groupObjects[Group.groupCurrentId].calculateGroupXP();
   updateSheet();
}


function removeEncounter() {
    if (Encounter.encounterCurrentId < 0) {
        console.log("No encounters left to remove.");
        return;
    }

    let currentEncounter = Encounter.encounterObjects[Encounter.encounterCurrentId];
    if (!currentEncounter) {
        console.warn("Tried to remove an encounter that doesn't exist.");
        return;
    }

    // Remove all monsters associated with this encounter
    for (let i = 0; i < currentEncounter.encounterMonsters.length; i++) {
        removeLastMonster();
    }

    // Remove the actual encounter from objects
    removeLastEncounter();

    // Remove the last row of the encounter table (visual table update)
    if (encounterTable.rows.length > 1) {
        encounterTable.deleteRow(-1);
    }

    let currentGroup = Group.groupObjects[Group.groupCurrentId];
    let currentDay = Day.dayObjects[Day.dayCurrentId];

    if (currentGroup && currentGroup.groupEncounters.length === 0) {
        console.log(`Group ${currentGroup.groupLetter} is now empty, removing it.`);
        currentDay.removeGroupFromDay();
        removeLastGroup();

        let groupTable = document.getElementById("group-table");
        if (groupTable.rows.length > 1) {
            groupTable.deleteRow(-1); // Also clear group table row
        }

        if (currentDay.dayGroups.length === 0) {
            console.log("All groups are gone, removing the day and resetting the page.");
            removeLastDay();

            resetTables();
            updateSheet();
            return;
        }
    }

    // Recalculate day XP and refresh everything
    currentDay.calculateNegDayAdjXP();
    updateSheet();
}

// Update functions
function updateSheet() {
    updatePartyTable();
    updateEncounterTable();
    updateGroupTable();
    updateDayTable();
}

function updatePartyTable() {
    Party.partyListedLevel = document.getElementById('js-party-levelinput').value;
    Party.partyNumber = document.getElementById('js-party-numberinput').value;
    Party.partyStartingXP = document.getElementById('js-xpgainedforcurrent').value;

    document.getElementById("party-level").innerText = Party.partyListedLevel;
    document.getElementById("party-number").innerText = Party.partyNumber;

    Party.calculatePartyBudget();
    Party.calculatePartyDifficulties();

    document.getElementById("dailybudget").innerText = Party.partyDailyBudget;
    document.getElementById("partyshortbudget").innerText = Math.floor(Party.partyShortRestBudget);
    document.getElementById("partyinitialbudgetremain").innerText = Math.floor(Party.partyInitialBudgetRemain);

    document.getElementById("difficulty-low").innerText = Party.lowThreshold;
    document.getElementById("difficulty-moderate").innerText = Party.moderateThreshold;
    document.getElementById("difficulty-high").innerText = Party.highThreshold;
}


function updateEncounterTable() {
    let encounterTable = document.getElementById("encounter-table");
    if (!encounterTable) {
        console.error("Encounter table not found!");
        return;
    }

    // Clear existing table rows (except the header)
    while (encounterTable.rows.length > 1) {
        encounterTable.deleteRow(1);
    }

    // Populate the table with current encounters
    for (let i = 0; i <= Encounter.encounterCurrentId; i++) {
        let encounter = Encounter.encounterObjects[i];
        let monster = Monster.monsterObjects[i];

        if (!encounter || !monster) continue; // Ensure encounter exists

        let newRow = encounterTable.insertRow(-1);
        
        for (let y = 0; y <= 10; y++) {
            newRow.insertCell(y);
        }

        newRow.cells[0].innerHTML = `<b>${encounter.encounterTag}:</b>`;
        newRow.cells[1].innerHTML = monster.monsterName;
        newRow.cells[2].innerHTML = ` CR${monster.monsterCrText}`;
        newRow.cells[3].innerHTML = ` ${monster.monsterXP}xp`;
        newRow.cells[4].innerHTML = " x ";
        newRow.cells[5].innerHTML = encounter.encounterMonQty;
        newRow.cells[6].innerHTML = " = ";
        newRow.cells[7].innerHTML = encounter.encounterBasicXP;
        newRow.cells[8].innerHTML = "xp ";
        newRow.cells[9].innerHTML = `${encounter.encounterHP}hp `;
        newRow.cells[10].innerHTML = ` Rolls: ${encounter.encounterRolls[0]}, 
        ${encounter.encounterRolls[1]}, 
        ${encounter.encounterRolls[2]}`;
    }
}


function updateGroupTable() {

    Party.calculatePartyBudget();
    Party.calculatePartyDifficulties();

    let columnNumber = 9;

    function addGroupRows() {
        let groupTable = document.getElementById("group-table");
        if (!groupTable) {
            console.error("Group table not found!");
            return;
        }

        let newRow = groupTable.insertRow(-1);

        for (let i = 0; i <= columnNumber; i++) {
            newRow.insertCell(i);
        }
    }

    // Iterate through all groups and update their data
    // for (let i = 0; i <= rowNumber; i++) {

    for (let groupId in Group.groupObjects) {
        let group = Group.groupObjects[groupId];

        Group.groupObjects[groupId].calculateGroupXP();

        addGroupRows();

        groupTable.rows[groupId].cells[0].innerHTML = `<b>${group.groupLetter}</b>`;
        groupTable.rows[groupId].cells[1].innerHTML = group.groupDeadliness;
        groupTable.rows[groupId].cells[2].innerHTML = "&nbsp; &nbsp Group XP: ";
        groupTable.rows[groupId].cells[3].innerHTML = group.groupXP;
        groupTable.rows[groupId].cells[4].innerHTML = ", Ratio: ";
        groupTable.rows[groupId].cells[5].innerHTML = group.groupRatioXP;
        groupTable.rows[groupId].cells[6].innerHTML = ", TotalHP: ";
        groupTable.rows[groupId].cells[7].innerHTML = group.groupHP;
        groupTable.rows[groupId].cells[8].innerHTML = " , Rounds: " + group.roundsToBeat;
    }
}

function updateDayTable() {

    if (Day.dayObjects[Day.dayCurrentId].dayTotalXP != 0) {
        document.getElementById("daily-total-xp").innerText = Day.dayObjects[Day.dayCurrentId].dayTotalXP;
        document.getElementById("daily-remaining-xp").innerText = Day.dayObjects[Day.dayCurrentId].dailyRemainingXP;
        document.getElementById("daily-ratio").innerText = (Day.dayObjects[Day.dayCurrentId].dayTotalXP / Party.partyDailyBudget).toFixed(2);
    } else if (Day.dayObjects[Day.dayCurrentId].dayTotalXP == 0) {
        document.getElementById("daily-total-xp").innerText = "";
        document.getElementById("daily-remaining-xp").innerText = "";
        document.getElementById("daily-ratio").innerText = "";
    } else {
        console.warn("Day object is undefined, skipping XP updates.");
    }

}


// Listen functions
document.addEventListener('DOMContentLoaded', () => {
    // Your startup function here
    initializePage();
});

function initializePage() {
    createNewDay();
    // createGroupTable();
}

const addEncounterCurrentButton = document.querySelector("#add-encounter-current-button");

addEncounterCurrentButton.addEventListener("click", () => {
    addEncounter("Current");
});

const addEncounterNewButton = document.querySelector("#add-encounter-new-button");

addEncounterNewButton.addEventListener("click", () => {
    addEncounter("New");
});

const ResetButton = document.querySelector("#reset-button");

ResetButton.addEventListener("click", () => {
    resetTables();
});

const CRUpButton = document.querySelector("#cr-up-button");

CRUpButton.addEventListener("click", () => {
    CRUp();
});

const CRDownButton = document.querySelector("#cr-down-button");

CRDownButton.addEventListener("click", () => {
    CRDown();
});

const removeLastEncounterButton = document.querySelector("#remove-last-encounter");

removeLastEncounterButton.addEventListener("click", () => {
    removeEncounter();
});



window.onload = function () {
    // createNewDay();

    updateSheet();
}

eventListeners.addInputListener('js-party-levelinput', updateSheet);
// eventListeners.addInputListener('js-party-levelinput', updateDeadliness);
// eventListeners.addInputListener('js-party-levelinput', updateGroupTable("current"));

eventListeners.addInputListener('js-party-numberinput', updateSheet);
// eventListeners.addInputListener('js-party-numberinput', updateDeadliness);
// eventListeners.addInputListener('js-party-numberinput', updateGroupTable("current"));

eventListeners.addInputListener('js-xpgainedforcurrent', updateSheet);