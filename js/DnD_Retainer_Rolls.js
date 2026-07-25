
/**
 * @property {num} RetainerId // 1
 * @property {string} Strength //12
 * @property {string} Intelligence
 * @property {string} Wisdom
 * @property {string} Dexterity
 * @property {string} Constitution
 * @property {string} Charisma
 * @property {string} Class
 * @property {num} Level
 * @property {string} ToHit
 * @property {string} acBonus
 * @property {string} conMod
 * @property {num} hp
 * @property {string} Armour
 * @property {num} ac
 * @property {string} Weapon1
 * @property {string} W1Att
 * @property {string} Weapon2
 * @property {string} W2Att
 * @property {string} generalGear
 * @property {string} adventuringGear1
 * @property {string} adventuringGear2
 * @property {string} extra

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";

const generateButton = document.getElementById("button-generate");
const copyButton = document.getElementById("button-copy");
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
        this.toHit = null;
        this.acBonus = null;
        this.conMod = null;
        this.hp = null;
        this.armour = null;
        this.ac = null;
        this.weapon1 = null;
        this.w1Att = null;
        this.weapon2 = null;
        this.w2Att = null;
        this.generalGear = null;
        this.adventuringGear1 = null;
        this.adventuringGear2 = null;
        this.extra = null;

    }

    toText() {
        return `
        <span class="small-text"><b>${this.retainerId}.</b></span> 
        &nbsp&nbsp <span class="small-text">Class: </span>${this.class ?? "—"},
        <span class="small-text">Level: </span>${this.level ?? "—"},<br>
        &nbsp&nbsp <span class="small-text">Str: </span>${this.strength}
        <span class="small-text">Int: </span>${this.intelligence ?? "—"},
        <span class="small-text">Wis: </span>${this.wisdom ?? "—"},
        <span class="small-text">Dex: </span>${this.dexterity ?? "—"},
        <span class="small-text">Con: </span>${this.constitution ?? "—"},
        <span class="small-text">Cha: </span>${this.charisma ?? "—"}, <br>
        &nbsp&nbsp <span class="small-text">ToHit: </span>${this.toHit}, <span class="small-text">AC </span>${this.ac}, <span class="small-text">HP: </span>${this.hp}<br>

        &nbsp&nbsp <span class="small-text">Weapons: </span>${this.weapon1} ${this.w1Att}, ${this.weapon2} ${this.w2Att}, 
        <span class="small-text">Armour: </span>${this.armour}<br>
        &nbsp&nbsp <span class="small-text">Gear: </span>${this.generalGear ?? "—"}, ${this.adventuringGear1}, ${this.adventuringGear2 ?? ""}${this.extra}<br><br>
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
        result.hp = null;
        result.class = null;
        result.toHit = null;
        result.acBonus = null;
        result.conMod = null;
        result.hp = null;
        result.armour = null;
        result.ac = null;
        result.weapon1 = null;
        result.w1Att = null;
        result.weapon2 = null;
        result.w2Att = null;
        result.extra = null;
        result.generalGear = null;
        result.adventuringGear1 = null;
        result.adventuringGear2 = null;


        this.#addLevel(result);
        this.#addClass(result);
        this.#addStats(result);
        this.#addEquipment(result);

        // this.results.push(result);
        // this.results.unshift("<br>");
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
            5: "Magic-User",
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

    #addStats(result) {
        const strMod = {
            3: "-3",
            4: "-2",
            5: "-2",
            6: "-1",
            7: "-1",
            8: "-1",
            9: "+0",
            10: "+0",
            11: "+0",
            12: "+0",
            13: "+1",
            14: "+1",
            15: "+1",
            16: "+2",
            17: "+2",
            18: "+3"
        }
        result.toHit = strMod[result.strength];

        const dexACMod = {
            3: -3,
            4: -2,
            5: -2,
            6: -1,
            7: -1,
            8: -1,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 1,
            14: 1,
            15: 1,
            16: 2,
            17: 2,
            18: 3
        }
        result.acBonus = dexACMod[result.dexterity];

        const conTable = {
            3: -3,
            4: -2,
            5: -2,
            6: -1,
            7: -1,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 1,
            14: 1,
            15: 1,
            16: 2,
            17: 2,
            18: 3
        }
        result.conBonus = conTable[result.constitution];
        result.hp = generalDiceRoll(result.level, 8) + (result.conBonus * result.level);
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
            12: "Wolfsbane (1 bunch)"
        }

        result.adventuringGear1 = this.#rollFromObjectTable(adventuringGearTable);
        result.adventuringGear2 = this.#rollFromObjectTable(adventuringGearTable);
        if (result.adventuringGear1 === result.adventuringGear2) {
            result.adventuringGear2 = "";
        }

        const classArmour = {
            "Cleric": ["Leather", "Leather",
                "Chainmail", "Chainmail",
                "Platemail", "Platemail"],
            "Dwarf": ["Leather", "Leather + Shield",
                "Chainmail", "Chainmail + Shield",
                "Platemail", "Platemail + Shield"],
            "Elf": ["Leather", "Leather + Shield",
                "Chainmail", "Chainmail + Shield",
                "Platemail", "Platemail + Shield"],
            "Fighter": ["Leather", "Leather + Shield",
                "Chainmail", "Chainmail + Shield",
                "Platemail", "Platemail + Shield"],
            "Fighter": ["Leather", "Leather + Shield",
                "Chainmail", "Chainmail + Shield",
                "Platemail", "Platemail + Shield"],
            "Halfling": ["Leather", "Leather + Shield",
                "Chainmail", "Chainmail + Shield",
                "Platemail", "Platemail + Shield"],
            "Magic-User": ["None", "None", "None",
                "None", "None", "None"],
            "Thief": ["Leather", "Leather", "Leather",
                "Leather", "Leather", "Leather"]
        }

        result.armour = classArmour[result.class][generalDiceRoll(6) - 1];

        const armourAC = {
            "None": 9,
            "Leather": 12,
            "Leather + Shield": 13,
            "Chainmail": 14,
            "Chainmail + Shield": 15,
            "Platemail": 16,
            "Platemail + Shield": 16
        }

        result.ac = armourAC[result.armour] + result.acBonus;

        const classWeapon = {
            "Cleric": ["Mace", "Sling",
                "Staff", "Warhammer",
                "Mace", "Sling",
                "Staff", "Warhammer",
                "Mace", "Sling",
                "Staff", "Warhammer"],
            "Dwarf": ["Battle Axe", "Crossbow",
                "Hand Axe", "Mace",
                "Pole Arm", "Short Bow",
                "Short Sword", "Silver Dagger",
                "Sling", "Spear",
                "Long Sword", "Warhammer"],
            "Elf": ["Battle Axe", "Crossbow",
                "Hand Axe", "Mace",
                "Pole Arm", "Short Bow",
                "Short Sword", "Silver Dagger",
                "Sling", "Spear",
                "Long Sword", "Warhammer"],
            "Fighter": ["Battle Axe", "Crossbow",
                "Hand Axe", "Mace",
                "Pole Arm", "Short Bow",
                "Short Sword", "Silver Dagger",
                "Sling", "Spear",
                "Long Sword", "Warhammer"],
            "Halfling": ["Battle Axe", "Crossbow",
                "Hand Axe", "Mace",
                "Pole Arm", "Short Bow",
                "Short Sword", "Silver Dagger",
                "Sling", "Spear",
                "Long Sword", "Warhammer"],
            "Magic-User": ["Dagger", "Dagger", "Dagger",
                "Dagger", "Dagger", "Dagger",
                "Dagger", "Dagger", "Dagger",
                "Dagger", "Dagger", "Dagger"],
            "Thief": ["Battle Axe", "Crossbow",
                "Hand Axe", "Mace",
                "Pole Arm", "Short Bow",
                "Short Sword", "Silver Dagger",
                "Sling", "Spear",
                "Long Sword", "Warhammer"]
        }

        result.weapon1 = classWeapon[result.class][generalDiceRoll(12) - 1];
        result.weapon2 = classWeapon[result.class][generalDiceRoll(12) - 1];

        const weaponDamage = {
            "Battle Axe": "1d8",
            "Club": "1d4",
            "Crossbow": "1d6",
            "Dagger": "1d4",
            "Hand Axe": "1d6",
            "Javelin": "1d4",
            "Lance": "1d6",
            "Long Bow": "1d6",
            "Mace": "1d6",
            "Oil Flask": "1d8",
            "Pole Arm": "1d10",
            "Short Bow": "1d6",
            "Short Sword": "1d6",
            "Silver Dagger": "1d4",
            "Sling": "1d4",
            "Spear": "1d6",
            "Staff": "1d4",
            "Long Sword": "1d8",
            "Torch": "1d4",
            "Two-handed Sword": "1d10",
            "Warhammer": "1d6"
        }
        result.w1Att = weaponDamage[result.weapon1];
        result.w2Att = weaponDamage[result.weapon2];

        const classExtra = {
            "Cleric": ", Holy Symbol",
            "Dwarf": "",
            "Elf": "",
            "Fighter": "",
            "Halfling": "",
            "Magic-User": "",
            "Thief": ", Thieves' Tools"
        }

        result.extra = classExtra[result.class];

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
    copyButton.addEventListener("click", copyResults);
}

async function generateResults() {

    await retainerRolls.generateRetainerResults();

    resultOutput.innerHTML = retainerRolls.getAllResultsText();

    // console.log(retainerRolls.results);
}

async function copyResults() {

    // let currentId = RetainerRollResults.nextId - 2;
    let currentRetainer = retainerRolls.results[0];
    let detailText =
        "> [!note] **" + currentRetainer.class + "** " +
        "lvl " + currentRetainer.level + "\n" +

        "Str " + currentRetainer.strength + " " +
        "Int " + currentRetainer.intelligence + " " +
        "Wis " + currentRetainer.wisdom + " " +
        "Dex " + currentRetainer.dexterity + " " +
        "Con " + currentRetainer.constitution + " " +
        "Cha " + currentRetainer.charisma + "\n" +

        "ToHit " + currentRetainer.toHit + "  " +
        "AC " + currentRetainer.ac + "  " +
        "HP " + currentRetainer.hp + "\n" +

        "Weapons: " + currentRetainer.weapon1 + " " +
        currentRetainer.w1Att + ", " +
        currentRetainer.weapon2 + "  " +
        currentRetainer.w2Att + ", " +
        "Armour: " + currentRetainer.armour + "\n" +

        "Gear: " + currentRetainer.generalGear + ", " +
        currentRetainer.adventuringGear1 + ", " +
        currentRetainer.adventuringGear2 + " " +
        currentRetainer.extra
        ;

    navigator.clipboard.writeText(detailText);

}

init();