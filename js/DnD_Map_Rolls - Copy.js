
/**
 * @property {string} terrain // plains
 * @property {num} mapId // 1
 * @property {string} terrainFeature // Hillock
 * @property {string} encFeature // Beetle, Fire
 * @property {string|null} wildFeature[0]  // Hazard/Resource, Consider a, 6-6, false
 * @property {string|null} wildFeature[1]  // Consider a
 * @property {string|null} wildFeature[2]  // 6-6
 * @property {string|null} wildFeature2 // sandbox gen proc eg "Sword stuck in a rock, Legend/Myth"
 * @property {string} themeRoll // Fire (from knave tables)
 * @property {string} results // Plains, Hillock, Beetle, Fire...

*/

import { generalDiceRoll, findNextTableNumber, rollOnTable } from './DnD_General.js';

const terrainSelect = document.getElementById("terrain-select");
const generateButton = document.getElementById("button-generate");
let mapRolls;

class MapRollTables {

    static async load() {
        const res = await fetch("json/DnD_Map_Rolls.json");

        if (!res.ok) {
            throw new Error(
                `Failed to load json/DnD_Map_Rolls.json: ${res.status}`
            );
        }

        const data = await res.json();


        const tables = new MapRollTables();
        tables.setTables(data);

        return tables;
    }

    setTables(data = {}) {
        /*    if (!data.hexWildernessTerrain || typeof data.hexWildernessTerrain !== "object") {
               throw new Error("HexMapCore.setTables: terrain missing or invalid");
           } */

        this.tables = {
            terrainTable: data.hexWildernessTerrain ?? null,
            terrainFeaturesTable: data.terrainFeature ?? null,
            inhabitationTable: data.hexInhabitation ?? null,
            wildernessRollsTable: data.wildernessRollsTable ?? null,
            wildernessFeatureChance: data.wildernessFeatureChance ?? null,
            wildernessEncountersTable: data.wildernessEncountersTable ?? null,
            specificEncountersTable: data.specificEncountersTable ?? null,
            wildernessFeaturesTable: data.wildernessFeaturesTable ?? null,
            wildFeatureWithSuppArray: data.wildFeatureWithSuppArray ?? null,
            specialInhabitationTable: data.specialInhabitation ?? null,
            ruinsTypeTable: data.ruinsType ?? null,
            ruinsDecayTable: data.ruinsDecay ?? null,
            ruinsInhabitantsTable: data.ruinsInhabitants ?? null,
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
            fillingFeatureTable: data.fillingFeatureTable ?? null,
            sandboxGenSpecialDisputeTable: data.sandboxGenSpecialDisputeTable ?? null,
            wildHexMatchingTable: data.wildHexMatchingTable ?? null,
            forestWildHexTable: data.forestWildHexTable ?? null,
            mountainWildHexTable: data.mountainWildHexTable ?? null,
            desertWildHexTable: data.desertWildHexTable ?? null,
            swampWildHexTable: data.swampWildHexTable ?? null,
            oceanWildHexTable: data.oceanWildHexTable ?? null,
            lostChanceTable: data.lostChanceTable ?? null,
            colourTable: data.colourTable ?? null,
            baseTerrainTable: data.baseTerrainTable ?? null,
            featureThresholdTable: data.featureThresholdTable ?? null,
            terrainAddThreshTable: data.terrainAddThreshTable ?? null,
            // Thesholds for forests becoming forest with hills, mountains having a pass
            featureKeysTable: data.featureKeysTable ?? null,
            encounterFeatureKeysTable: data.encounterFeatureKeysTable ?? null,
            // Points to the right part of encFeaturesTable on json

        };
    }
}

class MapRollsCore {

    static mapId = 0;

    constructor() {
        this.tables = tables.tables;
        this.mapId++;
        this.terrainFeature = null;
        this.encounterFeature = null;
        this.wildFeature = null;
        this.wildFeature2 = null;
        this.themeRoll = null;
        this.results = [];
    }



    #addTerrainFeature(cell) {
        // Checks for a terrain feature like hillock based on the cell's terrain
        if (!this.tables) return;
        // Checks which feature table to use based on numerous terrains
        const key = this.tables.featureKeysTable[cell.terrain];
        // Picks the terrain list to use
        const list = key && Array.isArray(this.tables.terrainFeaturesTable[key]) ? this.tables.terrainFeaturesTable[key] : null;
        if (!list || list.length === 0) return;

        const pick = rollOnTable(list);
        if (!pick) return;

        cell.terrainFeature = pick;

    }

    #addEncounterFeature(cell) {
        // Adds a monster
        const terrainCheck = cell.terrain;

        // which column of encFeaturesTable to use for this terrain
        const tableKey = this.tables.encounterFeatureKeysTable[terrainCheck];
        const col = tableKey && typeof this.tables.wildernessEncountersTable[tableKey] === "object"
            ? this.tables.wildernessEncountersTable[tableKey]
            : null;
        if (!col) return;

        cell.encFeature = null;

        // d8 on the column
        const categoryPick = rollOnTable(col);

        // d20 on the type
        const subTableColumn = this.tables.specificEncountersTable[categoryPick];
        const animalPick = rollOnTable(subTableColumn);
        cell.encFeature = [categoryPick, animalPick];

    }

    #addWildFeature(cell) {

        const terrainCheck = cell.terrain;

        // which column of encFeaturesTable to use for this terrain
        const tableKey = this.tables.encounterFeatureKeysTable[terrainCheck];
        const col = tableKey && typeof this.tables.wildernessEncountersTable[tableKey] === "object"
            ? this.tables.wildernessEncountersTable[tableKey]
            : null;
        if (!col) return;

        // clear previous results (so rerolls don't keep old ones)
        cell.encounterFeatures1 = null;
        cell.encounterFeatures2 = null;
        cell.encounterFeatures3 = null;
        cell.wildFeature = null;

        // d8 on the column
        const categoryPick = rollOnTable(col);
        if (!categoryPick) continue;

        // d20 on the type
        const subTableColumn = this.tables.specificEncountersTable[categoryPick];
        const animalPick = rollOnTable(subTableColumn);


        const wildFeatureRoll = generalDiceRoll(36);
        cell.wildFeature = [null, null, null, null];
        cell.wildFeature[0] = this.tables.wildernessFeaturesTable[wildFeatureRoll][0] ?? null;
        cell.wildFeature[1] = this.tables.wildernessFeaturesTable[wildFeatureRoll][1] ?? null;
        cell.wildFeature[2] = this.tables.wildernessFeaturesTable[wildFeatureRoll][2] ?? null;
        cell.wildFeature[3] = this.tables.wildFeatureWithSuppArray?.includes(cell.wildFeature[2]) ?? false;


    }

    #addwildFeature2(cell) {
        const sFTable = this.tables.sandboxGenFeatureTable;
        let sandboxFeaturePick = this.#lookupFromTable(sFTable);

        switch (sandboxFeaturePick) {
            case "Landmark":
                const startEntry = this.#lookupFromTable(this.tables.sandboxGenLandmarkStartingTable);
                const subTableName = startEntry[1];
                const subTable = this.tables[subTableName];
                const sandboxLandmarkPick = this.#lookupFromTable(subTable);
                cell = sandboxLandmarkPick;

                let sandboxContentPick = this.tables.sandboxGenLandmarkContentTable[this.#roll(6)];
                switch (sandboxContentPick) {
                    case "Hazard":
                        const hTable = this.tables.sandboxGenHazardTable;
                        let hazardPick = this.#lookupFromTable(hTable);
                        cell += (", " + hazardPick);
                        break;
                    case "Empty":
                        const eTable = this.tables.sandboxGenEmptyTable;
                        let emptyPick = this.#lookupFromTable(eTable);
                        cell += (", " + emptyPick);
                        break;
                    case "Special":
                        const sTable = this.tables.sandboxGenSpecialStartTable;
                        let specialPick = this.#lookupFromTable(sTable);
                        cell += (", " + specialPick);
                        if (specialPick == "Arbitrate a dispute") {
                            const dTable = this.tables.sandboxGenSpecialDisputeTable;
                            let dispute = this.#lookupFromTable(dTable);
                            cell += (", " + dispute);
                        }
                        break;
                    case "Monsters":
                        cell += (", " + "Monsters")
                        break;
                    default:
                        console.log("sandbox content error");
                }
                break;
            case "Settlement":
                const sTable = this.tables.sandboxGenSettlementTable;
                let sandboxSettlementPick = this.#lookupFromTable(sTable);
                cell = sandboxSettlementPick;
                break;
            case "Lair":
                cell = "Lair";
                break;
            case "Dungeon":
                cell = "Dungeon";
                break;
            default:
                cell = null;
                console.log("sandbox error");
        }
    }

    #rollTerrainResults(terrain) {
        const result = {
            terrain,
            features: []
        };

        result.features.push("result1");

        this.results.push(result);

        return result;
    }

    #formatResult(result) {
        return result.features
            .map((feature, index) => `${index + 1}. ${feature}`)
            .join("\n");
    }

    generateTerrainResults(terrain) {
        const result = {
            terrain,
            features: []
        };

        // this.#addTerrainFeature(result);
        this.#addEncounterFeature(result);
        this.#addWildFeature(result);
        this.#addWildFeature2(result);

        this.results.push(result);
        return result;
    }
}



async function init() {
    const tables = await MapRollTables.load();
    mapRolls = new MapRollsCore(tables);
    generateButton.addEventListener("click", generateResults);
}

function generateResults() {
    let terrain = terrainSelect.value;

    const terrainArray = [
        "Plains",
        "Forest",
        "Hills",
        "Desert",
        "Swamp",
        "Ocean"
    ];

    if (terrain === "random") {
        // Roll random terrain
        terrain = rollOnTable(terrainArray);
    }
    console.log(terrain);

    const mapRolls = new MapRollsCore();

    const result = mapRolls.generateTerrainResults(terrain);
}

init();