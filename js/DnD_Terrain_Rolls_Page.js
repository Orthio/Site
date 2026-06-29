import { rollOnTable } from "./DnD_General.js";
import { initKnaveRolls } from "./DnD_Knave_Rolls.js";
import { MapRollTables, MapRollsCore } from "./DnD_Terrain_Rolls.js";

const terrainSelect = document.getElementById("terrain-select");
const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

const terrainArray = [
    "Plain",
    "Forest",
    "Hills",
    "Desert",
    "Marsh",
    "Lake"
];

let mapRolls;

async function initTerrainRollsPage() {
    const tables = await MapRollTables.load();

    await initKnaveRolls();

    mapRolls = new MapRollsCore(tables);

    generateButton.addEventListener("click", generateResults);
}

function generateResults() {
    let terrain = terrainSelect.value;

    if (terrain === "Random") {
        terrain = rollOnTable(terrainArray);
    }

    mapRolls.generateTerrainResults(terrain);
    resultOutput.innerHTML = mapRolls.getAllResultsText();
}

initTerrainRollsPage();