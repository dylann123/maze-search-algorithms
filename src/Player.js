class Player{
    constructor(startx,starty){
        this.x = startx
        this.y = starty
    }

    up(){
        this.y--
    }

    down(){
        this.y++
    }

    left(){
        this.x--
    }

    right(){
        this.x++
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }

    setX(x){
        this.x = x
    }

    setY(y){
        this.y = y
    }
}