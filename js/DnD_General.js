
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
    switch (adv){
        case "Dis":
            return Math.min.apply(null,rollResult);
            break;
        case "Adv":
            return Math.max.apply(null,rollResult);
            break;
        case "Fortune":
            var countSixes = rollResult.filter(num => num === 6).length;
            if (countSixes >= 2) {
                return 7;
            } 
            else {
            return Math.max.apply(null,rollResult);
            }
            break;
        case "0d":
            return Math.min.apply(null,rollResult);
            break;
        default:
            return rollResult[0];
    }
};
