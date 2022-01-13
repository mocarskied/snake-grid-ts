export enum CellType {
    Bonus = 'BONUS',
    Snake = 'SNAKE',
    Empty = 'EMPTY',
    Tail = 'TAIL'
}

export interface ICell {
    x: number;
    y: number;
    type: CellType;
}


export class Grid {
    constructor(private container: HTMLElement, private width: number, private height: number, private cellSizePixels: number) {}

    gridCells: ICell[] = [];

    private getCoordinates(currentIndex: number, width: number): [number, number] {
        const x = currentIndex % width;
        const y = Math.floor(currentIndex / width);
        return [x, y];
    }

    private getCellId(xC: number, yC: number): number {
        return this.width * yC + xC;
    }

    renderGrid(): void {
        this.container.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSizePixels}px)`

        const totalCells = this.width * this.height;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('span');
            cell.style.height = this.cellSizePixels.toString()+'px';
            const [xC, yC] = this.getCoordinates(i, this.width);
            cell.id = [xC, yC].toString();
            this.container.append(cell);
            
            this.gridCells.push({x: xC, y: yC, type: CellType.Empty});

        }
    }

    renderCells(cells: ICell[], direction?): void { 
        for (const [i, cell] of cells.entries()) {
            const cellElement = this.container.querySelector(`[id='${cell.x},${cell.y}']`) as HTMLSpanElement; // id="x,y"
            const cellId = this.getCellId(cell.x, cell.y);
            switch (cell.type) {
                case CellType.Snake: {
                    cellElement.classList.add('snake')
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
                    cellElement.classList.add('bonus')
                    break;
                }
            }

        }
    }

    clearCells(cells?: ICell[]): void {
        if (cells === undefined) cells = this.gridCells; // clear all cells

        for (const cell of cells) {
            const cellElement = this.container.querySelector(`[id='${cell.x},${cell.y}']`) as HTMLSpanElement; // id="x,y"
            const cellId = this.getCellId(cell.x, cell.y);
            this.gridCells[cellId].type = CellType.Empty;
            cellElement.classList.value = '';
        }
    }

    getEmptyCells(): ICell[] {
        return this.gridCells.filter(c => c.type == CellType.Empty);
    }

    getCellType(coordinates: [number, number]): CellType | null {
        const cell = this.gridCells.find(c => c.x === coordinates[0] && c.y === coordinates[1]);
        if (cell) {
            return this.gridCells.find(c => c.x === coordinates[0] && c.y === coordinates[1]).type;
        }
        return null;
        
    }
}