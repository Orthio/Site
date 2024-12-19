
import { generalDiceRoll } from './DnD_General.js';

const indiTreasureTable = [
    { minCR: 0, maxCR: 4, roll1: 3, roll2: 6, roll3: 1 },
    { minCR: 5, maxCR: 10, roll1: 2, roll2: 8, roll3: 10 },
    { minCR: 11, maxCR: 16, roll1: 2, roll2: 10, roll3: 100 },
    { minCR: 17, maxCR: 40, roll1: 2, roll2: 8, roll3: 1000 }
];

const hoardTreasureTable = [
    {
        minCR: 0,
        maxCR: 4,
        roll1: 2,
        roll2: 4,
        roll3: 100,
        mroll1: 1,
        mroll2: 4,
        mroll3: -1
    },
    {
        minCR: 5,
        maxCR: 10,
        roll1: 8,
        roll2: 10,
        roll3: 100,
        mroll1: 1,
        mroll2: 3,
        mroll3: 0
    },
    {
        minCR: 11,
        maxCR: 16,
        roll1: 8,
        roll2: 8,
        roll3: 10000,
        mroll1: 1,
        mroll2: 4,
        mroll3: 0
    },
    {
        minCR: 17,
        maxCR: 30,
        roll1: 6,
        roll2: 10,
        roll3: 10000,
        mroll1: 1,
        mroll2: 6,
        mroll3: 0
    }
];

var magicItemTypeTable = {
    1: "Arcana",
    2: "Armaments",
    3: "Implements",
    4: "Relics"
};

class TreasureRoll {
    //Individual treasure roll

    static currentId = 0;
    static treasureObjects = {};
    static currentCR = -1;

}

function createNewTreasure() {
    TreasureRoll.currentId++;
    TreasureRoll.treasureObjects[TreasureRoll.currentId] = new TreasureRoll;
}

function findNextMinCR(table, cr) {
    for (let i = 0; i < table.length; i++) {
        if (table[i].maxCR >= cr) {
            return table[i]; // Return the matching row
        }
    }
    return null; // Return null if no matching row is found
}

function calcIndiTreasure() {
    let cr = parseInt(document.getElementById("CRInput").value);

    const matchingRow = findNextMinCR(indiTreasureTable, cr);

    TreasureRoll.currentCR = matchingRow.minCR;
    createNewTreasure();
    TreasureRoll.treasureObjects[TreasureRoll.currentId].treasureId = TreasureRoll.currentId;

    if (matchingRow) {
        TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure =
            generalDiceRoll(matchingRow.roll2, matchingRow.roll1) * matchingRow.roll3;
    } else {
        console.error("row with " + TreasureRoll.currentCR + "not found");
    }

    let indiText = TreasureRoll.currentId + ". Individual Treasure: " + TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure + "gp";
    document.getElementById("results-output").innerHTML = indiText;

}

function calcNewMag() {
    let magicItemRoll = generalDiceRoll(4, 1);
    let magicItemType = magicItemTypeTable[magicItemRoll];
    let magicText = "Magic Item type is: " + magicItemType;
    // console.log(magicText);
    document.getElementById("results-output").innerHTML = magicText;
}

function calcHoardTreasure() {
    let cr = parseInt(document.getElementById("CRInput").value);

    const matchingRow = findNextMinCR(hoardTreasureTable, cr);

    TreasureRoll.currentCR = matchingRow.minCR;
    createNewTreasure();
    TreasureRoll.treasureObjects[TreasureRoll.currentId].treasureId = TreasureRoll.currentId;

    if (matchingRow) {
        TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure =
            generalDiceRoll(matchingRow.roll2, matchingRow.roll1) * matchingRow.roll3;

        TreasureRoll.treasureObjects[TreasureRoll.currentId].magicItems =
            generalDiceRoll(matchingRow.mroll2, matchingRow.mroll1) + matchingRow.mroll3;
    } else {
        console.error("row with " + TreasureRoll.currentCR + "not found");
    }

    var magicItemsText = " Magic Items";
    if (TreasureRoll.treasureObjects[TreasureRoll.currentId].magicItems === 1) {
        magicItemsText = " Magic Item";
    }
    let hoardText = TreasureRoll.currentId + ". TreasureHoard: " + TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure + "gp, and "
        + TreasureRoll.treasureObjects[TreasureRoll.currentId].magicItems + magicItemsText;
    document.getElementById("results-output").innerHTML = hoardText;

}




const newButtonUp = document.querySelector("#button-up");

newButtonUp.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    inputField.value = parseInt(inputField.value) + 1;  // Increment and update value
});

const newButtonDown = document.querySelector("#button-down");

newButtonDown.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    let inputValue = parseInt(inputField.value);  // Get the current value as a number
    if (inputValue > 1) {
        inputField.value = inputValue - 1;  // Decrement value if greater than 1
    }
});

const newButtonIndi = document.querySelector("#button-individual-treasure");

newButtonIndi.addEventListener("click", () => {
    calcIndiTreasure();
});

const newButtonHoard = document.querySelector("#button-treasure-hoard");

newButtonHoard.addEventListener("click", () => {
    calcHoardTreasure();
});

const newButtonMag = document.querySelector("#button-magic-item-type");

newButtonMag.addEventListener("click", () => {
    calcNewMag();
});
