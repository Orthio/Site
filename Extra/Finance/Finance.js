

class EventListeners {
    constructor() {
    }
    // Generic method to add event listeners
    addListenerToElement(elementId, eventType, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, callback);
        } else {
            console.error(`Element with ID ${elementId} not found.`);
        }
    }

    // Method specifically for adding input event listeners
    addInputListener(elementId, callback) {
        this.addListenerToElement(elementId, 'change', callback);
    }
}

const eventListeners = new EventListeners();

var netIncomeMonthly;
var netIncomeWeekly;
var grossIncomeMonthly;
var grossIncomeWeekly;
var numberChildren;
var hanLiving;
var numberNights;
var numberNightsYear;
var numberShifts;
var rentMonthly;

var CMSRate;
var totalOutgoingMonthly;
var totalOutgoingWeekly;

function updateSheet() {
    numberShifts = document.getElementById("shift-input").value;
    // console.log("number of shifts ", numberShifts);
    numberChildren = document.getElementById("children-number-input").value;
    // console.log("number of children: ", numberChildren);
    numberNights = document.getElementById("nights-input").value;
    numberNightsYear = numberNights * 52;
    // console.log("number of nights in year ", numberNightsYear);

    calcIncome();
    checkHanLiving();
    calcChildMaintenance();
}

function calcIncome() {
    const incomeNetArray = [0, 900, 1800, 2800]; //net income per month
    const incomeGrossArray = [0, 1170, 2300, 3600]; //gross income per month

    netIncomeMonthly = incomeNetArray[numberShifts];
    netIncomeWeekly = netIncomeMonthly / 4;
    grossIncomeMonthly = incomeGrossArray[numberShifts];
    grossIncomeWeekly = grossIncomeMonthly / 4;
}

function checkHanLiving() {
    const isHanLivingChecked = document.getElementById('han-living-box').checked;

    if (isHanLivingChecked) {
        hanLiving = "Yes";
        rentMonthly = 0;
        document.getElementById('nights-input').disabled = true;
        document.getElementById('nights-label').style.color = 'grey';


    } else {
        hanLiving = "No";
        rentMonthly = 650;
        document.getElementById('nights-input').disabled = false;
        document.getElementById('nights-label').style.color = 'black';


    }

    document.getElementById("rent-cost").innerText = rentMonthly;

}

function calcChildMaintenance() {
    const basicRateArray = [0, 0.12, 0.16, 0.19]; // Percent of gross weekly income
    const basicRatePlusArray = [0, 0.09, 0.12, 0.15]; // Percent applied to income over £800

    if (grossIncomeWeekly > 800) {
        let extraIncome = 800 - grossIncomeWeekly;

        CMSRate = grossIncomeWeekly * basicRateArray[numberChildren] +
            extraIncome * basicRatePlusArray[numberChildren];
    } else {
        CMSRate = grossIncomeWeekly * basicRateArray[numberChildren]
    }

    const nightsArray = {
        0: {low: 0, high: 51, reduction: 1 },
        1: {low: 52, high: 103, reduction: 0.86 },
        2: {low: 104, high: 155, reduction: 0.72 },
        3: {low: 156, high: 174, reduction: 0.58 },
        4: {low: 175, high: 365, reduction: 0.5 }
    }; 

    console.log("reduction is ",nightsArray[numberNights].reduction, " for ",numberNights," nights");
    totalOutgoingWeekly = CMSRate * nightsArray[numberNights].reduction;
    totalOutgoingMonthly = totalOutgoingWeekly * 4;

    document.getElementById("weekly-cost").innerText = Math.round(totalOutgoingWeekly);
    document.getElementById("monthly-cost").innerText = Math.round(totalOutgoingMonthly);


}

eventListeners.addInputListener('shift-input', updateSheet);

eventListeners.addInputListener('han-living-box', updateSheet);

eventListeners.addInputListener('children-number-input', updateSheet);

eventListeners.addInputListener('nights-input', updateSheet);

window.onload = function () {

    updateSheet();
}