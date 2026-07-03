import { generalDiceRoll, rollOnTable } from './DnD_General.js';
import { DungeonRollsCore } from "./DnD_Dungeon_Rolls.js";
import { MapRollsCore, MapRollTables } from "./DnD_Terrain_Rolls.js";
import { initKnaveRolls, rollKnaveTheme } from "./DnD_Knave_Rolls.js";


const dungeon = new DungeonRollsCore();

await initKnaveRolls();
const terrainTables = await MapRollTables.load();
const terrain = new MapRollsCore(terrainTables);

const room = dungeon.generateDungeonResults();
const terrainHex = terrain.generateTerrainResults();

const terrainSelect = document.getElementById("terrain-select");

let jsonData;

let rollsCount = 0;

fetch('json/DnD_Roll_Tables.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));


let resultOutput = [];

let monsterReactionMod = 0;
const extraText = document.getElementById("monster-reaction-table-text");

function generateOracle() {
    const oracleTable = [
        "No, And",
        "No",
        "No, But",
        "Yes, But",
        "Yes",
        "Yes, And"
    ];

    let oracleResult = rollOnTable(oracleTable);
    updateOutput(oracleResult);

}

function generatePlace() {
    let place = rollOnTable(jsonData.structuresKnave);
    let placeTraitsKnave = rollOnTable(jsonData.placeTraitsKnave);
    let placeBuildings = rollOnTable(jsonData.placeBuildings);
    let placeTheme = rollOnTable(jsonData.placeTheme);
    let placeEvents = rollOnTable(jsonData.placeEvents);

    let placeResult = "<span class='no-select'><small>Place: </small></span><br>" +
        place + "<br>" +
        placeTraitsKnave + " " + placeBuildings + ", and " + placeTheme + "<br>" +
        "Busy with " + placeEvents + "<br>";

    updateOutput(placeResult);
}

function generateTerrain() {
    let terrainSelection = terrainSelect.value;

    if (terrainSelection === "Random") {
        const terrainArray = ["Plain", "Forest", "Hills", "Desert", "Marsh", "Lake"];
        terrainSelection = rollOnTable(terrainArray);
    }

    const terrainHex = terrain.generateTerrainResults(terrainSelection);
    updateOutput(terrainHex.toTextNoNumber());

}

function generateDungeon() {
    let dungeonsKnave = rollOnTable(jsonData.dungeonsKnave);
    let dungeonRoomThemes = rollOnTable(jsonData.dungeonRoomThemes);
    let dungeonShifts = rollOnTable(jsonData.dungeonShifts);
    let dungeonRoomFeatures = rollOnTable(jsonData.dungeonRoomFeatures);
    let monument = rollOnTable(jsonData.monument);
    let monumentDescription = rollOnTable(jsonData.monumentDescription);

    let dungeonResult = "<span class='no-select'><small>Dungeon Theme: </small></span><br>" +
        dungeonsKnave + "<br>" +
        dungeonRoomThemes + ", " + dungeonShifts + " and " + dungeonRoomFeatures + "<br>" +
        "With a " + monumentDescription + " " + monument + "<br>";

    updateOutput(dungeonResult);
}

function generateTrap() {
    let environmentSignsKnave = rollOnTable(jsonData.environmentSignsKnave);
    let trapComponents = rollOnTable(jsonData.trapComponents);
    let trapHazards = rollOnTable(jsonData.trapHazards);
    let trapEffects = rollOnTable(jsonData.trapEffects);

    let trapResult = "<span class='no-select'><small>Trap: </small></span><br>" +
        environmentSignsKnave + " gives away " + "<br>" +
        trapEffects + " " + trapHazards + " with a " + trapComponents + "<br>";

    updateOutput(trapResult);
}

function generateDungeonRoom() {
    const dungeonRoom = dungeon.generateDungeonResults();
    updateOutput(dungeonRoom.toDungeonText2());
}

function generateScenario() {
    let activity = rollOnTable(jsonData.activities);
    let occupations2 = rollOnTable(jsonData.occupations2);
    let hooks1 = rollOnTable(jsonData.hooks1);
    let hooks2 = rollOnTable(jsonData.hooks2);

    let scenarioResults = "<span class='no-select'><small>Scenario: </small></span><br>" +
        "Enemies " + activity + "<br>" +
        "A " + occupations2 + " works to " + hooks1 + "<br>" +
        hooks2 + "<br>";

    updateOutput(scenarioResults);
}

function generateMonsterReaction() {
    let reactionRoll = generalDiceRoll(6, 2);
    let reactionRoll2 = reactionRoll + monsterReactionMod;
    let reaction = jsonData.monsterReaction[reactionRoll2 - 1];

    let reactionResult = "<span class='no-select'><small>Monster Reaction: </small></span><br>" +
        reactionRoll + "&nbsp&nbsp&nbsp" + reaction + "<br>";

    updateOutput(reactionResult);
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
                            <li>What makes them unique, Where are they from, What are they doing, What's their reaction</li>
                </ul>
                `;

    extraText.style.display = "block";
}

function removeExtraText() {
    extraText.innerHTML = "";
}

function generateActivity() {

    let activity = rollOnTable(jsonData.generalActivityTable);
    updateOutput(activity);

}

function generateIndoorDistance() {
    let roll = 10 * (generalDiceRoll(6, 2));
    // 2d6 * 10ft

    let indoorDistText = "<span class='no-select'><small>Indoor Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" + "<br>";

    updateOutput(indoorDistText);
}

function generateOutdoorOpenDistance() {
    let roll = 60 * (generalDiceRoll(6, 2));
    // 2d6 * 60ft

    let outdoorOpenDistText = "<span class='no-select'><small>Outdoor Open Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" + "<br>";

    updateOutput(outdoorOpenDistText);
}

function generateOutdoorObsDistance() {
    let roll = 20 * (generalDiceRoll(6, 2));
    // 2d6 * 20ft

    let outdoorObsDistText = "<span class='no-select'><small>Outdoor Obstructed Encounter Distance: </small></span><br>" +
        "Enemies " + roll + "ft" + "<br>";

    updateOutput(outdoorObsDistText);
}


function generateArt() {
    let natureIndex = generalDiceRoll(5, 1);
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


    let artResult = "<span class='no-select'><small>Art Object: </small></span><br>" +
        objectChoice + "<br>" +
        artMetal + " and " + artMaterial + ", " + "<br>" +
        "With " + artGemstone + " and " + artDecorative + "<br>";

    updateOutput(artResult);

};

function generateEnemyWeapon() {
    let enemyWepIndex = generalDiceRoll(jsonData.enemyWeapons.length, 1);
    let enemyWep = jsonData.enemyWeapons[enemyWepIndex - 1];

    let enemyWepResult = "<span class='no-select'><small>Enemy Weapon: </small></span><br>" + enemyWep + "<br>";

    updateOutput(enemyWepResult);
}

function generatePartyWeapon() {
    let partyWepIndex = generalDiceRoll(jsonData.partyWeapons.length, 1);
    let partyWep = jsonData.partyWeapons[partyWepIndex - 1];

    let partyWepResult = "<span class='no-select'><small>Party Weapon: </small></span><br>" + partyWep + "<br>";

    updateOutput(partyWepResult);
}

function generateTreasures() {
    let treasures1 = rollOnTable(jsonData.treasures);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraitsKnave = rollOnTable(jsonData.itemTraitsKnave);
    let materials = rollOnTable(jsonData.materials);

    let treasuresResult = "<span class='no-select'><small>Treasures: </small></span><br>" +
        treasures1 + "<br>" +
        materialTraits + ", " + itemTraitsKnave + ", " + materials + "<br>";

    updateOutput(treasuresResult);
}

function generateEquipment() {
    let equipment1 = rollOnTable(jsonData.equipment1);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraitsKnave = rollOnTable(jsonData.itemTraitsKnave);
    let materials = rollOnTable(jsonData.materials);

    let equipmentResult = "<span class='no-select'><small>Equipment: </small></span><br>" +
        equipment1 + "<br>" +
        materialTraits + ", " + itemTraitsKnave + ", " + materials + "<br>";

    updateOutput(equipmentResult);
}

function generateMiscItems() {
    let miscItems1 = rollOnTable(jsonData.miscItems);
    let materialTraits = rollOnTable(jsonData.materialTraits);
    let itemTraitsKnave = rollOnTable(jsonData.itemTraitsKnave);
    let materials = rollOnTable(jsonData.materials);

    switch (miscItems1) {
        case "Weapons":
            miscItems1 = rollOnTable(jsonData.partyWeapons);
        case "Treasure":
            miscItems1 = rollOnTable(jsonData.treasures);
        default:
            break;
    }

    let miscResult = "<span class='no-select'><small>Misc Items: </small></span><br>" +
        miscItems1 + "<br>" +
        materialTraits + ", " + itemTraitsKnave + ", " + materials + "<br>";

    updateOutput(miscResult);
}

function updateOutput(inputText) {

    rollsCount++;
    resultOutput.unshift(`<div>
        <span class="spaceSpan"> ${rollsCount}: </span>
        <span class="inputSpan"> ${inputText}  </span>
    </div><br>`);

    if (resultOutput.length > 14) {
        resultOutput.pop();
    }

    document.getElementById("result-output").innerHTML = resultOutput.join('');
}


function diceRoll(diceSize, diceQuantity) {
    // Roll to get (0-1)*20=0 or 20
    // Math floor rounds down
    if (!diceQuantity) { diceQuantity = 1 }
    let roll = generalDiceRoll(diceSize, diceQuantity);

    let rollResult = "<span class=\"smallClass\">" + diceQuantity + "d" + diceSize +
        " = " + "</span>" + roll + "<br>";

    updateOutput(rollResult);
}

document.getElementById('generate-oracle').addEventListener('click', () => {
    generateOracle();
});

document.getElementById("button-caltrops-tables").addEventListener("click", () => {
    window.location.href = ("https://blog.d4caltrops.com/p/random-tables.html");
});

document.getElementById('generate-place').addEventListener('click', () => {
    generatePlace();
});

document.getElementById('generate-scenario').addEventListener('click', () => {
    generateScenario();
});

document.getElementById("button-open-character-gen").addEventListener("click", () => {
    window.location.href = ("DnD_Character_Generator.html");
});

document.getElementById("button-open-retainer-gen").addEventListener("click", () => {
    window.location.href = ("DnD_Retainer_Rolls.html");
});

document.getElementById('generate-terrain').addEventListener('click', () => {
    generateTerrain();
});

document.getElementById("button-open-hex-connections").addEventListener("click", () => {
    window.location.href = ("DnD_Hex_Connections.html");
});

document.getElementById('generate-dungeon-theme').addEventListener('click', () => {
    generateDungeon();
});

document.getElementById('generate-trap').addEventListener('click', () => {
    generateTrap();
});

document.getElementById('generate-dungeon-room').addEventListener('click', () => {
    generateDungeonRoom();
});

document.getElementById('generate-reaction').addEventListener('click', () => {
    generateMonsterReaction();
});

document.getElementById('generate-activity').addEventListener('click', () => {
    generateActivity();
});


document.getElementById("button-open-monster-hd").addEventListener("click", () => {
    window.location.href = "DnD_Monster_Rolls.html";
});

// document.getElementById('generate-indoor-distance').addEventListener('click', () => {
//     generateIndoorDistance();
// });

// document.getElementById('generate-outdoor-open-distance').addEventListener('click', () => {
//     generateOutdoorOpenDistance();
// });

// document.getElementById('generate-outdoor-obs-distance').addEventListener('click', () => {
//     generateOutdoorObsDistance();
// });


document.getElementById('add-reaction').addEventListener('click', () => {
    addReaction();
});

document.getElementById('detract-reaction').addEventListener('click', () => {
    detractReaction();
});

document.getElementById("button-open-treasure-gen").addEventListener("click", () => {
    window.location.href = ("https://oldschoolessentials.necroticgnome.com/generators/treasure-by-type-generator");
});

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

document.getElementById('diceRolld4').addEventListener('click', () => {
    diceRoll(4);
});
document.getElementById('diceRolld6').addEventListener('click', () => {
    diceRoll(6);
});
document.getElementById('diceRoll2d6').addEventListener('click', () => {
    diceRoll(6, 2);
});
document.getElementById('diceRolld8').addEventListener('click', () => {
    diceRoll(8);
});
document.getElementById('diceRolld10').addEventListener('click', () => {
    diceRoll(10);
});
document.getElementById('diceRolld12').addEventListener('click', () => {
    diceRoll(12);
});
document.getElementById('diceRolld20').addEventListener('click', () => {
    diceRoll(20);
});
document.getElementById('diceRolld24').addEventListener('click', () => {
    diceRoll(24);
});
document.getElementById('diceRolld30').addEventListener('click', () => {
    diceRoll(30);
});
document.getElementById('diceRolld100').addEventListener('click', () => {
    diceRoll(100);
});
document.getElementById('remove-reaction-text').addEventListener('click', () => {
    removeExtraText();
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