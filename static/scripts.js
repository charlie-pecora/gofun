console.log("Hello world!");

const EMPTY_CHAR = "*"
const CURRENT_LOCATION_CHAR = "x"

const currentLocation = {
    x: 0,
    y: 0
};

function setGrid() {
    console.log(userId);
    let g = document.getElementById("game-grid");
    g.style.display = "grid";
    g.style.gridTemplateColumns = "20px ".repeat(gridWidth);
    g.innerHTML = '<div class="empty-location" id="game-grid-item">*</div>'.repeat(gridWidth * gridHeight);
}

function calculateElementLocation(x, y) {
    return (y * gridWidth) + x;
}

function clamp(x, y) {
    if (x < 0) {
	x = 0;
    }
    if (x >= gridWidth) {
	x = gridWidth - 1;
    }
    if (y < 0) {
	y = 0;
    }
    if (y >= gridHeight) {
	y = gridHeight - 1;
    }
    return [x, y];

}

function setLocation(x, y) {
    [x, y] = clamp(x, y);
    console.log(`Setting position to (${x}, ${y}))`);
    const oldElementLocation = calculateElementLocation(currentLocation.x, currentLocation.y);
    const newElementLocation = calculateElementLocation(x, y);
    let g = document.getElementById("game-grid");
    let oldLocationNode = g.childNodes[oldElementLocation]
    let newLocationNode = g.childNodes[newElementLocation]
    oldLocationNode.innerText = EMPTY_CHAR;
    newLocationNode.innerText = CURRENT_LOCATION_CHAR;
    oldLocationNode.setAttribute("class", "empty-location")
    newLocationNode.setAttribute("class", "current-location")
    currentLocation.x = x;
    currentLocation.y = y;
}


setGrid();

setLocation(5, 1);

document.onkeydown = function (e) {
    switch (e.key) {
	case "ArrowLeft":
	    setLocation(currentLocation.x - 1, currentLocation.y);
	    console.log("Left Key pressed!");
	    break;
	case "ArrowRight":
	    setLocation(currentLocation.x + 1, currentLocation.y);
	    console.log("Right Key pressed!");
	    break;
	case "ArrowDown":
	    setLocation(currentLocation.x, currentLocation.y + 1);
	    console.log("Down Key pressed!");
	    break;
	case "ArrowUp":
	    setLocation(currentLocation.x, currentLocation.y - 1);
	    console.log("Up Key pressed!");
	    break;
    }
};
