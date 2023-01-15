class Tile {
    constructor(img, edges, rotate = false, fullRotate = true) {
        this.img = img;
        this.edges = edges;
        this.up = []
        this.down = []
        this.right = []
        this.left = []
        this.shouldRotate = rotate;
        this.fullRotate = fullRotate;
    }

    rotate(num) {
        const w = this.img.width;
        const h = this.img.height;
        const nImg = createGraphics(w, h);
        nImg.imageMode(CENTER);
        nImg.translate(w / 2, h / 2);
        nImg.rotate(HALF_PI * num);
        nImg.image(this.img, 0, 0);
        const newEdges = [];
        const len = this.edges.length;
        for (let i = 0; i < len; i++) {
            newEdges[i] = this.edges[(i - 1 + len) % len];
        }

        return new Tile(nImg, newEdges);
    }


    analyze(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (tile.edges[0] == reverseString(this.edges[2])) {
                this.up.push(i);
            }
            if (tile.edges[2] == reverseString(this.edges[0])) {
                this.down.push(i);
            }
            if (tile.edges[1] == reverseString(this.edges[3])) {
                this.left.push(i);
            }
            if (tile.edges[3] == reverseString(this.edges[1])) {
                this.right.push(i);
            }

        }
    }
}
function reverseString(str) {
    
    return str.split("").reverse().join("");
}
