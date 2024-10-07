import { generalDiceRoll } from './DnD_General.js';

let jsonData;

fetch('./json/DnD_Item_Rolls.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
        //  console.log(data.artDecorativeTechniques["1"]); // Outputs "Platinum filigree"

        // console.log(data.artNature["2"]); // Outputs "Worn or Carried Ornaments"
    })
    .catch(error => console.error('Error fetching JSON:', error));


/*   // Now you can use the generalDiceRoll function
const result = generalDiceRoll(20, 2, "Adv");
// console.log("Dice Roll Result with Advantage:", result);
document.getElementById("roll-results").innerText = result; */

var resultOutput = [];

function generateArt() {
    console.log("Art Gen started");
    var natureIndex = generalDiceRoll(5, 1);
    console.log("Nature Index ", natureIndex);
    var nature = jsonData.artNature[natureIndex];

    var jewelleryIndex = generalDiceRoll(50, 1);
    var jewellery = jsonData.artJewelleryItems[jewelleryIndex];

    var equipmentIndex = generalDiceRoll(50, 1);
    var equipment = jsonData.artEquipment[equipmentIndex];

    var artDiningIndex = generalDiceRoll(50, 1);
    var artDining = jsonData.artDiningItems[artDiningIndex];

    var artDecorativeIndex = generalDiceRoll(50, 1);
    var artDecorative = jsonData.artDecorativeItems[artDecorativeIndex];

    var artPersonalIndex = generalDiceRoll(50, 1);
    var artPersonal = jsonData.artPersonalItems[artPersonalIndex];

    let objectArray = [jewellery, equipment, artDining, artDecorative, artPersonal];
    let objectChoice = "";
    switch (natureIndex) {
        case 1:
            objectChoice = objectArray[0];
            break;
        case 2:
            objectChoice = objectArray[1];
            break;
        case 3:
            objectChoice = objectArray[2];
            break;
        case 4:
            objectChoice = objectArray[3];
            break;
        case 5:
            objectChoice = objectArray[4];
            break;
    }

    var artMetalIndex = generalDiceRoll(50, 1);
    var artMetal = jsonData.artMetalTypes[artMetalIndex];

    var artMaterialIndex = generalDiceRoll(50, 1);
    var artMaterial = jsonData.artMaterialTypes[artMaterialIndex];

    var artGemstoneIndex = generalDiceRoll(50, 1);
    var artGemstone = jsonData.artGemstoneTypes[artGemstoneIndex];

    var artDecorativeIndex = generalDiceRoll(20, 1);
    var artDecorative = jsonData.artDecorativeTechniques[artDecorativeIndex];

    var artDesignIndex = generalDiceRoll(20, 1);
    var artDesign = jsonData.artDesignThemes[artDesignIndex];


    var artResult = "<div>" + objectChoice + " made of " + artMetal + " and " + artMaterial + ", " + "<br>" +
        "ornamented with " + artGemstone + " and " + artDecorative + ", " + "<br>" +
        "in the theme of " + artDesign + "</div>" + "<br>"
        ;

    resultOutput.unshift(artResult);
    updateOutput();

};

function generateEnemyWeapon() {
    let enemyWepIndex = generalDiceRoll(jsonData.enemyWeapons.length, 1);
    let enemyWep = jsonData.enemyWeapons[enemyWepIndex];
    console.log("EnemyWepIndex: ", enemyWepIndex);
    console.log(enemyWep);

    let enemyWepResult = "<div>" + enemyWep + "</div>" + "<br>";

    resultOutput.unshift(enemyWepResult);
    updateOutput();
}

function generatePartyWeapon() {
    let partyWepIndex = generalDiceRoll(jsonData.partyWeapons.length, 1);
    let partyWep = jsonData.partyWeapons[partyWepIndex];
    console.log("partyWepIndex: ", partyWepIndex);
    console.log(partyWep);

    let partyWepResult = "<div>" + partyWep + "</div>" + "<br>";

    resultOutput.unshift(partyWepResult);
    updateOutput();
}

function updateOutput() {
    if (resultOutput.length > 8) {
        resultOutput.pop();
    }

    document.getElementById("result-output").innerHTML = resultOutput.join('');
}

document.getElementById('generate-art-button').addEventListener('click', () => {
    generateArt();
});

document.getElementById('generate-enemy-weapon-button').addEventListener('click', () => {
    generateEnemyWeapon();
});

document.getElementById('generate-party-weapon-button').addEventListener('click', () => {
    generatePartyWeapon();
});
