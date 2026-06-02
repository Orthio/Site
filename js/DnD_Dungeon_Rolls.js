
/**
 * @property {num} dungeonRoomId // 1
 * @property {string} feature // Special
 * @property {string} treasure // Yes

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";
import { initKnaveRolls, rollKnaveTheme } from "./DnD_Knave_Rolls.js";

const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

let dungeonRolls;

class DungeonRollResult {
    static nextId = 0;

    constructor() {
        this.dungeonRoomId = DungeonRollResult.nextId++;
        this.feature = null;
        this.treasure = null;

    }

    toText() {
        return `${this.dungeonRoomId}. <span class="small-text">Feature: </span>${this.feature}
        <span class="small-text">Treasure: </span>${this.treasure ?? "—"}`;
    }
}

class DungeonRollsCore {
    constructor() { // (tables)
        // this.tables = tables.tables;
        this.results = [];
    }

    generateDungeonResults() {
        const result = new DungeonRollResult();

        this.#addFeature(result);
        // this.#addEncounterFeature(result);
        // this.#addTheme1(result);
        // this.#addTheme2(result);

        this.results.unshift(result);

        return result;
    }

    getAllResultsText() {
        return this.results
            .map(result => result.toText())
            .join("\n\n");
    }

    #addFeature(result) {

        const featuresTable = {
            1: ["Empty", 1],
            2: ["Empty", 1],
            3: ["Monster", 3],
            4: ["Monster", 3],
            5: ["Special", 7],
            6: ["Trap", 2]
        };

        let roll = this.#rollFromObjectTable(featuresTable);
        result.feature = roll[0];
        let treasureRoll = generalDiceRoll(6);
        if (treasureRoll <= roll[1]) {  
        result.treasure = "True";
        } else {
            result.treasure = "False";
        }

    }

    #addEncounterFeature(result) {
        const terrainCheck = result.terrain;

        const tableKey =
            this.tables.encounterFeatureKeysTable?.[terrainCheck];

        const column =
            tableKey &&
                typeof this.tables.wildernessEncountersTable?.[tableKey] === "object"
                ? this.tables.wildernessEncountersTable[tableKey]
                : null;

        if (!column) return;

        const categoryPick = this.#rollFromObjectTable(column);
        if (!categoryPick) return;

        const subTableColumn =
            this.tables.specificEncountersTable?.[categoryPick];

        if (!subTableColumn) return;

        const animalPick = this.#rollFromObjectTable(subTableColumn);

        result.encounter = `${animalPick} `;
    }

    #caltropRoll(result) {
        const wildFeatureRoll = generalDiceRoll(36);

        const wildFeature =
            this.tables.wildernessFeaturesTable?.[wildFeatureRoll];

        if (!wildFeature) return;

        const type = wildFeature[0] ?? null;
        const prompt = wildFeature[1] ?? null;
        const detail = wildFeature[2] ?? null;
        const hasSupplement =
            this.tables.wildFeatureWithSuppArray?.includes(detail) ?? false;

        result.feature =
            `${type ?? ""}: ${prompt ?? ""} ${detail ?? ""} `.trim();
    }

    #addTheme1(result) {
        result.theme1 = rollKnaveTheme();
    }

    #addTheme2(result) {
        result.theme2 = rollKnaveTheme();
    }

    #rollFromObjectTable(table, roll = null) {
        if (!table) return null;

        if (Array.isArray(table)) {
            const index = roll ?? generalDiceRoll(table.length);
            return table[index - 1] ?? null;
        }

        if (typeof table === "object") {
            const keys = Object.keys(table);
            const actualRoll = roll ?? generalDiceRoll(keys.length);

            if (table[String(actualRoll)] !== undefined) {
                return table[String(actualRoll)];
            }

            for (const [range, result] of Object.entries(table)) {
                if (!range.includes("-")) continue;

                const [min, max] = range.split("-").map(Number);

                if (actualRoll >= min && actualRoll <= max) {
                    return result;
                }
            }
        }

        return null;
    }
}

async function init() {
    // const tables = await MapRollTables.load();

    // await initKnaveRolls();

    dungeonRolls = new DungeonRollsCore(); // (tables)

    generateButton.addEventListener("click", generateResults);
}

async function generateResults() {
    
    await dungeonRolls.generateDungeonResults();

    resultOutput.innerHTML = dungeonRolls.getAllResultsText();

    // console.log(dungeonRolls.results);
}

init();