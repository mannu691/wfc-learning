
const W = 400;
const SIZE = 40;
let tileWidth = 0;

const tiles = [];
const images = [];
let grid = [];


function preload() {
    images[0] = loadImage('tiles/blank.png');
    images[1] = loadImage('tiles/down.png');

}


function setup() {
    tileWidth = W / SIZE;
    tiles[0] = new Tile(images[0], ["0", "0", "0", "0"]);
    tiles[1] = new Tile(images[1], ["0", "1", "1", "1"]);
    tiles[2] = new Tile(images[1], ["0", "1", "1", "1"]).rotate(1);
    tiles[3] = new Tile(images[1], ["0", "1", "1", "1"]).rotate(2);
    tiles[4] = new Tile(images[1], ["0", "1", "1", "1"]).rotate(3);
    fillGrid();
    for (const tile of tiles) {
        tile.analyze(tiles);
    }
    console.table(tiles);

    createCanvas(W, W);
}
function fillGrid(){
    for (let i = 0; i < SIZE * SIZE; i++) {
        grid[i] = new Cell(false, Array.from(tiles.keys()));
    }
}

function mousePressed() {
    redraw();
}
function draw() {
    background(200);
    for (let j = 0; j < SIZE; j++) {
        for (let i = 0; i < SIZE; i++) {
            const index = i + j * SIZE;
            const cell = grid[index];
            if (cell.collapsed) {
                image(tiles[cell.available[0]].img, tileWidth * i, tileWidth * j, tileWidth, tileWidth);
            } else {
                fill(0);
                stroke(150)
                rect(tileWidth * i, tileWidth * j, tileWidth, tileWidth);
            }
        }
    }
    if (!collapseRandom()) return;
    grid = nextGeneration();
    // console.table(grid);
    // noLoop();
}


function checkValidation(arr, valid) {
    for (let k = arr.length - 1; k >= 0; k--) {
        if (!valid.includes(arr[k])) {
            arr.splice(k, 1);
        }
    }
}

function nextGeneration() {
    const next = [];
    for (let j = 0; j < SIZE; j++) {
        for (let i = 0; i < SIZE; i++) {
            const index = i + j * SIZE;
            const cell = grid[index];
            if (cell.collapsed) {
                next[index] = cell;
            } else {
                const options = cell.available.slice();
                //Check above
                if (j > 0) {
                    const secondCell = grid[i + (j - 1) * SIZE];
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].up)
                    }
                    checkValidation(options, valid);
                }
                //Check down
                if (j < SIZE - 1) {
                    const secondCell = grid[i + (j + 1) * SIZE];
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].down)
                    }
                    checkValidation(options, valid);
                }
                //Check left
                if (i > 0) {
                    const secondCell = grid[i - 1 + j * SIZE];
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].right)
                    }
                    checkValidation(options, valid);
                }
                //Check right
                if (i < SIZE - 1) {
                    const secondCell = grid[i + 1 + j * SIZE];
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].left)
                    }
                    checkValidation(options, valid);
                }

                next[index] = new Cell(false, options);

            }
        }
    }
    return next;
}


function collapseRandom(rec) {
    let sorted = grid.slice().filter((v) => !v.collapsed);
    if (sorted.length < 1) return false;
    sorted = sorted.sort((a, b) => a.available.length - b.available.length);

    let stopI = 0;
    let first = sorted[0].available.length;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].available.length > first) {
            stopI = i;
            break;
        }
    }
    if (stopI > 0) {
        sorted.splice(stopI);
    }

    if(rec != undefined){
        sorted.splice(rec,1);
    }

    if(sorted.length < 1){
        //start over
        console.log("[WFC] Starting Over..")
        fillGrid();
        return true;
    }

    const i = randomI(sorted.length);
    const pick = sorted[i];
    const rnd = getRnd(pick.available);

    if(rnd == undefined){
        console.log("[WFC] Reloading Available possibilities..")
        return collapseRandom(i);
    }

    pick.available = [rnd];
    pick.collapsed = true;
    return true;
}

function getRnd(arr) {
    if (arr.length < 1) return undefined;
    const i = randomI(arr.length);
    
    let res = arr[i];
    if (res == undefined) {
        return getRnd(arr.slice().splice(i, 1));
    }
    return res;
}
function randomI(max) {
    return Math.floor(Math.random() * max);
}