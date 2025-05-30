
import { generalDiceRoll, partyLevel } from './DnD_General.js';

fetch('json/bestiary-xmm.json')
    .then(res => res.json())
    .then(data => {
        const monsters = data.monster;

        /*     // Initial render: show full list
            renderResults(monsters); */

        // Filter on search
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            const filtered = monsters.filter(mon =>
                mon.name.toLowerCase().includes(query)
            );
            renderResults(filtered);
        });
    })
    .catch(error => {
        resultsList.innerHTML = `<li>Error loading monster data: ${error}</li>`;
    });

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
        1: { VeryLow: 25, Low: 50, Moderate: 75, High: 100 },
        2: { VeryLow: 50, Low: 100, Moderate: 150, High: 200 },
        3: { VeryLow: 75, Low: 150, Moderate: 225, High: 400 },
        4: { VeryLow: 125, Low: 250, Moderate: 375, High: 500 },
        5: { VeryLow: 250, Low: 500, Moderate: 750, High: 1100 },
        6: { VeryLow: 300, Low: 600, Moderate: 1000, High: 1400 },
        7: { VeryLow: 350, Low: 750, Moderate: 1300, High: 1700 },
        8: { VeryLow: 550, Low: 1000, Moderate: 1700, High: 2100 },
        9: { VeryLow: 650, Low: 1300, Moderate: 2000, High: 2600 },
        10: { VeryLow: 800, Low: 1600, Moderate: 2300, High: 3100 },
        11: { VeryLow: 950, Low: 1900, Moderate: 2900, High: 4100 },
        12: { VeryLow: 1100, Low: 2200, Moderate: 3700, High: 4700 },
        13: { VeryLow: 1300, Low: 2600, Moderate: 4200, High: 5400 },
        14: { VeryLow: 1450, Low: 2900, Moderate: 4900, High: 6200 },
        15: { VeryLow: 1650, Low: 3300, Moderate: 5400, High: 7800 },
        16: { VeryLow: 1900, Low: 3800, Moderate: 6100, High: 9800 },
        17: { VeryLow: 2250, Low: 4500, Moderate: 7200, High: 11700 },
        18: { VeryLow: 2500, Low: 5000, Moderate: 8700, High: 14200 },
        19: { VeryLow: 2750, Low: 5500, Moderate: 10700, High: 17200 },
        20: { VeryLow: 3200, Low: 6400, Moderate: 13200, High: 22000 }
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
    static easyThreshold = 0;
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
        Party.easyThreshold = globalVariables.getCombatEncounterDifficulty(Party.partyListedLevel, "VeryLow") * Party.partyNumber;
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

    static monstersReset() {
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
    static encounterCurrentGroupText = "Z0";
    static encounterObjects = {};

    constructor(qty) {
        this.encounterGroupText = Encounter.encounterCurrentGroupText;
        this.encounterGroupTextNo = Encounter.encounterCurrentGroupNo;
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

    calculateThisEncounterXP() {
        this.encounterBasicXP =
            this.encounterMonsters[0].monsterXP * this.encounterMonQty;
        this.encounterHP = this.encounterMonsters[0].monsterHP * this.encounterMonQty;
    }

    static calculateFullEncounterXP() {
        for (let encId in Encounter.encounterObjects) {
            let encounter = Encounter.encounterObjects[encId];
            encounter.calculateThisEncounterXP();
        }
    }

    static encountersReset() {
        Encounter.CurrentId = -1;
        Encounter.encounterCurrentId = -1;
        Encounter.encounterCurrentGroupNo = 0;
        Encounter.encounterCurrentGroupText = "Z0";
        Encounter.encounterObjects = {};

    }
}

function createNewEncounter(qty) {
    Encounter.encounterCurrentId++;
    Encounter.encounterCurrentGroupNo++;
    Encounter.encounterCurrentGroupText = Group.groupCurrentLetter + Encounter.encounterCurrentGroupNo;
    Encounter.encounterObjects[Encounter.encounterCurrentId] = new Encounter(qty);
    // console.log(`Encounter Tag ${Encounter.encounterCurrentGroupText} has been added at Id ${Encounter.encounterCurrentId}`);

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

    Encounter.encounterCurrentId--;
    if (Encounter.encounterCurrentGroupNo == 1) {
        if (Encounter.encounterCurrentId == -1) {
            resetTables();
            return
        }
        Encounter.encounterCurrentGroupNo =
            Encounter.encounterObjects[Encounter.encounterCurrentId].encounterGroupTextNo;
    } else {
        Encounter.encounterCurrentGroupNo--;
    }
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
            this.calculateThisGroupXP();
        } else {
            console.error("Invalid encounter object:", encounter);
        }
    }

    removeEncounterFromGroup(encounter) {
        this.groupEncounters = this.groupEncounters.filter(e => e !== encounter);
        // this.calculateThisGroupXP();
    }

    calculateThisGroupXP() {
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

    static calculateFullGroupXP() {
        for (let groupId in Group.groupObjects) {
            let group = Group.groupObjects[groupId];
            group.calculateThisGroupXP();
        }
    }

    determineGroupDeadliness(groupXP) {
        if (groupXP < Party.easyThreshold) {
            return "Easy";
        } else if (groupXP < Party.lowThreshold) {
            return "Low";
        } else if (groupXP < Party.moderateThreshold) {
            return "Moderate";
        } else if (groupXP < Party.highThreshold) {
            return "High";
        } else {
            return "Very High"
        }
    }

    static groupsReset() {
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

    calculateThisDayXP() {
        let totalXP = 0;
        this.dayGroups.forEach(group => {
            totalXP += group.groupXP;
        });
        this.dayTotalXP = totalXP;
        this.dailyRemainingXP = Party.partyDailyBudget - this.dayTotalXP;
        this.dailyBasicXP = this.dayGroups.reduce((acc, group) => acc + parseFloat(group.groupXP), 0);
    }

    static calculateFullDayXP() {
        for (let dayId in Day.dayObjects) {
            let day = Day.dayObjects[dayId];
            day.calculateThisDayXP();
        }
    }

    static daysReset() {
        Day.dayCurrentId = -1;
        Day.dayObjects = {};
        document.getElementById("daily-total-xp").innerText = "";
        document.getElementById("daily-remaining-xp").innerText = "";
        document.getElementById("daily-ratio").innerText = "";
        createNewDay();
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

    Day.dayObjects[Day.dayCurrentId].calculateThisDayXP();

    updateSheet();
}

function resetTables() {
    encounterTable.innerHTML = "";
    groupTable.innerHTML = "";
    Encounter.encountersReset();
    Monster.monstersReset();
    Group.groupsReset();
    Day.daysReset();

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
    Encounter.encounterObjects[Encounter.encounterCurrentId].calculateThisEncounterXP();
    Group.groupObjects[Group.groupCurrentId].calculateThisGroupXP();
    Day.calculateFullDayXP();
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
    Encounter.encounterObjects[Encounter.encounterCurrentId].calculateThisEncounterXP();
    Group.groupObjects[Group.groupCurrentId].calculateThisGroupXP();
    Day.calculateFullDayXP();
    updateSheet();
}


function removeEncounter() {
    if (Encounter.encounterCurrentId < 0) {
        console.log("No encounters left to remove.");
        resetTables();
        return;
    }

    let currentEncounter = Encounter.encounterObjects[Encounter.encounterCurrentId];
    if (!currentEncounter) {
        console.warn("Tried to remove an encounter that doesn't exist.");
        return;
    }

    for (let i = 0; i < currentEncounter.encounterMonsters.length; i++) {
        removeLastMonster();
    }

    removeLastEncounter();

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
            groupTable.deleteRow(-1);
        }

        if (currentDay.dayGroups.length === 0) {
            console.log("All groups are gone, removing the day and resetting the page.");
            removeLastDay();

            resetTables();
            updateSheet();
            return;
        }
    }

    Encounter.calculateFullEncounterXP();
    Group.calculateFullGroupXP();
    Day.calculateFullDayXP();
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

    document.getElementById("difficulty-easy").innerText = Party.easyThreshold;
    document.getElementById("difficulty-low").innerText = Party.lowThreshold;
    document.getElementById("difficulty-moderate").innerText = Party.moderateThreshold;
    document.getElementById("difficulty-high").innerText = Party.highThreshold;
}


function updateEncounterTable() {
    let rowNumber = Encounter.encounterCurrentId + 1; // check the +1
    let columnNumber = 10;

    function addEncounterRow() {
        let encounterTable = document.getElementById("encounter-table");
        if (!encounterTable) {
            console.error("Encounter table not found!");
            return;
        }

        let newRow = encounterTable.insertRow(-1);

        for (let y = 0; y <= columnNumber; y++) {
            newRow.insertCell(y);
        }
    }

    for (let i = 0; i < rowNumber; i++) {
        // where i is the row number
        if (!encounterTable.rows[i]) { addEncounterRow() }
        encounterTable.rows[i].cells[0].innerHTML = `<b>${Encounter.encounterObjects[i].encounterGroupText}:</b> `;
        encounterTable.rows[i].cells[1].innerHTML = Monster.monsterObjects[i].monsterName;
        encounterTable.rows[i].cells[2].innerHTML = ` CR${Monster.monsterObjects[i].monsterCrText}  `;
        encounterTable.rows[i].cells[3].innerHTML = ` ${Monster.monsterObjects[i].monsterXP}xp`;
        encounterTable.rows[i].cells[4].innerHTML = " x ";
        encounterTable.rows[i].cells[5].innerHTML = Encounter.encounterObjects[i].encounterMonQty;
        encounterTable.rows[i].cells[6].innerHTML = " = ";
        encounterTable.rows[i].cells[7].innerHTML = Encounter.encounterObjects[i].encounterBasicXP;
        encounterTable.rows[i].cells[8].innerHTML = "xp ";
        encounterTable.rows[i].cells[9].innerHTML = `${Encounter.encounterObjects[i].encounterHP}hp `;
        encounterTable.rows[i].cells[10].innerHTML = ` Rolls: ${Encounter.encounterObjects[i].encounterRolls[0]}, 
        ${Encounter.encounterObjects[i].encounterRolls[1]}, 
        ${Encounter.encounterObjects[i].encounterRolls[2]}`;
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

        Group.groupObjects[groupId].calculateThisGroupXP();

        if (!groupTable.rows[groupId]) { addGroupRows() }

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

function renderResults(monsters) {
    resultsList.innerHTML = ''; // Clear previous list

    if (monsters.length === 0) {
        resultsList.innerHTML = '<li>No monsters found.</li>';
        return;
    }

    monsters.forEach(mon => {
        const li = document.createElement('li');
        const ac = mon.ac?.[0] ?? '?';
        const originalHP = mon.hp?.average ?? '?';
        const initialCR = mon.cr ?? '?';
        var cr = 0;
        var hp = 0;

        if (initialCR === "1/8") {
            cr = 0.125;
        }
        else if (initialCR === "1/4") {
            cr = 0.25;
        }
        else if (initialCR === "1/2") {
            cr = 0.5;
        } else {
            cr = parseInt(initialCR, 10.000);
        }

        if (cr >= 3) {
            hp = Math.floor(originalHP * 0.9);
        } else {
            hp = originalHP;
        }

        li.textContent = `${mon.name} (CR ${cr}, AC ${ac}, HP ${originalHP})`;

        // ✅ Add click handler to populate HP input
        li.addEventListener('click', () => {
            const hpInput = document.getElementById('js-monster-hp-input');
            if (hpInput) {
                hpInput.value = hp;
            }
            const monsterNameInput = document.getElementById('js-monster-name-input');
            if (monsterNameInput) {
                monsterNameInput.value = mon.name;
            }
            const monsterCRInput = document.getElementById('js-monster-cr-input');
            if (monsterCRInput) {
                monsterCRInput.value = cr;
            }
        });

        resultsList.appendChild(li);
    });
}

function clearSearchBar() {
    resultsList.innerHTML = ''; // Clear previous list
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

const encounterTable = document.getElementById("encounter-table");
const groupTable = document.getElementById("group-table");

const searchBar = document.getElementById("search-bar");
const resultsList = document.getElementById("resultsList");

const clearSearchBarButton = document.querySelector("#clear-search-bar");
clearSearchBarButton.addEventListener("click", () => {
    clearSearchBar();
});

eventListeners.addInputListener('js-party-levelinput', updateSheet);

eventListeners.addInputListener('js-party-numberinput', updateSheet);

eventListeners.addInputListener('js-xpgainedforcurrent', updateSheet);

// Listen functions

document.addEventListener('DOMContentLoaded', () => {
    // Your startup function here
    initializePage();
});

function initializePage() {
    createNewDay();
    // createGroupTable();
    document.getElementById('js-party-levelinput').value = partyLevel;
}

window.onload = function () {
    // createNewDay();

    updateSheet();
}
