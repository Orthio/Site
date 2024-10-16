import { generalDiceRoll, currentDay, currentMonth, getDateName, getMonthDays } from './DnD_General.js';

// Global Variables
var weatherArray = [];
var windArray = [];
var rainArray = [];
var windDirArray = [];
var effectsArray = [];
var weatherCurrent = '';
var windCurrent = '';
var rainCurrent = '';
var windDirectionCurrent = '';
var weatherCRoll;
var windCRoll;
var effectsSave = [];

let weatherData = {};
let isWeatherDataLoaded = false; // Flag to check if data is loaded

// Load the JSON data using fetch
fetch('./json/DnD_Weather.json')
    .then(response => response.json())
    .then(data => {
        weatherData = data;
        isWeatherDataLoaded = true; // Mark as loaded

    })
    .catch(error => console.error('Error loading the JSON data:', error));
  


function decideConditions(roll, table) {
    if (!table) {
        console.error("Table is not defined.");
        return "Unknown";
    }

    const keys = Object.keys(table).map(Number).sort((a, b) => b - a);
    for (let i = 0; i < keys.length; i++) {
        if (roll >= keys[i]) {
            return table[keys[i]];
        }
    }
    return "Unknown";
}

function isInRange(numbercheck, numberlow, numberhigh) {
    return numbercheck >= numberlow && numbercheck <= numberhigh;
}

function fetchEffects(current, roll, windroll) {
    if (!weatherData.effectsTable || !current) {
        console.error("Effects data or current effect is missing.");
        return;
    }
    let effectsCurrent = weatherData.effectsTable[current];
    effectsArray.push(effectsCurrent);

    if (roll === 1) {
        effectsArray.push(weatherData.effectsTable["A Snowfall"]);
        effectsArray.push(weatherData.effectsTable["A High Wind"]);
        effectsArray.push(weatherData.effectsTable["A Freezing Cold"]);
    }

    if ([2, 3, 4, 5, 6, 7, 8, 9].includes(roll)) {
        effectsArray.push(weatherData.effectsTable["A Snowfall"]);
    }

    if (roll === 100) {
        effectsArray.push(weatherData.effectsTable["An Ashfall descends"]);
    }

    if ([16, 17, 18, 19, 20].includes(windroll)) {
        effectsArray.push(weatherData.effectsTable["A High Wind"]);
    }
}

function weatherFunction() {
    for (let i = 0; i < 4; i++) {
        if (i > 0 && Math.random() < 0.25) {
            weatherArray.push(weatherArray[i - 1]);
            windCRoll = generalDiceRoll(20);
        } else {
            weatherCRoll = generalDiceRoll(100);
            windCRoll = generalDiceRoll(20);

            weatherCurrent = decideConditions(weatherCRoll, weatherData.winterWeatherTable);
            weatherArray.push(weatherCurrent);

            fetchEffects(weatherCurrent, weatherCRoll, windCRoll);
        }

        if (isInRange(weatherCRoll, 20, 94)) {
            windCurrent = decideConditions(windCRoll, weatherData.winterWindTable);
            if (isInRange(windCRoll, 16, 20)) {
                windDirectionCurrent = decideConditions(generalDiceRoll(4), weatherData.windDirectionTable);
            } else {
                windDirectionCurrent = "";
            }
        } else {
            windCurrent = "";
        }

        if (isInRange(weatherCRoll, 20, 59)) {
            rainCurrent = decideConditions(generalDiceRoll(20), weatherData.winterRainTable);
        } else {
            rainCurrent = "";
        }

        windArray.push(windCurrent);
        rainArray.push(rainCurrent);
        windDirArray.push(windDirectionCurrent);
    }

    displayResults();

    let uniqueEffectsArray = [...new Set(effectsArray)];
    effectsSave = uniqueEffectsArray;

    weatherArray = [];
    windArray = [];
    rainArray = [];
    windDirArray = [];
    effectsArray = [];
}

function displayResults() {
    let weatherHistory = '';
    let day = currentDay;
    let month = currentMonth;

    for (var i = 0; i < 4; i++) {
        let thisMonthsDays = getMonthDays(month);
        if (day > thisMonthsDays) {
            day = 1;
            month++;
        }
        if (month > 18) {
            month = 1;
        }

        let dateName = getDateName(day, month);
        weatherHistory += `<div><b>Day ${i + 1}, ${dateName}</b></div>
            <div>${weatherArray[i]} ${windArray[i]} ${windDirArray[i]} ${rainArray[i]}</div><br>`;
            day ++;

    }

    document.getElementById("results").innerHTML = weatherHistory + "___________________________________ ";
}

function effectsFunction() {
    if (effectsSave.length === 0) {
        console.error("No effects to display.");
        return;
    }

    let effectshistory = '';
    effectsSave.forEach(effect => {
        effectshistory += "<div>" + effect + "<br><div><br></div>";
    });

    document.getElementById("effectsresults").innerHTML = "<br>" + effectshistory + "___________________________________ ";
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const weatherFunctionButton = document.querySelector("#weather-function");
    const effectsFunctionButton = document.querySelector("#effects-function");

    weatherFunctionButton.addEventListener("click", () => {
        if (isWeatherDataLoaded) {
            weatherFunction();
        }
    });

    effectsFunctionButton.addEventListener("click", effectsFunction);
});
