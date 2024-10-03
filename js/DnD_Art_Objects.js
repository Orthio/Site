import { generalDiceRoll} from './DnD_General.js';

fetch('../json/DnD_Art_Objects.json')  // Replace 'data.json' with the correct file path
  .then(response => response.json())  // Parse the JSON
  .then(data => {
    // Accessing artDecorativeTechniques
    // console.log(data.artDecorativeTechniques["1"]); // Outputs "Platinum filigree"
    
    // Accessing artDesignThemes
    //console.log(data.artNature["2"]); // Outputs "Jewellery or Ornaments"
  })
  .catch(error => console.error('Error fetching JSON:', error));


  // Now you can use the generalDiceRoll function
const result = generalDiceRoll(20, 2, "Adv");
// console.log("Dice Roll Result with Advantage:", result);
document.getElementById("roll-results").innerText = result;

function generateArt() {
  var natureIndex = generalDiceRoll(5,1);
  var nature = data.artNature[natureIndex];
  console.log(nature);

  var jewelleryIndex = generalDiceRoll(50,1);
  var jewellery = data.artJewelleryItems[jewelleryIndex];
  console.log(jewellery);

  var equipmentIndex = generalDiceRoll(50,1);
  var equipment = data.artEquipment[equipmentIndex];
  console.log(equipment);

  var artDiningIndex = generalDiceRoll(50,1); 
  var artDining = data.artDiningItems[artDiningIndex];
  console.log(artDining);

  var artDecorativeIndex = generalDiceRoll(50,1);
  var artDecorative = data.artDecorativeItems[artDecorativeIndex];
  console.log(artDecorative);

  var artMiscellaneousIndex = generalDiceRoll(50,1);
  var artMiscellaneous = data.artMiscellaneousItems[artMiscellaneousIndex];
  console.log(artMiscellaneous);

  var artMetalIndex = generalDiceRoll(50,1);
  var artMetal = data.artMetalTypes[artMetalIndex];
  console.log(artMetal);

  var artMaterialIndex = generalDiceRoll(50,1);
  var artMetal = data.artMaterialTypes[artMaterialIndex];
  console.log(ArtMetal);

  var artGemstoneIndex = generalDiceRoll(50,1);
  var artGemstone = data.artGemstoneTypes[artGemstoneIndex];
  console.log(artGemstone);

  var artDecorativeIndex = generalDiceRoll(20,1);
  var artDecorative = data.artDecorativeTechniques[artDecorativeIndex];
  console.log(artDecorative);

  var artDesignIndex = generalDiceRoll(20,1);
  var artDesign = data.artDesignThemes[artDesignIndex];
  console.log(artDesign);

  document.getElementById("art-results").innerText = Art+"blah";
};

document.addEventListener("DOMContentLoaded", function() {
  // Checks in DOM content is loaded then checks the button
  const button = document.getElementById('generate-art-btn');
  if (button) {
      button.addEventListener('click', function() {
          generateArt();
      });
  }
});