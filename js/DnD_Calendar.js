
// console.log('DnD_Calendar.js loaded');

// import {dayCurrentDay, dayCurrentMonth, dayCurrentYear, monthsArray}  from './DnD_General.js';

fetch('json/holidays.json')
    .then(response => response.json())
    .then(holidays => {
        console.log(holidays);  // Now holidays contains the array from the JSON file
        // You can now use the holidays array in your code
    })
    .catch(error => console.error('Error loading JSON:', error));

var monthsArray = [
    { number: 1, month: "Hammer", days: 30, desc: "('Deepwinter') the first month" },
    { number: 2, month: "Alturiak", days: 30, desc: " ('The Claws of the Cold') the second month" },
    { number: 3, month: "Ches", days: 30, desc: " ('The Claw of Sunsets') the third month" },
    { number: 4, month: "Tarsakh", days: 30, desc: " ('The Claw of Storms') the fourth month" },
    { number: 5, month: "Mirtul", days: 30, desc: " ('The Melting') the fifth month" },
    { number: 6, month: "Kythorn", days: 30, desc: " ('The Time of Flowers') the sixth month" },
    { number: 7, month: "Flamerule", days: 30, desc: " ('Summertide') the seventh month" },
    { number: 8, month: "Elasis", days: 30, desc: " ('Highsun') the eighth month" },
    { number: 9, month: "Eleint", days: 30, desc: " ('The Fading') the ninth month" },
    { number: 10, month: "Marpenoth", days: 30, desc: " ('Leaffall') the tenth month" },
    { number: 11, month: "Uktar", days: 30, desc: " ('The Rotting') the eleventh month" },
    { number: 12, month: "Nightal", days: 30, desc: " ('The Drawing Down') the twelfth month" }
];

const festivalDays = [
    { name: "Midwinter", day: 30, month: "Hammer" },
    { name: "Greengrass", day: 30, month: "Tarsakh" },
    { name: "Midsummer", day: 30, month: "Flamerule" },
    { name: "Highharvestide", day: 30, month: "Eleint" },
    { name: "The Feast of the Moon", day: 30, month: "Uktar" }
];
/* const holidays = [
    {
        hday: "01-01-2023",
        holiday: "New Year Day",
    },
    {
        hday: "15-01-2023",
        holiday: "Pongal",
    }

];
 */
class Day{
    static dayCurrentDay = 5; // Current day of the game
    static dayCurrentMonth = 10;
    static dayCurrentMonthName = monthsArray[Day.dayCurrentMonth - 1].month;
    static dayCurrentYear = 1489;
    static dayCurrentDateText = `${Day.dayCurrentDay}-${Day.dayCurrentMonth}-${Day.dayCurrentYear}`;

    static dayCalendarDay = 0; // Day to cycle through while creating day boxes
    static dayCalendarMonth = Day.dayCurrentMonth;
    static dayCalendarMonthName = Day.dayCurrentMonthName;
    static dayCalendarYear = Day.dayCurrentYear;
    static dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    static dayObjects = {};

    constructor(){
        this.day = Day.dayCalendarDay;
            // for the day number in the month (1st 2nd)
        this.dayText = this.day <10 ? "0" + this.day : this.day;
            // if current day is less than 10, add 0, otherwise leave it
        this.month = Day.dayCalendarMonth;
        this.monthText = this.month < 10 ? "0" + this.month : this.month ;
        this.monthName = monthsArray[this.month - 1].month;
        this.year = Day.dayCalendarYear;
        this.yearText = this.year;
        this.dayText = this.dayText + this.monthText + this.yearText;
        this.monthIndex++;
            // for the number of day in the month
        this.yearIndex++;
            // for the number of day in the year
    }
}

function nextDay(i){
    Day.dayCalendarDay = i;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
  
        Day.dayObjects[Day.dayText] = new Day();
    
    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);
}

function nextMonth(){
    Day.dayCalendarMonth++;
    if (Day.dayCalendarMonth === 13){
        Day.dayCalendarMonth = 1;
        nextYear();
    }
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth-1].month;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Date();
    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);
}

function previousMonth(){
    Day.dayCalendarMonth--;
    if (Day.dayCalendarMonth === 0){
        Day.dayCalendarMonth = 12;
        previousYear();
    }
    Day.dayCalendarMonthName = monthsArray[Day.dayCalendarMonth-1].month;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
    // console.log("Day ",Day.dayCalendarDay,"Month ",Day.dayCalendarMonth,"Year ",Day.dayCalendarYear);
}

function nextYear(){
    Day.dayCalendarYear++;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
}

function previousYear(){
    Day.dayCalendarYear--;
    Day.dayText = Day.dayCalendarDay + "-" + Day.dayCalendarMonth + "-" + Day.dayCalendarYear;
    Day.dayObjects[Day.dayText] = new Day();
}

const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
let navigation = 0;
let clicked = null;
let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : [];
const weekdays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

function loadCalendar() {

    monthBanner.innerText = `${Day.dayCalendarMonthName} ${Day.dayCalendarYear}DR`;
    calendar.innerHTML = "";
 
    // console.log("Day: ", Day.dayCurrentDay, "Month ", Day.dayCurrentMonth, " ", Day.dayCurrentMonthName, "Year ", Day.dayCurrentYear);
    // console.log("dayCurrentDateText ",Day.dayCurrentDateText);

    for (let i = 1; i <= 30; i++) {
        const dayBox = document.createElement("div");
        dayBox.classList.add("day");

        nextDay(i);

        dayBox.innerText = i;
/*         //Event Day
        const eventOfTheDay = events.find((e) => e.day == dayText);
        //Holiday
        const holidayOfTheDay = holidays.find((e) => e.hday == dayText); */

        if (i === Day.dayCurrentDay && navigation == 0) {
            dayBox.id = "currentDay";
        }

/*         if (eventOfTheDay) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.innerText = eventOfTheDay.title;
            dayBox.appendChild(eventDiv);
        }
        if (holidayOfTheDay) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.classList.add("holiday");
            eventDiv.innerText = holidayOfTheDay.holiday;
            dayBox.appendChild(eventDiv);
        } */

        dayBox.addEventListener("click", () => {
            showModal(dayText);
        });
        
        calendar.append(dayBox);
    }
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
        previousMonth();
        loadCalendar();
    });
    btnNext.addEventListener("click", () => {
        navigation++;
        nextMonth();
        loadCalendar();
    });
    modal.addEventListener("click", closeModal);
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });
    btnDelete.addEventListener("click", function () {
        events = events.filter((e) => e.day !== clicked);
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

function showModal(dayText) {
    clicked = dayText;
    const eventOfTheDay = events.find((e) => e.day == dayText);
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
    loadCalendar();
}

buttons();
loadCalendar();

/*
1. Add Event     
3. Upday Local Storage
*/