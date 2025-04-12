import { generalDiceRoll, rollOnTable } from './DnD_General.js';

let jsonData;

fetch('json/DnD_Roll_Tables.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
        //  console.log(data.artDecorativeTechniques["1"]); // Outputs "Platinum filigree"

        // console.log(data.artNature["2"]); // Outputs "Worn or Carried Ornaments"
    })
    .catch(error => console.error('Error fetching JSON:', error));


let resultOutput = [];

let monsterReactionMod = 0;
const extraText = document.getElementById("monster-reaction-table-text");


function generateArt() {
    // console.log("Art Gen started");
    let natureIndex = generalDiceRoll(5, 1);
    // console.log("Nature Index ", natureIndex);
    let nature = jsonData.artNature[natureIndex];

    let jewelleryIndex = generalDiceRoll(50, 1);
    let jewellery = jsonData.artJewelleryItems[jewelleryIndex];

    let equipmentIndex = generalDiceRoll(50, 1);
    let equipment = jsonData.artEquipment[equipmentIndex];

    let artDiningIndex = generalDiceRoll(50, 1);
    let artDining = jsonData.artDiningItems[artDiningIndex];

    let artDecorativeIndex = generalDiceRoll(50, 1);
    let artDecorative = jsonData.artDecorativeItems[artDecorativeIndex];

    let artPersonalIndex = generalDiceRoll(50, 1);
    let artPersonal = jsonData.artPersonalItems[artPersonalIndex];

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

    let artMetalIndex = generalDiceRoll(50, 1);
    let artMetal = jsonData.artMetalTypes[artMetalIndex];

    let artMaterialIndex = generalDiceRoll(50, 1);
    let artMaterial = jsonData.artMaterialTypes[artMaterialIndex];

    let artGemstoneIndex = generalDiceRoll(50, 1);
    let artGemstone = jsonData.artGemstoneTypes[artGemstoneIndex];

    let artDecorativeIndex2 = generalDiceRoll(20, 1);
    let artDecorative2 = jsonData.artDecorativeTechniques[artDecorativeIndex];

    let artDesignIndex = generalDiceRoll(20, 1);
    let artDesign = jsonData.artDesignThemes[artDesignIndex];


    let artResult = "<div><span class='no-select'><small>Art Object: </small></span><br>" +
        objectChoice + "<br>" +
        artMetal + " and " + artMaterial + ", " + "<br>" +
        "With " + artGemstone + " and " + artDecorative + "<br>" +
        "</div>" + "<br>"
        ;

    resultOutput.unshift(artResult);
    updateOutput();

};

function generateEnemyWeapon() {
    let enemyWepIndex = generalDiceRoll(jsonData.enemyWeapons.length, 1);
    let enemyWep = jsonData.enemyWeapons[enemyWepIndex];
    // console.log("EnemyWepIndex: ", enemyWepIndex);
    // console.log(enemyWep);

    let enemyWepResult = "<div><span class='no-select'><small>Enemy Weapon: </small></span><br>" + enemyWep + "</div><br>";

    resultOutput.unshift(enemyWepResult);
    updateOutput();
}

function generatePartyWeapon() {
    let partyWepIndex = generalDiceRoll(jsonData.partyWeapons.length, 1);
    let partyWep = jsonData.partyWeapons[partyWepIndex];
    // console.log("partyWepIndex: ", partyWepIndex);
    // console.log(partyWep);

    let partyWepResult = "<div><span class='no-select'><small>Party Weapon: </small></span><br>" + partyWep + "</div>" + "<br>";

    resultOutput.unshift(partyWepResult);
    updateOutput();
}

function generateTreasures() {
    let treasures1 = rollOnTable(jsonData.treasures);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraits = rollOnTable(jsonData.itemTraits);
    let materials = rollOnTable(jsonData.materials);

    let treasuresResult = "<div><span class='no-select'><small>Treasures: </small></span><br>" +
        treasures1 + "<br>" +
        materialTraits + ", " + itemTraits + ", " + materials +
        "</div>" + "<br>";

    resultOutput.unshift(treasuresResult);
    updateOutput();
}

function generateEquipment() {
    let equipment1 = rollOnTable(jsonData.equipment1);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraits = rollOnTable(jsonData.itemTraits);
    let materials = rollOnTable(jsonData.materials);

    let equipmentResult = "<div><span class='no-select'><small>Equipment: </small></span><br>" +
        equipment1 + "<br>" +
        materialTraits + ", " + itemTraits + ", " + materials +
        "</div>" + "<br>";

    resultOutput.unshift(equipmentResult);
    updateOutput();
}

function generateMiscItems() {
    let miscItems1 = rollOnTable(jsonData.miscItems);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraits = rollOnTable(jsonData.itemTraits);
    let materials = rollOnTable(jsonData.materials);

    switch (miscItems1) {
        case "Weapons":
            miscItems1 = rollOnTable(jsonData.partyWeapons);
        case "Treasure":
            miscItems1 = rollOnTable(jsonData.treasures);
        default:
            break;
    }

    let miscResult = "<div><span class='no-select'><small>Misc Items: </small></span><br>" +
        miscItems1 + "<br>" +
        materialTraits + ", " + itemTraits + ", " + materials +
        "</div>" + "<br>";

    resultOutput.unshift(miscResult);
    updateOutput();
}

function generatePlace() {
    let place = rollOnTable(jsonData.places);
    let placeDescriptions = rollOnTable(jsonData.placeDescriptions);
    let placeBuildings = rollOnTable(jsonData.placeBuildings);
    let placeTheme = rollOnTable(jsonData.placeTheme);
    let placeEvents = rollOnTable(jsonData.placeEvents);

    let placeResult = "<div><span class='no-select'><small>Place: </small></span><br>" +
        place + "<br>" +
        placeDescriptions + " " + placeBuildings + ", and " + placeTheme + "<br>" +
        "Busy with " + placeEvents +
        "</div>" + "<br>";

    resultOutput.unshift(placeResult);
    updateOutput();
}

function generateDungeon() {
    let dungeonLocations = rollOnTable(jsonData.dungeonLocations);
    let dungeonRoomThemes = rollOnTable(jsonData.dungeonRoomThemes);
    let dungeonShifts = rollOnTable(jsonData.dungeonShifts);
    let dungeonRoomFeatures = rollOnTable(jsonData.dungeonRoomFeatures);
    let monument = rollOnTable(jsonData.monument);
    let monumentDescription = rollOnTable(jsonData.monumentDescription);

    let dungeonResult = "<div><span class='no-select'><small>Dungeon: </small></span><br>" +
        dungeonLocations + "<br>" +
        dungeonRoomThemes + ", " + dungeonShifts + " and " + dungeonRoomFeatures + "<br>" +
        "With a " + monumentDescription + " " + monument +
        "</div>" + "<br>";

    resultOutput.unshift(dungeonResult);
    updateOutput();
}

function generateTrap() {
    let environmentalSigns = rollOnTable(jsonData.environmentalSigns);
    let trapComponents = rollOnTable(jsonData.trapComponents);
    let trapHazards = rollOnTable(jsonData.trapHazards);
    let trapEffects = rollOnTable(jsonData.trapEffects);

    let trapResult = "<div><span class='no-select'><small>Trap: </small></span><br>" +
        environmentalSigns + " gives away " + "<br>" +
        trapEffects + " " + trapHazards + " with a " + trapComponents + "<br>" +
        "</div>" + "<br>";

    resultOutput.unshift(trapResult);
    updateOutput();
}

function generateScenario() {
    let activity = rollOnTable(jsonData.activities);
    let occupations2 = rollOnTable(jsonData.occupations2);
    let hooks1 = rollOnTable(jsonData.hooks1);
    let hooks2 = rollOnTable(jsonData.hooks2);

    let scenarioResults = "<div><span class='no-select'><small>Scenario: </small></span><br>" +
        "Enemies " + activity + "<br>" +
        "A " + occupations2 + " works to " + hooks1 + "<br>" +
        hooks2 +
        "</div>" + "<br>";

    resultOutput.unshift(scenarioResults);
    updateOutput();
}

function generateMonsterReaction() {
    let reactionRoll = generalDiceRoll(6, 2);
    let reactionRoll2 = reactionRoll + monsterReactionMod;
    let reaction = jsonData.monsterReaction[reactionRoll2 - 1];

    let reactionResult = "<div><span class='no-select'><small>Monster Reaction: </small></span><br>" +
        reactionRoll + "&nbsp&nbsp&nbsp" + reaction +
        "</div>" + "<br>";

    resultOutput.unshift(reactionResult);
    updateOutput();
}

function addReaction() {
    if (monsterReactionMod > -4) {
        monsterReactionMod -= 2;
    }
    updateExtraText()
}

function detractReaction() {
    if (monsterReactionMod < 4) {
        monsterReactionMod += 2;
    }
    updateExtraText()
}

function updateExtraText() {
    extraText.innerHTML = `
    <p>Current Reaction: ${monsterReactionMod}</p>

                <table class="stats-table" id="reaction-table">
                    <thead>
                        <tr>
                            <td>2d6</td>
                            <td>Reaction</td>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> 2 - 3</td>
                            <td>Immediate Attack</td>
                        </tr>
                        <tr>
                            <td> 4 - 5</td>
                            <td>Hostile</td>
                        </tr>
                        <tr>
                            <td> 6 - 8</td>
                            <td>Cautious / Threatening</td>
                        </tr>
                        <tr>
                            <td> 9 - 10</td>
                            <td> Neutral</td>
                        </tr>
                        <tr>
                            <td> 11 - 12</td>
                            <td> Amiable</td>
                        </tr>
                    </tbody>
                </table>

                <ul>

                    <li> -2 to -4 for aggressive creatures, +2 to +4 for friendly </li>
                    <li> Charisma checks can be used to alter the circumstance </li>
                    <li class="p-link"><a
                            href="https://web.archive.org/web/20170519041648/http://1d8.blogspot.com/2011/04/what-are-those-wandering-monsters-up-to.html">
                            What are those monsters up to</a></li>
                </ul>
                `;

    extraText.style.display = "block";
}
function generateIndoorDistance() {
    let roll = 10 * (generalDiceRoll(6, 2));
    // 2d6 * 10ft

    let indoorDistText = "<div><span class='no-select'><small>Indoor Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" +
        "</div>" + "<br>";

    resultOutput.unshift(indoorDistText);
    updateOutput();
}

function generateOutdoorOpenDistance() {
    let roll = 60 * (generalDiceRoll(6, 2));
    // 2d6 * 60ft

    let outdoorOpenDistText = "<div><span class='no-select'><small>Outdoor Open Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" +
        "</div>" + "<br>";

    resultOutput.unshift(outdoorOpenDistText);
    updateOutput();
}

function generateOutdoorObsDistance() {
    let roll = 20 * (generalDiceRoll(6, 2));
    // 2d6 * 20ft

    let outdoorObsDistText = "<div><span class='no-select'><small>Outdoor Obstructed Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" +
        "</div>" + "<br>";

    resultOutput.unshift(outdoorObsDistText);
    updateOutput();
}

function updateOutput() {
    if (resultOutput.length > 8) {
        resultOutput.pop();
    }

    document.getElementById("result-output").innerHTML = resultOutput.join('');
}

document.getElementById('generate-treasures').addEventListener('click', () => {
    generateTreasures();
});

document.getElementById('generate-enemy-weapon-button').addEventListener('click', () => {
    generateEnemyWeapon();
});

document.getElementById('generate-party-weapon-button').addEventListener('click', () => {
    generatePartyWeapon();
});

document.getElementById('generate-art-button').addEventListener('click', () => {
    generateArt();
});

document.getElementById('generate-equipment').addEventListener('click', () => {
    generateEquipment();
});

document.getElementById('generate-misc-items').addEventListener('click', () => {
    generateMiscItems();
});

document.getElementById('generate-place').addEventListener('click', () => {
    generatePlace();
});

document.getElementById('generate-dungeon').addEventListener('click', () => {
    generateDungeon();
});

document.getElementById('generate-trap').addEventListener('click', () => {
    generateTrap();
});

document.getElementById('generate-scenario').addEventListener('click', () => {
    generateScenario();
});

document.getElementById('generate-reaction').addEventListener('click', () => {
    generateMonsterReaction();
});

document.getElementById('generate-indoor-distance').addEventListener('click', () => {
    generateIndoorDistance();
});

document.getElementById('generate-outdoor-open-distance').addEventListener('click', () => {
    generateOutdoorOpenDistance();
});

document.getElementById('generate-outdoor-obs-distance').addEventListener('click', () => {
    generateOutdoorObsDistance();
});

document.getElementById('add-reaction').addEventListener('click', () => {
    addReaction();
});

document.getElementById('detract-reaction').addEventListener('click', () => {
    detractReaction();
});

const words = document.querySelectorAll("#monster-reaction-link");

words.forEach(word => {
    word.addEventListener("click", function () {
        const isHidden = window.getComputedStyle(extraText).display === "none";

        if (isHidden) {
            updateExtraText();
        } else {
            // Hide the additional text
            extraText.style.display = "none";
        }
    });
});