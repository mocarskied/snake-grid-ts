import { Grid, CellType } from "./classes/grid.js";
import { Snake, Direction } from "./classes/snake.js";
const width = 15;
const height = 15;
const speed = 100;
const cellSize = 30;
const container = document.getElementById('grid-container');
const gameControlls = document.getElementById('game-controlls');
const scoreElement = document.getElementById('score');
const grid = new Grid(container, width, height, cellSize);
const startingPosition = [Math.floor(width / 2), Math.floor(height / 2)];
let snake;
let gameTimer;
let snakeCells;
let snakeDirection;
let score = 0;
let isDirectionSet = false;
let isGameInProgress = false;
let bonusEaten = false;
function getSnakeBodyCells(snakeBody) {
    const cells = [];
    for (const part of snakeBody) {
        cells.push({ x: part[0], y: part[1], type: CellType.Snake });
    }
    return cells;
}
function getRandomBonusCell(grid) {
    const emptyCells = grid.getEmptyCells();
    const bonusCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    bonusCell.type = CellType.Bonus;
    return [bonusCell];
}
function getNextCell(grid, headPosition, currentDirection, gridWidth, gridHeight) {
    let nextCell = {};
    switch (currentDirection) {
        case Direction.Right: {
            nextCell.y = headPosition[1];
            if (headPosition[0] === gridWidth - 1) {
                nextCell.x = 0;
                break;
            }
            nextCell.x = headPosition[0] + 1;
            break;
        }
        case Direction.Left: {
            nextCell.y = headPosition[1];
            if (headPosition[0] === 0) {
                nextCell.x = gridWidth - 1;
                break;
            }
            nextCell.x = headPosition[0] - 1;
            break;
        }
        case Direction.Up: {
            nextCell.x = headPosition[0];
            if (headPosition[1] === 0) {
                nextCell.y = gridHeight - 1;
                break;
            }
            nextCell.y = headPosition[1] - 1;
            break;
        }
        case Direction.Down: {
            nextCell.x = headPosition[0];
            if (headPosition[1] === gridHeight - 1) {
                nextCell.y = 0;
                break;
            }
            nextCell.y = headPosition[1] + 1;
            break;
        }
    }
    nextCell.type = grid.getCellType([nextCell.x, nextCell.y]);
    return nextCell;
}
function spawnBonus(grid) {
    const bonusCell = getRandomBonusCell(grid);
    grid.renderCells(bonusCell);
}
function spawnSnake(snake, grid) {
    const snakeBody = snake.getBody();
    const snakeCells = getSnakeBodyCells(snakeBody);
    grid.renderCells(snakeCells, snake.getCurrentDirection());
    return snakeCells;
}
function updateScore(points) {
    score += points;
    scoreElement.children[0].textContent = score.toString();
}
function handleMove() {
    isDirectionSet = false;
    const headPosition = snake.getHeadPosition();
    const nextCell = getNextCell(grid, headPosition, snakeDirection, width, height);
    switch (nextCell.type) {
        case (CellType.Bonus): {
            bonusEaten = true;
            updateScore(1);
            spawnBonus(grid);
            break;
        }
        case (CellType.Snake): {
            endGame();
            return;
        }
    }
    snake.move(snakeDirection, bonusEaten);
    bonusEaten = false;
    snake.setHeadPosition([nextCell.x, nextCell.y]); // realign head position for border cross
    grid.clearCells(snakeCells);
    snakeCells = spawnSnake(snake, grid);
}
function initializeGame() {
    scoreElement.hidden = true;
    grid.renderGrid();
    let startButton = document.getElementById('start');
    startButton.onclick = startGame;
}
function startGame() {
    if (!isGameInProgress) {
        gameControlls.hidden = true;
        score = 0;
        grid.clearCells();
        snake = new Snake();
        snake.setHeadPosition(startingPosition);
        snakeCells = spawnSnake(snake, grid);
        snakeDirection = snake.getCurrentDirection();
        spawnBonus(grid);
        isGameInProgress = true;
        gameTimer = setInterval(handleMove, speed);
    }
    else {
        console.log("GAME IN PROGRESS");
    }
}
function endGame() {
    console.log("GAME OVER!");
    isGameInProgress = false;
    gameControlls.hidden = false;
    scoreElement.hidden = false;
    clearInterval(gameTimer);
}
initializeGame();
document.addEventListener('keydown', (e) => {
    if (isDirectionSet === true) {
        return;
    }
    isDirectionSet = true;
    const currentDirection = snake.getCurrentDirection();
    if (e.key === 'ArrowUp') {
        if (currentDirection !== Direction.Down) {
            snakeDirection = Direction.Up;
        }
        return;
    }
    if (e.key === 'ArrowDown') {
        if (currentDirection !== Direction.Up) {
            snakeDirection = Direction.Down;
        }
        return;
    }
    if (e.key === 'ArrowLeft') {
        if (currentDirection !== Direction.Right) {
            snakeDirection = Direction.Left;
        }
        return;
    }
    if (e.key === 'ArrowRight') {
        if (currentDirection !== Direction.Left) {
            snakeDirection = Direction.Right;
        }
        return;
    }
    console.log("unrecognized input");
});
//# sourceMappingURL=app.js.map