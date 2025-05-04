
import { generalDiceRoll, partyLevel, findNextTableNumber, rollOnTable, findPreviousToNextHigher } from './DnD_General.js';

let jsonData;
let jsonRollTablesData;

fetch('json/DnD_Treasure_Rolls.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

fetch('json/DnD_Roll_Tables.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonRollTablesData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));


class TreasureRoll {
    //Individual treasure roll
    static currentId = 0;
    static treasureObjects = {};
    static treasureText = "";
    static magicItemText = "";
    static themeItemTypeText = "";
    static treasureSplit1 = "";
    static treasureSplit2 = "";
    static treasureSplit3 = "";

    static treasureValuesOriginalText = "";
    static treasureValuesText = "";
    static themeItemTypeInputName = "Random";
    static themeItemTypeSelectedName = "";
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
        '<div class="treasure-values-text">' + TreasureRoll.treasureValuesText + '</div>' +
        '<div class="item-type">' + TreasureRoll.themeItemTypeText + '</div>' +
        '<div class="treasure-values-original-text">' + TreasureRoll.treasureValuesOriginalText + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;

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

    calculateTreasureValue();

    let miscItemsIndi = jsonRollTablesData.miscItems;
    let treasuresIndi = jsonRollTablesData.treasures;
    let miscItemsIndiRoll = rollOnTable(miscItemsIndi);
    let treasuresIndiRoll = rollOnTable(treasuresIndi);

    TreasureRoll.treasureText = TreasureRoll.currentId + ". Individual Treasure: " + currentTreasureRoll.treasure + "gp";
    TreasureRoll.themeItemTypeText = "";
    TreasureRoll.treasureValuesOriginalText = "";
    TreasureRoll.treasureValuesText = miscItemsIndiRoll + ", " + treasuresIndiRoll;
    TreasureRoll.magicItemText = "";
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

    if (TreasureRoll.themeItemTypeInputName == "Random") {
        //  && TreasureRoll.themeItemTypeSelectedName != "Random"
        let newTheme = rollForTreasureTheme();
        TreasureRoll.themeItemTypeSelectedName = newTheme;
        updateRolledThemeText(newTheme);
    }
    else {
        updateRolledThemeText(TreasureRoll.themeItemTypeSelectedName);
    }

    TreasureRoll.treasureText = TreasureRoll.currentId + ". Treasure Hoard: " +
        currentTreasureRoll.treasure + "gp, and "
        + currentTreasureRoll.magicItemsNo + magicItemsPluralText;
    TreasureRoll.magicItemText = "";
    // TreasureRoll.themeItemTypeText = "";
    TreasureRoll.itemRarityText = "";

    getMagicItemRarity();

    AddToTreasureRollText();
}

function rollForTreasureTheme() {
    let themeItemRoll = generalDiceRoll(4, 1);
    let themeItemTypeSelectedName = jsonData.magicItemTypeTable[themeItemRoll];
    return themeItemTypeSelectedName;
}

function updateRolledThemeText(themeName) {
    TreasureRoll.themeItemTypeSelectedName = themeName;
    if (TreasureRoll.themeItemTypeInputName == "Random") {
        TreasureRoll.themeItemTypeText = " Rolled Treasure type is: " + TreasureRoll.themeItemTypeSelectedName;
    } else {
        TreasureRoll.themeItemTypeText = " Picked Treasure type is: " + TreasureRoll.themeItemTypeSelectedName;
    }
    if (TreasureRoll.currentId > 0) {
        calculateTreasureValue();
    };
}

function selectTreasureTheme(theme) {
    let itemTheme;

    switch (theme) {
        case "arcana":
            itemTheme = "Arcana";
            TreasureRoll.themeItemTypeInputName = itemTheme;
            TreasureRoll.themeItemTypeSelectedName = itemTheme;
            TreasureRoll.themeItemTypeText = " Picked Treasure type is: " + itemTheme;
            calculateTreasureValue();
            updateTreasureRollText();
            break;
        case "armaments":
            itemTheme = "Armaments";
            TreasureRoll.themeItemTypeInputName = itemTheme;
            TreasureRoll.themeItemTypeSelectedName = itemTheme;
            TreasureRoll.themeItemTypeText = "Picked Treasure type is: " + itemTheme;
            calculateTreasureValue();
            updateTreasureRollText();
            break;
        case "implements":
            itemTheme = "Implements";
            TreasureRoll.themeItemTypeInputName = itemTheme;
            TreasureRoll.themeItemTypeSelectedName = itemTheme;
            TreasureRoll.themeItemTypeText = "Picked Treasure type is: " + itemTheme;
            calculateTreasureValue();
            updateTreasureRollText();
            break;
        case "relics":
            itemTheme = "Relics";
            TreasureRoll.themeItemTypeInputName = itemTheme;
            TreasureRoll.themeItemTypeSelectedName = itemTheme;
            TreasureRoll.themeItemTypeText = "Picked Treasure type is: " + itemTheme;
            calculateTreasureValue();
            updateTreasureRollText();
            break;
        case "random":
            let themeItemRoll = generalDiceRoll(4, 1);
            itemTheme = jsonData.magicItemTypeTable[themeItemRoll];
            TreasureRoll.themeItemTypeInputName = "Random";
            TreasureRoll.themeItemTypeSelectedName = itemTheme;
            TreasureRoll.themeItemTypeText = "Rolled Treasure type is: " + itemTheme;
            calculateTreasureValue();
            updateTreasureRollText();
            break;

        default:
            console.log("Unknown theme");
    }
}

function calculateTreasureValue() {
    if (TreasureRoll.currentId <= 0) {
        return;
    }

    let currentTreasureTheme = TreasureRoll.themeItemTypeSelectedName; //eg Arcana
    let currentGP = TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure;

    let coinNumber;
    let tradeBarNumber;
    let tradeGoodsNumber;
    let tradeBarCheck;
    let tradeBarType;
    let tradeBarValue;
    let remainingGoldValue;
    let remainingGoldValue2;
    let remainingGoldValue3;
    let remainingGoldValue4;

    let gold = document.getElementById("GoldInput").value;
    if (gold != "") {
        currentGP = gold;
        TreasureRoll.treasureObjects[TreasureRoll.currentId].treasure = gold;
    }

    switch (currentTreasureTheme) {
        case "Arcana":
            //Gemstones
            let gemCheck = findPreviousToNextHigher(jsonData.gemstoneValues, currentGP);
            let gemCategory = jsonData.gems.find(gem => gem.name === gemCheck.type);
            let gemType = rollOnTable(gemCategory.table);
            let gemValue = gemCheck.value;
            remainingGoldValue = currentGP - gemValue;

            TreasureRoll.treasureValuesOriginalText = currentGP + "gp worth of gemstones";
            TreasureRoll.treasureValuesText = gemType + " worth " + gemValue + "gp, and other gems worth " + remainingGoldValue + "gp";
            break;
        case "Armaments":
            // Coin tradebars 50-50

            tradeBarNumber = Math.floor(currentGP / 2);
            coinNumber = currentGP - tradeBarNumber;
            tradeBarCheck = findPreviousToNextHigher(jsonData.tradeBarsTable, tradeBarNumber);
            tradeBarType = tradeBarCheck.type;
            tradeBarValue = tradeBarCheck.value;
            remainingGoldValue = currentGP - tradeBarValue;

            TreasureRoll.treasureValuesOriginalText = coinNumber + "gp worth of coin"
            ", and " + tradeBarNumber + "gp worth of trade bars";
            TreasureRoll.treasureValuesText = tradeBarType + " worth " + tradeBarValue + "gp, and coinage worth " + remainingGoldValue + "gp";

            break;
        case "Implements":
            // Coins, tradebars, trade goods - 10-10-80

            tradeGoodsNumber = Math.floor(currentGP * 0.8);
            tradeBarNumber = Math.floor(currentGP * 0.1);
            coinNumber = currentGP - tradeBarNumber - tradeGoodsNumber;

            tradeBarCheck = findPreviousToNextHigher(jsonData.tradeBarsTable, tradeBarNumber);
            tradeBarType = tradeBarCheck.type;
            tradeBarValue = tradeBarCheck.value;
            let tradeGoodsCheck = findPreviousToNextHigher(jsonData.tradeGoodsTable, tradeGoodsNumber);
            let tradeGoodsType = tradeGoodsCheck.type;
            let tradeGoodsValue = tradeGoodsCheck.value;
            remainingGoldValue = currentGP - tradeBarValue - tradeGoodsValue;

            TreasureRoll.treasureValuesOriginalText = coinNumber + "gp worth of coin," +
                " " + tradeBarNumber + "gp worth of trade bars," +
                "<br>" + " and " + tradeGoodsNumber + "gp worth of trade goods";
            TreasureRoll.treasureValuesText = tradeGoodsType + " worth " + tradeGoodsValue + "gp, " +
                tradeBarType + " worth " + tradeBarValue + "gp, and coinage worth " + remainingGoldValue + "gp";

            break;
        case "Relics":
            // Art objects
            let artCheck = findPreviousToNextHigher(jsonData.artObjectValues, currentGP);
            let artCategory = jsonData.artObjects.find(art => art.name === artCheck.type);
            let artType = rollOnTable(artCategory.table);
            let artValue = artCheck.value;
            remainingGoldValue2 = Math.floor(currentGP - artValue);

            let artType2 = rollOnTable(jsonRollTablesData.treasures);
            let artType3 = rollOnTable(jsonRollTablesData.miscItems);
            if (remainingGoldValue2 - artValue > 0) {
                remainingGoldValue3 = Math.floor((remainingGoldValue2 - artValue) * 2 / 3);
                remainingGoldValue4 = Math.floor((remainingGoldValue2 - artValue) * 1 / 3);
            } else {
                remainingGoldValue3 = 0
                remainingGoldValue4 = 0
            }

            TreasureRoll.treasureValuesOriginalText = currentGP + "gp worth of art objects";
            TreasureRoll.treasureValuesText = artType + " worth " + artValue + "gp, " +
                artType2 + " worth " + remainingGoldValue2 + "gp, " +
                artType3 + " worth " + remainingGoldValue3 + "gp";

            break;
        case "Random":
            // Random treasure
            let randomTreasureTypeTable = jsonData.randomTreasureTypeTable;
            let roll = generalDiceRoll(8);
            let treasureRoll = randomTreasureTypeTable[roll - 1];
            switch (treasureRoll) {
                case "Arcana":
                    processCategory("Arcana");
                    break;
                case "Armaments":
                    processCategory("Armaments");
                    break;
                case "Implements":
                    processCategory("Implements");
                    break;
                case "Relics":
                    processCategory("Relics");
                    break;
                case "Personal items":
                    let personalItemType = rollOnTable(jsonRollTablesData.artPersonalItems);

                    TreasureRoll.treasureValuesOriginalText = currentGP + "gp worth of personal items";
                    TreasureRoll.treasureValuesText = personalItemType + " worth " + currentGP + "gp";
                    break;
                case "Equipment":
                    let equipmentType = rollOnTable(jsonRollTablesData.equipment1);

                    TreasureRoll.treasureValuesOriginalText = currentGP + "gp worth of equipment";
                    TreasureRoll.treasureValuesText = equipmentType + " worth " + currentGP + "gp";
                    break;
                default:
                    TreasureRoll.treasureValuesText = currentGP + "gp worth of coinage";
                    break;
            }
            break;
        default:
            console.log("Unknown theme");
    }
}

function updateTreasureRollText() {
    if (TreasureRoll.currentId <= 0) {
        return;
    }
    TreasureRoll.currentTreasureText = '<div class="treasure-text-results">' +
        '<div>' + TreasureRoll.treasureText + '</div>' +
        '<div>' + TreasureRoll.magicItemText + '</div>' +
        '<div class="treasure-values-text">' + TreasureRoll.treasureValuesText + '</div>' +
        '<div class="item-type">' + TreasureRoll.themeItemTypeText + '</div>' +
        '<div class="treasure-values-original-text">' + TreasureRoll.treasureValuesOriginalText + '</div>' +
        '<div class="item-rarity-text">' + TreasureRoll.itemRarityText + '</div>' +
        '</div>';

    document.getElementById("results-output").innerHTML = TreasureRoll.currentTreasureText +
        TreasureRoll.lastTreasureText;
}

function getMagicItemRarity() {
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
    let themeItemRolls = [
        rollForTreasureTheme(),
        rollForTreasureTheme(),
        rollForTreasureTheme(),
        rollForTreasureTheme(),
        rollForTreasureTheme(),
        rollForTreasureTheme(),
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
            itemRarityText2.push(itemRarityArray[i].rarity + " " + themeItemRolls[i]);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            itemRarityText2.push(itemRarityArray[i].rarity + " " + themeItemRolls[i]);
        }

        itemRarityTextFull = itemRarityText2.join(', ');

        if (numberOfMagicItems > 3) {
            itemRarityTextFull += '<br>';
            for (let i = 3; i < numberOfMagicItems; i++) {
                itemRarityText2.push(itemRarityArray[i].rarity + " " + themeItemRolls[i]);
            }
        }

    }

    itemRarityTextFull = itemRarityText2.join(', ');

    let itemRarityText1 = "Magic Item Rarity: ";
    TreasureRoll.itemRarityText = itemRarityText1 + itemRarityTextFull;

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
    let newTheme = rollForTreasureTheme();
    TreasureRoll.themeItemTypeSelectedName = newTheme;
    updateRolledThemeText(newTheme);
    updateTreasureRollText();
    newButtonTheme.textContent = TreasureRoll.themeItemTypeInputName + " Theme"; // Update button text

});

const newButtonTheme = document.getElementById("button-theme");
const dropdownThemeLinks = document.querySelectorAll(".dropdown-content a");

dropdownThemeLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        const selectedTheme = this.getAttribute("data-value"); // Get the value of the selected item
        newButtonTheme.textContent = this.textContent + " Theme"; // Update button text
        selectTreasureTheme(selectedTheme); // Apply the theme logic
    });
});
