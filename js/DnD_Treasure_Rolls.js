
import { generalDiceRoll } from './DnD_General.js';

let jsonData;

fetch('json/DnD_Treasure_Rolls.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
        //  console.log(data.artDecorativeTechniques["1"]); // Outputs "Platinum filigree"

        // console.log(data.artNature["2"]); // Outputs "Worn or Carried Ornaments"
    })
    .catch(error => console.error('Error fetching JSON:', error));

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

function findNextTableNumber(table, number) {
    for (let i = 0; i < table.length; i++) {
        if (table[i].maxCR >= number) {
            return table[i]; // Return the matching row
        }
    }
    return null; // Return null if no matching row is found
}

function calcIndiTreasure() {
    let cr = parseInt(document.getElementById("CRInput").value);
    var indiTreasureTable = jsonData.indiTreasureTable;
    const matchingRow = findNextTableNumber(indiTreasureTable, cr);

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
    document.getElementById("treasure-theme-output").innerHTML = null;


}

function calcNewMag() {
    let magicItemRoll = generalDiceRoll(4, 1);
    let magicItemType = jsonData.magicItemTypeTable[magicItemRoll];
    let magicText = "  Magic Item type is: " + magicItemType;
    // console.log(magicText);
    document.getElementById("treasure-theme-output").innerHTML = magicText;
}

function calcHoardTreasure() {
    let cr = parseInt(document.getElementById("CRInput").value);
    var hoardTreasureTable = jsonData.hoardTreasureTable;
    const matchingRow = findNextTableNumber(hoardTreasureTable, cr);

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

    document.getElementById("treasure-theme-output").innerHTML = null;


}

function itemTheme(theme) {
    let itemTheme;

    switch (theme) {
        case "arcana":
            itemTheme = "Arcana";
            document.getElementById("treasure-theme-output").innerHTML = " Picked Item type is: " + itemTheme;
            break;
        case "armaments":
            itemTheme = "Armaments";
            document.getElementById("treasure-theme-output").innerHTML = "Picked Item type is: " + itemTheme;
            break;
        case "implements":
            itemTheme = "Implements";
            document.getElementById("treasure-theme-output").innerHTML = "Picked Item type is: " + itemTheme;
            break;
        case "relics":
            itemTheme = "Relics";
            document.getElementById("treasure-theme-output").innerHTML = "Picked Item type is: " + itemTheme;
            break;
        default:
            console.log("Unknown theme");
    }
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
