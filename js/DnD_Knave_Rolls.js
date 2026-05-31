
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";

let rollsKnave = null;

class KnaveRollTables {
    static async load() {
        const res = await fetch("json/DnD_Roll_Tables.json");

        if (!res.ok) {
            throw new Error(
                `Failed to load json/DnD_Roll_Tables.json: ${res.status}`
            );
        }

        const data = await res.json();

        const tables = new KnaveRollTables();
        tables.setTables(data);

        return tables;
    }

    setTables(data = {}) {
        this.tables = {
            locationsKnaveTable: data.locationsKnave ?? null,
            structuresKnaveTable: data.structuresKnave ?? null,
            placeTraitsKnaveTable: data.placeTraitsKnave ?? null,
            roomThemesKnaveTable: data.roomThemesKnave ?? null,
            dungeonsKnaveTable: data.dungeonsKnave ?? null,
            qualitiesKnaveTable: data.qualitiesKnave ?? null,
            effectsKnaveTable: data.effectsKnave ?? null,
            elementsKnaveTable: data.elementsKnave ?? null,
            formsKnaveTable: data.formsKnave ?? null,

            activitiesKnaveTable: data.activitiesKnave ?? null,
            environmentSignsKnaveTable: data.environmentSignsKnave ?? null,
            booksKnaveTable: data.booksKnave ?? null,
            domainsKnaveTable: data.domainsKnave ?? null,
            itemTraitsKnaveTable: data.itemTraitsKnave ?? null,
        };
    }
}

class KnaveRolls {
    constructor(tables) {
        this.tables = tables.tables;
        this.knaveThemePick = null;
        this.knaveTheme = null;
    }

    knaveThemeRoll() {
        const knaveThemeTables = [
            "locationsKnaveTable",
            "structuresKnaveTable",
            "placeTraitsKnaveTable",
            "roomThemesKnaveTable",
            "dungeonsKnaveTable",
            "qualitiesKnaveTable",
            "effectsKnaveTable",
            "elementsKnaveTable",
            "formsKnaveTable",
            "domainsKnaveTable",
            "itemTraitsKnaveTable"
        ];

        this.knaveThemePick = rollOnTable(knaveThemeTables);

        let result = rollOnTable(
            this.tables[this.knaveThemePick]
        );

        result = this.#resolveKnaveReroll(this.knaveThemePick, result);

        this.knaveTheme = result;

        return this.knaveTheme;

    }

    #resolveKnaveReroll(tableName, result) {
        if (tableName === "locationsKnaveTable") {
            if (result === "Element Field") {
                return `${rollOnTable(this.tables.elementsKnaveTable)} field`;
            }

        }

        if (tableName === "roomThemesKnaveTable") {
            if (result === "Book") {
                return rollOnTable(this.tables.booksKnaveTable);
            }

            if (result === "Domains") {
                return rollOnTable(this.tables.domainsKnaveTable);
            }

            if (result === "Item Trait") {
                return rollOnTable(this.tables.itemTraitsKnaveTable);
            }
        }

        return result;
    }
}

export async function initKnaveRolls() {
    const tables = await KnaveRollTables.load();

    rollsKnave = new KnaveRolls(tables);
    rollsKnave.knaveThemeRoll();

    return rollsKnave.knaveTheme;
}

export function rollKnaveTheme() {
    if (!rollsKnave) {
        throw new Error("Knave rolls not initialized");
    }

    return rollsKnave.knaveThemeRoll();
}