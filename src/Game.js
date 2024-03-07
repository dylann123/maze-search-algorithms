class Game {
    constructor(w, h) {
        this.width = w
        this.height = h
        this.player = new Player(0, 0)
        this.map = new GameMap()

        this.solved = false;
        this.pointsSearched = 0
        this.pathLength = 0

        this.running = true
    }

    /**
     * Draws the map
     * @param {CanvasRenderingContext2D} ctx Canvas context
     */
    draw(ctx) {
        try {
            let blockWidth = this.width / this.map.WIDTH
            let blockHeight = this.height / this.map.HEIGHT
            let map = this.map.getMap()
            ctx.fillStyle = "black"

            for (let row = 0; row < map.length; row++) {
                for (let col = 0; col < map[0].length; col++) {
                    if (map[row][col].getType == undefined)
                        alert(map[row][col])
                    switch (map[row][col].getType()) {
                        case 'start':
                            ctx.fillStyle = "blue"
                            break
                        case 'end':
                            ctx.fillStyle = "red"
                            break
                        case 'explored':
                            ctx.fillStyle = "gold"
                            break
                        case 'wall':
                            ctx.fillStyle = "black"
                            break
                        case 'path':
                            ctx.fillStyle = "green"
                            break
                        default:
                            ctx.fillStyle = "white"
                    }
                    if (map[row][col].getDistance && map[row][col].getType() != 'path') {
                        let distance = map[row][col].getDistance()
                        // yellow to white
                        let color = `rgb(125,${255 * (distance / 150)},${255 * (distance / 150)})`
                        ctx.fillStyle = color
                    }
                    ctx.fillRect(col * blockWidth, row * blockHeight, blockWidth, blockHeight)
                }
            }
        } catch (e) {
            alert(e.stack)
        }
    }
    async dijkstra(speed) {
        this.pointsSearched = 0
        this.pathLength = 0
        this.solved = false
        this.running = true
        let nodes = [new DijkstraPoint(this.map.START.getX(), this.map.START.getY(), 'explored')]
        console.log("Start value is at " + this.map.START.getX() + " " + this.map.START.getY());
        while (!this.solved && this.running) {
            await (() => {
                return new Promise((resolve) => {
                    this.dijkstraTick(nodes).then(() => {
                        if (speed == 0)
                            resolve()
                        else
                            setTimeout(resolve, speed)
                    })
                })
            })()
        }
    }
    async dijkstraTick(nodes) {
        let len = nodes.length
        let end = null
        for (let index = 0; index < len; index++) {
            let node = nodes[0]

            let left = this.map.getPoint(node.getX() - 1, node.getY())
            let right = this.map.getPoint(node.getX() + 1, node.getY())
            let up = this.map.getPoint(node.getX(), node.getY() - 1)
            let down = this.map.getPoint(node.getX(), node.getY() + 1)

            if (left != null && left.getType() == null) {
                left = new DijkstraPoint(left.getX(), left.getY(), 'explored')
                left.setDistance((node.getDistance() + 1) || 1)
                this.map.setPoint(left.getX(), left.getY(), left)
                nodes.push(left)
                this.pointsSearched++
            } else if (left != null && left.getType() == 'end') {
                end = left
                break
            }
            if (right != null && right.getType() == null) {
                right = new DijkstraPoint(right.getX(), right.getY(), 'explored')
                right.setDistance((node.getDistance() + 1) || 1)
                this.map.setPoint(right.getX(), right.getY(), right)
                nodes.push(right)
                this.pointsSearched++
            } else if (right != null && right.getType() == 'end') {
                end = right
                break
            }
            if (up != null && up.getType() == null) {
                up = new DijkstraPoint(up.getX(), up.getY(), 'explored')
                up.setDistance((node.getDistance() + 1) || 1)
                this.map.setPoint(up.getX(), up.getY(), up)
                nodes.push(up)
                this.pointsSearched++
            } else if (up != null && up.getType() == 'end') {
                end = up
                break
            }
            if (down != null && down.getType() == null) {
                down = new DijkstraPoint(down.getX(), down.getY(), 'explored')
                down.setDistance((node.getDistance() + 1) || 1)
                this.map.setPoint(down.getX(), down.getY(), down)
                nodes.push(down)
                this.pointsSearched++
            } else if (down != null && down.getType() == 'end') {
                end = down
                break
            }

            nodes.shift()
        }
        if (end != null) {
            let current = end
            while (current.getType() != 'start') {
                let closest = null
                let distance = Infinity
                let left = this.map.getPoint(current.getX() - 1, current.getY())
                let right = this.map.getPoint(current.getX() + 1, current.getY())
                let up = this.map.getPoint(current.getX(), current.getY() - 1)
                let down = this.map.getPoint(current.getX(), current.getY() + 1)
                if (left != null && left.getType() == 'explored' && left.getDistance() < distance) {
                    closest = left
                    distance = left.getDistance()
                }
                if (right != null && right.getType() == 'explored' && right.getDistance() < distance) {
                    closest = right
                    distance = right.getDistance()
                }
                if (up != null && up.getType() == 'explored' && up.getDistance() < distance) {
                    closest = up
                    distance = up.getDistance()
                }
                if (down != null && down.getType() == 'explored' && down.getDistance() < distance) {
                    closest = down
                    distance = down.getDistance()
                }
                if (closest == null)
                    break
                closest.setType('path')
                this.pathLength++
                current = closest
                if (current.getDistance() == 1)
                    break
            }
            this.solved = true
        }

    }
    async greedy(speed) {
        this.pointsSearched = 0
        this.pathLength = 0
        this.solved = false
        this.running = true
        let path = [new DijkstraPoint(this.map.START.getX(), this.map.START.getY(), 'explored')]
        console.log("Start value is at " + this.map.START.getX() + " " + this.map.START.getY());
        while (!this.solved && this.running) {
            await (() => {
                return new Promise((resolve) => {
                    this.greedyTick(path).then(() => {
                        if (speed == 0)
                            resolve()
                        else
                            setTimeout(resolve, speed)
                    })
                })
            })()
        }
    }
    // uses a stack with top @ path[length-1]
    /**
     * 
     * @param {Array<DijkstraPoint>} path 
     * @returns 
     */
    async greedyTick(path) {
        try {
            let node = path[path.length - 1]
            if (node == undefined) {
                this.solved = true
                alert("Impossible")
                return
            }

            if (node.getDistanceTo(this.map.END.getX(), this.map.END.getY()) == 1) {
                this.solved = true
                return
            }

            let closestDist = Infinity
            let closestNode = null
            const left = this.map.getPoint(node.getX() - 1, node.getY())
            const right = this.map.getPoint(node.getX() + 1, node.getY())
            const up = this.map.getPoint(node.getX(), node.getY() - 1)
            const down = this.map.getPoint(node.getX(), node.getY() + 1)

            if (left != null && left.getType() == null) {
                if (left.getDistanceTo(this.map.END.getX(), this.map.END.getY()) < closestDist || closestNode == null) {
                    closestDist = left.getDistanceTo(this.map.END.getX(), this.map.END.getY())
                    closestNode = left
                }
            }
            if (right != null && right.getType() == null) {
                if (right.getDistanceTo(this.map.END.getX(), this.map.END.getY()) < closestDist || closestNode == null) {
                    closestDist = right.getDistanceTo(this.map.END.getX(), this.map.END.getY())
                    closestNode = right
                }
            }
            if (up != null && up.getType() == null) {
                if (up.getDistanceTo(this.map.END.getX(), this.map.END.getY()) < closestDist || closestNode == null) {
                    closestDist = up.getDistanceTo(this.map.END.getX(), this.map.END.getY())
                    closestNode = up
                }
            }
            if (down != null && down.getType() == null) {
                if (down.getDistanceTo(this.map.END.getX(), this.map.END.getY()) < closestDist || closestNode == null) {
                    closestDist = down.getDistanceTo(this.map.END.getX(), this.map.END.getY())
                    closestNode = down
                }
            }
            if (closestNode != null) {
                closestNode = closestNode.copy('path')
                this.map.setPoint(closestNode.getX(), closestNode.getY(), closestNode)
                path.push(closestNode)
                this.pathLength++
                this.pointsSearched++
            } else {
                path.pop()
            }
        } catch (e) {
            alert(e.stack)
        }
    }
    async breadthFirst(speed) {
        this.pointsSearched = 0
        this.pathLength = 0
        this.solved = false
        this.running = true
        let startnode = this.map.START.copy('explored')
        console.log("Start value is at " + this.map.START.getX() + " " + this.map.START.getY());
        while (!this.solved && this.running) {
            await (() => {
                return new Promise((resolve) => {
                    this.breadthFirstTick(startnode).then(() => {
                        if (speed == 0)
                            resolve()
                        else
                            setTimeout(resolve, speed)
                    })
                })
            })()
        }
    }
    async breadthFirstTick(startnode) {
        let leaves = startnode.getAllLeaves()
        let found = null
        for (let leaf of leaves) {
            const left = this.map.getPoint(leaf.getX() - 1, leaf.getY())
            const right = this.map.getPoint(leaf.getX() + 1, leaf.getY())
            const up = this.map.getPoint(leaf.getX(), leaf.getY() - 1)
            const down = this.map.getPoint(leaf.getX(), leaf.getY() + 1)

            // left
            if (left != null && left.getType() == null) {
                let point = left.copy('explored')
                point.setParent(leaf)
                leaf.setLeft(point)
                this.map.setPoint(point.getX(), point.getY(), point)
                this.pointsSearched++
            } else if (left != null && left.getType() == 'end') {
                found = leaf
                break
            }
            // right
            if (right != null && right.getType() == null) {
                let point = right.copy('explored')
                point.setParent(leaf)
                leaf.setRight(point)
                this.map.setPoint(point.getX(), point.getY(), point)
                this.pointsSearched++
            } else if (right != null && right.getType() == 'end') {
                found = leaf
                break
            }
            // up
            if (up != null && up.getType() == null) {
                let point = up.copy('explored')
                point.setParent(leaf)
                leaf.setUp(point)
                this.map.setPoint(point.getX(), point.getY(), point)
                this.pointsSearched++
            } else if (up != null && up.getType() == 'end') {
                found = leaf
                break
            }
            // down
            if (down != null && down.getType() == null) {
                let point = down.copy('explored')
                point.setParent(leaf)
                leaf.setDown(point)
                this.map.setPoint(point.getX(), point.getY(), point)
                this.pointsSearched++
            } else if (down != null && down.getType() == 'end') {
                found = leaf
                break
            }
        }
        if (found != null) {
            console.log(found);
            this.pathLength--
            let current = found
            while (current != null && current.getType() != 'start') {
                current.setType('path')
                current = current.getParent()
                this.pathLength++
            }
            this.solved = true
        }
    }

    async aStar(speed) {
        this.pointsSearched = 0
        this.pathLength = 0
        this.solved = false
        this.running = true
        let nodes = [new DijkstraPoint(this.map.START.getX(), this.map.START.getY(), 'explored')]
        nodes[0].setDistance(0)
        console.log("Start value is at " + this.map.START.getX() + " " + this.map.START.getY());
        while (!this.solved && this.running) {
            await (() => {
                return new Promise((resolve) => {
                    this.aStarHelper(nodes).then(() => {
                        if (speed == 0)
                            resolve()
                        else
                            setTimeout(resolve, speed)
                    })
                })
            })()
        }
    }

    async aStarHelper(nodes) {
        function getManhattanDistance(x1, y1, x2, y2) {
            return Math.abs(y2 - y1) + Math.abs(x2 - x1)
        }
        try {
            let bestPoint = null
            let bestPointHeuristic = Infinity
            for (let i = 0; i < nodes.length; i++) {
                let left = this.map.getPoint(nodes[i].getX() - 1, nodes[i].getY())
                let right = this.map.getPoint(nodes[i].getX() + 1, nodes[i].getY())
                let up = this.map.getPoint(nodes[i].getX(), nodes[i].getY() - 1)
                let down = this.map.getPoint(nodes[i].getX(), nodes[i].getY() + 1)

                if ((left == null || left.getType() != null) &&
                    (right == null || right.getType() != null) &&
                    (up == null || up.getType() != null) &&
                    (down == null || down.getType() != null)) {
                    nodes.splice(i, 1);
                    i--
                    continue
                }

                if (left && left.getType() == 'end' || up && up.getType() == 'end' || right && right.getType() == 'end' || down && down.getType() == 'end') {
                    this.solved = true
                    break
                }


                if (left != null && left.getType() == null) {
                    let heuristic = getManhattanDistance(left.getX(), left.getY(), this.map.END.getX(), this.map.END.getY()) + nodes[i].getDistance() + 1
                    if (heuristic < bestPointHeuristic) {
                        left = new DijkstraPoint(left.getX(), left.getY(), null)
                        this.map.setPoint(left.getX(), left.getY(), left)
                        bestPoint = left
                        bestPointHeuristic = heuristic
                        bestPoint.setDistance(nodes[i].getDistance() + 1)
                    }
                }
                if (right != null && right.getType() == null) {
                    let heuristic = getManhattanDistance(right.getX(), right.getY(), this.map.END.getX(), this.map.END.getY()) + nodes[i].getDistance() + 1
                    if (heuristic < bestPointHeuristic) {
                        right = new DijkstraPoint(right.getX(), right.getY(), null)
                        this.map.setPoint(right.getX(), right.getY(), right)
                        bestPoint = right
                        bestPointHeuristic = heuristic
                        bestPoint.setDistance(nodes[i].getDistance() + 1)
                    }
                }
                if (up != null && up.getType() == null) {
                    let heuristic = getManhattanDistance(up.getX(), up.getY(), this.map.END.getX(), this.map.END.getY()) + nodes[i].getDistance() + 1
                    if (heuristic < bestPointHeuristic) {
                        up = new DijkstraPoint(up.getX(), up.getY(), null)
                        this.map.setPoint(up.getX(), up.getY(), up)
                        bestPoint = up
                        bestPointHeuristic = heuristic
                        bestPoint.setDistance(nodes[i].getDistance() + 1)
                    }
                }
                if (down != null && down.getType() == null) {
                    let heuristic = getManhattanDistance(down.getX(), down.getY(), this.map.END.getX(), this.map.END.getY()) + nodes[i].getDistance() + 1
                    if (heuristic < bestPointHeuristic) {
                        down = new DijkstraPoint(down.getX(), down.getY(), null)
                        this.map.setPoint(down.getX(), down.getY(), down)
                        bestPoint = down
                        bestPointHeuristic = heuristic
                        bestPoint.setDistance(nodes[i].getDistance() + 1)
                    }
                }
            }
            if (this.solved) {
                let current = this.map.END
                while (current.getType() != 'start') {
                    let closest = null
                    let distance = Infinity
                    let left = this.map.getPoint(current.getX() - 1, current.getY())
                    let right = this.map.getPoint(current.getX() + 1, current.getY())
                    let up = this.map.getPoint(current.getX(), current.getY() - 1)
                    let down = this.map.getPoint(current.getX(), current.getY() + 1)
                    if (left != null && left.getType() == 'explored' && left.getDistance() < distance) {
                        closest = left
                        distance = left.getDistance()
                    }
                    if (right != null && right.getType() == 'explored' && right.getDistance() < distance) {
                        closest = right
                        distance = right.getDistance()
                    }
                    if (up != null && up.getType() == 'explored' && up.getDistance() < distance) {
                        closest = up
                        distance = up.getDistance()
                    }
                    if (down != null && down.getType() == 'explored' && down.getDistance() < distance) {
                        closest = down
                        distance = down.getDistance()
                    }
                    if (closest == null)
                        break
                    closest.setType('path')
                    this.pathLength++
                    current = closest
                    if (current.getDistance() == 1)
                        break
                }
                this.solved = true
            }
            else {
                this.pointsSearched++
                bestPoint.setType('explored')
                nodes.push(bestPoint)
                this.map.setPoint(bestPoint.getX(), bestPoint.getY(), bestPoint)
            }
        } catch (e) {
            alert("oops")
        }
    }

    getDistanceToNode(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    stopSolve() {
        this.running = false
    }
}