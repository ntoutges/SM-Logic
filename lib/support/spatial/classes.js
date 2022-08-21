"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotate = exports.RelativePos = exports.Pos = void 0;
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
}
exports.Rotate = Rotate;
//# sourceMappingURL=classes.js.map