
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
var effectsCurrent = [];

let weatherCRoll;
let windCRoll;
var weatherSave = [];
var effectsSave = [];


const winterWeatherTable = {
    1: "A Blizzard ",
    2: "A Snowfall ",
    10: "A Freezing Cold ",
    20: "Heavy Clouds ",
    40: "Light Clouds ",
    60: "Clear Skies ",
    85: "Clear Skies and Warm ",
    95: "A Wizard Fog ",
    96: "The Flaywinds rise ",
    97: "A Meteor Shower crashes ",
    98: "Ghost Lights abound ",
    99: "A Solar Eclipse yawns ",
    100: "An Ashfall descends "
};

var winterTempTable = {
    1: "Very Cold",
    4: "Cold 20",
    8: "Cool 40",
    10: "Mild 50", 
    15: "Warm 75", 
    18: "Hot 90",
    21: ""
};

var winterWindTable = {
    1: "", 
    10: "with a Light Wind ",
    16: "with a Strong",
    21: ""
};

var winterRainTable = {
    1: "", 
    13: "and a Light Rain", 
    17: "and a Heavy Rain",
    21: ""
};

const windDirectionTable = {
    1: " Northerly Wind ",
    2: " Easterly Wind ",
    3: " Southerly Wind ",
    4: " Westerly Wind "
};




// Weather Effect descriptions
var effectsTable = {
    "A Blizzard ": "<b>" + "A Blizzard " + "</b>" + "<br>" +
    "At the end of every hour spend in a Blizzard, make a DC 12 Constitution saving. <br>\
    On failure, you take 3d4 cold damage and gain one level of exhaustion. <br>\
    You make this check with advantage if you have proper gear. <br>\
    All creatures are heavily obscured if they are more than 20 feet from you. <br>\
    All terrain is difficult terrain. <br>\
    Also has the effect of Snow, High Winds, and Freezing Cold.",

    "A Snowfall ": "<b>" + "A Snowfall " + "</b>" + "<br>" +
    "All travel speed is halved. Terrain becomes difficult terrain. <br>\
    Also has the effects of Heavy Clouds and Freezing Cold",

    "A Freezing Cold ": "<b>" + "A Freezing Cold " + "</b>" + "<br>" +
    "A creature exposed to the cold must succeed \
    on a DC 10 Constitution saving throw at the end of each\
    hour or gain one level of exhaustion. <br>\
    Creatures with resistance or immunity to cold damage automatically\
    succeed on the saving throw, <br>\
    as do creatures wearing cold weather gear",

    "Heavy Clouds ": "<b>" + "Heavy Clouds " + "</b>" + "<br>" +
    "The sky is blocked. Aerial creatures have total cover",
    "Light Clouds ": "<b>" + "Light Clouds " + "</b>" + "<br>" +
    "Easy breezy clouds pass by",
    "Clear Skies ": "<b>" + "Clear Skies " + "</b>" + "<br>" +
    "Clear bright light and wispy clouds during the daytime \
    View of the stars and moon at night",
    "Clear Skies and Warm ": "<b>" + "Clear Skies and Warm " + "</b>" + "<br>" +
    "Clear skies and a warm temperature pervade",
    "A Wizard Fog ": "<b>" + "A Wizard Fog " + "</b>" + "<br>" +
    "An adventurer can't see more than 5ft and can't light non-magical flames",

    "The Flaywinds rise ": "<b>" + "The Flaywinds rise " + "</b>" + "<br>" +
    "An intense sandstorm gathering large rocks and debris \
    in addition to sand or grit. <br>\
    The area is heavily obscured, and a creature within it takes 1d4 slashing damage \
    at the start of each of their turns.<br>\
    Only substantial cover offers protection.<br>\
    A succesful DC15 Int(Arcana) or Wis(Nature) check allows a character to\
    recognise a Flaywind 1 minute before it strikes, allowing time to find shelter<br>\
    A flaywind lasts 1d4*10 hours. Tasha's pg163",

    "A Meteor Shower crashes ": "<b>" + "A Meteor Shower crashes " + "</b>" + "<br>" +
    "Stars begin to fall from the sky as lumps of stone and metal.<br>\
    All creatures gain 1 luck point as per the Lucky feat, which lasts until used \
    or the weather changes.<br>\
    If you travel 4 or more hours outdoors through this weather, a meteor strikes nearby, \
    leaving 40d6 of devastation in it's wake, \
    but perhaps you'll find something cool. <br>\
    Potential consequences: 2d12 damage from the shock wave, difficult terrain, or heavily obscuring dust clouds.",

    "Ghost Lights abound ": "<b>" + "Ghost Lights abound " + "</b>" + "<br>" +
    "Strange swirling lights fill the sky, swirls of green, \
    blue, and purple. <br>\
    Night becomes dim (strangely hued) light until the effect ends.",

    "A Solar Eclipse yawns ": "<b>" + "A Solar Eclipse yawns " + "</b>" + "<br>" +
    "For 1 hour during the day, it becomes night. <br>\
    Either select a dramatic time or roll a d12 for the hour. <br>\
    May or may not have prophetic ramifications.",

    "An Ashfall descends ": "<b>" + "An Ashfall descends " + "</b>" + "<br>" +
    "Heavy white clouds of swirling smoke fill the sky, and it \
    rains ash that coats everything in little flecks. <br>\
    A smell of burning wood or sulphur permeates the air. <br>\
    Also has the the effect of Heavy Clouds.",

    "A High Wind ": "<b>" + "A High Wind " + "</b>" + "<br>" +
    "Turbulent gusts sweep across the land. <br>\
    Flying creatures gain +10 movement speed when moving with the wind, \
    and –10 movement speed when moving against it. <br>\
    All ranged weapon attacks have a –2 to attack rolls, <br>\
    and their range is reduced by half when shooting into the wind."

};

const months = 
    "<b>" + "Hammer " + "</b>" + "('Deepwinter') the first month" + "<br>" +
    "<b>" + "Alturiak " + "</b>" + " ('The Claws of the Cold') the second month" + "<br>" +
    "<b>" + "Ches " + "</b>" + " ('The Claw of Sunsets') the third month" + "<br>" +
    "<b>" + "Tarsakh " + "</b>" + " ('The Claw of Storms') the fourth month" + "<br>" +
    "<b>" + "Mirtu l" + "</b>" + " ('The Melting') the fifth month" + "<br>" +
    "<b>" + "Kythorn " + "</b>" + " ('The Time of Flowers') the sixth month" + "<br>" +
    "<b>" + "Flamerule " + "</b>" + " ('Summertide') the seventh month" + "<br>" +
    "<b>" + "Eleasis " + "</b>" + " ('Highsun') the eighth month" + "<br>" +
    "<b>" + "Eleint " + "</b>" + " ('The Fading') the ninth month" + "<br>" +
    "<b>" + "Marpenoth " + "</b>" + " ('Leaffall') the tenth month" + "<br>" +
    "<b>" + "Uktar " + "</b>" + " ('The Rotting') the eleventh month" + "<br>" +
    "<b>" + "Nightal " + "</b>" + " ('The Drawing Down') the twelfth month" + "<br>"
; 

function decideConditions(roll, table) {
    const keys = Object.keys(table).map(Number).sort((a, b) => b - a);
    for (let i = 0; i < keys.length; i++) {
        if (roll >= keys[i]) {
            return table[keys[i]];
        }
    }
    return "Unknown";
}

// Function to get a random roll (including 0)
function diceRoll(roll) {
    return Math.floor(Math.random() * roll) + 1;
}

function isInRange(numbercheck,numberlow,numberhigh) {
    if (numbercheck >= numberlow && numbercheck <= numberhigh) {
    return true;  // The number is within the range
    } else {
        return false; // The number is not within the range
    }
}

function fetchEffects(current,roll,windroll){
    effectsCurrent = effectsTable[current];
    effectsArray.push(effectsCurrent);

    if (roll===1){
        effectsCurrent = effectsTable["A Snowfall "];
        effectsArray.push(effectsCurrent);
        effectsCurrent = effectsTable["A High Wind "];
        effectsArray.push(effectsCurrent);
        effectsCurrent = effectsTable["A Freezing Cold "];
        effectsArray.push(effectsCurrent);
    }

    let validRolls = [2,3,4,5,6,7,8,9];
    if (validRolls.includes(roll)) {
        effectsCurrent = effectsTable["A Snowfall "];
        effectsArray.push(effectsCurrent);
    }

    if (roll===100){
        effectsCurrent = effectsTable["An Ashfall descends "];
        effectsArray.push(effectsCurrent);
    }

    let validRolls2 = [16,17,18,19,20]
    if (validRolls.includes(windroll)) {
        effectsCurrent = effectsTable["A High Wind "];
        effectsArray.push(effectsCurrent);
    }
}

function winterFunction(){
    
    for (var i = 0; i < 4; i++) {

        // var windCRoll = 16;

        // 25% chance for weather to use "As Yesterday"
        if (i > 0 && Math.random() < 0.25) { 
            weatherArray.push(weatherArray[i-1]);
            windCRoll = diceRoll(20);
        } else {
            weatherCRoll = diceRoll(100);
            //weatherCRoll = 1;
            windCRoll = diceRoll(20);
            

            weatherCurrent = decideConditions(weatherCRoll, winterWeatherTable);
            weatherArray.push(weatherCurrent);

            fetchEffects(weatherCurrent,weatherCRoll, windCRoll);
            
        }

        // Add wind conditions if regular weather is present
        if (isInRange(weatherCRoll,20,94)===true){
            windCurrent = decideConditions(windCRoll, winterWindTable);
            
            // Add wind direction if the wind is strong
            if (isInRange(windCRoll,16,20)===true){
                windDirectionCurrent = decideConditions(diceRoll(4), windDirectionTable);
                } else {
                windDirectionCurrent = "";
            }
        } else {
            windCurrent = "";
        }

        // Add rain conditions if cloudy
        if (isInRange(weatherCRoll,20,59)===true){
            rainCurrent = decideConditions(diceRoll(20), winterRainTable );
        } else {
            rainCurrent = "";
        }

        windArray.push(windCurrent); //push adds to end of the array
        rainArray.push(rainCurrent);  
        windDirArray.push(windDirectionCurrent);

    }

    displayResults();

    weatherSave = weatherArray;
    let uniqueEffectsArray = [...new Set(effectsArray)];
    effectsSave = uniqueEffectsArray;

    weatherArray = [];
    windArray = [];
    rainArray = [];
    windDirArray = [];
    effectsArray = [];

}



function displayResults() {

    // Update the HTML to display the history
    var weatherHistory = '';
    for (var i = 0; i < 4; i++) {
        weatherHistory += "<div>" +
        "<b>" + "Day " + (i + 1) + "</b>"
        + "<br>" +
        weatherArray[i] + windArray[i] + windDirArray[i] + rainArray[i] + "<br>" + "</div>" + "<br>";

    }

    document.getElementById("results").innerHTML = weatherHistory +
   "___________________________________ ";
    
}

function effectsFunction() {
    var effectshistory = '';
    var j = effectsSave.length;
    for (var i = 0; i < j; i++) {
        effectshistory += "<div>" + effectsSave[i] + "<br>" +
            "<div>" + "<br>" + "</div>";

        }
        
    document.getElementById("effectsresults").innerHTML = "<br>" + effectshistory +
    "___________________________________ ";

    // Add effects for each individual weather, and show only when the check effects
    // button is pressed. Might need a separate var to store it in so it doesn't wipe 
    // in display results
}

function monthFunction() {

    document.getElementById("checkmonth").innerHTML = "<br>" + months;


}
