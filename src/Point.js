class BreadthPoint {
    /**
     * 
     * @param {Number} x x position
     * @param {Number} y y position
     * @param {String} type Type of point; should be 'start', 'end', 'explored', 'wall', 'path', or null
     */
    constructor(x, y, type = null) {
        this.x = x
        this.y = y
        this.left = null
        this.right = null
        this.up = null
        this.down = null
        this.parent = null
        this.type = type
    }

    getDistanceTo(x,y){
        return Math.sqrt((y-this.y)**2 + (x-this.x)**2)
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    /**
     * Returns a point's type
     * @returns int `type`, should be 'start', 'end', 'explored', 'wall', 'path', or null
     */
    getType() {
        return this.type
    }

    setType(type) {
        this.type = type
    }

    /**
     * 
     * @param {BreadthPoint} point Another point
     * @returns `true` if both points point to the same location; `false` otherwise
     */
    equals(point) {
        return point.getX() == this.x && point.getY() == this.y
    }

    copy(type) {
        return new BreadthPoint(this.x, this.y, type)
    }

    setLeft(left) {
        this.left = left
    }

    setRight(right) {
        this.right = right
    }

    setUp(up) {
        this.up = up
    }

    setDown(down) {
        this.down = down
    }

    getLeft() {
        return this.left
    }

    getRight() {
        return this.right
    }

    getUp() {
        return this.up
    }

    getDown() {
        return this.down
    }

    setParent(parent) {
        this.parent = parent
    }

    getParent() {
        return this.parent
    }


    getAllLeaves() {
        let leaves = []
        this.getAllLeavesHelper(this, leaves)
        return leaves
    }

    getAllLeavesHelper(leaf, leaves) {
        if (leaf.getLeft() == null && leaf.getRight() == null && leaf.getUp() == null && leaf.getDown() == null) {
            leaves.push(leaf)
        }
        if (leaf.getLeft() != null) {
            this.getAllLeavesHelper(leaf.getLeft(), leaves)
        }
        if (leaf.getRight() != null) {
            this.getAllLeavesHelper(leaf.getRight(), leaves)
        }
        if (leaf.getUp() != null) {
            this.getAllLeavesHelper(leaf.getUp(), leaves)
        }
        if (leaf.getDown() != null) {
            this.getAllLeavesHelper(leaf.getDown(), leaves)
        }
    }

    toString(){
        return this.x+", "+this.y+" TYPE: "+this.type
    }
}

class DijkstraPoint extends BreadthPoint {
    constructor(x, y, type = null) {
        super(x, y, type)
        this.distance = 0
    }

    copy(type) {
        return new DijkstraPoint(this.x, this.y, type)
    }

    getDistance() {
        return this.distance
    }

    setDistance(distance) {
        this.distance = distance
    }
}