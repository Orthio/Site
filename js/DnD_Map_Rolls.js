
/**
 * @property {string} terrain // plains
 * @property {num} mapId // 1
 * @property {string} terrainFeature // Hillock
 * @property {string} encFeature // Beetle, Fire
 * @property {string|null} wildFeature[0]  // Hazard/Resource, Consider a, 6-6, false
 * @property {string|null} wildFeature[1]  // Consider a
 * @property {string|null} wildFeature[2]  // 6-6
 * @property {string|null} wildFeature2 // sandbox gen proc eg "Sword stuck in a rock, Legend/Myth"
 * @property {string} theme1 // Fire (from knave tables)
 * @property {string} theme2 // Salt flat (from knave tables)
 * @property {string} results // Plains, Hillock, Beetle, Fire...

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";
import { initKnaveRolls, rollKnaveTheme } from "./DnD_Knave_Rolls.js";

const terrainSelect = document.getElementById("terrain-select");
const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

let mapRolls;

class MapRollTables {
    static async load() {
        const res = await fetch("json/DnD_Hexmap.json");

        if (!res.ok) {
            throw new Error(
                `Failed to load json/DnD_Hexmap.json: ${res.status}`
            );
        }

        const data = await res.json();

        const tables = new MapRollTables();
        tables.setTables(data);

        return tables;
    }

    setTables(data = {}) {
        this.tables = {
            terrainTable: data.hexWildernessTerrain ?? null,
            terrainFeaturesTable: data.terrainFeature ?? null,

            wildernessEncountersTable: data.wildernessEncountersTable ?? null,
            specificEncountersTable: data.specificEncountersTable ?? null,
            wildernessFeaturesTable: data.wildernessFeaturesTable ?? null,
            wildFeatureWithSuppArray: data.wildFeatureWithSuppArray ?? null,

            sandboxGenFeatureTable: data.sandboxGenFeatureTable ?? null,
            sandboxGenSettlementTable: data.sandboxGenSettlementTable ?? null,
            sandboxGenLandmarkStartingTable: data.sandboxGenLandmarkStartingTable ?? null,
            sandboxGenLandmarkNaturalTable: data.sandboxGenLandmarkNaturalTable ?? null,
            sandboxGenLandmarkArtificialTable: data.sandboxGenLandmarkArtificialTable ?? null,
            sandboxGenLandmarkMagicTable: data.sandboxGenLandmarkMagicTable ?? null,
            sandboxGenLandmarkContentTable: data.sandboxGenLandmarkContentTable ?? null,
            sandboxGenHazardTable: data.sandboxGenHazardTable ?? null,
            sandboxGenEmptyTable: data.sandboxGenEmptyTable ?? null,
            sandboxGenSpecialStartTable: data.sandboxGenSpecialStartTable ?? null,
            sandboxGenSpecialDisputeTable: data.sandboxGenSpecialDisputeTable ?? null,

            featureKeysTable: data.featureKeysTable ?? null,
            encounterFeatureKeysTable: data.encounterFeatureKeysTable ?? null
        };
    }
}

class MapRollResult {
    static nextId = 1;

    constructor(terrain) {
        this.mapId = MapRollResult.nextId++;
        this.terrain = terrain;

        this.terrainFeature = null;
        this.encounter = null;
        this.feature = null;
        this.feature2 = null;
        this.theme1 = null;
        this.theme2 = null;
    }

    toText() {
        return `${this.mapId}. <span class="small-text">Terrain: </span>${this.terrain}
<span class="small-text">Terrain Feature: </span>${this.terrainFeature ?? "—"}
<span class="small-text">Encounter: </span>${this.encounter ?? "—"}
<span class="small-text">Feature1: </span>${this.feature ?? "—"}
<span class="small-text">Feature2: </span>${this.feature2 ?? "—"}
<span class="small-text">Theme1: </span>${this.theme1 ?? "—"}
<span class="small-text">Theme2: </span>${this.theme2 ?? "—"}`;
    }
}

class MapRollsCore {
    constructor(tables) {
        this.tables = tables.tables;
        this.results = [];
    }

    generateTerrainResults(terrain) {
        const result = new MapRollResult(terrain);

        this.#addTerrainFeature(result);
        this.#addEncounterFeature(result);
        this.#addWildFeature(result);
        this.#addWildFeature2(result);
        this.#addTheme1(result);
        this.#addTheme2(result);

        this.results.unshift(result);

        return result;
    }

    getAllResultsText() {
        return this.results
            .map(result => result.toText())
            .join("\n\n");
    }

    #addTerrainFeature(result) {
        const key = this.tables.featureKeysTable?.[result.terrain];

        const list =
            key && Array.isArray(this.tables.terrainFeaturesTable?.[key])
                ? this.tables.terrainFeaturesTable[key]
                : null;

        if (!list || list.length === 0) return;

        result.terrainFeature = rollOnTable(list);
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

        const categoryPick = this.#lookupFromTable(column);
        if (!categoryPick) return;

        const subTableColumn =
            this.tables.specificEncountersTable?.[categoryPick];

        if (!subTableColumn) return;

        const animalPick = this.#lookupFromTable(subTableColumn);

        result.encounter = `${animalPick}`;
    }

    #addWildFeature(result) {
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
            `${type ?? ""}: ${prompt ?? ""} ${detail ?? ""}`.trim();
    }

    #addWildFeature2(result) {
        const sandboxFeaturePick =
            this.#lookupFromTable(this.tables.sandboxGenFeatureTable);

        if (!sandboxFeaturePick) return;

        switch (sandboxFeaturePick) {
            case "Landmark":
                result.feature2 = this.#rollSandboxLandmark();
                break;

            case "Settlement":
                result.feature2 = this.#lookupFromTable(
                    this.tables.sandboxGenSettlementTable
                );
                break;

            case "Lair":
                result.feature2 = "Lair";
                break;

            case "Dungeon":
                result.feature2 = "Dungeon";
                break;

            default:
                result.feature2 = sandboxFeaturePick;
                break;
        }
    }

    #rollSandboxLandmark() {
        const startEntry = this.#lookupFromTable(
            this.tables.sandboxGenLandmarkStartingTable
        );

        if (!startEntry) return null;

        const subTableName = startEntry[1];
        const subTable = this.tables[subTableName];

        let landmark = this.#lookupFromTable(subTable);

        if (!landmark) return null;

        const contentPick =
            this.tables.sandboxGenLandmarkContentTable?.[generalDiceRoll(6)];

        switch (contentPick) {
            case "Hazard": {
                const hazard = this.#lookupFromTable(
                    this.tables.sandboxGenHazardTable
                );
                if (hazard) landmark += `, ${hazard}`;
                break;
            }

            case "Empty": {
                const empty = this.#lookupFromTable(
                    this.tables.sandboxGenEmptyTable
                );
                if (empty) landmark += `, ${empty}`;
                break;
            }

            case "Special": {
                const special = this.#lookupFromTable(
                    this.tables.sandboxGenSpecialStartTable
                );

                if (special) landmark += `, ${special}`;

                if (special === "Arbitrate a dispute") {
                    const dispute = this.#lookupFromTable(
                        this.tables.sandboxGenSpecialDisputeTable
                    );

                    if (dispute) landmark += `, ${dispute}`;
                }

                break;
            }

            case "Monsters":
                landmark += ", Monsters";
                break;

            default:
                break;
        }

        return landmark;
    }

    #addTheme1(result) {
        result.theme1 = rollKnaveTheme();
    }

    #addTheme2(result) {
        result.theme2 = rollKnaveTheme();
    }

    #lookupFromTable(table, roll = null) {
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
    const tables = await MapRollTables.load();

    await initKnaveRolls();

    mapRolls = new MapRollsCore(tables);

    generateButton.addEventListener("click", generateResults);
}

async function generateResults() {
    let terrain = terrainSelect.value;

    const terrainArray = [
        "Plain",
        "Forest",
        "Hills",
        "Desert",
        "Marsh",
        "Lake"
    ];

    if (terrain === "Random") {
        terrain = rollOnTable(terrainArray);
    }

    await mapRolls.generateTerrainResults(terrain);

    resultOutput.innerHTML = mapRolls.getAllResultsText();

    // console.log(mapRolls.results);
}

init();