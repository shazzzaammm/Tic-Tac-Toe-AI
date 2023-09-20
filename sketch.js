class Spot {
    constructor(x, y, size) {
        this.value = EMPTY;
        this.size = size;
        this.x = x * this.size;
        this.y = y * this.size;
    }
    show() {
        rectMode(RADIUS);
        fill(0);
        // stroke(255);
        noStroke();
        rect(this.x, this.y, this.size, this.size);
        this.value == playerY ? fill(91, 206, 250) : fill(245, 169, 184);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        text(this.value, this.x - this.size / 2, this.y - this.size / 2);
    }
    checkClicked(x, y) {
        if (
            x >= this.x - this.size &&
            x <= this.x &&
            y >= this.y - this.size &&
            y <= this.y
        ) {
            return true;
        }
        return false;
    }
}
//#region variables
const grid = [];
const EMPTY = " ";
const playerX = "x";
const playerY = "o";
let turn = playerX;
//#endregion
function setup() {
    const size = min(window.innerWidth, window.innerHeight);
    createCanvas(size, size);
    for (let x = 1; x < 4; x++) {
        for (let y = 1; y < 4; y++) {
            grid.push(new Spot(x, y, width / 3));
        }
    }
}
function draw() {
    if (turn == playerY) {
        computerChoice();
    }
    for (const s of grid) {
        s.show();
    }
    drawGrid();
    if (isGameOver()) {
        noLoop();
        swapTurn();
        drawWinningLine(turn);
    }
}
function mouseClicked() {
    userChoice();
}
function swapTurn() {
    //yeah i couldve just typed this out but shhh
    turn === playerX ? (turn = playerY) : (turn = playerX);
}
function isGameOver() {
    return boardIsFull() || checkWinner(playerX) || checkWinner(playerY);
}
function checkSpots(a, b, c, letter) {
    return (
        grid[a].value == letter &&
        grid[b].value == letter &&
        grid[c].value == letter
    );
}
function checkWinner(letter) {
    //theres probably a way to do this with a for loop
    return (
        checkSpots(0, 1, 2, letter) ||
        checkSpots(3, 4, 5, letter) ||
        checkSpots(6, 7, 8, letter) ||
        checkSpots(0, 3, 6, letter) ||
        checkSpots(1, 4, 7, letter) ||
        checkSpots(2, 5, 8, letter) ||
        checkSpots(0, 4, 8, letter) ||
        checkSpots(2, 4, 6, letter)
    );
}
function boardIsEmpty() {
    return (
        checkSpots(0, 1, 2, EMPTY) &&
        checkSpots(3, 4, 5, EMPTY) &&
        checkSpots(6, 7, 8, EMPTY)
    );
}
function boardIsFull() {
    for (const s of grid) {
        if (s.value == EMPTY) {
            return false;
        }
    }
    return true;
}
function userChoice() {
    if (isGameOver()) return;
    //pick the clicked one if it is empty
    for (const s of grid) {
        if (s.checkClicked(mouseX, mouseY) && s.value == EMPTY) {
            s.value = turn;
            swapTurn();
        }
    }
}
function computerChoice() {
    if (boardIsFull()) return;
    // randomComputerChoice();
    grid[findBestMove()].value = playerY;
    swapTurn();
}
function randomComputerChoice() {
    if (boardIsFull()) return;
    let rand = random(grid);
    while (rand.value != EMPTY) {
        rand = random(grid);
    }
    rand.value = turn;
}
//#region minimax stuff
function evaluate() {
    if (checkWinner(playerX)) {
        return 10;
    } else if (checkWinner(playerY)) {
        return -10;
    } else {
        return 0;
    }
}
function minimax(depth, maximizingPlayer) {
    if (isGameOver()) {
        return evaluate();
    }
    if (maximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i].value == EMPTY) {
                grid[i].value = playerX;
                let score = minimax(depth + 1, false);
                grid[i].value = EMPTY;
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i].value == EMPTY) {
                grid[i].value = playerY;
                let score = minimax(depth + 1, true);
                grid[i].value = EMPTY;
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}
function findBestMove() {
    let bestMove = -1;
    let bestScore = Infinity;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].value == EMPTY) {
            grid[i].value = playerY;
            let score = minimax(0, true);
            grid[i].value = EMPTY;
            if (score < bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}
//#endregion
function drawWinningLine(letter) {
    // there actually has to be a better way
    strokeWeight(grid[0].size / 6);
    turn == playerY ? stroke(91, 206, 250) : stroke(245, 169, 184);
    spotPairs = [
        { a: 0, b: 2, c: 1 },
        { a: 3, b: 5, c: 4 },
        { a: 6, b: 8, c: 7 },
        { a: 0, b: 6, c: 3 },
        { a: 1, b: 7, c: 4 },
        { a: 2, b: 8, c: 5 },
        { a: 0, b: 8, c: 4 },
        { a: 2, b: 6, c: 4 },
    ];
    for (const s of spotPairs) {
        if (checkSpots(s.a, s.b, s.c, letter)) {
            line(
                grid[s.a].x - grid[s.a].size / 2,
                grid[s.a].y - grid[s.a].size / 2,
                grid[s.b].x - grid[s.b].size / 2,
                grid[s.b].y - grid[s.b].size / 2
            );
            break;
        }
    }
}
function drawGrid() {
    stroke(255);
    strokeWeight(width * 0.0085);
    // line(0, 0, 0, height);
    line(width / 3, 0, width / 3, height);
    line((2 * width) / 3, 0, (2 * width) / 3, height);
    // line(width, 0, width, height);
    // line(0, 0, width, 0);
    line(0, height / 3, width, height / 3);
    line(0, (2 * height) / 3, width, (2 * height) / 3);
    // line(0, height, width, height);
}
