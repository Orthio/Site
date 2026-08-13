
/**
 * @property {num} dungeonRoomId // 1
 * @property {string} feature // Special
 * @property {string} feature2 // Perhaps an unusual statue?
 * @property {string} treasure // Yes

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";
import { initKnaveRolls, rollKnaveTheme } from "./DnD_Knave_Rolls.js";

let jsonData;
fetch('json/DnD_Roll_Tables.json')

    .then(response => response.json())  // Parse the JSON
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

let tableOutput = [];



const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

let dungeonRolls;

export class DungeonRollResult {
    static nextId = 1;

    constructor() {
        this.dungeonRoomId = DungeonRollResult.nextId++;
        this.feature = null;
        this.feature2 = null;
        this.treasure = null;

    }

    toDungeonText() {
        return `${this.dungeonRoomId}. <span class="small-text">Feature: </span>${this.feature}
        <span class="small-text">Treasure: </span>${this.treasure ?? "—"}`;
    }

    toDungeonText2() {
        // No number
        return `<span class="small-text">Feature: </span>${this.feature}
        <span class="small-text">Treasure: </span>${this.treasure ?? "—"}
        <br>
        ${this.feature2 ?? "—"}
        `;
    }
}

export class DungeonRollsCore {
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
            .map(result => result.toDungeonText())
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

        let caltropsDungeonRollsTable = jsonData.caltropsDungeonRolls;

        let featuresRoll1 = generalDiceRoll(6);
        let featuresRoll2 = generalDiceRoll(6);

        let featuresRoll1Result = featuresTable[featuresRoll1][0];
        result.feature = featuresRoll1Result;

        let caltropsRoll1 = caltropsDungeonRollsTable.find(
            entry =>
                entry.roll[0] === featuresRoll1 &&
                entry.roll[1] === featuresRoll2
        );
        let caltropsRoll2 = caltropsRoll1.prompt;
        result.feature2 = caltropsRoll2;

        let treasurePart = featuresTable[featuresRoll1][1];
        let treasureRoll = generalDiceRoll(6);
        if (treasureRoll <= treasurePart) {
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
