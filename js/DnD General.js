
//Global Variables
var generalPartyDPS1r = 30.8;

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
    if (adv === "Dis") {
        return Math.min.apply(null,rollResult);
    } 
    if (adv === "Adv") {
        return Math.max.apply(null, rollResult);
    }
    if (adv === "Fortune") { // if it's a fortune roll
        var countSixes = rollResult.filter(num => num === 6).length;
        if (countSixes >= 2) {
            return 7;
        } 
        else {
        return Math.max.apply(null,rollResult);
        }
    }
    if (adv === "0d"){ // For the blades in the dark disadv roll
        return Math.min.apply(null,rollResult);

    }
    else { 
    return null;
    }
};
