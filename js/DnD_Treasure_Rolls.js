
const indiTreasureTable = [
    { minCR: 0, maxCR: 4, treasure: "3d6 gp" },
    { minCR: 5, maxCR: 10, treasure: "2d8 * 10 gp" },
    { minCR: 11, maxCR: 16, treasure: "2d10 * 10 pp" },
    { minCR: 17, maxCR: 40, treasure: "2d8 * 100 pp" }
];

const hoardTreasureTable = [
    {
        minCR: 0,
        maxCR: 4,
        treasure: "2d4 * 100 gp",
        magicItems: "1d4-1"
    },
    {
        minCR: 5,
        maxCR: 10,
        treasure: "8d10 * 100 gp",
        magicItems: "1d3"
    },
    {
        minCR: 11,
        maxCR: 16,
        treasure: "8d8 * 10,000 gp",
        magicItems: "1d4"
    },
    {
        minCR: 17,
        maxCR: 30,
        treasure: "6d10 * 10,000 gp",
        magicItems: "1d6"
    }
];


function calcIndiTreasure() {
    let cr = document.getElementById("CRInput").value;
    for (let row of indiTreasureTable) {
        if (cr >= row.minCR && cr <= row.maxCR) {
            return row.treasure;
        }
    }
    return "No treasure found";

}


const newButtonUp = document.querySelector("#button-up");

newButtonUp.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    inputField.value = parseInt(inputField.value) + 1;  // Increment and update value
});

const newButtonDown = document.querySelector("#button-down");

newButtonDown.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    let inputValue = parseInt(inputField.value);  // Get the current value as a number
    if (inputValue > 1) {
        inputField.value = inputValue - 1;  // Decrement value if greater than 1
    }
});

const newButtonIndi = document.querySelector("#button-individual-treasure");

newButtonIndi.addEventListener("click", () => {
    calcIndiTreasure();
});

const newButtonHoard = document.querySelector("#button-treasure-hoard");

newButtonIndi.addEventListener("click", () => {
    calcHoardTreasure();
});

