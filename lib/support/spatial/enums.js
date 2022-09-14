"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateTable = exports.Orientation = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["Forwards"] = 0] = "Forwards";
    Direction[Direction["Backwards"] = 1] = "Backwards";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
    Direction[Direction["Left"] = 4] = "Left";
    Direction[Direction["Right"] = 5] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Up"] = 0] = "Up";
    Orientation[Orientation["Down"] = 1] = "Down";
    Orientation[Orientation["Left"] = 2] = "Left";
    Orientation[Orientation["Right"] = 3] = "Right";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
exports.rotateTable = {
    0: {
        0: {
            xAxis: 3,
            zAxis: 1,
            x: -1,
            y: 0,
            z: 0
        },
        1: {
            xAxis: -3,
            zAxis: -1,
            x: 0,
            y: 0,
            z: 1
        },
        2: {
            xAxis: -1,
            zAxis: 3,
            x: 0,
            y: 0,
            z: 0
        },
        3: {
            xAxis: 1,
            zAxis: -3,
            x: -1,
            y: 0,
            z: 1
        }
    },
    1: {
        0: {
            xAxis: 3,
            zAxis: -1,
            x: 0,
            y: -1,
            z: 0
        },
        1: {
            xAxis: -3,
            zAxis: 1,
            x: -1,
            y: -1,
            z: 1
        },
        2: {
            xAxis: 1,
            zAxis: 3,
            x: -1,
            y: -1,
            z: 0
        },
        3: {
            xAxis: -1,
            zAxis: -3,
            x: 0,
            y: -1,
            z: 1
        }
    },
    2: {
        0: {
            xAxis: 2,
            zAxis: 1,
            x: -1,
            y: -1,
            z: 0
        },
        1: {
            xAxis: -2,
            zAxis: -1,
            x: 0,
            y: 0,
            z: 0
        },
        2: {
            xAxis: -1,
            zAxis: 2,
            x: 0,
            y: -1,
            z: 0
        },
        3: {
            xAxis: 1,
            zAxis: -2,
            x: -1,
            y: 0,
            z: 0
        }
    },
    3: {
        0: {
            xAxis: -2,
            zAxis: 1,
            x: -1,
            y: 0,
            z: 1
        },
        1: {
            xAxis: 2,
            zAxis: -1,
            x: 0,
            y: -1,
            z: 1
        },
        2: {
            xAxis: -1,
            zAxis: -2,
            x: 0,
            y: 0,
            z: 1
        },
        3: {
            xAxis: 1,
            zAxis: 2,
            x: -1,
            y: -1,
            z: 1
        }
    },
    4: {
        0: {
            xAxis: 3,
            zAxis: -2,
            x: 0,
            y: 0,
            z: 0
        },
        1: {
            xAxis: -3,
            zAxis: 2,
            x: 0,
            y: -1,
            z: 1
        },
        2: {
            xAxis: 2,
            zAxis: 3,
            x: 0,
            y: -1,
            z: 0
        },
        3: {
            xAxis: -2,
            zAxis: -3,
            x: 0,
            y: 0,
            z: 1
        }
    },
    5: {
        0: {
            xAxis: 3,
            zAxis: 2,
            x: -1,
            y: -1,
            z: 0
        },
        1: {
            xAxis: -3,
            zAxis: -2,
            x: -1,
            y: 0,
            z: 1
        },
        2: {
            xAxis: -2,
            zAxis: 3,
            x: -1,
            y: 0,
            z: 0
        },
        3: {
            xAxis: 2,
            zAxis: -3,
            x: -1,
            y: -1,
            z: 1
        }
    }
};
//# sourceMappingURL=enums.js.map