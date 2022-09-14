"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotate = exports.Bounds = exports.RelativePos = exports.Pos = void 0;
const enums_1 = require("./enums");
const classes_1 = require("../support/classes");
class Pos extends classes_1.Equatable {
    constructor({ x = 0, y = 0, z = 0, }) {
        super(["x", "y", "z"]);
        this._x = x;
        this._y = y;
        this._z = z;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    add(other) {
        return new Pos({
            "x": this.x + other.x,
            "y": this.y + other.y,
            "z": this.z + other.z
        });
    }
    build() {
        return {
            "x": this.x,
            "y": this.y,
            "z": this.z
        };
    }
}
exports.Pos = Pos;
class RelativePos extends Pos {
    constructor({ x = 0, y = 0, z = 0, pos, }) {
        super({ x, y, z });
        this.other = pos;
    }
    get x() { return super.x + this.other.x; }
    get y() { return super.y + this.other.y; }
    get z() { return super.z + this.other.z; }
}
exports.RelativePos = RelativePos;
class Bounds extends Pos {
    constructor({ x = 1, y = 1, z = 1 }) {
        if (x < 1 || y < 1 || z < 1)
            throw new Error("value in Bounds cannot be less than one");
        super({ x, y, z });
    }
}
exports.Bounds = Bounds;
class Rotate extends classes_1.Equatable {
    constructor({ direction = enums_1.Direction.Forwards, orientation = enums_1.Orientation.Up, }) {
        super(["dir", "or"]);
        this.dir = direction;
        this.or = orientation;
    }
    get direction() {
        return this.dir;
    }
    get orientation() {
        return this.or;
    }
    get xAxis() { return enums_1.rotateTable[this.dir][this.or].xAxis; }
    get zAxis() { return enums_1.rotateTable[this.dir][this.or].zAxis; }
    get offset() {
        let entry = enums_1.rotateTable[this.dir][this.or];
        return new Pos({
            x: entry.x,
            y: entry.y,
            z: entry.z
        });
    }
}
exports.Rotate = Rotate;
//# sourceMappingURL=classes.js.map