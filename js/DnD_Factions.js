//Global Variables

let factionsData = {};

// Async function to fetch data and wait for it to load
async function loadData() {
    try {
        const response = await fetch('json/DnD_Factions.json');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        factionsData = await response.json();  // Wait for JSON to be parsed
        console.log("Data loaded:", factionsData);

        // Now call the function that depends on the loaded data
        circleCheck('Green',3, 1);
    } catch (error) {
        console.error('Error loading factions data:', error);
    }
}

// Call the loadData function
loadData();

class Circle {
    static circleDatabase = {};
    img = undefined;

    constructor(color, size, ticks) {
        this.circleColor = color;
        this.circleSize = size;
        this.circleTicks = ticks;
        Circle.circleDatabase[this.generateName()] = this;
    }
    generateName() {
        const circleCount = Object.keys(Circle.circleDatabase).length + 1;
        return `Circle${circleCount}`;
    }
}

function circleCheck(color, size, ticks) {
    let circleSource = "../images/Progress_Clocks/Circle-" + color + "-" + size + "-" + ticks + ".png";
    return circleSource;
}

/* function circleCheck(size, ticks, color) {
    if (factionsData.hasOwnProperty(color)) {
        if (factionsData[color].hasOwnProperty(size)) {
            if (factionsData[color][size].hasOwnProperty(ticks)) {
                return factionsData[color][size][ticks];
            } else {
                console.log("Ticks value not found in the database.");
                return null;
            }
        } else {
            console.log("Size value not found in the database.");
            return null;
        }
    } else {
        console.log("Color value not found in the database.");
        return null;
    }
} */

function circleSwap(i,color) {
    // Makes a new circle and swaps the image
    var name = "js-circle" + i;  //Name of image to be swapped
    var currentCircle = document.getElementById(name);
    var newInit = currentCircle.getAttribute('data-circle');
    let newParts = newInit.split('-');
    let newSize = parseInt(newParts[0], 10);
    let newTicks = parseInt(newParts[1], 10);
    new Circle(color, newSize, newTicks);
    var img = document.getElementById(name);
    var circleImage = circleCheck(color,newSize,newTicks);
    if (circleImage) {
        img.srcset = circleImage;
    }
};

function checkOutcome(roll) {
    // Check the outcome of the roll
    if (roll === 7) {
        return "Critical, Exceptional Result";
    } else if (roll < 7 && roll > 5) {
        return "Good Result, Full Effect";
    } else if (roll < 6 && roll > 3) {
        return "Mixed Result, Partial Effect";
    } else if (roll < 4) {
        return "Poor Result, Limited Effect";
    }
};

function rollFortune() {
    var traitRating = parseInt(document.getElementById('trait-rating').value);
    var majorAdv = parseInt(document.getElementById('major-advantage').value);
    var majorDisAdv = parseInt(document.getElementById('major-disadvantage').value);
    var roll0d = "Fortune";
    var diceQty = traitRating + majorAdv - majorDisAdv;
    if (diceQty < 1) {
        diceQty = 2;
        roll0d = "0d"; // Rolling both dice at disadvantage
    }
    var diceOutcome = generalDiceRoll(6,diceQty,roll0d);
    var fortuneOutcome = checkOutcome(diceOutcome);
    var fortuneResult = diceOutcome + ": " + fortuneOutcome;
    document.getElementById('fortune-result').innerHTML = fortuneResult;
};


function updateSheet(id){
    var circleNos = 0;
    if (id === undefined){
        circleNos = 1;
    } else {
        circleNos = id;
    }
    var colorOrder = ["Green","Blue","Grey","Green","Blue","Grey","Green","Blue","Grey"];
    for (var i = 1; i <= circleNos; i++) {
        circleSwap(i,colorOrder[i-1]);
    }
};
