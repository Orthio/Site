import { DungeonRollsCore } from "./DnD_Dungeon_Rolls.js";

const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

const dungeonGenerator = new DungeonRollsCore();

generateButton.addEventListener("click", () => {
    dungeonGenerator.generateDungeonResults();
    resultOutput.innerHTML = dungeonGenerator.getAllResultsText();
});
