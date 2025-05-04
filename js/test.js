let size = 4;
let board = "";
let tile = 1;
let count = true;
for (let row = 1; row < size; row++) {
    if (row % 2 == 0) {
        // Even rows
        for (let column = 1; column < size; column++) {
            let add = count ? " " : "#";
            board += add;
            count = !count; //flips count
            tile++;
        }
    }
    if (row % 2 != 0) {
        // Odd rows
        for (let column = 1; column < size; column++) {
            let add = count ? "#" : " ";
            board += add;
            count = !count; //flips count
            tile++;
        }
    }
    board += "\n";
}
console.log(board);
