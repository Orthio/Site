
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
        case 8: return ['8 - Raspberry', "a"];
        case 9: return ['9 - Olive', "an"];
        case 10: return ['10 - Prune', "a"];
        case 11: return ['11 - Lime', "a"];
        case 12: return ['12 - Pear', "a"];
        case 13: return ['13 - Peach', "a"];
        case 14: return ['14 - Lemon', "a"];
        case 15: return ['15 - Navel Orange', "a"];
        case 16: return ['16 - Avocado', "an"];
        case 17: return ['17 - Onion', "an"];
        case 18: return ['18 - Sweet Potato', "a"];
        case 19: return ['19 - Mango', "a"];
        case 20: return ['20 - Banana', "a"];
        case 21: return ['21 - Pomegranate', "a"];
        case 22: return ['22 - Papaya', "a"];
        case 23: return ['23 - Grapefruit', "a"];
        case 24: return ['24 - Sweetcorn', "a"];
        case 25: return ['25 - Cauliflower', "a"];
        case 26: return ['26 - Lettuce', "a"];
        case 27: return ['27 - Swede', "a"];
        case 28: return ['28 - Aubergine', "an"];
        case 29: return ['29 - Butternut Squash', "a"];
        case 30: return ['30 - Cabbage', "a"];
        case 31: return ['31 - Coconut', "a"];
        case 32: return ['32 - Jicama', "a"];
        case 33: return ['33 - Pineapple', "a"];
        case 34: return ['34 - Cantaloupe', "a"];
        case 35: return ['35 - Kale', "a"];
        case 36: return ['36 - Romaine Lettuce', "a"];
        case 37: return ['37 - Swiss Chard', "a"];
        case 38: return ['38 - Canary Melon', "a"];
        case 39: return ['39 - Watermelon', "a"];
        case 40: return ['40 - Pumpkin', "a"];
        default: return ['Unknown Week', ""];
    }
    
}

function findFruitName(fruit) {
    return fruit[0].split(' - ')[1] || 'Unknown Fruit';
}

let img = document.getElementById("fruit-pic");
let fruitImage = getImage(weeksSinceConception);
let fruitFile = "../images/Baby_Fruits/" + fruitImage[0] + ".jpg";
// console.log(fruitImage);
if (fruitFile) {
    let fruitName = findFruitName(fruitImage);
    let fruitNameText = "Our baby is the size of: " + "<br>" + fruitImage[1] + " " + fruitName ;
    document.getElementById("fruit-size-desc").innerHTML = fruitNameText;

    img.src = fruitFile;
}
