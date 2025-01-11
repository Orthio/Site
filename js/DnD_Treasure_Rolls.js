
import { generalDiceRoll, partyLevel } from './DnD_General.js';

let jsonData;

fetch('json/DnD_Treasure_Rolls.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

class TreasureRoll {
    //Individual treasure roll
    static currentId = 0;
    static treasureObjects = {};
    static treasure = "";
    static magicItem = "";
    static magicItemType = "";
    static itemRarityText = "";
    static currentTreasureText = "";
    static lastTreasureText = "";
    static CR = -1;
}

function createNewTreasure() {
    TreasureRoll.currentId++;
    TreasureRoll.treasureObjects[TreasureRoll.currentId] = new TreasureRoll;
}

function AddToTreasureRollText() {
    TreasureRoll.lastTreasureText = TreasureRoll.currentTreasureText + TreasureRoll.lastTreasureText;
    TreasureRoll.currentTreasureText = '<div class="treasure-text-results">' +
        '<div>' + TreasureRoll.treasure + '</div>' +
        '<div>' + TreasureRoll.magicItem + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '<div class="item-type">' + TreasureRoll.magicItemType + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;

}

function updateTreasureRollText() {
    TreasureRoll.currentTreasureText = '<div class="treasure-text-results">' +
        '<div>' + TreasureRoll.treasure + '</div>' +
        '<div>' + TreasureRoll.magicItem + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '<div class="item-type">' + TreasureRoll.magicItemType + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;
}


function findNextTableNumber(table, number) {
    for (let i = 0; i < table.length; i++) {
        if (table[i].max >= number) {
            return table[i]; // Return the matching row
        }
    }
    return null; // Return null if no matching row is found
}

function calcIndiTreasure() {
    createNewTreasure();
    let cr = parseInt(document.getElementById("CRInput").value);
    var indiTreasureTable = jsonData.indiTreasureTable;
    const matchingRow = findNextTableNumber(indiTreasureTable, cr);
    let currentTreasureRoll = TreasureRoll.treasureObjects[TreasureRoll.currentId];

    currentTreasureRoll.CR = matchingRow.minCR;

    if (matchingRow) {
        currentTreasureRoll.treasure =
            generalDiceRoll(matchingRow.roll2, matchingRow.roll1) * matchingRow.roll3;
    } else {
        console.error("row with " + TreasureRoll.CR + "not found");
    }

    TreasureRoll.treasure = TreasureRoll.currentId + ". Individual Treasure: " + currentTreasureRoll.treasure + "gp";
    TreasureRoll.magicItem = "";
    TreasureRoll.magicItemType = "";
    TreasureRoll.itemRarityText = "";

    AddToTreasureRollText();

}



function calcHoardTreasure() {
    createNewTreasure();
    let cr = parseInt(document.getElementById("CRInput").value);
    let inputtedLevel = LevelInput.value;
    let hoardTreasureTable = jsonData.hoardTreasureTable;
    const matchingRow = findNextTableNumber(hoardTreasureTable, cr);


    let currentTreasureRoll = TreasureRoll.treasureObjects[TreasureRoll.currentId];
    currentTreasureRoll.CR = matchingRow.minCR;

    if (matchingRow) {
        currentTreasureRoll.treasure =
            generalDiceRoll(matchingRow.roll2, matchingRow.roll1) * matchingRow.roll3;

        currentTreasureRoll.magicItemsNo =
            generalDiceRoll(matchingRow.mroll2, matchingRow.mroll1) + matchingRow.mroll3;
    } else {
        console.error("row with " + currentTreasureRoll.CR + "not found");
    }

    let magicItemsPluralText = " Magic Items";
    if (currentTreasureRoll.magicItemsNo === 1) {
        magicItemsPluralText = " Magic Item";
    }

    TreasureRoll.treasure = TreasureRoll.currentId + ". TreasureHoard: " +
        currentTreasureRoll.treasure + "gp, and "
        + currentTreasureRoll.magicItemsNo + magicItemsPluralText;
    TreasureRoll.magicItem = "";
    TreasureRoll.magicItemType = "";
    TreasureRoll.itemRarityText = "";

    getItemLevel();

    AddToTreasureRollText(TreasureRoll.magicItemType);
}

function calcNewMag() {
    let magicItemRoll = generalDiceRoll(4, 1);
    let magicItemType1 = jsonData.magicItemTypeTable[magicItemRoll];
    TreasureRoll.magicItemType = " Rolled Item type is: " + magicItemType1;

    updateTreasureRollText();
}

function itemTheme(theme) {
    let itemTheme;

    switch (theme) {
        case "arcana":
            itemTheme = "Arcana";
            TreasureRoll.magicItemType = " Picked Item type is: " + itemTheme;
            updateTreasureRollText();
            break;
        case "armaments":
            itemTheme = "Armaments";
            TreasureRoll.magicItemType = "Picked Item type is: " + itemTheme;
            updateTreasureRollText();
            break;
        case "implements":
            itemTheme = "Implements";
            TreasureRoll.magicItemType = "Picked Item type is: " + itemTheme;
            updateTreasureRollText();
            break;
        case "relics":
            itemTheme = "Relics";
            TreasureRoll.magicItemType = "Picked Item type is: " + itemTheme;
            updateTreasureRollText();
            break;
        default:
            console.log("Unknown theme");
    }
}

function getItemLevel() {
    let itemLevelTable = jsonData.itemLevelTable;
    let inputtedLevel = LevelInput.value;
    let itemTableIndices = [
        jsonData.itemTableA, //itemTableIndex 0
        jsonData.itemTableB,
        jsonData.itemTableC,
        jsonData.itemTableD
    ];
    let itemRarityArray = [];
    let numberOfMagicItems = TreasureRoll.treasureObjects[TreasureRoll.currentId].magicItemsNo;
    let itemRollIndices = [
        generalDiceRoll(100), // itemRollIndex0
        generalDiceRoll(100),
        generalDiceRoll(100),
        generalDiceRoll(100),
        generalDiceRoll(100),
        generalDiceRoll(100)
    ];

    for (let i = 0; i < 6; i++) {
        const tableChoice = findNextTableNumber(itemLevelTable, inputtedLevel);
        let itemIndex = itemRollIndices[i % 6];
        let itemTableChoice = itemTableIndices[tableChoice.table];
        itemRarityArray[i] = findNextTableNumber(itemTableChoice, itemIndex);
    }

    let itemRarityText2 = [];
    let itemRarityTextFull = "";

    if (numberOfMagicItems < 3) {
        for (let i = 0; i < numberOfMagicItems; i++) {
            itemRarityText2.push(itemRarityArray[i].type);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            itemRarityText2.push(itemRarityArray[i].type);
        }

        itemRarityTextFull = itemRarityText2.join(', ');

        if (numberOfMagicItems > 3) {
            itemRarityTextFull += '<br>';
            for (let i = 3; i < numberOfMagicItems; i++) {
                itemRarityText2.push(itemRarityArray[i].type);
            }
        }

    }



    itemRarityTextFull = itemRarityText2.join(', ');


    let itemRarityText1 = "Rarity: ";
    TreasureRoll.itemRarityText = itemRarityText1 + itemRarityTextFull;


    // TreasureRoll.itemRarityText = itemRarityText1 + itemRarityText2.join(",");

}

document.getElementById("LevelInput").value = partyLevel;

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

const newButtonTheme = document.getElementById("button-theme");
const dropdownThemeLinks = document.querySelectorAll(".dropdown-content a");

dropdownThemeLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        const selectedTheme = this.getAttribute("data-value"); // Get the value of the selected item
        newButtonTheme.textContent = this.textContent + " Theme"; // Update button text
        itemTheme(selectedTheme); // Apply the theme logic
    });
});
