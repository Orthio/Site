import { generalDiceRoll, currentDay, currentMonth, currentYear, getDateName, getMonthDays, monthsArray, getDayOfYear } from './DnD_General.js';

// Global Variables
let weatherArray = [];
let windArray = [];
let rainArray = [];
let windDirArray = [];
let effectsArray = [];
let weatherCurrent = '';
let windCurrent = '';
let rainCurrent = '';
let windDirectionCurrent = '';
let weatherCRoll;
let windCRoll;
let effectsSave = [];
let jsonArray = [];
let jsonHistory = "";


let weatherData = {};
let isWeatherDataLoaded = false; // Flag to check if data is loaded

const calendarWeatherTable = [
    { seasonName: "Winter2", seasonDay: 1, seasonMonth: 1 },
    { seasonName: "Spring", seasonDay: 19, seasonMonth: 4 },  // Ches 19
    { seasonName: "Summer", seasonDay: 20, seasonMonth: 8 },  // Kythorn 20
    { seasonName: "Autumn", seasonDay: 21, seasonMonth: 12 }, // Eleint 21
    { seasonName: "Winter", seasonDay: 20, seasonMonth: 17 }  // Nightal 20
];

var currentCalendarSeason = "Autumn";

// Load the JSON data using fetch
fetch('json/DnD_Weather.json')
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

/* function getCurrentSeason(currentDay, currentMonth) {
    const currentDayOfYear = getDayOfYear(currentDay, currentMonth);

    const seasons = calendarWeatherTable.map(season => ({
        ...season,
        dayOfYear: getDayOfYear(season.seasonDay, season.seasonMonth)
    })).sort((a, b) => a.dayOfYear - b.dayOfYear);

    // If current day is before the first season starts, it's still Winter
    if (currentDayOfYear < seasons[0].dayOfYear) {
        return seasons[seasons.length - 1].seasonName; // Winter
    }

    // Find the most recent season start
    for (let i = seasons.length - 1; i >= 0; i--) {
        if (currentDayOfYear >= seasons[i].dayOfYear) {
            return seasons[i].seasonName;
        }
    }

    // Fallback (shouldn't hit this)
    return "Unknown";
} */

function weatherFunction() {

    // Select correct season tables
    var weatherTable;
    var windTable;
    var rainTable;

    switch (currentCalendarSeason) {
        case "Spring":
            weatherTable = weatherData.springWeatherTable;
            windTable = weatherData.springWindTable;
            rainTable = weatherData.springRainTable;
            break;
        case "Summer":
            weatherTable = weatherData.summerWeatherTable;
            windTable = weatherData.summerWindTable;
            rainTable = weatherData.summerRainTable;
            break;
        case "Autumn":
            weatherTable = weatherData.autumnWeatherTable;
            windTable = weatherData.autumnWindTable;
            rainTable = weatherData.autumnRainTable;
            break;
        case "Winter":
            weatherTable = weatherData.winterWeatherTable;
            windTable = weatherData.winterWindTable;
            rainTable = weatherData.winterRainTable;
            break;
    }

    // Roll for season weather
    for (let i = 0; i < 30; i++) {
        if (i > 0 && Math.random() < 0.25) {
            weatherArray.push(weatherArray[i - 1]);
            windCRoll = generalDiceRoll(20);
        } else {
            weatherCRoll = generalDiceRoll(100);
            windCRoll = generalDiceRoll(20);

            weatherCurrent = decideConditions(weatherCRoll, weatherTable);
            weatherArray.push(weatherCurrent);

            fetchEffects(weatherCurrent, weatherCRoll, windCRoll);
        }

        if (isInRange(weatherCRoll, 20, 94)) {
            windCurrent = decideConditions(windCRoll, windTable);
            if (isInRange(windCRoll, 16, 20)) {
                windDirectionCurrent = decideConditions(generalDiceRoll(4), weatherData.windDirectionTable);
            } else {
                windDirectionCurrent = "";
            }
        } else {
            windCurrent = "";
        }

        if (isInRange(weatherCRoll, 20, 59)) {
            rainCurrent = decideConditions(generalDiceRoll(20), rainTable);
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
    let year = currentYear;

    for (let i = 0; i < 30; i++) {
        let thisMonthsDays = getMonthDays(month);
        if (day > thisMonthsDays) {
            day = 1;
            month++;
        }
        if (month > 17) {
            month = 1;
            year++;
        }

        var dateName = getDateName(day, month);
        weatherHistory += `<div><b>Day ${i + 1}, ${dateName}</b></div>
            <div>${weatherArray[i]} ${windArray[i]} ${windDirArray[i]} ${rainArray[i]}</div><br>`;
        jsonHistory += "{" + '<br>' +
            '"date": "' + day + "-" + month + "-" + year + '",' + '<br>' +
            '"title": "' + weatherArray[i] + windArray[i] + windDirArray[i] + rainArray[i] + '"' + '<br>' +
            "}," + '<br>';

        day++;

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

function jsonFunction() {
    if (jsonHistory.length === 0) {
        console.error("No json data to display.");
        return;
    }

    document.getElementById("json-results").innerHTML = "<br>" + jsonHistory + "___________________________________ ";

}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const weatherFunctionButton = document.querySelector("#weather-function");
    const effectsFunctionButton = document.querySelector("#effects-function");
    const jsonFunctionButton = document.querySelector('#json-function');

    const dateNameToday = getDateName(currentDay, currentMonth);
    const dateText = "Today is " + dateNameToday + " " + currentYear + " (" + currentDay + "-" + currentMonth + "-" + currentYear + ")";
    document.getElementById("date-text").innerHTML = dateText;

    const seasonToday = currentCalendarSeason;
    const seasonText = "The current season is " + seasonToday;
    document.getElementById("season-name").innerHTML = seasonText;

    weatherFunctionButton.addEventListener("click", () => {
        if (isWeatherDataLoaded) {
            weatherFunction();
        }
    });

    effectsFunctionButton.addEventListener("click", effectsFunction);

    jsonFunctionButton.addEventListener("click", jsonFunction);
});
