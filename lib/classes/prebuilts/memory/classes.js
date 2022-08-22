"use strict";
/// assemblies of prebuilt structures
Object.defineProperty(exports, "__esModule", { value: true });
exports.Byte = exports.Bit = void 0;
const classes_1 = require("../../../containers/classes");
const classes_2 = require("../../../support/colors/classes");
const classes_3 = require("../../../support/context/classes");
const classes_4 = require("../../../support/logic/classes");
const enums_1 = require("../../../support/logic/enums");
const classes_5 = require("../../../support/spatial/classes");
const basics_1 = require("../../blocks/basics");
class Bit extends classes_1.Container {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color() }) {
        const setBitKey = new classes_3.UniqueCustomKey({ key: key, identifier: "bit0" });
        const resetBitKey = new classes_3.UniqueCustomKey({ key: key, identifier: "bit1" });
        const bufferBitKey = new classes_3.UniqueCustomKey({ key: key, identifier: "bit2" });
        super({
            key,
            pos,
            rotate,
            children: [
                new basics_1.Logic({
                    key: setBitKey,
                    connections: new classes_4.Connections([new classes_3.Id(resetBitKey)]),
                    operation: new classes_4.Operation({ operation: enums_1.LogicalOperation.Nor }),
                    pos: pos.add(new classes_5.Pos({ "x": -1 })),
                    color
                }),
                new basics_1.Logic({
                    key: resetBitKey,
                    connections: new classes_4.Connections([new classes_3.Id(bufferBitKey)]),
                    operation: new classes_4.Operation({ operation: enums_1.LogicalOperation.Nor }),
                    pos: pos.add(new classes_5.Pos({ "y": 1 })),
                    color
                }),
                new basics_1.Logic({
                    key: bufferBitKey,
                    connections: new classes_4.Connections([new classes_3.Id(setBitKey)]),
                    pos: pos.add(new classes_5.Pos({ "x": 1 })),
                    color
                })
            ]
        });
        this._io = new Map();
        this._io.set("set", setBitKey);
        this._io.set("reset", resetBitKey);
    }
    get setId() { return new classes_3.Id(this._io.get("set")); }
    get resetId() { return new classes_3.Id(this._io.get("reset")); }
    build(offset = new classes_5.Pos({})) {
        return (new classes_1.Container({
            children: this.children
        })).build(offset);
    }
}
exports.Bit = Bit;
class Byte extends classes_1.Container {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), }) {
        let bits = [];
        for (let i = 0; i < 8; i++) {
            bits.push(new Bit({
                key: key,
                pos: pos.add(new classes_5.Pos({ "y": i })),
                rotate,
                color
            }));
        }
        super({
            key: key,
            children: bits
        });
        this._bits = bits;
    }
    get bit0() { return this._bits[0]; }
    get bit1() { return this._bits[1]; }
    get bit2() { return this._bits[2]; }
    get bit3() { return this._bits[3]; }
    get bit4() { return this._bits[4]; }
    get bit5() { return this._bits[5]; }
    get bit6() { return this._bits[6]; }
    get bit7() { return this._bits[7]; }
}
exports.Byte = Byte;
//# sourceMappingURL=classes.js.map