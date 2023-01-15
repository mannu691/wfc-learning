
const W = 500;
const SIZE = 20;
const ASSET = "./tiles/Circuit/"
let tileWidth = 0;

const tiles = [];
const images = [];
let grid = [];
const DUMMY = []

function preload() {

    for (let i = 0; i < 14; i++) {
        images[i] = loadImage(ASSET + (i + 1) + '.png');
    }
}


function setup() {
    tileWidth = W / SIZE;
    tiles.push(new Tile(images[0], ["BCB", "BGB", "BCB", "BGB"], true, false));
    tiles.push(new Tile(images[1], ["DDD", "DDD", "DDD", "DDD"]));
    tiles.push(new Tile(images[2], ["BCB", "BBD", "DDD", "DBB"], true));
    tiles.push(new Tile(images[3], ["BBB", "BBB", "BBD", "DBB"], true));
    tiles.push(new Tile(images[4], ["BCB", "BCB", "BCB", "BCB"], true, false));
    tiles.push(new Tile(images[5], ["BCB", "BCB", "BBB", "BBB"], true));
    tiles.push(new Tile(images[6], ["BBB", "BBB", "BBB", "BBB"]));
    tiles.push(new Tile(images[7], ["BBB", "BCB", "BCB", "BCB"], true));
    tiles.push(new Tile(images[8], ["BCB", "BBB", "BCB", "BBB"], true, false));
    tiles.push(new Tile(images[9], ["BGB", "BBB", "BCB", "BBB"], true));
    tiles.push(new Tile(images[10], ["BCB", "BCB", "BBB", "BBB"], true));
    tiles.push(new Tile(images[11], ["BBB", "BCB", "BBB", "BCB"], true, false));
    tiles.push(new Tile(images[12], ["BCB", "BBB", "BBB", "BBB"], true));
    tiles.push(new Tile(images[13], ["BBB", "BGB", "BBB", "BGB"], true, false));

    // console.log();
    // const a = tiles[2].edges;
    // console.log(a);
    // const b = tiles[2].rotate(1);
    // console.log(b.edges);
    // const c = b.rotate(1).edges;
    // console.log(c);
    // console.log(a);
    for (const tile of tiles) {
        if (tile.shouldRotate) {
            const a = tile.rotate(1);
            tiles.push(a);
            if (tile.fullRotate) {
                const b = a.rotate(1);
                tiles.push(b);
                tiles.push(b.rotate(1));
            }
        }
    }

    let i = 0;
    for (const tile of tiles) {
        tile.analyze(tiles);
        DUMMY.push(i);
        i++;
    }
    fillGrid();
    console.table(tiles);

    createCanvas(W, W);
}
function fillGrid() {
    grid = [];
    // for (let i = 0; i < SIZE * SIZE; i++) {
    //     grid[i] = new Cell(false, Array.from(tiles.keys()));
    // }
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
            if (cell == undefined || !cell.collapsed) {
                fill(0);
                stroke(150)
                rect(tileWidth * i, tileWidth * j, tileWidth, tileWidth);
            }
            else {
                image(tiles[cell.available[0]].img, tileWidth * i, tileWidth * j, tileWidth, tileWidth);
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
            const cell = getCell(index);
            if (cell.collapsed) {
                next[index] = cell;
            } else {
                const options = cell.available.slice();

                //Check above
                if (j > 0) {
                    const secondCell = getCell(i + (j - 1) * SIZE);
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].up)
                    }
                    checkValidation(options, valid);
                }
                //Check down
                if (j < SIZE - 1) {
                    const secondCell = getCell(i + (j + 1) * SIZE);
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].down)
                    }
                    checkValidation(options, valid);
                }
                //Check left
                if (i > 0) {
                    const secondCell = getCell(i - 1 + j * SIZE);
                    let valid = [];
                    for (const avl of secondCell.available) {
                        valid = valid.concat(tiles[avl].right)
                    }
                    checkValidation(options, valid);
                }
                //Check right
                if (i < SIZE - 1) {
                    const secondCell = getCell(i + 1 + j * SIZE);
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


function collapseRandom() {
    if (grid.length == 0) {
        grid[0] = getCell(0);
    }
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

    const i = randomI(sorted.length);
    const pick = sorted[i];
    const rnd = getRnd(pick.available);

    if (rnd == undefined) {
        fillGrid();
        console.log("[WFC] Starting Over..")
        return false;
    }

    pick.available = [rnd];
    pick.collapsed = true;
    return true;
}

function getRnd(arr, rec) {
    if (arr.length < 1 || (rec != undefined && rec.length < 1)) return undefined;

    if (rec != undefined) {
        const i = randomI(rec.length);
        let res = arr[rec[i]];
        if (res == undefined) {
            return getRnd(arr, rec.splice(i, 1));
        }
        return res;
    } else {
        const i = randomI(arr.length);
        let res = arr[i];
        if (res == undefined) {
            return getRnd(arr, Array.from(arr.keys()).splice(i, 1));
        }
        return res;
    }
}
function randomI(max) {
    return Math.floor(Math.random() * max);
}
function getCell(index) {
    const c = grid[index];
    if (c == undefined) {
        const v = new Cell(false, DUMMY);
        grid[index] = v;
        return v;
    } return c;
}