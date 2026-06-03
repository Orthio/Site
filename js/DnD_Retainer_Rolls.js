
/**
 * @property {num} RetainerId // 1
 * @property {string} Strength //12
 * @property {string} Intelligence
 * @property {string} Wisdom
 * @property {string} Dexterity
 * @property {string} Constitution
 * @property {string} Charisma
 * @property {num} Level

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";

const generateButton = document.getElementById("button-generate");
const resultOutput = document.getElementById("result-output");

let retainerRolls;

class RetainerRollResults {
    static nextId = 1;

    constructor() {
        this.retainerId = RetainerRollResults.nextId++;
        this.strength = null;
        this.intelligence = null;
        this.wisdom = null;
        this.dexterity = null;
        this.constitution = null;
        this.charisma = null;
        this.level = 1;
        this.class = null;
        this.generalGear = null;
        this.adventuringGear1 = null;
        this.adventuringGear2 = null;
    }

    toText() {
        return `
        <span class="small-text"><b>${this.retainerId}.</b></span> <span class="small-text">Str: </span>${this.strength},
        <span class="small-text">Int: </span>${this.intelligence ?? "—"},
        <span class="small-text">Wis: </span>${this.wisdom ?? "—"},
        <span class="small-text">Dex: </span>${this.dexterity ?? "—"},
        <span class="small-text">Con: </span>${this.constitution ?? "—"},
        <span class="small-text">Cha: </span>${this.charisma ?? "—"},
        <span class="small-text">Level: </span>${this.level ?? "—"},<br>
        &nbsp&nbsp <span class="small-text">Class: </span>${this.class ?? "—"},<br>
        &nbsp&nbsp <span class="small-text">Gear: </span>${this.generalGear ?? "—"}, ${this.adventuringGear1}, ${this.adventuringGear2 ?? ""}
        `.replace(/\s+/g, " ");
    }
}

class retainerRollsCore {
    constructor() { // (tables)
        // this.tables = tables.tables;
        this.results = [];
    }

    generateRetainerResults() {
        const result = new RetainerRollResults();

        result.strength = generalDiceRoll(3, 6);
        result.intelligence = generalDiceRoll(3, 6);
        result.wisdom = generalDiceRoll(3, 6);
        result.dexterity = generalDiceRoll(3, 6);
        result.constitution = generalDiceRoll(3, 6);
        result.charisma = generalDiceRoll(3, 6);
        result.level = 1;
        result.class = null;
        result.generalGear = null;
        result.adventuringGear1 = null;
        result.adventuringGear2 = null;


        this.#addLevel(result);
        this.#addClass(result);
        this.#addEquipment(result);

        // this.results.push(result);
        this.results.unshift(result);

        return result;
    }

    getAllResultsText() {
        return this.results
            .map(result => result.toText())
            .join("\n\n");
    }

    #addLevel(result) {
        let rollCheck = generalDiceRoll(6);
        if (rollCheck <= 1) {
            let levelRoll = generalDiceRoll(3) + 1;
            result.level = levelRoll;
        }
    }

    #addClass(result) {
        const classTable = {
            1: "Cleric",
            2: "Fighter",
            3: "Fighter",
            4: "Fighter",
            5: "Magic-user",
            6: "Thief",
            7: "Thief",
            8: "Thief",
            9: "Halfling",
            10: "Halfling",
            11: "Dwarf",
            12: "Elf"
        };

        let classRoll = this.#rollFromObjectTable(classTable);
        let extraClassRoll = generalDiceRoll(8);
        if (classRoll === "Halfling") {
            if (result.constitution < 9 | result.dexterity < 9) {
                classRoll = classTable[extraClassRoll];
            }
        }
        if (classRoll === "Dwarf" & result.constitution < 9) {
            classRoll = classTable[extraClassRoll];
        }
        if (classRoll === "Elf" & result.intelligence < 9) {
            classRoll = classTable[extraClassRoll];
        }

        result.class = classRoll;

    }

    #addEquipment(result) {
        const adventuringGearTable = {
            1: "Crowbar",
            2: "Hammer(small) + 12 iron spikes",
            3: "Holy water",
            4: "Lantern + 3 flasks of oil",
            5: "Mirror (hand-sized, steel)",
            6: "Pole (10' long, wooden)",
            7: "Rope (50')",
            8: "Rope (50') + grappling hook",
            9: "Sack(large)",
            10: "Sack(small)",
            11: "Stakes (3) + mallet",
            12: "Wolfsbane (1 bunch"
        }

        result.adventuringGear1 = this.#rollFromObjectTable(adventuringGearTable);
        result.adventuringGear2 = this.#rollFromObjectTable(adventuringGearTable);
        if (result.adventuringGear1 === result.adventuringGear2) {
            result.adventuringGear2 = "";
        }

        let torchesNo = generalDiceRoll(6);
        let rationsNo = generalDiceRoll(6);
        let cashNo = generalDiceRoll(6, 3);
        result.generalGear = `A backpack, tinderbox, ${torchesNo} torches, a waterskin, ${rationsNo} iron rations, ${cashNo}gp`;


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

    retainerRolls = new retainerRollsCore(); // (tables)

    generateButton.addEventListener("click", generateResults);
}

async function generateResults() {

    await retainerRolls.generateRetainerResults();

    resultOutput.innerHTML = retainerRolls.getAllResultsText();

    // console.log(retainerRolls.results);
}

init();