class Tile {
    constructor(img, edges) {
        this.img = img;
        this.edges = edges;
        this.up = []
        this.down = []
        this.right = []
        this.left = []
    }

    rotate(num) {
        const w = this.img.width;
        const h = this.img.height;
        const nImg = createGraphics(w, h);
        nImg.imageMode(CENTER);
        nImg.translate(w / 2, h / 2);
        nImg.rotate(HALF_PI * num);
        nImg.image(this.img, 0, 0);
        const nOptions = moveArr(this.edges, num);
        return new Tile(nImg, nOptions);
    }


    analyze(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (tile.edges[0] == this.edges[2]) {
                this.up.push(i);
            }
            if (tile.edges[2] == this.edges[0]) {
                this.down.push(i);
            }
            if (tile.edges[3] == this.edges[1]) {
                this.left.push(i);
            }
            if (tile.edges[1] == this.edges[3]) {
                this.right.push(i);
            }

        }
    }
}
function reverseString(str) {
    return ("" + str).split("").reverse().join("");
}
function moveArr(arr, num) {
    if (num < 1) {

        return arr;
    }
    else if (num > 1) {
        var nArr = arr;
        for (let i = 0; i < num; i++) {
            nArr = moveArr(nArr, 1);
        }
        return nArr;
    } else {

        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                newArr[i] = arr[0];
            } else {
                newArr[i] = arr[i + 1];
            }
        }
        return newArr;
    }
}