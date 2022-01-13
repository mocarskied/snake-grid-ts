export var Direction;
(function (Direction) {
    Direction["Left"] = "LEFT";
    Direction["Down"] = "DOWN";
    Direction["Right"] = "RIGHT";
    Direction["Up"] = "UP";
})(Direction || (Direction = {}));
export class Snake {
    constructor() {
        this.body = [[0, 0]];
        this.currentDirection = Direction.Right;
    }
    getHeadPosition() {
        return [this.body[0][0], this.body[0][1]];
    }
    setHeadPosition(headPosition) {
        this.body[0][0] = headPosition[0];
        this.body[0][1] = headPosition[1];
    }
    getTailPosition() {
        let currentLength = this.body.length;
        if (currentLength > 1) {
            return this.body[this.body.length - 1];
        }
        return this.getHeadPosition();
    }
    getBody() {
        return this.body;
    }
    getCurrentDirection() {
        return this.currentDirection;
    }
    move(direction, bonus) {
        let newPosition;
        switch (direction) {
            case Direction.Left: {
                newPosition = [(this.body[0][0] - 1), this.body[0][1]];
                break;
            }
            case Direction.Down: {
                newPosition = [this.body[0][0], (this.body[0][1] + 1)];
                break;
            }
            case Direction.Right: {
                newPosition = [(this.body[0][0] + 1), this.body[0][1]];
                break;
            }
            case Direction.Up: {
                newPosition = [this.body[0][0], (this.body[0][1] - 1)];
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
//# sourceMappingURL=snake.js.map