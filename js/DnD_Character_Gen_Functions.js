
import { generalDiceRoll, findNextTableNumber, rollOnTable } from './DnD_General.js';
import { Variables } from './DnD_Character_Gen_Variables.js';

let {
  currentCharacter, resultsHistory, nameArray, clanArray,
  raceType, sexType, flawText, voiceText, races
} = Variables;

const { sexes, nameListings, nameDictionary, appearances, quirks,
  traits, occupations, flaws, voices, ideals, bonds,
  motivationverbs, motivationnouns1, motivationnouns2, motivationnouns3, motivationnouns4,
  motivationnouns5, waylayadjectives, waylaynouns, waylaysolutions, villainTraits, villainCrooks,
  menuRaces, charAge
} = Variables;

let race;
let sex;

// Function Create Character
function createCharacter() {

  var raceIndex = Math.floor(Math.random() * races.length);
  var sexIndex = Math.floor(Math.random() * sexes.length);
  var occupationIndex = Math.floor(Math.random() * occupations.length);
  var appearanceIndex = Math.floor(Math.random() * appearances.length);
  var quirkIndex = Math.floor(Math.random() * quirks.length);
  var traitIndex = Math.floor(Math.random() * traits.length);
  var voiceIndex = Math.floor(Math.random() * voices.length);
  var age = rollOnTable(charAge);

  if (raceType === "Random") {
    race = races[raceIndex];
  }

  if (sexType === "Random") {
    sex = sexes[sexIndex];
  }

  var occupation = occupations[occupationIndex];
  var appearance = appearances[appearanceIndex];
  var quirk = quirks[quirkIndex];
  var voice = voices[voiceIndex];

  var trait;
  if (traits[traitIndex] === "Two Traits") {
    var traitIndex1 = Math.floor(Math.random() * traits.length);
    var traitIndex2 = Math.floor(Math.random() * traits.length);
    while (traitIndex2 === traitIndex1) {
      traitIndex2 = Math.floor(Math.random() * traits.length);
    }
    trait = traits[traitIndex1] + ", " + traits[traitIndex2];
  } else {
    trait = traits[traitIndex];
  }

  var nameArray = retrieveNames(race, sex);
  var clanArray = retrieveNames(race, "Clan");

  var nameIndex = Math.floor(Math.random() * nameArray.length);
  var clannameIndex = Math.floor(Math.random() * clanArray.length);

  currentCharacter = {
    name: nameArray[nameIndex],
    clanName: clanArray[clannameIndex],
    fullname: nameArray[nameIndex] + " " + clanArray[clannameIndex],
    race: race,
    sex: sex,
    age: age,
    occupation: occupation,
    appearance: appearance,
    quirk: quirk,
    trait: trait,
    flaw: ' ',
    voice: voice,
    ideal: '',
    bond: '',
    background: '',
    villainy: '',
    hook: '',
    loyalties: '',
    goals: '',
    fears: '',
    interests: '',
    secrets: '',
    mood: '',
    relationshipPositive: '',
    relationshipNegative: '',
    simplified: ''
  };

  resultsHistory.unshift(currentCharacter);
  if (resultsHistory.length > 6) {
    resultsHistory.pop();
  }
  updateCharacterDisplay();
}


// Function Retrieve Names
function retrieveNames(retrieverace, category) {
  // Check if the race and category exist in the dictionary
  if (nameDictionary[retrieverace] && nameDictionary[retrieverace][category]) {
    return nameDictionary[retrieverace][category];
  } else {
    console.error("No data found for the specified race and category.");
    return []; // Return an empty array if no matching data is found
  }
}

// Function Update Character Display
function updateCharacterDisplay() {
  var charhistory = '';
  resultsHistory.forEach(function (item) {
    charhistory +=
      '<div class="character-result">' +
      '<div>' + "<b>" + item.fullname + "</b>" + ' - ' + item.race + ' ' +
      item.sex + ', ' + item.age + " " + item.occupation + '</div>' +
      '<div>' + "<i>Appearance: </i>" + item.appearance + '</div>' +
      '<div>' + "<i>Mannerisms: </i>" + item.quirk + ", " + item.trait + '</div>' +
      '<div>' + "<i>Voice: </i>" + item.voice + '</div>' +
      '<div>' + '<br>' + '</div>' +
      '<div>' + item.flaw + '</div>' +
      '<div>' + item.background + '</div>' +
      '<div>' + item.villainy + '</div>' +
      '<div>' + '<br>' + '</div>' +
      '<div>' + item.simplified + '</div>' +
      '</div>';

  })

  document.getElementById("results").innerHTML = charhistory;
}

// Function Rename Character                  
function renameCharacter() {

  if (!currentCharacter.race || !currentCharacter.sex) {
    console.error("No current character race or sex data available. Run 'createCharacter()' first.");
    return;
  }

  var nameArray = retrieveNames(currentCharacter.race, currentCharacter.sex);
  var clanArray = retrieveNames(currentCharacter.race, "Clan");

  if (!nameArray.length || !clanArray.length) {
    console.error("No names or clans available to rename.");
    return;
  }

  var nameIndex = Math.floor(Math.random() * nameArray.length);
  var clannameIndex = Math.floor(Math.random() * clanArray.length);

  currentCharacter.name = nameArray[nameIndex];
  currentCharacter.clanName = clanArray[clannameIndex];
  currentCharacter.fullname = nameArray[nameIndex] + " " + clanArray[clannameIndex];

  updateCharacterDisplay();
  if (resultsHistory.length > 6) {
    resultsHistory.pop();
  }
}

function selectRaceSex(selectRace, selectSex) {
  race = selectRace;
  raceType = selectRace;
  sex = selectSex;
  sexType = selectSex;

  currentCharacter = {
    race: race,
    sex: sex,
  };

  document.getElementById('button-race').textContent = race + " " + sex;

  event.preventDefault();
}

// Function Add Detail
function addDetail() {

  addFlaw();
  addBackground();
  addVillainy();

  updateCharacterDisplay();
  if (resultsHistory.length > 6) {
    resultsHistory.pop();
  }
}

// Function Add Flaw
function addFlaw() {
  var flawIndex = Math.floor(Math.random() * flaws.length);
  currentCharacter.flaw = "<i>Flaw: </i>" + flaws[flawIndex];
  currentCharacter.shortflaw = flaws[flawIndex];

}

// Function Add Background
function addBackground() {

  var IdealIndex = Math.floor(Math.random() * ideals.length);
  var BondIndex = Math.floor(Math.random() * bonds.length);

  // Roll 3 unique indices for motivation verbs
  var lastMotivationVerbsIndices = [];
  for (let i = 0; i < 3; i++) {
    let uniqueIndex = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
    lastMotivationVerbsIndices.push(uniqueIndex);
    if (lastMotivationVerbsIndices.length > 3) {
      lastMotivationVerbsIndices.shift();
    }
  }

  // Roll 3 unique indices for motivation nouns columns
  var lastMotivationNounsColumnsIndices = [];
  for (let i = 0; i < 3; i++) {
    let uniqueNounsIndex = getUniqueIndex(5, lastMotivationNounsColumnsIndices);
    lastMotivationNounsColumnsIndices.push(uniqueNounsIndex);
    if (lastMotivationNounsColumnsIndices.length > 3) {
      lastMotivationNounsColumnsIndices.shift();
    }
  }

  var motivationverbsIndex1 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  var motivationverbsIndex2 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  var motivationverbsIndex3 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  var motivationnouns1Index = Math.floor(Math.random() * motivationnouns1.length);
  var motivationnouns2Index = Math.floor(Math.random() * motivationnouns2.length);
  var motivationnouns3Index = Math.floor(Math.random() * motivationnouns3.length);
  var motivationnouns4Index = Math.floor(Math.random() * motivationnouns4.length);
  var motivationnouns5Index = Math.floor(Math.random() * motivationnouns5.length);
  var waylayadjectivesIndex1 = Math.floor(Math.random() * waylayadjectives.length);
  var waylayadjectivesIndex2 = Math.floor(Math.random() * waylayadjectives.length);
  var waylaynounsIndex1 = Math.floor(Math.random() * waylaynouns.length);
  var waylaynounsIndex2 = Math.floor(Math.random() * waylaynouns.length);
  var waylaysolutionsIndex1 = (Math.floor(Math.random() * 10)) + (Math.floor(Math.random() * 10));
  var waylaysolutionsIndex2 = (Math.floor(Math.random() * 10)) + (Math.floor(Math.random() * 10));


  var motivationVerb1 = motivationverbs[motivationverbsIndex1];
  var motivationVerb2 = motivationverbs[motivationverbsIndex2];
  var motivationVerb3 = motivationverbs[motivationverbsIndex3];
  var motivationNoun1 = motivationnouns1[motivationnouns1Index];
  var motivationNoun2 = motivationnouns2[motivationnouns2Index];
  var motivationNoun3 = motivationnouns3[motivationnouns3Index];
  var motivationNoun4 = motivationnouns4[motivationnouns4Index];
  var motivationNoun5 = motivationnouns5[motivationnouns5Index];
  var motivationNounsArray = [motivationNoun1, motivationNoun2, motivationNoun3, motivationNoun4, motivationNoun5];
  var motivationNouns = [motivationNounsArray[lastMotivationNounsColumnsIndices[0]],
  motivationNounsArray[lastMotivationNounsColumnsIndices[1]], motivationNounsArray[lastMotivationNounsColumnsIndices[2]]];
  var waylayAdjective1 = waylayadjectives[waylayadjectivesIndex1];
  var waylayNoun1 = waylaynouns[waylaynounsIndex1];
  var waylaySolution1 = waylaysolutions[waylaysolutionsIndex1];
  var waylayAdjective2 = waylayadjectives[waylayadjectivesIndex2];
  var waylayNoun2 = waylaynouns[waylaynounsIndex2];
  var waylaySolution2 = waylaysolutions[waylaysolutionsIndex2];


  currentCharacter.background =
    '<div>' + "<i>Motivation: </i>" + '</div>' +
    '<div>' + "<i>Ideals: </i>" + ideals[IdealIndex] + '</div>' +
    '<div>' + "<i>Bonds: </i>" + bonds[BondIndex] + '</div>' +
    '<div>' + "&nbsp;&nbsp;&nbsp;" + motivationVerb1 + " " + motivationNouns[0] + '</div>' +
    '<div>' + "&nbsp;&nbsp;&nbsp;" + motivationVerb2 + " " + motivationNouns[1] + '</div>' +
    '<div>' + "&nbsp;&nbsp;&nbsp;" + motivationVerb3 + " " + motivationNouns[2] + '</div>' +
    '<div>' + "<i>Background: </i>" + '</div>' +
    '<div>' + "&nbsp;&nbsp;&nbsp;" + waylayAdjective1 + " " + waylayNoun1 + " solved by " + waylaySolution1 + '</div>' +
    '<div>' + "&nbsp;&nbsp;&nbsp;" + waylayAdjective2 + " " + waylayNoun2 + " solved by " + waylaySolution2 + '</div>'
    ;

}

// Function add villainy
function addVillainy() {
  var villainTraitIndex1 = Math.floor((Math.random() * 50) + 1);
  var villainTraitIndex2 = Math.floor((Math.random() * 50) + 1);
  var villainTrait1 = villainTraits[villainTraitIndex1];
  var villainTrait2 = villainTraits[villainTraitIndex2];
  var villainCrookIndex = Math.floor((Math.random() * 50) + 1);
  var villainCrook = villainCrooks[villainCrookIndex];

  currentCharacter.villainy =
    '<div>' + "<i>Villainous Traits: </i>" + villainTrait1 + ", " + villainTrait2 + '</div>' +
    '<div>' + "<i>Villainous Crook: </i>" + villainCrook + '</div>';

}



// Function Simplify Description
function simpleCopy() {

  var simpleFlawCheck = '';
  var simpleVoiceCheck = '';
  var simpleVillainyCheck = '';

  if (currentCharacter.flaw === "" || simpleFlawCheck === " " || simpleFlawCheck === '') {
    simpleFlawCheck = "";
  } else {
    simpleFlawCheck = ". " + currentCharacter.flaw
  };

  if (currentCharacter.voice === "") {
    simpleVoiceCheck = "";
  } else {
    simpleVoiceCheck = ". " + currentCharacter.voice
  };

  if (currentCharacter.villainy === "") {
    simpleVillainyCheck = "";
  } else {
    simpleVillainyCheck = ". " + currentCharacter.villainy
  };

  var simpleText =
    "<b>" + currentCharacter.fullname + "</b>" + " - ("
    + "<i>" + currentCharacter.race + " " + currentCharacter.sex
    + ", " + currentCharacter.age + " " + currentCharacter.occupation
    + "<br>"
    + currentCharacter.appearance + ". "
    + "<br>"
    + currentCharacter.quirk
    + ". " + currentCharacter.trait
    + simpleFlawCheck
    + simpleVoiceCheck + "</i>"
    + ")";

  currentCharacter.simplified = simpleText;
  updateCharacterDisplay();


  navigator.clipboard.writeText(simpleText);
}

// Function to get a unique index
function getUniqueIndex(length, lastIndices) {
  // length is the length of the array, lastIndices is the index to check
  let index;
  do {
    index = Math.floor(Math.random() * length);
  } while (lastIndices.includes(index));
  return index;
}

document.addEventListener('DOMContentLoaded', () => {
  initializePage();
});

function initializePage() {

}


// Function Dropbox Window Click
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Function Random Selected
function randomFunction() {
  raceType = "Random";
  sexType = "Random";
  document.getElementById('button-race').textContent = "Random";
}



const addCreateCharacterButton = document.querySelector("#button-create");

addCreateCharacterButton.addEventListener("click", () => {
  createCharacter();
});

const addSimpleButton = document.querySelector("#button-simple");

addSimpleButton.addEventListener("click", () => {
  simpleCopy();
});

const addRenameButton = document.querySelector("#button-rename");

addRenameButton.addEventListener("click", () => {
  renameCharacter();
});

const addDetailButton = document.querySelector("#button-detail");

addDetailButton.addEventListener("click", () => {
  addDetail();
});


const dropdown = document.getElementById('myDropdown');

// Add the "Random" option
const randomOption = document.createElement('a');
randomOption.textContent = 'Random';
randomOption.href = '#';
randomOption.addEventListener('click', () => randomFunction());
dropdown.appendChild(randomOption);

// Add race/sex options
menuRaces.forEach(race => {
  ['Male', 'Female'].forEach(sex => {
    const option = document.createElement('a');
    option.textContent = `${race} ${sex}`;
    option.href = '#';
    option.addEventListener('click', () => selectRaceSex(race, sex));
    dropdown.appendChild(option);
  });
});

// Add dropdown toggle logic
document.getElementById('button-race').addEventListener('click', () => {
  dropdown.classList.toggle('show');
});

// Optional: close dropdown if clicking outside (optional polish)
window.addEventListener('click', (event) => {
  if (!event.target.matches('#button-race')) {
    dropdown.classList.remove('show');
  }
});
