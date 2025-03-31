
import { generalDiceRoll, findNextTableNumber, rollOnTable } from './DnD_General.js';
import { Variables } from './DnD_Character_Gen_Variables.js';

let {
  currentCharacter, resultsHistory,
  raceType, sexType, flawText, voiceText, races
} = Variables;

const { sexes, nameListings, nameDictionary, appearances, quirks,
  traits, occupations, flaws, voices, ideals, bonds,
  motivationverbs, motivationnouns1, motivationnouns2, motivationnouns3, motivationnouns4,
  motivationnouns5, waylayadjectives, waylaynouns, waylaysolutions, villainTraits, villainCrooks,
  menuRaces, charAge, relationships
} = Variables;

let jsonData;

fetch('json/DnD_Roll_Tables.json')

  .then(response => response.json())  // Parse the JSON
  .then(data => {
    jsonData = data;
    //  console.log(data.artDecorativeTechniques["1"]); // Outputs "Platinum filigree"

    // console.log(data.artNature["2"]); // Outputs "Worn or Carried Ornaments"
  })
  .catch(error => console.error('Error fetching JSON:', error));


let race;
let sex;

// Function Create Character
function createCharacter() {

  let age = rollOnTable(charAge);

  if (raceType === "Random") {
    race = rollOnTable(races);
  }

  if (sexType === "Random") {
    sex = rollOnTable(sexes);
  }

  let occupation = rollOnTable(occupations);
  let appearance = rollOnTable(appearances);
  let quirk = rollOnTable(quirks);
  let voice = rollOnTable(voices);

  let trait;
  let traitIndex = Math.floor(Math.random() * traits.length);

  if (traits[traitIndex] === "Two Traits") {
    let traitIndex1 = Math.floor(Math.random() * traits.length);
    let traitIndex2 = Math.floor(Math.random() * traits.length);
    while (traitIndex2 === traitIndex1) {
      traitIndex2 = Math.floor(Math.random() * traits.length);
    }
    trait = traits[traitIndex1] + ", " + traits[traitIndex2];
  } else {
    trait = traits[traitIndex];
  }

  let nameArray = retrieveNames(race, sex);
  let clanArray = retrieveNames(race, "Clan");

  let name = rollOnTable(nameArray);
  let clanName = rollOnTable(clanArray);

  currentCharacter = {
    name: name,
    clanName: clanName,
    fullname: name + " " + clanName,
    race: race,
    sex: sex,
    age: age,
    occupation: occupation,
    appearance: appearance,
    trait: trait,
    quirk: quirk,
    relationship: ' ',
    specialAdvantage: ' ',
    flaw: ' ',
    voice: voice,
    ideal: '',
    bond: '',
    background: '',
    villainy: '',
    hook: '',
    goal: '',
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
  let charhistory = '';
  resultsHistory.forEach(function (item) {
    charhistory +=
      '<div class="character-result">' +
      '<div>' + "<b>" + item.fullname + "</b>" + ' - ' + item.race + ' ' +
      item.sex + ', ' + item.age + " " + item.occupation + '</div>' +
      '<div>' + "<i>Appearance: </i>" + item.appearance + '</div>' +
      '<div>' + "<i>Mannerisms: </i>" + item.trait + ", " + item.quirk + '</div>' +
      '<div>' + "<i>Voice: </i>" + item.voice + '</div>' +
      '<div>' + '<br>' + '</div>' +
      '<div>' + item.specialAdvantage + '</div>' +
      '<div>' + item.flaw + '</div>' +
      '<div>' + item.background + '</div>' +
      '<div>' + item.relationship + '</div>' +
      '<div>' + item.goal + '</div>' +
      '<div>' + item.villainy + '</div>' +
      '<div>' + item.hook + '</div>' +
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

  let nameArray = retrieveNames(currentCharacter.race, currentCharacter.sex);
  let clanArray = retrieveNames(currentCharacter.race, "Clan");

  if (!nameArray.length || !clanArray.length) {
    console.error("No names or clans available to rename.");
    return;
  }

  let name = rollOnTable(nameArray);
  let clanName = rollOnTable(clanArray);

  currentCharacter.name = name;
  currentCharacter.clanName = clanName;
  currentCharacter.fullname = name + " " + clanName;

  updateCharacterDisplay();
  if (resultsHistory.length > 6) {
    resultsHistory.pop();
  }
}

// Function for choosing race and sex from dropdown
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
}

// Function Add Detail
function addDetail() {

  addFlaw();
  addBackground();
  addVillainy();
  addHook();

  updateCharacterDisplay();
  if (resultsHistory.length > 6) {
    resultsHistory.pop();
  }
}

// Function Add Flaw
function addFlaw() {
  let flawIndex = Math.floor(Math.random() * flaws.length);
  currentCharacter.flaw = "<i>Flaw: </i>" + flaws[flawIndex];
  currentCharacter.shortflaw = flaws[flawIndex];

}

// Function Add Background
function addBackground() {

  let ideal = rollOnTable(ideals);
  let bond = rollOnTable(bonds);

  // Roll 3 unique indices for motivation verbs
  let lastMotivationVerbsIndices = [];
  for (let i = 0; i < 3; i++) {
    let uniqueIndex = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
    lastMotivationVerbsIndices.push(uniqueIndex);
    if (lastMotivationVerbsIndices.length > 3) {
      lastMotivationVerbsIndices.shift();
    }
  }

  // Roll 3 unique indices for motivation nouns columns
  let lastMotivationNounsColumnsIndices = [];
  for (let i = 0; i < 3; i++) {
    let uniqueNounsIndex = getUniqueIndex(5, lastMotivationNounsColumnsIndices);
    lastMotivationNounsColumnsIndices.push(uniqueNounsIndex);
    if (lastMotivationNounsColumnsIndices.length > 3) {
      lastMotivationNounsColumnsIndices.shift();
    }
  }

  let motivationverbsIndex1 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  let motivationverbsIndex2 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  let motivationverbsIndex3 = getUniqueIndex(motivationverbs.length, lastMotivationVerbsIndices);
  let motivationnouns1Index = Math.floor(Math.random() * motivationnouns1.length);
  let motivationnouns2Index = Math.floor(Math.random() * motivationnouns2.length);
  let motivationnouns3Index = Math.floor(Math.random() * motivationnouns3.length);
  let motivationnouns4Index = Math.floor(Math.random() * motivationnouns4.length);
  let motivationnouns5Index = Math.floor(Math.random() * motivationnouns5.length);
  let waylayadjectivesIndex1 = Math.floor(Math.random() * waylayadjectives.length);
  let waylayadjectivesIndex2 = Math.floor(Math.random() * waylayadjectives.length);
  let waylaynounsIndex1 = Math.floor(Math.random() * waylaynouns.length);
  let waylaynounsIndex2 = Math.floor(Math.random() * waylaynouns.length);
  let waylaysolutionsIndex1 = (Math.floor(Math.random() * 10)) + (Math.floor(Math.random() * 10));
  let waylaysolutionsIndex2 = (Math.floor(Math.random() * 10)) + (Math.floor(Math.random() * 10));


  let motivationVerb1 = motivationverbs[motivationverbsIndex1];
  let motivationVerb2 = motivationverbs[motivationverbsIndex2];
  let motivationVerb3 = motivationverbs[motivationverbsIndex3];
  let motivationNoun1 = motivationnouns1[motivationnouns1Index];
  let motivationNoun2 = motivationnouns2[motivationnouns2Index];
  let motivationNoun3 = motivationnouns3[motivationnouns3Index];
  let motivationNoun4 = motivationnouns4[motivationnouns4Index];
  let motivationNoun5 = motivationnouns5[motivationnouns5Index];
  let motivationNounsArray = [motivationNoun1, motivationNoun2, motivationNoun3, motivationNoun4, motivationNoun5];
  let motivationNouns = [motivationNounsArray[lastMotivationNounsColumnsIndices[0]],
  motivationNounsArray[lastMotivationNounsColumnsIndices[1]], motivationNounsArray[lastMotivationNounsColumnsIndices[2]]];
  let waylayAdjective1 = waylayadjectives[waylayadjectivesIndex1];
  let waylayNoun1 = waylaynouns[waylaynounsIndex1];
  let waylaySolution1 = waylaysolutions[waylaysolutionsIndex1];
  let waylayAdjective2 = waylayadjectives[waylayadjectivesIndex2];
  let waylayNoun2 = waylaynouns[waylaynounsIndex2];
  let waylaySolution2 = waylaysolutions[waylaysolutionsIndex2];


  currentCharacter.background =
    '<div>' + "<i>Motivation: </i>" + '</div>' +
    '<div>' + "<i>Ideals: </i>" + ideal + '</div>' +
    '<div>' + "<i>Bonds: </i>" + bond + '</div>' +
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
  let villainTraitIndex1 = Math.floor((Math.random() * 50) + 1);
  let villainTraitIndex2 = Math.floor((Math.random() * 50) + 1);
  let villainTrait1 = villainTraits[villainTraitIndex1];
  let villainTrait2 = villainTraits[villainTraitIndex2];
  let villainCrookIndex = Math.floor((Math.random() * 50) + 1);
  let villainCrook = villainCrooks[villainCrookIndex];
  let villainGoal = rollOnTable(jsonData.villainGoals);

  currentCharacter.villainy =
    '<div>' + "<i>Villainous Traits: </i>" + villainTrait1 + ", " + villainTrait2 + '</div>' +
    '<div>' + "<i>Villainous Crook: </i>" + villainCrook + '</div>' +
    '<div>' + "<i>Villainous Goal: </i>" + villainGoal + '</div>';
}

// Function add hook
function addHook() {
  let relationship = rollOnTable(relationships);
  let hook1 = rollOnTable(jsonData.hooks1);
  let hook2 = rollOnTable(jsonData.hooks2);
  let goal = rollOnTable(jsonData.goals);
  let specialAdvantage = rollOnTable(jsonData.specialAdvantage);

  currentCharacter.relationship = '<div>' + "<i>Relationship: </i>" + relationship;
  currentCharacter.specialAdvantage = '<div>' + "<i>Advantage: </i>" + specialAdvantage;
  currentCharacter.hook =
    '<div>' + "<i>Hooks: </i>" + hook1 + '<br>' +
    hook2 + '</div>' + '<br>';
  currentCharacter.goal = '<div>' + "<i>Goal: </i>" + goal + '</div>';
}


// Function Simplify Description
function simpleCopy() {

  let simpleFlawCheck = '';
  let simpleVoiceCheck = '';
  let simpleVillainyCheck = '';

  if (currentCharacter.flaw === "" || simpleFlawCheck === " " || simpleFlawCheck === '') {
    simpleFlawCheck = "";
  } else {
    simpleFlawCheck = ". " + currentCharacter.flaw
  };

  if (currentCharacter.voice === "") {
    simpleVoiceCheck = "";
  } else {
    simpleVoiceCheck = currentCharacter.voice
  };

  if (currentCharacter.villainy === "") {
    simpleVillainyCheck = "";
  } else {
    simpleVillainyCheck = ". " + currentCharacter.villainy
  };

  let simpleSex;
  if (currentCharacter.sex == "Male") {
    simpleSex = "M"
  } else {
    simpleSex = "F"
  }

  let simpleText =
    "<b>" + currentCharacter.fullname + "</b>" + " - <i>("
    + currentCharacter.race + " " + simpleSex
    + ", " + currentCharacter.age + " " + currentCharacter.occupation + ")"
    + "<br>"
    + currentCharacter.appearance
    + "<br>"
    + currentCharacter.trait
    + ", " + currentCharacter.quirk
    + simpleFlawCheck + "<br>"
    + simpleVoiceCheck + "</i>";

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

// Initialize listener
document.addEventListener('DOMContentLoaded', () => {
  initializePage();
});

function initializePage() {

}


// Function Dropbox Window Click
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
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
