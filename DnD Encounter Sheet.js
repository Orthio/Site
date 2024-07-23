// Global variables

var PartyLevel = 6;
var PartyNumbers = 4; 
var XPSoFar = 0;
var XPRecord = '';

// Daily Budget for 1 adventurer
var DailyBudget = {
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

var PartyDailyBudget = DailyBudget[PartyLevel] * PartyNumbers;
var PartyExtraDailyBudget = PartyDailyBudget * 1.5;
var PartyShortRestBudget = PartyDailyBudget/3;

var MonsterCR = {
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

function updateSheet() {
    var partyLevelElement = document.getElementById("party-level");
    if (partyLevelElement) {
        partyLevelElement.innerText = PartyLevel;
    } else {
        console.error("Element with ID 'party-level' not found.");
    }

    document.getElementById("party-numbers").innerText = PartyNumbers;
    document.getElementById("xpsofar").innerText = XPSoFar;
    document.getElementById("dailybudget").innerText = PartyDailyBudget;
    document.getElementById("partyshortbudget").innerText = Math.floor(PartyShortRestBudget);


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
consider how far into the adventuring day the encounter will take place, 
and finally consider the toasty heat that can be given off by taking your 
copy of XGTE and setting it on fucking fire then consider and how that will
 balance against the guilt you feel contributing to climate change.
*/
