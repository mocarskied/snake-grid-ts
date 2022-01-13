import { Grid, ICell, CellType } from "./classes/grid.js";
import { Snake, Direction } from "./classes/snake.js";

const width: number = 15;
const height: number = 15;
const speed: number = 100;
const cellSize: number = 30;

const container: HTMLElement = document.getElementById('grid-container');
const gameControlls: HTMLElement = document.getElementById('game-controlls');
const scoreElement: HTMLElement = document.getElementById('score');

const grid: Grid = new Grid(container, width, height, cellSize);

const startingPosition: [number, number] = [Math.floor(width/2), Math.floor(height/2)];

let snake: Snake;
let gameTimer: NodeJS.Timer;
let snakeCells: ICell[];
let snakeDirection: Direction;
let score: number = 0;

let isDirectionSet: boolean = false;
let isGameInProgress: boolean = false;
let bonusEaten: boolean = false;

function getSnakeBodyCells(snakeBody: number[][]): ICell[] {
    const cells: ICell[] = [];
    for (const part of snakeBody) {
        cells.push({x: part[0], y: part[1], type: CellType.Snake});
    }
    return cells;
}

function getRandomBonusCell(grid: Grid): ICell[] {
    const emptyCells = grid.getEmptyCells();
    const bonusCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    bonusCell.type = CellType.Bonus;
    return [bonusCell];
}

function getNextCell(grid: Grid, headPosition: [number, number], currentDirection: Direction, gridWidth: number, gridHeight: number): ICell {

    let nextCell: ICell = {} as ICell;
    
    switch (currentDirection) {

        case Direction.Right : {
            nextCell.y = headPosition[1];
            if (headPosition[0] === gridWidth - 1) {
                nextCell.x = 0;
                break;
            }
            nextCell.x = headPosition[0] + 1;
            break;
        }

        case Direction.Left : {
            nextCell.y = headPosition[1];
            if (headPosition[0] === 0) {
                nextCell.x = gridWidth - 1;
                break;
            }
            nextCell.x = headPosition[0] - 1;
            break;
        }
        
        case Direction.Up : {
            nextCell.x = headPosition[0];
            if (headPosition[1] === 0) {
                nextCell.y = gridHeight - 1;
                break;
            }
            nextCell.y = headPosition[1] - 1;
            break;
        }

        case Direction.Down : {
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

function spawnBonus(grid: Grid): void {
    const bonusCell = getRandomBonusCell(grid);
    grid.renderCells(bonusCell);
}

function spawnSnake(snake: Snake, grid: Grid): ICell[] {
    const snakeBody = snake.getBody();
    const snakeCells = getSnakeBodyCells(snakeBody);
    grid.renderCells(snakeCells, snake.getCurrentDirection());
    return snakeCells;
}

function updateScore(points: number) {
    score += points;
    scoreElement.children[0].textContent = score.toString();
}


function handleMove(): void {
    isDirectionSet = false;
    const headPosition = snake.getHeadPosition();
    const nextCell = getNextCell(grid, headPosition, snakeDirection, width, height);
    
    switch (nextCell.type) {
        case (CellType.Bonus) : {
            bonusEaten = true;
            updateScore(1);
            spawnBonus(grid);
            break;
        }
        case (CellType.Snake) : {
            endGame();
            return;
        }
    }
    snake.move(snakeDirection, bonusEaten)
    bonusEaten = false;
    
    snake.setHeadPosition([nextCell.x, nextCell.y]); // realign head position for border cross

    grid.clearCells(snakeCells);
    snakeCells = spawnSnake(snake, grid);


}

function initializeGame(): void {
    scoreElement.hidden = true;
    grid.renderGrid();
    let startButton = document.getElementById('start');
    startButton.onclick = startGame;
}

function startGame(): void {
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
    } else {
        console.log("GAME IN PROGRESS")
    }
}

function endGame(): void {
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
    console.log("unrecognized input")

});