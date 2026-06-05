
/**
 * @property {num} MonsterId // 1
 * @property {string} HD // 2*
 * @property {string} HP1 // 1
 * @property {string} HP2 // 2
 * @property {string} HP3 // 1
 * @property {string} HP4 // 4
 * @property {string} HP5 // 
 * @property {string} HP6 // 
 * @property {string} HP7 // 
 * @property {string} HP8 // 
 * @property {string} HPString // 1, 2, 1, 4

*/
import { generalDiceRoll, rollOnTable } from "./DnD_General.js";
// import { initKnaveRolls, rollKnaveTheme } from "./DnD_Knave_Rolls.js";

const hdButtons = {
    "button-halfHD": 0.5,
    "button-1HD": 1,
    "button-2HD": 2,
    "button-3HD": 3,
    "button-4HD": 4,
    "button-5HD": 5,
    "button-6HD": 6,
    "button-7HD": 7,
    "button-8HD": 8,
    "button-9HD": 9,
    "button-10HD": 10,
    "button-11HD": 11,
    "button-12HD": 12
};

const hpAddInput = document.getElementById("button-hp-add");
const hpResetButton = document.getElementById("button-hp-reset");

const resultOutput = document.getElementById("result-output");

let monsterRolls;

class MonsterRollResult {
    static nextId = 1;

    constructor() {
        this.monsterId = MonsterRollResult.nextId++;
        this.HD = null;
        this.HP1 = null;
        this.HP2 = null;
        this.HP3 = null;
        this.HP4 = null;
        this.HP5 = null;
        this.HP6 = null;
        this.HP7 = null;
        this.HP8 = null;
        this.HPString = null;
    }

    toText() {
        return `${this.monsterId}. <span class="small-text">HD: </span>${this.HD}, &nbsp&nbsp <span class="small-text">HP: </span>${this.HPString ?? "—"}`;
    }
}

class monsterRollsCore {
    constructor() { // (tables)
        // this.tables = tables.tables;
        this.results = [];
    }

    generateMonsterResults(hd, hpAdd) {
        const result = new MonsterRollResult();

        result.HD = hpAdd === 0 ? `${hd}` : `${hd}+${hpAdd}`;

        const hpValues = [];

        for (let i = 1; i <= 8; i++) {
            const hp = this.#rollHp(hd, hpAdd);
            result[`HP${i}`] = hp;
            hpValues.push(hp);
        }
        result.HPString = hpValues.join(", &nbsp");
        this.results.unshift(result);

        return result;
    }

    getAllResultsText() {
        return this.results
            .map(result => result.toText())
            .join("\n\n");
    }

    #rollHp(hd, hpAdd) {

        if (hd === 0.5) {
            return Math.max(1, generalDiceRoll(4) + hpAdd);
        }

        let total = 0;

        for (let i = 0; i < hd; i++) {
            total += generalDiceRoll(8);
        }

        return Math.max(1, total + hpAdd);
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

    monsterRolls = new monsterRollsCore();

    for (const [buttonId, hd] of Object.entries(hdButtons)) {
        document.getElementById(buttonId).addEventListener("click", () => {
            generateResults(hd);
        });
    }

    hpResetButton.addEventListener("click", () => {
        hpAddInput.value = 0;
    });
}

function generateResults(hd) {

    const hpAdd = Number(hpAddInput.value) || 0;

    monsterRolls.generateMonsterResults(hd, hpAdd);

    resultOutput.innerHTML = monsterRolls.getAllResultsText();
}

init();