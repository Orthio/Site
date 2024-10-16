

import { currentTime, currentDay, currentMonth, currentYear, monthsArray, getDateName, getMonthDays } from './DnD_General.js';
// console.log("currentday: ",currentDay," currentmonth: ", currentMonth, " currentyear: ",currentYear);

let dateName = getDateName(currentDay, currentMonth);
let dateText = "Currently " + dateName + " " + currentYear + "DR, About " + currentTime;

const currentDateBanner = document.querySelector("#current-date");
currentDateBanner.innerText = dateText;

let holidaysArray = [];
let eventsArray = [];

Promise.all([
    fetch('../json/DnD_Calendar_Holidays.json').then(response => response.json()),
    fetch('../json/DnD_Calendar_Events.json').then(response => response.json())
])
    .then(([holidaysData, eventsData]) => {
        holidaysArray = holidaysData;
        eventsArray = eventsData;
        // console.log("Holidays Array ", holidaysArray);  // Holidays array from JSON file
        // console.log("Events Array ", eventsArray);      // Events array from JSON file

        // Now you can use both holidaysArray and eventsArray
        buttons();
        updateCalendar();
    })
    .catch(error => console.error('Error loading JSON data:', error));

class Day {
    static dayCurrentDay = currentDay; // Current day of the game
    static dayCurrentMonth = currentMonth;
    static dayCurrentMonthName = monthsArray[Day.dayCurrentMonth - 1].month;
    static dayCurrentYear = currentYear;
    static dayCurrentDateText = `${Day.dayCurrentDay}-${Day.dayCurrentMonth}-${Day.dayCurrentYear}`;

    static dayCalendarDay = 0; // Day to cycle through while creating day boxes
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
        this.month = Day.dayCalendarMonth;
        this.monthText = this.month < 10 ? "0" + this.month : this.month;
        this.monthName = monthsArray[this.month - 1].month;
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

    if (Day.dayCalendarDay > dayCalendarMonthDays) {
        nextMonth();
    }

    Day.dayCalendarDay++;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;

    Day.dayObjects[Day.dayText] = new Day();

    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);

}

function nextMonth() {

    Day.dayCalendarMonth++;
    if (Day.dayCalendarMonth === 18) {
        Day.dayCalendarMonth = 1;
        nextYear();
    }
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth - 1].month;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Date();
    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);
}

function nextMonthFunction() {
    // Skip a month if about to go onto a holiday month
    let holidayMonths = [1, 5, 9, 12, 16, 14]; //Take away 14 later
    if (holidayMonths.includes(Day.dayCalendarMonth)) {
        Day.dayCalendarMonth++;
    }
}

function previousMonth() {

    Day.dayCalendarMonth--;
    if (Day.dayCalendarMonth === 0) {
        Day.dayCalendarMonth = 18;
        previousYear();
    }
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth - 1].month;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);
}

function previousMonthFunction() {
    // Skip a month if about to go onto a holiday month
    let holidayMonths = [3, 7, 11, 14, 18, 16]; //Take away 16 later
    if (holidayMonths.includes(Day.dayCalendarMonth)) {
        Day.dayCalendarMonth--;
    }
}

function nextYear() {
    Day.dayCalendarYear++;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
}

function previousYear() {
    Day.dayCalendarYear--;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
}

const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
let navigation = 0;
let clicked = null;
// let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : [];


function updateCalendar() {

    monthBanner.innerText = `${Day.dayCalendarMonthName} ${Day.dayCalendarYear}DR`;
    calendar.innerHTML = "";

    let holidayMonths = [1, 5, 9, 12, 16, 14]; //Take away 14 later
    let holidayCheck = 1;

    for (let i = 1; i <= Day.dayCalendarMonthDays; i++) {
        const dayBox = document.createElement("div");
        dayBox.classList.add("day");

        nextDay();

        dayBox.innerText = i;
        //Event Day
        const eventOfTheDay = eventsArray.find((e) => e.date == Day.dayText);
        //Holiday
        const holidayOfTheDay = holidaysArray.find((e) => e.date == Day.dayText);

        if (i === Day.dayCurrentDay && navigation == 0) {
            dayBox.id = "currentDay";
        }

        if (eventOfTheDay) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.innerText = eventOfTheDay.title;
            dayBox.appendChild(eventDiv);
        }
        if (holidayOfTheDay) {
            const holidayDiv = document.createElement("div");
            holidayDiv.classList.add("event");
            holidayDiv.classList.add("holiday");
            holidayDiv.innerText = holidayOfTheDay.holiday;
            dayBox.appendChild(holidayDiv);
        }

        if (holidayCheck === 1) {
            addHolidayDay();
        }

        dayBox.addEventListener("click", () => {
            showModal(Day.dayText);
        });

        calendar.append(dayBox);
    }
}

function addHolidayDay() {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    Day.dayCalendarDay = 31;
    Day.dayCalendarMonth = Day.dayCalendarMonth + 0.9;

    // Add to Select calendar month for hol based on current using festivalDays
    Day.dayText = 1 + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;

    Day.dayObjects[Day.dayText] = new Day();

    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);

    dayBox.innerText = 1;
    //Event Day
    let eventOfTheDay = eventsArray.find((e) => e.day == Day.dayText);
    //Holiday
    let holidayOfTheDay = holidaysArray.find((e) => e.hday == Day.dayText);

    Day.dayCalendarMonth = Day.dayCalendarMonth + 0.1;

}

function buttons() {
    const btnBack = document.querySelector("#btnBack");
    const btnNext = document.querySelector("#btnNext");
    const btnDelete = document.querySelector("#btnDelete");
    const btnSave = document.querySelector("#btnSave");
    const closeButtons = document.querySelectorAll(".btnClose");
    const txtTitle = document.querySelector("#txtTitle");

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
        eventsArray = eventsArray.filter((e) => e.day !== clicked);
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
}

const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");

function showModal(writing) {
    clicked = writing;
    const eventOfTheDay = events.find((e) => e.day == clicked);
    if (eventOfTheDay) {
        //Event already Preset
        document.querySelector("#eventText").innerText = eventOfTheDay.title;
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



/*
1. Add Event     
3. Upday Local Storage
*/