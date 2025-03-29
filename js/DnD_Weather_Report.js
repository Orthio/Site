

import { currentTime, currentDay, currentMonth, currentYear, monthsArray, getDateSuffix, getDateName, getMonthDays } from './DnD_General.js';
// console.log("currentday: ",currentDay," currentmonth: ", currentMonth, " currentyear: ",currentYear);

let dateName = getDateName(currentDay, currentMonth);
let dateText = "Currently " + dateName + " " + currentYear + "DR, About " + currentTime;

const currentDateBanner = document.querySelector("#current-date");
currentDateBanner.innerText = dateText;

let holidaysArray = [];
let weatherArray = [];
let weatherEffectsArray = [];
let effectsToggle = 0;

Promise.all([
    fetch('json/DnD_Calendar_Holidays.json').then(response => response.json()),
    fetch('json/DnD_Calendar_Weather.json').then(response => response.json()),
    fetch('json/DnD_Weather.json').then(response => response.json()),

])
    .then(([holidaysData, weatherData, weatherEffectsData]) => {
        holidaysArray = holidaysData;
        weatherArray = weatherData;
        weatherEffectsArray = weatherEffectsData.effectsTable;
        // console.log("Holidays Array ", holidaysArray);  // Holidays array from JSON file
        // console.log("Events Array ", weatherArray);      // Events array from JSON file

        // Now you can use both holidaysArray and weatherArray
        buttons();
        updateCalendar();
        updateArrivalDays();
    })
// .catch(error => console.error('Error loading JSON data:', error));

class Day {
    static dayCurrentDay = currentDay;
    static dayCurrentMonth = currentMonth;
    static dayCurrentMonthName = monthsArray[Day.dayCurrentMonth - 1].month;
    static dayCurrentYear = currentYear;
    static dayCurrentDateText = `${Day.dayCurrentDay}-${Day.dayCurrentMonth}-${Day.dayCurrentYear}`;

    static dayCalendarDay = 0; // Day to cycle through while creating day boxes
    static dayFaerunDay = 0;
    static dayFaerunWeek = 1;
    static dayFaerunDayText1 = Day.dayFaerunDay + getDateSuffix(Day.dayFaerunDay) + " day of the "
    static dayFaerunDayText2 = Day.dayFaerunWeek + getDateSuffix(Day.dayFaerunWeek) + " tenday";
    static dayCalendarMonth = Day.dayCurrentMonth;
    static dayCalendarMonthText = Day.dayCalendarMonth < 10 ? "0" + Day.dayCalendarMonth : Day.dayCalendarMonth;
    static dayCalendarMonthName = Day.dayCurrentMonthName;
    static dayCalendarMonthDays = getMonthDays(Day.dayCalendarMonth);
    static dayCalendarYear = Day.dayCurrentYear;
    static dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    static dayObjects = {};

    constructor() {
        this.day = Day.dayCalendarDay;
        // for the day number in the month (1st 2nd)
        this.dayText = this.day;
        //this.day < 10 ? "0" + this.day : 
        // old code was: if current day is less than 10, add 0, otherwise leave it
        this.faerunDay = Day.dayFaerunDay; // For the 1st day of second tenday
        this.faerunWeek = Day.dayFaerunWeek;
        this.faerunDayText1 = Day.dayFaerunDay + getDateSuffix(Day.dayFaerunDay) + " day of the "
        this.faerunDayText2 = Day.dayFaerunWeek + getDateSuffix(Day.dayFaerunWeek) + " tenday";

        this.month = Day.dayCalendarMonth;
        this.monthText = this.month < 10 ? "0" + this.month : this.month;
        this.year = Day.dayCalendarYear;
        this.yearText = this.year;
        this.dayText = this.dayText + "-" + this.monthText + "-" + this.yearText;
        this.monthIndex++;
        // for the number of day in the month
        this.yearIndex++;
        // for the number of day in the year
    }
}

function nextDay() {

    if (Day.dayCalendarDay > 30) {
        nextMonth();
    }

    Day.dayCalendarDay++;
    Day.dayFaerunDay++;
    if (Day.dayFaerunDay > 10) {
        Day.dayFaerunDay = 1;
        Day.dayFaerunWeek++;
    }
    updateDayText();
}

function nextMonth() {

    Day.dayCalendarMonth++;
    if (Day.dayCalendarMonth === 18) {
        Day.dayCalendarMonth = 1;
        nextYear();
    }
    Day.dayCalendarDay = 0;
    Day.dayFaerunDay = 0;
    Day.dayFaerunWeek = 1;
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth - 1].month;
    updateDayText();
}

function nextMonthFunction() {
    // Skip a month if about to go onto a holiday month
    let holidayMonths = [1, 5, 9, 12, 15];
    if (holidayMonths.includes(Day.dayCalendarMonth)) {
        Day.dayCalendarMonth++;
    }
}

function previousMonth() {

    Day.dayCalendarMonth--;
    Day.dayCalendarDay = 0;
    Day.dayFaerunWeek = 0;

    if (Day.dayCalendarMonth === 0) {
        Day.dayCalendarMonth = 17;
        previousYear();
    }
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth - 1].month;
    updateDayText();
}

function previousMonthFunction() {
    // Skip a month if about to go onto a holiday month
    let holidayMonths = [3, 7, 11, 14, 17];
    if (holidayMonths.includes(Day.dayCalendarMonth)) {
        Day.dayCalendarMonth--;
    }
}

function nextYear() {
    Day.dayCalendarYear++;
    updateDayText();
}

function previousYear() {
    Day.dayCalendarYear--;
    updateDayText();
}

function updateDayText() {
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayFaerunDayText1 = Day.dayFaerunDay + getDateSuffix(Day.dayFaerunDay) + " day of the "
    Day.dayFaerunDayText2 = Day.dayFaerunWeek + getDateSuffix(Day.dayFaerunWeek) + " tenday";

    Day.dayObjects[Day.dayText] = new Day();
}

const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month-weather");
let navigation = 0;
let clicked = null;
// let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : [];


function updateCalendar() {

    monthBanner.innerText = `${Day.dayCalendarMonthName} ${Day.dayCalendarYear}DR`;
    calendar.innerHTML = "";
    let holidayCheck;

    let holidayMonths = [1, 5, 9, 12, 15];
    if (holidayMonths.includes(Day.dayCalendarMonth)) {
        holidayCheck = 1;
    } else {
        holidayCheck = 0;
    }

    for (let i = 1; i <= 30; i++) {
        const dayBox = document.createElement("div");
        dayBox.classList.add("day");

        nextDay();

        dayBox.innerText = i + "\n" +
            Day.dayFaerunDayText1 + "\n" +
            Day.dayFaerunDayText2;
        //Weather of Day
        const weatherOfTheDay = weatherArray.find((e) => e.date == Day.dayText);
        //Holiday
        const holidayOfTheDay = holidaysArray.find((e) => e.date == Day.dayText);

        if (i === Day.dayCurrentDay && navigation == 0) {
            dayBox.id = "currentDay";
        }

        if (holidayOfTheDay) {
            const holidayDiv = document.createElement("div");
            holidayDiv.classList.add("weather");
            holidayDiv.classList.add("holiday");
            holidayDiv.innerText = holidayOfTheDay.holiday;
            dayBox.appendChild(holidayDiv);
        }
        if (weatherOfTheDay) {
            const weatherDiv = document.createElement("div");
            weatherDiv.classList.add("weather");
            weatherDiv.innerText = weatherOfTheDay.title;
            dayBox.appendChild(weatherDiv);
        }

        dayBox.addEventListener("click", () => {
            showModal(Day.dayText);
        });

        calendar.append(dayBox);

        if (i === 30 && holidayCheck === 1) {
            addHolidayDay();
        }
    }
}

function addHolidayDay() {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    // Day.dayCalendarDay = 31;
    Day.dayCalendarMonth++;

    // Add to Select calendar month for hol based on current using festivalDays
    Day.dayText = 1 + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;

    Day.dayObjects[Day.dayText] = new Day();

    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);

    dayBox.innerText = 1;
    //Event Day
    let weatherOfTheDay = weatherArray.find((e) => e.date == Day.dayText);
    let holidayText = Day.dayText.slice(0, -4);
    //Holiday
    let holidayOfTheDay = holidaysArray.find((e) => e.date == holidayText);

    Day.dayCalendarMonth--;

    if (holidayOfTheDay) {
        const holidayDiv = document.createElement("div");
        holidayDiv.classList.add("event");
        holidayDiv.classList.add("holiday");
        holidayDiv.innerText = holidayOfTheDay.holiday;
        dayBox.appendChild(holidayDiv);
    }
    if (weatherOfTheDay) {
        const weatherDiv = document.createElement("div");
        weatherDiv.classList.add("weather");
        weatherDiv.innerText = weatherOfTheDay.title;
        dayBox.appendChild(weatherDiv);
    }

    dayBox.addEventListener("click", () => {
        showModal(Day.dayText);
    });

    calendar.append(dayBox);

}

function updateArrivalDays() {
    const arriveCairn = document.querySelector("#arrive-cairn");
    let arriveCairnDay = currentDay + 5;
    // 27 hex, 5 days Beregost to Cairn at a fast pace through the Line
    arriveCairn.innerHTML = arriveCairnDay + "days at a fast pace";

    const arriveBaldurs = document.querySelector("#arrive-baldurs");
    let arriveBaldursDay = currentDay + 4 + 5;
    arriveBaldurs.innerHTML = arriveBaldursDay + "days at a fast pace";
    // 22 hex, 4 days at a fast pace based on Beregost to Cairn to Baldur's through a Line



}

function buttons() {
    const btnBack = document.querySelector("#btnBack");
    const btnNext = document.querySelector("#btnNext");
    const btnDelete = document.querySelector("#btnDelete");
    const btnSave = document.querySelector("#btnSave");
    const closeButtons = document.querySelectorAll(".btnClose");
    const txtTitle = document.querySelector("#txtTitle");
    const btnEffects = document.querySelector("#btn-effects");

    btnBack.addEventListener("click", () => {
        navigation--;
        previousMonthFunction();
        previousMonth();
        updateCalendar();
    });
    btnNext.addEventListener("click", () => {
        navigation++;
        nextMonthFunction();
        nextMonth();
        updateCalendar();
    });
    modal.addEventListener("click", closeModal);
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });
    btnDelete.addEventListener("click", function () {
        weatherArray = weatherArray.filter((e) => e.day !== clicked);
        localStorage.setItem("events", JSON.stringify(events));
        closeModal();
    });

    btnSave.addEventListener("click", function () {
        if (txtTitle.value) {
            txtTitle.classList.remove("error");
            events.push({
                day: clicked,
                title: txtTitle.value.trim(),
            });
            txtTitle.value = "";
            localStorage.setItem("events", JSON.stringify(events));
            closeModal();
        } else {
            txtTitle.classList.add("error");
        }
    });

    btnEffects.addEventListener("click", function () {
        let effectsText = "";
        for (const [weather, description] of Object.entries(weatherEffectsArray)) {
            effectsText += description + '<br>' + '<br>';
        }

        if (effectsToggle == 0) {

            document.getElementById("effects-div").innerHTML = effectsText;
            effectsToggle = 1;
        } else {
            document.getElementById("effects-div").innerHTML = " ";
            effectsToggle = 0;
        }
    });
}

const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");

function showModal(writing) {
    clicked = writing;
    const weatherOfTheDay = events.find((e) => e.date == clicked);
    if (weatherOfTheDay) {
        //Event already Preset
        document.querySelector("#eventText").innerText = weatherOfTheDay.title;
        viewEventForm.style.display = "block";
    } else {
        //Add new Event
        addEventForm.style.display = "block";
    }
    modal.style.display = "block";
}

//Close Modal
function closeModal() {
    viewEventForm.style.display = "none";
    addEventForm.style.display = "none";
    modal.style.display = "none";
    clicked = null;
    updateCalendar();
}