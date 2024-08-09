//Global Variables
var CircleSize = '';
var CircleTicks = '';

var circleDatabase = {
    3: {0: "https://i.imgur.com/EuNDi3m.png", 
        1: "https://i.imgur.com/dp6fbCp.png", 
        2: '', 
        3: ''},
    4: {0: '',
        1: '',
        2: '',
        3: '',
        4: ''}
};

function circleCheck(size, ticks) {
    if (circleDatabase.hasOwnProperty(size)) {
        if (circleDatabase[size].hasOwnProperty(ticks)) {
            return circleDatabase[size][ticks];
        } else {
            console.log("Ticks value not found in the database.");
            return null;
        }
    } else {
        console.log("Size value not found in the database.");
        return null;
    }
}


function circleSwap() {
        var img = document.getElementById('Circle1');
        var size = parseInt(document.getElementById('circle-size-1').value, 10);
        var ticks = parseInt(document.getElementById('circle-tick-1').value, 10);

        var circleImage = circleCheck(size,ticks);
        if (circleImage) {
            img.src = circleImage;
        }
};

function updateSheet(){
circleSwap();
};

window.onload = function() {
    updateSheet();
};