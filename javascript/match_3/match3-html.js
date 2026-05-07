const colorList = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
var allTiles = [];
var firstSelection = null;
var totalMatches = 0;
var isProcessing = false;

// 1. Tile Data Object - Maps directly to your HTML Table IDs
function Tile_data(tile_color, row, col) {
    this.color = tile_color;
    this.row = row;
    this.col = col;
    this.render = function () {
        let cellId = "R" + this.row + "C" + this.col;
        let el = document.getElementById(cellId);
        if (el) {
            // Creates a button inside your <td>
            el.innerHTML = `<button id="btn${this.row}_${this.col}" 
                            onclick="handleTileClick(${this.row}, ${this.col})" 
                            style="background-color:${this.color}; width:100%; height:100%; border:none; cursor:pointer; min-height:30px;"></button>`;
        }
    };
}

// 2. The "START" function called by your HTML button
function nextStep() {
    // Reset game state
    totalMatches = 0;
    allTiles = [];
    firstSelection = null;
    isProcessing = false;
    
    document.getElementById("someTest").innerHTML = "Game Started! Match the colors.";
    document.getElementById("program_ended").innerHTML = "";
    
    initBoard();
    dispTable();
}

// 3. Initialize the grid logic
function initBoard() {
    for (let i = 0; i < 8; i++) {
        allTiles[i] = [];
        for (let j = 0; j < 8; j++) {
            allTiles[i][j] = new Tile_data(findColor(), i, j);
        }
    }
    
    // Prevent starting the game with existing matches
    let safety = 0;
    while (scanForMatches() && safety < 10) {
        processMatches();
        refillBoard();
        safety++;
    }
}

// 4. Click Handler for Swapping
function handleTileClick(r, c) {
    if (isProcessing) return;

    let clickedTile = allTiles[r][c];
    let btn = document.getElementById(`btn${r}_${c}`);

    if (!firstSelection) {
        firstSelection = clickedTile;
        if (btn) btn.style.outline = "3px solid white"; 
    } else {
        let rowDiff = Math.abs(firstSelection.row - clickedTile.row);
        let colDiff = Math.abs(firstSelection.col - clickedTile.col);

        // Adjacency check (Up, Down, Left, Right)
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            isProcessing = true;
            swapColors(firstSelection, clickedTile);
            
            if (!scanForMatches()) {
                // If no match, swap back after a delay
                setTimeout(() => {
                    swapColors(firstSelection, clickedTile);
                    firstSelection = null;
                    isProcessing = false;
                    dispTable();
                }, 400);
            } else {
                firstSelection = null;
                gameLoop();
            }
        } else {
            firstSelection = null;
            dispTable();
        }
    }
}

// 5. Recursive Game Loop for Cascading Matches
function gameLoop() {
    isProcessing = true;
    if (scanForMatches()) {
        processMatches();
        dispTable();
        
        setTimeout(() => {
            refillBoard();
            dispTable();
            setTimeout(gameLoop, 400); // Cascading check
        }, 400);
    } else {
        isProcessing = false;
        updateStatus();
    }
}

function scanForMatches() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (j < 6 && allTiles[i][j].color && allTiles[i][j].color === allTiles[i][j+1].color && allTiles[i][j].color === allTiles[i][j+2].color) return true;
            if (i < 6 && allTiles[i][j].color && allTiles[i][j].color === allTiles[i+1][j].color && allTiles[i][j].color === allTiles[i+2][j].color) return true;
        }
    }
    return false;
}

function processMatches() {
    let toRemove = Array.from({ length: 8 }, () => Array(8).fill(false));

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (j < 6 && allTiles[i][j].color && allTiles[i][j].color === allTiles[i][j+1].color && allTiles[i][j].color === allTiles[i][j+2].color) {
                toRemove[i][j] = toRemove[i][j+1] = toRemove[i][j+2] = true;
            }
            if (i < 6 && allTiles[i][j].color && allTiles[i][j].color === allTiles[i+1][j].color && allTiles[i][j].color === allTiles[i+2][j].color) {
                toRemove[i][j] = toRemove[i+1][j] = toRemove[i+2][j] = true;
            }
        }
    }

    toRemove.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                allTiles[i][j].color = null;
                totalMatches++;
            }
        });
    });
}

function refillBoard() {
    for (let j = 0; j < 8; j++) {
        for (let i = 7; i >= 0; i--) {
            if (allTiles[i][j].color === null) {
                for (let k = i - 1; k >= 0; k--) {
                    if (allTiles[k][j].color !== null) {
                        allTiles[i][j].color = allTiles[k][j].color;
                        allTiles[k][j].color = null;
                        break;
                    }
                }
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (allTiles[i][j].color === null) allTiles[i][j].color = findColor();
        }
    }
}

// Helpers
function findColor() { return colorList[Math.floor(Math.random() * colorList.length)]; }
function swapColors(t1, t2) {
    let temp = t1.color;
    t1.color = t2.color;
    t2.color = temp;
    dispTable();
}
function dispTable() { 
    for (let i = 0; i < 8; i++) { 
        for (let j = 0; j < 8; j++) {
            allTiles[i][j].render(); 
        }
    } 
}
function updateStatus() {
    document.getElementById("status_box2").innerHTML = "Total Score: " + totalMatches;
}

// Wait for the HTML to be ready before initializing the visual table
window.onload = function() {
    // This creates an empty/dummy board so the table isn't blank on load
    for (let i = 0; i < 8; i++) {
        allTiles[i] = [];
        for (let j = 0; j < 8; j++) {
            allTiles[i][j] = new Tile_data("#333", i, j);
        }
    }
    dispTable();
};