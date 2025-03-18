
let jsonData;

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

function circleSwap(i, color) {
    // Makes a new circle and swaps the image
    let name = "js-circle" + i;  //Name of image to be swapped
    let currentCircle = document.getElementById(name);
    let newInit = currentCircle.getAttribute('data-circle');
    let newParts = newInit.split('-');
    let newTicks = parseInt(newParts[0], 10);
    let newSize = parseInt(newParts[1], 10);
    new Circle(color, newSize, newTicks);
    let img = document.getElementById(name);
    let circleImage = "../images/Progress_Clocks/Clock-" + color + "-" + newSize + "-" + newTicks + ".png";
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

function updateSheet(id) {
    let circleNos = 0;
    if (id === undefined) {
        circleNos = 1;
    } else {
        circleNos = id;
    }
    let colorOrder = ["Green", "Blue", "Grey", "Green", "Blue", "Grey", "Green", "Blue", "Grey"];
    for (let i = 1; i <= circleNos; i++) {
        circleSwap(i, colorOrder[i - 1]);
    }
};

function generateGoals(data) {
    let goalContainer = document.getElementById("form-goal-overall");

    if (!goalContainer) {
        console.error("Error: form-goal-overall not found in DOM!");
        return;
    }

    const goalNumber = data.test.length; // Use the length of the JSON array

    for (let i = 0; i < goalNumber; i++) {
        let goalData = data.test[i]; // Get current goal object

        const goalDiv = document.createElement("div");
        goalDiv.className = "form-goal";

        const textGoal = document.createElement("p");
        textGoal.className = "text-goal";

        const span = document.createElement("span");
        span.id = `progress-label-${i + 1}`;

        const boldText = document.createElement("b");
        boldText.textContent = `Goal ${goalData.number} - ${goalData["text-goal"]}`; // Using text-goal from JSON

        textGoal.appendChild(span);
        textGoal.appendChild(boldText);

        const img = document.createElement("img");
        img.id = `js-circle${i + 1}`;
        img.src = `../images/Progress_Clocks/Clock-${goalData.colour}-${goalData["circle-fill"]}-${goalData["circle-size"]}.png`;
        img.alt = "Circle Pic";
        img.dataset.circle = `${goalData["circle-size"]}-${goalData["circle-fill"]}`;
        img.width = 100;

        goalDiv.appendChild(textGoal);
        goalDiv.appendChild(img);
        goalContainer.appendChild(goalDiv);
    }
}


window.onload = function () {
    let goalContainer = document.getElementById("form-goal-overall");

    if (!goalContainer) {
        console.error("Error: form-goal-overall not found in DOM!");
        return;
    }

    // Fetch JSON
    fetch('../json/DnD_Faction_Test_Store.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log("JSON Loaded Successfully:", data);
            generateGoals(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
};


