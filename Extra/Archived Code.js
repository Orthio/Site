
// Windows/Linux: Shift + Alt + F Shortcut for formatting

// Get-ChildItem *.jpg | Rename-Item -NewName {$_.Name -replace ".jpg", ".png"}

let factionsData = {};

// Async function to fetch data and wait for it to load
async function loadData() {
    try {
        const response = await fetch('json/DnD_Factions.json');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        factionsData = await response.json();  // Wait for JSON to be parsed
        console.log("Data loaded:", factionsData);

        // Now call the function that depends on the loaded data
        circleCheck(3, 1, 'Green');
    } catch (error) {
        console.error('Error loading factions data:', error);
    }
}

   <div class="weekdays">
      <div>01</div>
      <div>02</div>
      <div>03</div>
      <div>04</div>
      <div>05</div>
      <div>06</div>
      <div>07</div>
      <div>08</div>
      <div>09</div>
      <div>10</div>

    </div> 

function factorial(n) {
    let result = 1;
    for (let i = n; i > 0; i--) {
        result *= i;
    }
    return result;
}

/* Button code */
<div class="button-arrow-container">
                        <button type="button" id="button-up">⬆</button>
                        <button type="button" id="button-down">⬇</button>
                    </div>
.button-arrow-container {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
}

const newButtonUp = document.querySelector("#button-up");

newButtonUp.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    inputField.value = parseInt(inputField.value) + 1;  // Increment and update value
});

const newButtonDown = document.querySelector("#button-down");

newButtonDown.addEventListener("click", () => {
    let inputField = document.getElementById("CRInput");
    let inputValue = parseInt(inputField.value);  // Get the current value as a number
    if (inputValue > 1) {
        inputField.value = inputValue - 1;  // Decrement value if greater than 1
    }
});

/* Weather Table */

const winterWeatherTable = {
  1: "A Blizzard ",
  2: "A Snowfall ",
  10: "A Freezing Cold ",
  20: "Fog",
  25: "Heavy Clouds ",
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
const effectsTable = {
      "A Blizzard": "<b>" + "A Blizzard " + "</b>" + "<br>" +
          "At the end of every hour spent in a Blizzard, make a DC 12 Constitution saving throw. <br>" +
          "&nbsp&nbsp On failure, you take 3d4 cold damage and gain one level of exhaustion. <br>" +
          "&nbsp&nbsp Make this check with advantage with appropriate gear. <br>" +
          "All creatures are heavily obscured if they are more than 20 feet from you. <br>" +
          "All terrain is difficult terrain. All travel speed is halved. <br><br>" +
          "All travel speed is halved. Terrain becomes difficult terrain.<br>" +
          "The sky is blocked. Aerial creatures have total cover.<br>" +
          "Flying creatures gain +10 movement speed when moving with the wind, and –10 movement speed when moving against it. <br>" +
          "All ranged weapon attacks have their range reduced by half when shooting into the wind.",
  
      "Fog": "<b>" + "Fog " + "</b>" + "<br>" +
          "Unable to see more than 40ft.",
  
      "A Snowfall": "<b>" + "A Snowfall " + "</b>" + "<br>" +
          "All terrain is difficult terrain. All travel speed is halved. <br><br>" +
          "<i>Also has the effects of Heavy Clouds and Freezing Cold:</i><br>" +
          "The sky is blocked. Aerial creatures have total cover. <br>" +
          "A creature exposed to the cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain one level of exhaustion. <br>" +
          "&nbsp&nbsp Succeed this check automatically with appropriate gear.",
  
      "A Freezing Cold": "<b>" + "A Freezing Cold " + "</b>" + "<br>" +
          "A creature exposed to the cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain one level of exhaustion. <br>" +
          "&nbsp&nbsp Succeed this check automatically with appropriate gear.",
  
      "Heavy Clouds": "<b>" + "Heavy Clouds " + "</b>" + "<br>" +
          "The sky is blocked. Aerial creatures have total cover.",
  
      "Light Clouds": "<b>" + "Light Clouds " + "</b>" + "<br>" +
          "Easy breezy clouds pass by.",
  
      "Clear Skies": "<b>" + "Clear Skies " + "</b>" + "<br>" +
          "Clear bright light and wispy clouds during the daytime. <br>" +
          "View of the stars and moon at night.",
  
      "Clear Skies and Warm": "<b>" + "Clear Skies and Warm " + "</b>" + "<br>" +
          "Clear skies and a warm temperature pervade.",
  
      "A Wizard Fog": "<b>" + "A Wizard Fog " + "</b>" + "<br>" +
          "An adventurer can't see more than 5ft and can't light non-magical flames.",
  
      "The Flaywinds rise": "<b>" + "The Flaywinds rise " + "</b>" + "<br>" +
          "An intense sandstorm gathering large rocks and debris in addition to sand or grit. <br>" +
          "The area is heavily obscured, and a creature within it takes 1d4 slashing damage at the start of each of their turns. <br>" +
          "Only substantial cover offers protection. <br>" +
          "A successful DC 15 Intelligence (Arcana) or Wisdom (Nature) check allows a character to recognize a Flaywind 1 minute before it strikes, allowing time to find shelter. <br>" +
          "A Flaywind lasts 1d4 × 10 hours. Tasha's pg. 163.",
  
      "A Meteor Shower crashes": "<b>" + "A Meteor Shower crashes " + "</b>" + "<br>" +
          "Stars begin to fall from the sky as lumps of stone and metal. <br>" +
          "All creatures gain 1 luck point as per the Lucky feat, which lasts until used or the weather changes. <br>" +
          "If you travel 4 or more hours outdoors through this weather, a meteor strikes nearby, leaving 40d6 of devastation in its wake, but perhaps you'll find something cool. <br>" +
          "Potential consequences: 2d12 damage from the shock wave, difficult terrain, or heavily obscuring dust clouds.",
  
      "Ghost Lights abound": "<b>" + "Ghost Lights abound " + "</b>" + "<br>" +
          "Strange swirling lights fill the sky, swirls of green, blue, and purple. <br>" +
          "Night becomes dim (strangely hued) light until the effect ends.",
  
      "A Solar Eclipse yawns": "<b>" + "A Solar Eclipse yawns " + "</b>" + "<br>" +
          "For 1 hour during the day, it becomes night. <br>" +
          "Either select a dramatic time or roll a d12 for the hour. <br>" +
          "May or may not have prophetic ramifications.",
  
      "An Ashfall descends": "<b>" + "An Ashfall descends " + "</b>" + "<br>" +
          "Heavy white clouds of swirling smoke fill the sky, and it rains ash that coats everything in little flecks. <br>" +
          "A smell of burning wood or sulfur permeates the air. <br>" +
          "The sky is blocked. Aerial creatures have total cover.",
  
      "A High Wind": "<b>" + "A High Wind " + "</b>" + "<br>" +
          "Turbulent gusts sweep across the land. <br>" +
          "Flying creatures gain +10 movement speed when moving with the wind, and –10 movement speed when moving against it. <br>" +
          "All ranged weapon attacks have their range reduced by half when shooting into the wind."
  };

const months = 
  "<b>" + "Hammer " + "</b>" + "('Deepwinter') the first month" + "<br>" +
  "<b>" + "Alturiak " + "</b>" + " ('The Claws of the Cold') the second month" + "<br>" +
  "<b>" + "Ches " + "</b>" + " ('The Claw of Sunsets') the third month" + "<br>" +
  "<b>" + "Tarsakh " + "</b>" + " ('The Claw of Storms') the fourth month" + "<br>" +
  "<b>" + "Mirtul" + "</b>" + " ('The Melting') the fifth month" + "<br>" +
  "<b>" + "Kythorn " + "</b>" + " ('The Time of Flowers') the sixth month" + "<br>" +
  "<b>" + "Flamerule " + "</b>" + " ('Summertide') the seventh month" + "<br>" +
  "<b>" + "Eleasis " + "</b>" + " ('Highsun') the eighth month" + "<br>" +
  "<b>" + "Eleint " + "</b>" + " ('The Fading') the ninth month" + "<br>" +
  "<b>" + "Marpenoth " + "</b>" + " ('Leaffall') the tenth month" + "<br>" +
  "<b>" + "Uktar " + "</b>" + " ('The Rotting') the eleventh month" + "<br>" +
  "<b>" + "Nightal " + "</b>" + " ('The Drawing Down') the twelfth month" + "<br>"
; 

var encumberanceTable = {
    // Based on Alexandrian slot based inventory. Carrying changed
      1: {"Encumb": 0, "Heavy": 0.5, "Carrying": 1},
      2: {"Encumb": 0, "Heavy": 1, "Carrying": 2},
      3: {"Encumb": 1, "Heavy": 2, "Carrying": 3},
      4: {"Encumb": 1, "Heavy": 2, "Carrying": 4},
      5: {"Encumb": 1, "Heavy": 3, "Carrying": 5},
      6: {"Encumb": 2, "Heavy": 4, "Carrying": 6},
      7: {"Encumb": 2, "Heavy": 4, "Carrying": 7},
      8: {"Encumb": 2, "Heavy": 5, "Carrying": 8},
      9: {"Encumb": 3, "Heavy": 6, "Carrying": 9},
      10: {"Encumb": 3, "Heavy": 6, "Carrying": 10},
      11: {"Encumb": 3, "Heavy": 7, "Carrying": 11},
      12: {"Encumb": 4, "Heavy": 8, "Carrying": 12},
      13: {"Encumb": 4, "Heavy": 8, "Carrying": 13},
      14: {"Encumb": 4, "Heavy": 9, "Carrying": 14},
      15: {"Encumb": 5, "Heavy": 10, "Carrying": 15},
      16: {"Encumb": 5, "Heavy": 10, "Carrying": 16},
      17: {"Encumb": 5, "Heavy": 11, "Carrying": 17},
      18: {"Encumb": 6, "Heavy": 12, "Carrying": 18},
      19: {"Encumb": 6, "Heavy": 12, "Carrying": 19},
      20: {"Encumb": 6, "Heavy": 13, "Carrying": 20},
      21: {"Encumb": 7, "Heavy": 14, "Carrying": 21},
      22: {"Encumb": 7, "Heavy": 14, "Carrying": 22},
      23: {"Encumb": 7, "Heavy": 15, "Carrying": 23},
      24: {"Encumb": 8, "Heavy": 16, "Carrying": 24},
      25: {"Encumb": 8, "Heavy": 16, "Carrying": 25},
      26: {"Encumb": 8, "Heavy": 17, "Carrying": 26},
      27: {"Encumb": 9, "Heavy": 18, "Carrying": 27},
      28: {"Encumb": 9, "Heavy": 18, "Carrying": 28},
      29: {"Encumb": 9, "Heavy": 19, "Carrying": 29},
      30: {"Encumb": 10, "Heavy": 20, "Carrying": 30}
  }