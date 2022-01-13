export enum Direction {
    Left = 'LEFT',
    Down = 'DOWN',
    Right = 'RIGHT',
    Up = 'UP'
}

export class Snake {
    private body: number[][] = [[0,0]];
    private currentDirection: Direction = Direction.Right;

    getHeadPosition(): [number, number] {
        return [this.body[0][0], this.body[0][1]];
    }

    setHeadPosition(headPosition: [number, number]): void {
        this.body[0][0] = headPosition[0];
        this.body[0][1] = headPosition[1];
    }

    getTailPosition(): number[] {
        let currentLength = this.body.length;
        if (currentLength > 1) {
            return this.body[this.body.length - 1];
        }
        return this.getHeadPosition();
        
    }

    getBody(): number[][] {
        return this.body;
    }

    getCurrentDirection(): Direction {
        return this.currentDirection;
    }

    move(direction: Direction, bonus: boolean): void { 

        let newPosition: number[];
        switch (direction) {
            case Direction.Left: {
                newPosition = [ (this.body[0][0] - 1), this.body[0][1] ];
                break;
            }
            case Direction.Down: {
                newPosition = [ this.body[0][0], (this.body[0][1] + 1) ];
                break;
            }
            case Direction.Right: {
                newPosition = [ (this.body[0][0] + 1), this.body[0][1] ];
                break;
            }
            case Direction.Up: {
                newPosition = [ this.body[0][0], (this.body[0][1] - 1) ];
                break;
            }
        }
        this.currentDirection = direction;
        if (!bonus) {
            this.body.pop();
        }
        this.body.unshift(newPosition);   
    }

}

