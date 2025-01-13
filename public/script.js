const gridContainer = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');

let gridSize = 4;
let tiles = [];
let board = [];
let score = 0;

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    return { date, time };
}

function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'empty'); // Добавляем класс 'empty' по умолчанию
        tiles.push(tile);
        gridContainer.appendChild(tile);
    }
}

function generateNewNumber() {
    const emptyTiles = tiles.filter((tile, index) => !board[index]);
    if (emptyTiles.length > 0) {
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        const index = tiles.indexOf(randomTile);
        board[index] = value;
        updateTile(index, value, true); // Корректное обновление новой ячейки
    }
}

function updateTile(index, value, isNew = false) {
    const tile = tiles[index];
    if (value === 0) {
        tile.textContent = '';
        tile.style.backgroundColor = '#cdc1b4';
        tile.classList.remove('new');
        tile.classList.add('empty');
    } else {
        tile.textContent = value;
        tile.style.backgroundColor = getTileColor(value);
        if (isNew) {
            tile.classList.add('new');
            setTimeout(() => tile.classList.remove('new'), 300);
        } else {
            tile.classList.remove('empty');
        }
    }
}

function getTileColor(value) {
    const colors = {
        '2': '#eee4da',
        '4': '#ede0c8',
        '8': '#f2b179',
        '16': '#f59563',
        '32': '#f67c5f',
        '64': '#f65e3b',
        '128': '#edcf72',
        '256': '#edcc61',
        '512': '#edc850',
        '1024': '#edc53f',
        '2048': '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function startGame() {
    tiles.forEach(tile => {
        tile.textContent = '';
        tile.style.backgroundColor = '#cdc1b4';
        tile.classList.add('empty');
        tile.style.transform = 'translate(0, 0)';
    });
    board = Array(gridSize * gridSize).fill(0);
    score = 0;
    scoreDisplay.textContent = score;
    generateNewNumber();
    generateNewNumber();
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
        let row = board.slice(i * gridSize, (i + 1) * gridSize);
        let oldRow = [...row];
        row = compactAndMerge(row);
        if (!moved && JSON.stringify(oldRow) !== JSON.stringify(row)) {
            moved = true;
        }
        for (let j = 0; j < gridSize; j++) {
            board[i * gridSize + j] = row[j];
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
        let row = board.slice(i * gridSize, (i + 1) * gridSize).reverse();
        let oldRow = [...row];
        row = compactAndMerge(row);
        row.reverse();
        if (!moved && JSON.stringify(oldRow) !== JSON.stringify(row)) {
            moved = true;
        }
        for (let j = 0; j < gridSize; j++) {
            board[i * gridSize + j] = row[j];
        }
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let col = 0; col < gridSize; col++) {
        let column = [];
        for (let row = 0; row < gridSize; row++) {
            column.push(board[row * gridSize + col]);
        }
        let oldColumn = [...column];
        column = compactAndMerge(column);
        if (!moved && JSON.stringify(oldColumn) !== JSON.stringify(column)) {
            moved = true;
        }
        for (let row = 0; row < gridSize; row++) {
            board[row * gridSize + col] = column[row];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < gridSize; col++) {
        let column = [];
        for (let row = 0; row < gridSize; row++) {
            column.push(board[(gridSize - 1 - row) * gridSize + col]);
        }
        let oldColumn = [...column];
        column = compactAndMerge(column);
        column.reverse();
        if (!moved && JSON.stringify(oldColumn) !== JSON.stringify(column)) {
            moved = true;
        }
        for (let row = 0; row < gridSize; row++) {
            board[row * gridSize + col] = column[row];
        }
    }
    return moved;
}

function compactAndMerge(arr) {
    arr = arr.filter(val => val); // Убираем нули
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(val => val); // Убираем нули после слияния
    while (arr.length < gridSize) {
        arr.push(0);
    }
    return arr;
}

function animateTileMove(fromIndex, toIndex) {
    const fromTile = tiles[fromIndex];
    const toTile = tiles[toIndex];

    // Просто обновляем порядок плиток в DOM
    gridContainer.appendChild(toTile); // Move the tile to its new position
}

function updateBoard() {
    board.forEach((value, index) => {
        updateTile(index, value); // Корректное обновление всех ячеек
    });
    scoreDisplay.textContent = score;
}

function checkGameOver() {
    if (!board.includes(0)) {
        alert("Game Over!");
    }
}

window.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if ([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        let moved = false;
        if (e.keyCode === 37) moved = moveLeft();
        else if (e.keyCode === 38) moved = moveUp();
        else if (e.keyCode === 39) moved = moveRight();
        else if (e.keyCode === 40) moved = moveDown();
        if (moved) {
            updateBoard();
            generateNewNumber();
            checkGameOver();
        }
    }
}

createGrid();
startGame();