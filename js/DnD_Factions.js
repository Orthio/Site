//Global Variables

var circleDatabase = {
    Green: {
        0: {
            0: "https://i.imgur.com/XsKFVmC.jpeg"
        },
        3: {
            0: "https://i.imgur.com/EuNDi3m.png", 
            1: "https://i.imgur.com/dp6fbCp.png", 
            2: "https://i.imgur.com/MJ1QiWu.png", 
            3: "https://i.imgur.com/hFHQHwb.png"
        },
        4: {
            0: "https://i.imgur.com/gNBLY5u.png",
            1: "https://i.imgur.com/uP9577F.png",
            2: "https://i.imgur.com/LOu1Xip.png",
            3: "https://i.imgur.com/NCZvcJ5.png",
            4: "https://i.imgur.com/VOOUlgU.png"
        },
        6: {
            0: "https://i.imgur.com/2qY7Z1d.png",
            1: "https://i.imgur.com/oap2Hht.png",
            2: "https://i.imgur.com/CkkiUEA.png",
            3: "https://i.imgur.com/LmFRyIS.png",
            4: "https://i.imgur.com/JILta8k.png",
            5: "https://i.imgur.com/k5piBfe.png",
            6: "https://i.imgur.com/InKKP3N.png"
        },
        8: {
            0: "https://i.imgur.com/T2TInVp.png",
            1: "https://i.imgur.com/M5RMETA.png",
            2: "https://i.imgur.com/n7n3vqg.png",
            3: "https://i.imgur.com/FRsot33.png",
            4: "https://i.imgur.com/jB6T9lW.png",
            5: "https://i.imgur.com/3Pe6tOg.png",
            6: "https://i.imgur.com/f7Ur7yl.png",
            7: "https://i.imgur.com/90B0OXY.png",
            8: "https://i.imgur.com/NelzCbt.png"
        },
        12: {
            0: "https://i.imgur.com/qIrst5B.jpeg",
            1: "https://i.imgur.com/bGh5Pmi.jpeg",
            2: "https://i.imgur.com/a0a9S9j.jpeg",
            3: "https://i.imgur.com/WRNw5op.jpeg",
            4: "https://i.imgur.com/YABr7ql.jpeg",
            5: "https://i.imgur.com/neJsgvP.jpeg",
            6: "https://i.imgur.com/yFg9zbq.jpeg",
            7: "https://i.imgur.com/dGMhJVe.jpeg",
            8: "https://i.imgur.com/adSehAg.jpeg",
            9: "https://i.imgur.com/kdJRNJ7.jpeg",
            10: "https://i.imgur.com/SI0CwNK.jpeg",
            11: "https://i.imgur.com/S2gseHz.jpeg",
            12: "https://i.imgur.com/Vsw5mIT.jpeg",
        },
    },
    Blue: {
        0: {
            0: "https://i.imgur.com/XsKFVmC.jpeg"
        },
        3: {
            0: "https://i.imgur.com/EuNDi3m.png", 
            1: "https://i.imgur.com/HxWfwSp.png", 
            2: "https://i.imgur.com/JiLqSed.png", 
            3: "https://i.imgur.com/slSxOVm.png"
        },
        4: {
            0: "https://i.imgur.com/gNBLY5u.png",
            1: "https://i.imgur.com/cuyH20H.png",
            2: "https://i.imgur.com/LpAL46B.png",
            3: "https://i.imgur.com/mHMhP8I.png",
            4: "https://i.imgur.com/Laimtrr.png"
        },
        6: {
            0: "https://i.imgur.com/2qY7Z1d.png",
            1: "https://i.imgur.com/EIrLK87.png",
            2: "https://i.imgur.com/COCXXQj.png",
            3: "https://i.imgur.com/wetHrNE.png",
            4: "https://i.imgur.com/LqI87W1.png",
            5: "https://i.imgur.com/EPF9vhc.png",
            6: "https://i.imgur.com/RuRv1p3.png"
        },
        8: {
            0: "https://i.imgur.com/T2TInVp.png",
            1: "https://i.imgur.com/kbqORZ5.png",
            2: "https://i.imgur.com/h4LYOR8.png",
            3: "https://i.imgur.com/X6x8CcX.png",
            4: "https://i.imgur.com/nkKfD8w.png",
            5: "https://i.imgur.com/JVmH787.png",
            6: "https://i.imgur.com/SMq4k6x.png",
            7: "https://i.imgur.com/gs9coJt.png",
            8: "https://i.imgur.com/mqH90W9.png"
        },
        12: {
            0: "https://i.imgur.com/qIrst5B.jpeg",
            1: "https://i.imgur.com/zDcSqb1.jpeg",
            2: "https://i.imgur.com/Tv1iuGD.jpeg",
            3: "https://i.imgur.com/HvPwoir.jpeg",
            4: "https://i.imgur.com/SewqlI6.jpeg",
            5: "https://i.imgur.com/uAz8Kr6.jpeg",
            6: "https://i.imgur.com/VHGnvA2.jpeg",
            7: "https://i.imgur.com/20UwdgC.jpeg",
            8: "https://i.imgur.com/9EzrXG7.jpeg",
            9: "https://i.imgur.com/KLK8cn1.jpeg",
            10: "https://i.imgur.com/fRH9rD9.jpeg",
            11: "https://i.imgur.com/IXmNwuT.jpeg",
            12: "https://i.imgur.com/nKPcvmV.jpeg",
            },
    },
    Grey: {
        0: {
            0: "https://i.imgur.com/XsKFVmC.jpeg"
        },
        3: {
            0: "https://i.imgur.com/EuNDi3m.png",
            1: "https://i.imgur.com/N6cWkJZ.png",
            2: "https://i.imgur.com/0kb8w39.png",
            3: "https://i.imgur.com/EtQ2tVl.png"
        },
        4: {
            0: "https://i.imgur.com/gNBLY5u.png",
            1: "https://i.imgur.com/35OV3M1.png",
            2: "https://i.imgur.com/xkzgTwA.png",
            3: "https://i.imgur.com/bI9jHf9.png",
            4: "https://i.imgur.com/MlAo4va.png"
        },
        6: {
            0: "https://i.imgur.com/2qY7Z1d.png",
            1: "https://i.imgur.com/Pm3OYMT.png",
            2: "https://i.imgur.com/Q6kSHOt.png",
            3: "https://i.imgur.com/8G608bG.png",
            4: "https://i.imgur.com/iAZHWcA.png",
            5: "https://i.imgur.com/caZ0EgU.png",
            6: "https://i.imgur.com/5gmwBJT.png"
        },
        8: {
            0: "https://i.imgur.com/T2TInVp.png",
            1: "https://i.imgur.com/azFyWrR.png",
            2: "https://i.imgur.com/RJhH3Ie.png",
            3: "https://i.imgur.com/vlfB4n5.png",
            4: "https://i.imgur.com/mNWSJiU.png",
            5: "https://i.imgur.com/IVJM1ZN.png",
            6: "https://i.imgur.com/vdGUUar.png",
            7: "https://i.imgur.com/yiO8bZO.png",
            8: "https://i.imgur.com/MVGpCdo.png"
        },
        12: {
            0: "https://i.imgur.com/qIrst5B.jpeg",
            1: "https://i.imgur.com/PLqf9Aq.jpeg",
            2: "https://i.imgur.com/TpveN48.jpeg",
            3: "https://i.imgur.com/ULWMMDC.jpeg",
            4: "https://i.imgur.com/dKbOGFt.jpeg",
            5: "https://i.imgur.com/oICwLFl.jpeg",
            6: "https://i.imgur.com/0suG0iZ.jpeg",
            7: "https://i.imgur.com/BON6Da3.jpeg",
            8: "https://i.imgur.com/YHB92cr.jpeg",
            9: "https://i.imgur.com/7ZA6Jxe.jpeg",
            10: "https://i.imgur.com/Vt0AwWc.jpeg",
            11: "https://i.imgur.com/SchHfQ1.jpeg",
            12: "https://i.imgur.com/RsEewAm.jpeg"
        }
    }              
}

class Circle {
    static circleDatabase = {};
    img = undefined;

    constructor(size, ticks, color) {
        this.circleSize = size;
        this.circleTicks = ticks;
        this.circleColor = color;
        Circle.circleDatabase[this.generateName()] = this;
    }
    generateName() {
        const circleCount = Object.keys(Circle.circleDatabase).length + 1;
        return `Circle${circleCount}`;
    }
}

function circleCheck(size, ticks, color) {
    if (circleDatabase.hasOwnProperty(color)) {
        if (circleDatabase[color].hasOwnProperty(size)) {
            if (circleDatabase[color][size].hasOwnProperty(ticks)) {
                return circleDatabase[color][size][ticks];
            } else {
                console.log("Ticks value not found in the database.");
                return null;
            }
        } else {
            console.log("Size value not found in the database.");
            return null;
        }
    } else {
        console.log("Color value not found in the database.");
        return null;
    }
}

function circleSwap(i,color) {
    // Makes a new circle and swaps the image
    var name = "js-circle" + i;
    var currentCircle = document.getElementById(name);
    var newInit = currentCircle.getAttribute('data-circle');
    let newParts = newInit.split('-');
    let newSize = parseInt(newParts[0], 10);
    let newTicks = parseInt(newParts[1], 10);
    new Circle(newSize, newTicks, color);
    var img = document.getElementById(name);
    var circleImage = circleCheck(newSize,newTicks,color);
    if (circleImage) {
        img.src = circleImage;
    }
};

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


function updateSheet(id){
    var circleNos = 0;
    if (id === undefined){
        circleNos = 1;
    } else {
        circleNos = id;
    }
    var colorOrder = ["Green","Blue","Grey","Green","Blue","Grey","Green","Blue","Grey"];
    for (var i = 1; i <= circleNos; i++) {
        circleSwap(i,colorOrder[i-1]);
    }
};
