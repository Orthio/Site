//Global Variables

var circleDatabase = {
    Green: {
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
        }
    },
    Blue: {
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
        }
    },
    Grey: {
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
        }
    }              
};


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



function circleSwap() {
        var img1 = document.getElementById('Circle1');
        var size1 = parseInt(document.getElementById('circle-size-1').value, 10);
        var ticks1 = parseInt(document.getElementById('circle-tick-1').value, 10);

        var circleImage = circleCheck(size1,ticks1,"Green");
        if (circleImage) {
            img1.src = circleImage;
        }

        var img2 = document.getElementById('Circle2');
        var size2 = parseInt(document.getElementById('circle-size-2').value, 10);
        var ticks2 = parseInt(document.getElementById('circle-tick-2').value, 10);

        var circleImage = circleCheck(size2,ticks2,"Blue");
        if (circleImage) {
            img2.src = circleImage;
        } 

        var img3 = document.getElementById('Circle3');
        var size3 = parseInt(document.getElementById('circle-size-3').value, 10);
        var ticks3 = parseInt(document.getElementById('circle-tick-3').value, 10);

        var circleImage = circleCheck(size3,ticks3,"Grey");
        if (circleImage) {
            img3.src = circleImage;
        } 
};

function updateSheet(){
circleSwap();
};

window.onload = function() {
    updateSheet();
};