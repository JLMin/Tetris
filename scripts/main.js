/********************************************************
    Game Settings
********************************************************/

// game board, size 10x20;
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

// shapes of the blocks;
const shapes = {
    I: [[1, 1, 1, 1]],
    J: [[2, 0, 0], [2, 2, 2]],
    L: [[0, 0, 3], [3, 3, 3]],
    O: [[4, 4], [4, 4]],
    S: [[0, 5, 5], [5, 5, 0]],
    T: [[0, 6, 0], [6, 6, 6]],
    Z: [[7, 7, 0], [0, 7, 7]]
};

// colors of the blocks;
const colors = ["5c636c", "e06c75", "bc78dd", "61afef", "e6ca39", "98c36e", "36e0ff", "d19a66"];

// block;
let currentBlock = { 'col': 4, 'row': 0, 'shape': null };
let upcomingBlock = { 'col': 4, 'row': 0, 'shape': null };
let blockList = [];

// informations;
let score = 0;
let basicSpeed = 1;


/********************************************************
    Game Logic
********************************************************/

// clean game board
function cleanBoard() {

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            grid[i][j] = 0;
        }
    }
}

// check full line
function cleanFullLine() {

    for (let i = 0; i < height ; i++) {
        if (!contains(grid[i], 0)) {
            cleanLine(i);
        }
    }
}

//
function contains(arr, val) {

    for (let i = 0, len = arr.length; i < len; i++)
        if (arr[i] === val)
            return true;
    return false;
}

// clean one line
function cleanLine(line) {

    for (let i = line; i > 0; i--) {
        grid[i] = grid[i - 1].slice();
    }
    grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    score++;
}

// get current score
function getScore() {

    return score;
}

// get current speed
function getSpeed() {

    return basicSpeed + score / 10;
}

// get current height
function getHeight() {

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (grid[i][j] !== 0) {
                return height - i;
            }
        }
    }
    return 0;
}

// get a random block;
function getRandomBlock() {

    let index = Math.floor(Math.random() * 7 + 1);
    let shape;
    switch (index) {
        case 1:
            shape = shapes.I;
            break;
        case 2:
            shape = shapes.J;
            break;
        case 3:
            shape = shapes.L;
            break;
        case 4:
            shape = shapes.O;
            break;
        case 5:
            shape = shapes.S;
            break;
        case 6:
            shape = shapes.T;
            break;
        case 7:
            shape = shapes.Z;
            break;
    }
    return { 'col': 4, 'row': 0, 'shape': shape };
}

// initialize blockList
// this function should called only once for every game
function initBlocks() {
    blockList.push(getRandomBlock());
    blockList.push(getRandomBlock());
    blockList.push(getRandomBlock());
    upcomingBlock = getRandomBlock();
}

// insert current block into grid
function insertCurrentBlock() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    for (let sRow = 0; sRow < shape.length; sRow++) {
        for (let sCol = 0; sCol < shape[sRow].length; sCol++) {
            if (shape[sRow][sCol] !== 0) {
                if (grid[offsetRow + sRow][offsetCol + sCol] === 0) {
                    grid[offsetRow + sRow][offsetCol + sCol] = shape[sRow][sCol];
                }
            }
        }
    }
}

// remove current block from grid
function removeCurrentBlock() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    for (let sRow = 0; sRow < shape.length; sRow++) {
        for (let sCol = 0; sCol < shape[sRow].length; sCol++) {
            if (shape[sRow][sCol] !== 0) {
                grid[offsetRow + sRow][offsetCol + sCol] = 0;
            }
        }
    }
}

function moveDown() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    removeCurrentBlock();

    // check if it is safe to move to the next row
    for (let sCol = shape[0].length - 1; sCol >= 0; sCol--) {
        for (let sRow = shape.length - 1; sRow >= 0; sRow--) {
            // check last block of each columns if its not empty
            if (shape[sRow][sCol] !== 0) {
                // if reached the bottom of the grid
                if (offsetRow + sRow === height - 1) {
                    insertCurrentBlock();
                    return false;
                }
                // if next row have a block
                else if (grid[offsetRow + sRow + 1][offsetCol + sCol] !== 0) {
                    insertCurrentBlock();
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
    insertCurrentBlock();
    return true;
}

function moveLeft() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    removeCurrentBlock();

    // check if it is safe to move to the left column
    for (let sRow = shape.length - 1; sRow >= 0 ; sRow--) {
        for (let sCol = 0; sCol < shape[0].length; sCol++) {
            // check first block of each row if its not empty
            if (shape[sRow][sCol] !== 0) {
                // if reached the left board of the grid
                if (offsetCol + sCol === 0) {
                    insertCurrentBlock();
                    return false;
                }
                // if left column have a block
                else if (grid[offsetRow + sRow][offsetCol + sCol - 1] !== 0) {
                    insertCurrentBlock();
                    return false;
                }
            } else {
                // it is a empty block, skip
                continue;
            }
            // this row is checked, break to the next columns
            break;
        }
    }

    if (currentBlock.col > 0) {
        currentBlock.col--;
    }
    insertCurrentBlock();
}

function moveRight() {

    let shape = currentBlock.shape;
    let offsetCol = currentBlock.col;
    let offsetRow = currentBlock.row;

    removeCurrentBlock();

    // check if it is safe to move to the right column
    for (let sRow = shape.length - 1; sRow >= 0 ; sRow--) {
        for (let sCol = shape[0].length - 1; sCol >= 0 ; sCol--) {
            // check last block of each row if its not empty
            if (shape[sRow][sCol] !== 0) {
                // if reached the right board of the grid
                if (offsetCol + sCol === width - 1) {
                    insertCurrentBlock();
                    return false;
                }
                // if right column have a block
                else if (grid[offsetRow + sRow][offsetCol + sCol + 1] !== 0) {
                    insertCurrentBlock();
                    return false;
                }
            } else {
                // it is a empty block, skip
                continue;
            }
            // this row is checked, break to the next columns
            break;
        }
    }

    if (currentBlock.col + currentBlock.shape[0].length < width) {
        currentBlock.col++;
    }
    insertCurrentBlock();
}

function rotate() {

    removeCurrentBlock();
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
    insertCurrentBlock();
}

// set curent block and upcoming block
// this function should be called after a block is settled
function setBlocks() {

    currentBlock = upcomingBlock;
    blockList.shift();
    upcomingBlock = blockList[0];
    blockList.push(getRandomBlock());
}
