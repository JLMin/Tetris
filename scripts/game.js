/************************************************************
    DOM Variables
************************************************************/
const divGrid     = document.querySelector('#grid');
const divUpcoming = document.querySelector('#upcoming');
const spanScore   = document.querySelector('#score');
const spanSpeed   = document.querySelector('#speed');
const btnStart    = document.querySelector('#start');


/************************************************************
    Game Variables
************************************************************/
const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const width = 10;
const height = 20;

const shapes = {
    I: [[1, 1, 1, 1]],
    J: [[2, 0, 0], [2, 2, 2]],
    L: [[0, 0, 3], [3, 3, 3]],
    O: [[4, 4],    [4, 4]],
    S: [[0, 5, 5], [5, 5, 0]],
    T: [[0, 6, 0], [6, 6, 6]],
    Z: [[7, 7, 0], [0, 7, 7]]
};

const colors = ["5c636c", "e06c75", "bc78dd", "61afef",
                "e6ca39", "98c36e", "36e0ff", "d19a66"];

let currentBlock = { 'col': 4, 'row': 0, 'shape': null };
let upcomingBlock = { 'col': 4, 'row': 0, 'shape': null };
let blockList = [];

let score = 0;
let speedFactor = 1;
let gameSpeed = speedFactor + score / 10;
let gameState = 'OVER';


/************************************************************
    Game Functions
************************************************************/
function clearBoard() {
    for (let i = 0; i < height; i++)
        grid[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function clearFilledLine() {
    for (let i = 0; i < height ; i++)
        if (!contains(grid[i], 0))
            clearLine(i);
}

function contains(arr, val) {
    for (let i = 0, len = arr.length; i < len; i++)
        if (arr[i] === val)
            return true;
    return false;
}

function clearLine(line) {
    for (let i = line; i > 0; i--)
        grid[i] = grid[i - 1].slice();
    grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    score++;
}

function currentHeight() {
    for (let i = 0; i < height; i++)
        for (let j = 0; j < width; j++)
            if (grid[i][j] !== 0)
                return height - i;
    return 0;
}

function randomBlock() {
    let shape;
    switch (Math.floor(Math.random() * 7 + 1)) {
        case 1: shape = shapes.I; break;
        case 2: shape = shapes.J; break;
        case 3: shape = shapes.L; break;
        case 4: shape = shapes.O; break;
        case 5: shape = shapes.S; break;
        case 6: shape = shapes.T; break;
        case 7: shape = shapes.Z; break;
    }
    return { 'col': 4, 'row': 0, 'shape': shape };
}

function initBlockList() {
    blockList = [];
    blockList.push(randomBlock());
    blockList.push(randomBlock());
    upcomingBlock = randomBlock();
}

function updateBlocks() {
    currentBlock = upcomingBlock;
    blockList.shift();
    upcomingBlock = blockList[0];
    blockList.push(randomBlock());
}

function drawCurrentBlock() {
    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    for (let sRow = 0; sRow < shape.length; sRow++)
        for (let sCol = 0; sCol < shape[sRow].length; sCol++)
            if (shape[sRow][sCol] !== 0 &&
                grid[offsetRow + sRow][offsetCol + sCol] === 0)
            {
                grid[offsetRow + sRow][offsetCol + sCol] = shape[sRow][sCol];
            }
}

function eraseCurrentBlock() {
    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    for (let sRow = 0; sRow < shape.length; sRow++)
        for (let sCol = 0; sCol < shape[sRow].length; sCol++)
            if (shape[sRow][sCol] !== 0)
                grid[offsetRow + sRow][offsetCol + sCol] = 0;
}

function moveDown() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    eraseCurrentBlock();

    // check if it is safe to move to the next row
    for (let sCol = shape[0].length - 1; sCol >= 0; sCol--) {
        for (let sRow = shape.length - 1; sRow >= 0; sRow--) {
            // check the first non-empty block for each column
            // from buttom to top
            if (shape[sRow][sCol] !== 0) {
                // if reached the bottom of the grid
                if (offsetRow + sRow === height - 1) {
                    drawCurrentBlock();
                    return false;
                }
                // if next row have a block
                else if (grid[offsetRow + sRow + 1][offsetCol + sCol] !== 0) {
                    drawCurrentBlock();
                    return false;
                }
            } else {
                // it is a empty block, skip
                continue;
            }
            // this columns is checked, break to the next columns
            break;
        }
    }

    currentBlock.row++;
    drawCurrentBlock();
    return true;
}

function moveLeft() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    eraseCurrentBlock();

    // check if it is safe to move to the left column
    for (let sRow = shape.length - 1; sRow >= 0 ; sRow--) {
        for (let sCol = 0; sCol < shape[0].length; sCol++) {
            // check the first non-empty block for each row
            // from left to right
            if (shape[sRow][sCol] !== 0) {
                // if reached the left board of the grid
                if (offsetCol + sCol === 0) {
                    drawCurrentBlock();
                    return false;
                }
                // if left column have a block
                else if (grid[offsetRow + sRow][offsetCol + sCol - 1] !== 0) {
                    drawCurrentBlock();
                    return false;
                }
            } else {
                // it is a empty block, skip
                continue;
            }
            // this row is checked, break to the next row
            break;
        }
    }

    currentBlock.col--;
    drawCurrentBlock();
}

function moveRight() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    eraseCurrentBlock();

    // check if it is safe to move to the right column
    for (let sRow = shape.length - 1; sRow >= 0 ; sRow--) {
        for (let sCol = shape[0].length - 1; sCol >= 0 ; sCol--) {
            // check the first non-empty block for each row
            // from right to left
            if (shape[sRow][sCol] !== 0) {
                // if reached the right board of the grid
                if (offsetCol + sCol === width - 1) {
                    drawCurrentBlock();
                    return false;
                }
                // if right column have a block
                else if (grid[offsetRow + sRow][offsetCol + sCol + 1] !== 0) {
                    drawCurrentBlock();
                    return false;
                }
            } else {
                // it is a empty block, skip
                continue;
            }
            // this row is checked, break to the next row
            break;
        }
    }

    currentBlock.col++;
    drawCurrentBlock();
}

function rotate() {

    eraseCurrentBlock();
    let shape = currentBlock.shape;
    let newShape = [];
    for (let i = 0; i < shape[0].length; i++) {
        let newLine = [];
        for (let j = shape.length - 1; j >= 0 ; j--) {
            newLine.push(shape[j][i]);
        }
        newShape.push(newLine);
    }
    currentBlock.shape = newShape;
    drawCurrentBlock();
}

function gameOver() {
    return currentHeight() === height;
}


/************************************************************
    Window Functions
************************************************************/
function drawGrid() {

    divGrid.innerHTML = '';
    let html = '';

    for (let i = 0; i < height; i++) {

        if (i === 0)
            html += 'const grid = [';
        else
            html += '<span style="color:#282c34">______________</span>';

        html += '[';

        for (let j = 0; j < width; j++) {
            html += `<span style="color:#${colors[grid[i][j]]}">${grid[i][j]}</span>`;
            if (j !== width - 1)
                html += ',';
        }

        html += ']';
        if (i < height - 1)
            html += '<br>';

    }

    html += '];';
    divGrid.innerHTML = html;
}

function drawUpcoming() {

    let shape = upcomingBlock.shape;
    divUpcoming.innerHTML = '';
    let html = '';

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0)
                html += `<span style="color:#${colors[shape[i][j]]}">${shape[i][j]} </span>`;
            else
                html += '<span style="color:#282c34">__</span>';
        }
        html += '<br>';
    }
    divUpcoming.innerHTML = html;
}

function updateInfo() {
    spanScore.innerHTML = score;
    spanSpeed.innerHTML = gameSpeed;
}

let timer = null;
let blockFixed = false;
function gameLoop(timestamp) {

    if (gameState === 'RUNNING') {
        if (!timer) timer = timestamp;
        let progress = timestamp - timer;

        if (progress > 1000 / gameSpeed) {
            timer = timestamp;
            blockFixed = !moveDown();

            if (blockFixed) {
                clearFilledLine();
                if (gameOver()){
                    initGame();
                } else {
                    updateBlocks();
                }
            }

            drawUpcoming();
            updateInfo();
        }
    } else if (gameState === 'OVER') {
        divUpcoming.innerHTML = '';
    }

    drawGrid();
    requestAnimationFrame(gameLoop);
}

function initGame() {
    gameState = 'OVER';
    btnStart.innerHTML = 'start';
    clearBoard();
    initBlockList();
    updateBlocks();
    score = 0;
}


/************************************************************
    Game Start Point
************************************************************/
window.onload = () => {

    btnStart.onclick = () => {
        if (gameState !== 'RUNNING') {
            if (gameState === 'OVER') initGame();
            gameState = 'RUNNING';
            btnStart.innerHTML = 'pause';
        } else {
            gameState = 'PAUSE';
            btnStart.innerHTML = 'start';
        }
    }

    addEventListener('keydown', e => {
        if (gameState === 'RUNNING') {
            switch (e.key) {
                case 'w': case 'i': case 'ArrowUp':     rotate();       break;
                case 'a': case 'j': case 'ArrowLeft':   moveLeft();     break;
                case 's': case 'k': case 'ArrowDown':   moveDown();     break;
                case 'd': case 'l': case 'ArrowRight':  moveRight();    break;
            }
        }
    });

    requestAnimationFrame(gameLoop);
}
