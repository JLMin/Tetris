const $divGrid = $('#grid');
const $divUpcoming = $('#upcoming');
const $score = $('#score');
const $speed = $('#speed');
const $height = $('#height');

let start = null;

function drawGrid() {

    $divGrid.text('');

    for (let i = 0; i < height; i++) {

        if (i === 0) {
            $divGrid.append('const grid = [');
        } else {
            $divGrid.append('<span style="color:#282c34">______________</span>');
        }

        $divGrid.append('[');

        for (let j = 0; j < width; j++) {
            $divGrid.append(`<span style="color:#${colors[grid[i][j]]}">${grid[i][j]}</span>`);
            if (j !== width - 1) {
                $divGrid.append(',');
            }
        }

        if (i === height - 1) {
            $divGrid.append(']');
        } else {
            $divGrid.append('],<br>');
        }

    }
    $divGrid.append('];')
}

function drawUpcoming(shape) {

    $divUpcoming.text('');

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0) {
                $divUpcoming.append(`<span style="color:#${colors[shape[i][j]]}">${shape[i][j]} </span>`);
            } else {
                $divUpcoming.append('<span style="color:#282c34">__</span>');
            }
        }
        $divUpcoming.append('<br>');
    }
}

function updateInfo() {
    $score.text(getScore());
    $speed.text(getSpeed());
    // $height.text(getHeight());
}

// draw game board & upcoming block
function gameLoop(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    if (progress > 1000 / getSpeed()) {
        start = timestamp;
        updateInfo();
        if (!moveDown()) {
            cleanFullLine();
            // lose
            if (getHeight() === height) {
                cleanBoard();
                init();
            } else {
                setBlocks();
            }
        }
    }
    drawGrid();
    drawUpcoming(upcomingBlock.shape);
    requestAnimationFrame(gameLoop);
}

// initialize game
function init() {
    console.log('Game Initiallizing...');
    initBlocks();
    setBlocks();
    score = 0;
}

// game start
init();
addEventListener('keydown', e => {
    switch (e.key) {
        case 'w': case 'i': case 'ArrowUp':     rotate();       break;
        case 'a': case 'j': case 'ArrowLeft':   moveLeft();     break;
        case 's': case 'k': case 'ArrowDown':   moveDown();     break;
        case 'd': case 'l': case 'ArrowRight':  moveRight();    break;
    }
});
requestAnimationFrame(gameLoop);
