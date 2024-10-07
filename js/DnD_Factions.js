
import { generalDiceRoll } from './DnD_General.js';

//Global Variables

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
    var circleImage = "../images/Progress_Clocks/Clock-" + color + "-" + newSize + "-" + newTicks + ".png";
    if (circleImage) {
        img.src = circleImage;
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

window.onload = function () {
    let idElements = document.querySelectorAll('[id^="js-circle"]');
    let idCount = idElements.length;
    updateSheet(idCount);
};