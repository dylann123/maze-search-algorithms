class GameMap {
    constructor() {
        this.WIDTH = 100
        this.HEIGHT = 100

        this.START = new BreadthPoint(parseInt(Math.random() * 100), parseInt(Math.random() * 100), 'start')
        this.END = new BreadthPoint(parseInt(Math.random() * 100), parseInt(Math.random() * 100), 'end')

        this.saved_map = []
        this.map = []
        for (let i = 0; i < this.HEIGHT; i++) {
            this.map.push([])
            this.saved_map.push([])
            for (let j = 0; j < this.WIDTH; j++) {
                if (Math.random() > 0.8) {
                    this.map[i].push(new BreadthPoint(j, i, 'wall'))
                    this.saved_map[i].push(new BreadthPoint(j,i,'wall'))
                }
                else {
                    this.map[i].push(new BreadthPoint(j, i, null))
                    this.saved_map[i].push(new BreadthPoint(j,i,null))
                }
            }
        }

        this.setPoint(this.START.getX(), this.START.getY(), this.START)
        this.setPoint(this.END.getX(), this.END.getY(), this.END)
        this.saved_map[this.START.getY()][this.START.getX()] = this.START
        this.saved_map[this.END.getY()][this.END.getX()] = this.END
    }

    getPoint(x, y) {
        if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT)
            return null

        return this.map[y][x]
    }

    setPoint(x, y, val) {
        this.map[y][x] = val
    }

    /**
     * Returns the array of poitns
     * @returns {Array<Array<BreadthPoint>>} 2d point array
     */
    getMap() {
        return this.map
    }

    clearMap(){
        for(let row = 0; row < this.saved_map.length; row++){
            for(let col = 0; col < this.saved_map[0].length; col++){
                this.map[row][col] = new BreadthPoint(this.saved_map[row][col].getX(), this.saved_map[row][col].getY(), this.saved_map[row][col].getType())
            }
        }
    }
}
