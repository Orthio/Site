
// console.log('DnD_General.js loaded');

/* export function generalDiceRoll(){};
export {generalPartyDPS1r };
 */
//Global Variables
var generalPartyDPS1r = 30.8;

var currentDay = 5;
var currentMonth = 10;
var currentYear = 1489;

var monthsArray = [
    {number: 1, month: "Hammer", desc:  "('Deepwinter') the first month"},
    {number: 2, month: "Alturiak", desc: " ('The Claws of the Cold') the second month"},
    {number: 3, month: "Ches", desc: " ('The Claw of Sunsets') the third month"},
    {number: 4, month: "Tarsakh", desc: " ('The Claw of Storms') the fourth month"},
    {number: 5, month: "Mirtul", desc:  " ('The Melting') the fifth month"},
    {number: 6, month: "Kythorn", desc: " ('The Time of Flowers') the sixth month"},
    {number: 7, month: "Flamerule", desc: " ('Summertide') the seventh month"},
    {number: 8, month: "Elasis", desc: " ('Highsun') the eighth month"},
    {number: 9, month: "Eleint", desc: " ('The Fading') the ninth month"},
    {number: 10, month: "Marpenoth", desc: " ('Leaffall') the tenth month"},
    {number: 11, month: "Uktar", desc: " ('The Rotting') the eleventh month"},
    {number: 12, month: "Nightal", desc: " ('The Drawing Down') the twelfth month"}
];

function getCurrentDate(){
    let suffix = "";
    switch(currentDay){
        case 1: 
            suffix = "st ";
            break;
        case 2:
            suffix = "nd ";
            break;
        case 3:
            suffix = "rd ";
            break;
        default:
            suffix = "th ";
            break;
    }
    let currentDateName = currentDay + suffix + monthsArray[(currentMonth-1)].month;
    document.getElementById("current-date-name").innerHTML = currentDateName;

    //The year consists of 365 days: 12 months of exactly 30 days each (due to the single moon and its followers), \
    //plus 5 days that fall between months. These days are special occasions. Later on it says: Months are subdivided 
    //into three ten-day periods. These are known variously as "eves", "tendays", "domen", "hyrar", or "rides" throughout the Forgotten Realms.
};

function generalDiceRoll(dice,qty,adv) {
    // Roll a dice (d6 d20) a no of times, with advantage or disadvantage
    var rollResult = [];
    if (qty === undefined) {
        qty = 1;
    }
    if (adv === "Adv" || adv === "Dis" || adv === "0d") {
        qty = 2;
    }
    
    for (var i = 0; i < qty; i++) {
        rollResult.push(Math.floor(Math.random() * dice) + 1);
    }
    switch (adv){
        case "Dis":
            return Math.min.apply(null,rollResult);
            break;
        case "Adv":
            return Math.max.apply(null,rollResult);
            break;
        case "Fortune":
            var countSixes = rollResult.filter(num => num === 6).length;
            if (countSixes >= 2) {
                return 7;
            } 
            else {
            return Math.max.apply(null,rollResult);
            }
            break;
        case "0d":
            return Math.min.apply(null,rollResult);
            break;
        default:
            return rollResult[0];
    }
};
