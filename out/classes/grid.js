export var CellType;
(function (CellType) {
    CellType["Bonus"] = "BONUS";
    CellType["Snake"] = "SNAKE";
    CellType["Empty"] = "EMPTY";
    CellType["Tail"] = "TAIL";
})(CellType || (CellType = {}));
export class Grid {
    constructor(container, width, height, cellSizePixels) {
        this.container = container;
        this.width = width;
        this.height = height;
        this.cellSizePixels = cellSizePixels;
        this.gridCells = [];
    }
    getCoordinates(currentIndex, width) {
        const x = currentIndex % width;
        const y = Math.floor(currentIndex / width);
        return [x, y];
    }
    getCellId(xC, yC) {
        return this.width * yC + xC;
    }
    renderGrid() {
        this.container.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSizePixels}px)`;
        const totalCells = this.width * this.height;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('span');
            cell.style.height = this.cellSizePixels.toString() + 'px';
            const [xC, yC] = this.getCoordinates(i, this.width);
            cell.id = [xC, yC].toString();
            this.container.append(cell);
            this.gridCells.push({ x: xC, y: yC, type: CellType.Empty });
        }
    }
    renderCells(cells, direction) {
        for (const [i, cell] of cells.entries()) {
            const cellElement = this.container.querySelector(`[id='${cell.x},${cell.y}']`); // id="x,y"
            const cellId = this.getCellId(cell.x, cell.y);
            switch (cell.type) {
                case CellType.Snake: {
                    cellElement.classList.add('snake');
                    if (i === 0) {
                        cellElement.classList.add('head', `${direction}`);
                        this.gridCells[cellId].type = CellType.Snake;
                        break;
                    }
                    if (i === cells.length - 1) {
                        cellElement.classList.add('tail');
                        this.gridCells[cellId].type = CellType.Tail;
                        break;
                    }
                    this.gridCells[cellId].type = CellType.Snake;
                    break;
                }
                case CellType.Bonus: {
                    this.gridCells[cellId].type = CellType.Bonus;
                    cellElement.classList.add('bonus');
                    break;
                }
            }
        }
    }
    clearCells(cells) {
        if (cells === undefined)
            cells = this.gridCells; // clear all cells
        for (const cell of cells) {
            const cellElement = this.container.querySelector(`[id='${cell.x},${cell.y}']`); // id="x,y"
            const cellId = this.getCellId(cell.x, cell.y);
            this.gridCells[cellId].type = CellType.Empty;
            cellElement.classList.value = '';
        }
    }
    getEmptyCells() {
        return this.gridCells.filter(c => c.type == CellType.Empty);
    }
    getCellType(coordinates) {
        const cell = this.gridCells.find(c => c.x === coordinates[0] && c.y === coordinates[1]);
        if (cell) {
            return this.gridCells.find(c => c.x === coordinates[0] && c.y === coordinates[1]).type;
        }
        return null;
    }
}
//# sourceMappingURL=grid.js.map