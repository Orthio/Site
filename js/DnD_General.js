
//Global Variables

export var partyLevel = 7;

export var currentTime = "7pm";
export var currentDay = 6;
export var currentMonth = 14;
export var currentYear = 1489;

export var generalPartyDPS1r = 30.8;

export var monthsArray = [
    { number: 1, month: "Hammer", days: 30, desc: "('Deepwinter') the first month", holiday: "Midwinter" },
    { number: 2, month: "Midwinter", days: 1, desc: "" },
    { number: 3, month: "Alturiak", days: 30, desc: " ('The Claws of the Cold') the second month" },
    { number: 4, month: "Ches", days: 30, desc: " ('The Claw of Sunsets') the third month" },
    { number: 5, month: "Tarsakh", days: 30, desc: " ('The Claw of Storms') the fourth month", holiday: "Greengrass" },
    { number: 6, month: "Greengrass", days: 1, desc: "" },
    { number: 7, month: "Mirtul", days: 30, desc: " ('The Melting') the fifth month" },
    { number: 8, month: "Kythorn", days: 30, desc: " ('The Time of Flowers') the sixth month" },
    { number: 9, month: "Flamerule", days: 30, desc: " ('Summertide') the seventh month", holiday: "Midsummer" },
    { number: 10, month: "Midsummer", days: 1, desc: "" },
    { number: 11, month: "Elasis", days: 30, desc: " ('Highsun') the eighth month" },
    { number: 12, month: "Eleint", days: 30, desc: " ('The Fading') the ninth month", holiday: "Highharvestide" },
    { number: 13, month: "Highharvesttide", days: 1, desc: "" },
    { number: 14, month: "Marpenoth", days: 30, desc: " ('Leaffall') the tenth month", holiday: "Marp-Fest" },
    { number: 15, month: "Uktar", days: 30, desc: " ('The Rotting') the eleventh month", holiday: "The Feast of the Moon" },
    { number: 16, month: "The Feast of the Moon", days: 1, desc: "" },
    { number: 17, month: "Nightal", days: 30, desc: " ('The Drawing Down') the twelfth month" }
];

export function getMonthName(month) {
    return monthsArray[(month - 1)].month;
}

export function getMonthDays(month) {
    return monthsArray[(month - 1)].days;
}

export function getDateName(day, month) {
    let suffix = "";
    switch (day) {
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
    let currentDateName = day + suffix + monthsArray[(month - 1)].month;
    return currentDateName;

    //The year consists of 365 days: 12 months of exactly 30 days each (due to the single moon and its followers), \
    //plus 5 days that fall between months. These days are special occasions. Later on it says: Months are subdivided 
    //into three ten-day periods. These are known variously as "eves", "tendays", "domen", "hyrar", or "rides" throughout the Forgotten Realms.
};

export function generalDiceRoll(dice, qty, adv) {
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
    switch (adv) {
        case "Dis":
            return Math.min.apply(null, rollResult);
            break;
        case "Adv":
            return Math.max.apply(null, rollResult);
            break;
        case "Fortune":
            var countSixes = rollResult.filter(num => num === 6).length;
            if (countSixes >= 2) {
                return 7;
            }
            else {
                return Math.max.apply(null, rollResult);
            }
            break;
        case "0d":
            return Math.min.apply(null, rollResult);
            break;
        default:
            return rollResult[0];
    }
};
