
import { generalDiceRoll, partyLevel, findNextTableNumber} from './DnD_General.js';

let jsonData;

fetch('json/DnD_Treasure_Rolls.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

  /*   enemyWeapons
    partyWeapons 
    artNature
    artJewelleryItems
    artEquipment
    artDiningItems
    artDecorativeItems
    artPersonalItems
    artMetalTypes
    artMaterialTypes
    artGemstoneTypes
    artDecorativeTechniques
    artDesignThemes
    hooks1
    hooks2
    origin
    tactics
    equipment1
    miscItems
    materialTraits
    treasures
    itemTraits
    materials */



class TreasureRoll {
    //Individual treasure roll
    static currentId = 0;
    static treasureObjects = {};
    static treasureText = "";
    static magicItemText = "";
    static magicItemTypeText = "";
    static treasureSplit1 = "";
    static treasureSplit2 = "";
    static treasureSplit3 = "";

    static treasureSplitText = "";
    static magicItemTypeName = "Random";
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
        '<div>' + TreasureRoll.treasureText + '</div>' +
        '<div>' + TreasureRoll.magicItemText + '</div>' +
        '<div class="treasure-split-text">' + TreasureRoll.treasureSplitText + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '<div class="item-type">' + TreasureRoll.magicItemTypeText + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;

}

function updateTreasureRollText() {
    TreasureRoll.currentTreasureText = '<div class="treasure-text-results">' +
        '<div>' + TreasureRoll.treasureText + '</div>' +
        '<div>' + TreasureRoll.magicItemText + '</div>' +
        '<div class="treasure-split-text">' + TreasureRoll.treasureSplitText + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '<div class="item-type">' + TreasureRoll.magicItemTypeText + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;
}


function findNextTableNumber2(table, number) {
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
    let indiTreasureTable = jsonData.indiTreasureTable;
    const matchingRow = findNextTableNumber(indiTreasureTable, cr);
    let currentTreasureRoll = TreasureRoll.treasureObjects[TreasureRoll.currentId];

    currentTreasureRoll.CR = matchingRow.minCR;

    if (matchingRow) {
        currentTreasureRoll.treasure =
            generalDiceRoll(matchingRow.roll2, matchingRow.roll1) * matchingRow.roll3;
    } else {
        console.error("row with " + TreasureRoll.CR + "not found");
    }

    calculateTreasureSplit();

    TreasureRoll.treasureText = TreasureRoll.currentId + ". Individual Treasure: " + currentTreasureRoll.treasure + "gp";
    TreasureRoll.magicItemText = "";
    TreasureRoll.magicItemTypeText = "";
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

    calculateTreasureSplit();

    TreasureRoll.treasureText = TreasureRoll.currentId + ". TreasureHoard: " +
        currentTreasureRoll.treasure + "gp, and "
        + currentTreasureRoll.magicItemsNo + magicItemsPluralText;
    TreasureRoll.magicItemText = "";
    TreasureRoll.magicItemTypeText = "";
    TreasureRoll.itemRarityText = "";

    getItemLevel();

    AddToTreasureRollText(TreasureRoll.magicItemTypeText);
}

function calcNewMag() {
    let magicItemRoll = generalDiceRoll(4, 1);
    let magicItemTypeName = jsonData.magicItemTypeTable[magicItemRoll];
    TreasureRoll.magicItemTypeName = magicItemTypeName;
    TreasureRoll.magicItemTypeText = " Rolled Item type is: " + magicItemTypeName;
    if (TreasureRoll.currentId > 0) {
        calculateTreasureSplit();
    };
    updateTreasureRollText();
}

function calculateTreasureSplit() {
    let currentTreasureTheme = TreasureRoll.magicItemTypeName; //eg Arcana
    let currentGP = TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure;

    let coinNumber;
    let tradeBarNumber;
    let tradeGoodsNumber;

    switch (currentTreasureTheme) {
        case "Arcana":
            //Gemstones
            TreasureRoll.treasureSplitText = currentGP + "gp worth of gemstones";
            break;
        case "Armaments":
            // Coin tradebars 50-50

            tradeBarNumber = Math.floor(currentGP / 2);
            coinNumber = currentGP - tradeBarNumber;
            TreasureRoll.treasureSplitText = coinNumber + "gp worth of coinage" +
                ", and " + tradeBarNumber + "gp worth of trade bars";

            break;
        case "Implements":
            // Coins, tradebars, trade goods - 30-10-40

            tradeGoodsNumber = Math.floor(currentGP * 0.4);
            tradeBarNumber = Math.floor(currentGP * 0.1);
            coinNumber = currentGP - tradeBarNumber - tradeGoodsNumber;

            TreasureRoll.treasureSplitText = coinNumber + "gp worth of coinage," +
                " " + tradeBarNumber + "gp worth of trade bars," +
                "<br>" + " and " + tradeGoodsNumber + "gp worth of trade goods";

            break;
        case "Relics":
            // Art objects
            TreasureRoll.treasureSplitText = currentGP + "gp worth of art objects";
            break;
        case "Random":
            // Random treasure
            let randomTreasureTypeTable = jsonData.randomTreasureTypeTable;
            let roll = generalDiceRoll(8);
            let treasureRoll = randomTreasureTypeTable[roll - 1];
            TreasureRoll.treasureSplitText = currentGP + "gp worth of " + treasureRoll;
            break;
        default:
            console.log("Unknown theme");
    }


}

function itemTheme(theme) {
    let itemTheme;

    switch (theme) {
        case "arcana":
            itemTheme = "Arcana";
            TreasureRoll.magicItemTypeText = " Picked Item type is: " + itemTheme;
            calculateTreasureSplit();
            updateTreasureRollText();
            break;
        case "armaments":
            itemTheme = "Armaments";
            TreasureRoll.magicItemTypeText = "Picked Item type is: " + itemTheme;
            calculateTreasureSplit();
            updateTreasureRollText();
            break;
        case "implements":
            itemTheme = "Implements";
            TreasureRoll.magicItemTypeText = "Picked Item type is: " + itemTheme;
            calculateTreasureSplit();
            updateTreasureRollText();
            break;
        case "relics":
            itemTheme = "Relics";
            TreasureRoll.magicItemTypeText = "Picked Item type is: " + itemTheme;
            calculateTreasureSplit();
            updateTreasureRollText();
            break;
        case "random":
            let magicItemRoll = generalDiceRoll(4, 1);
            let magicItemTypeName = jsonData.magicItemTypeTable[magicItemRoll];

            TreasureRoll.magicItemTypeText = "Picked Item type is: " + magicItemTypeName;
            calculateTreasureSplit();
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


    let itemRarityText1 = "Magic Item Rarity: ";
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

const newButtonMag = document.querySelector("#button-treasure-theme");

newButtonMag.addEventListener("click", () => {
    calcNewMag();
    newButtonTheme.textContent = TreasureRoll.magicItemTypeName + " Theme"; // Update button text

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
