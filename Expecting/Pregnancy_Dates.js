
const todaysDate = new Date();
// console.log(todaysDate);

// Function to add ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th'; // Covers 4-20 (th)
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Function to format date as "17th March 2025"
function formatDate(year, month, day) {
    const date = new Date(year, month - 1, day); // Month is zero-based
    const dayWithSuffix = day + getOrdinalSuffix(day);

    // Format the month name
    const monthName = date.toLocaleString('en-GB', { month: 'long' });

    return `${dayWithSuffix} ${monthName} ${year}`;
}

const currentYear = todaysDate.getFullYear();
const currentMonth = todaysDate.getMonth() + 1; // getMonth() is zero-based
const currentDay = todaysDate.getDate();

// console.log(`${currentYear}-${currentMonth}-${currentDay}`); // Example output: "2025-03-17"

const formattedTodaysDate = formatDate(currentYear, currentMonth, currentDay);


const conceptionYear = 2025;
const conceptionMonth = 1;
const conceptionDay = 12;

const conceptionDate = new Date(conceptionYear, conceptionMonth - 1, conceptionDay);

const differenceInMilliseconds = todaysDate - conceptionDate;

const weeksSinceConception = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7));

// console.log(`Weeks since conception: ${weeksSinceConception}`);

document.getElementById("todays-date").innerText = formattedTodaysDate;

document.getElementById("weeks-since-conception").innerText = weeksSinceConception;

function getImage(weeksSince) {
    if (weeksSince < 8 || weeksSince > 40) {
        console.log("Error: weeks out of range");
        document.getElementById("fruit-pic").alt = "Error: weeks out of range";
    }
    switch (weeksSince) {
        case 8: return '8 - Raspberry';
        case 9: return '9 - Olive';
        case 10: return '10 - Prune';
        case 11: return '11 - Lime';
        case 12: return '12 - Pear';
        case 13: return '13 - Peach';
        case 14: return '14 - Lemon';
        case 15: return '15 - Navel Orange';
        case 16: return '16 - Avocado';
        case 17: return '17 - Onion';
        case 18: return '18 - Sweet Potato';
        case 19: return '19 - Mango';
        case 20: return '20 - Banana';
        case 21: return '21 - Pomegranate';
        case 22: return '22 - Papaya';
        case 23: return '23 - Grapefruit';
        case 24: return '24 - Sweetcorn';
        case 25: return '25 - Cauliflower';
        case 26: return '26 - Lettuce';
        case 27: return '27 - Swede';
        case 28: return '28 - Aubergine';
        case 29: return '29 - Butternut Squash';
        case 30: return '30 - Cabbage';
        case 31: return '31 - Coconut';
        case 32: return '32 - Jicama';
        case 33: return '33 - Pineapple';
        case 34: return '34 - Cantaloupe';
        case 35: return '35 - Kale';
        case 36: return '36 - Romaine Lettuce';
        case 37: return '37 - Swiss Chard';
        case 38: return '38 - Canary Melon';
        case 39: return '39 - Watermelon';
        case 40: return '40 - Pumpkin';
        default: return 'Unknown Week';
    }
}

function extractFruit(weeksSince) {
    const fruitEntry = getFruitName(weeksSince);
    return fruitEntry.split(' - ')[1] || 'Unknown Fruit';
}

let img = document.getElementById("fruit-pic");
let fruitImage = "../images/Baby_Fruits/" + getImage(weeksSinceConception) + ".jpg";
// console.log(fruitImage);
if (fruitImage) {
    img.src = fruitImage;
}
