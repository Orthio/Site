
import { generalDiceRoll } from './DnD_General.js';

//Global Variables

function checkOutcome(roll) {
    // Check the outcome of the roll
    if (roll === 7) {
        return "Critical, Exceptional Result";
    } else if (roll < 7 && roll > 5) {
        return "Good Result, Full Effect";
    } else if (roll < 6 && roll > 3) {
        return "Mixed Result, Partial Effect";
    } else if (roll < 4) {
        return "Poor Result, Limited Effect";
    }
};

function rollFortune() {
    var traitRating = parseInt(document.getElementById('trait-rating').value);
    var majorAdv = parseInt(document.getElementById('major-advantage').value);
    var majorDisAdv = parseInt(document.getElementById('major-disadvantage').value);
    var roll0d = "Fortune";
    var diceQty = traitRating + majorAdv - majorDisAdv;
    if (diceQty < 1) {
        diceQty = 2;
        roll0d = "0d"; // Rolling both dice at disadvantage
    }
    var diceOutcome = generalDiceRoll(6,diceQty,roll0d);
    var fortuneOutcome = checkOutcome(diceOutcome);
    var fortuneResult = diceOutcome + ": " + fortuneOutcome;
    document.getElementById('fortune-result').innerHTML = fortuneResult;
};

const fortuneButton = document.querySelector("#fortune-button");

fortuneButton.addEventListener("click", () => {
    rollFortune();
  });
  
