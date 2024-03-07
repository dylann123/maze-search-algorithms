try {
    let mode = "breadth"
    const canvas = document.getElementsByTagName("canvas")[0]
    const ctx = canvas.getContext('2d')
    const searched = document.getElementById("searched")
    const pathl = document.getElementById("path")
    let game = new Game(700, 700)
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx)
        searched.innerHTML = "Points searched: " + game.pointsSearched
        pathl.innerHTML = "Path length: " + game.pathLength
    }, 1000 / 60);

    const mouseCoords = document.getElementById("coords")
    canvas.onmousemove = (e) => {
        let x = Math.floor((e.clientX - canvas.getBoundingClientRect().left) / (game.width / game.map.WIDTH))
        let y = Math.floor((e.clientY - canvas.getBoundingClientRect().top) / (game.height / game.map.HEIGHT))
        mouseCoords.innerText = "Mouse: " + x + " " + y
    }

    for (let btn of document.getElementsByTagName("input")) {
        btn.onclick = () => {
            if (btn.type == "radio") {
                mode = btn.value
                document.getElementById("description").innerText = btn.dataset.description
            }
        }
    }
    document.getElementById("flod").click()

    document.getElementById("start").onclick = () => {
        game.stopSolve()
        game.map.clearMap()
        setTimeout(() => {
            let speed = 250 - (document.getElementById("speed").value * 50)
            if(speed == 50)
                speed = 1
            switch (mode) {
                case "dijkstras":
                    game.dijkstra(speed)
                    break
                case "greedy":
                    game.greedy(speed)
                    break
                case "astar":
                    game.aStar(speed)
                    break
                case "breadth":
                    game.breadthFirst(speed)
                    break
            }
            document.getElementById("start").ariaDisabled = true
            setTimeout(() => {
                document.getElementById("start").ariaDisabled = false
            }, 10000);
        }, 50);
    }
    document.getElementById("newmaze").onclick = () => {
        game = new Game(700, 700)
        game.stopSolve()
    }
}
catch (e) {
    alert(e.stack)
}
