"use strict";
/// assemblies of prebuilt structures
Object.defineProperty(exports, "__esModule", { value: true });
exports.Byte = exports.Nibble = exports.Bits = exports.Bit = void 0;
const classes_1 = require("../../../containers/classes");
const classes_2 = require("../../../support/colors/classes");
const classes_3 = require("../../../support/context/classes");
const classes_4 = require("../../../support/logic/classes");
const enums_1 = require("../../../support/logic/enums");
const classes_5 = require("../../../support/spatial/classes");
const basics_1 = require("../../blocks/basics");
class Bit extends classes_1.Container {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), placeValue = 1 }) {
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
                    pos: pos.add(new classes_5.Pos({ "y": -1 })),
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
        this._placeValue = placeValue;
    }
    get setId() { return new classes_3.Id(this._io.get("set")); }
    get resetId() { return new classes_3.Id(this._io.get("reset")); }
    get placeValue() { return this._placeValue; }
    build(offset = new classes_5.Pos({})) {
        return (new classes_1.Container({
            children: this.children
        })).build(offset);
    }
}
exports.Bit = Bit;
class Bits extends classes_1.Container {
    constructor({ key, depth = 8, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), placeValue = 1 }) {
        if (depth < 1)
            throw new Error("Bit depth must be at least 1");
        let bits = [];
        for (let i = 0; i < depth; i++) {
            bits.push(new Bit({
                key: key,
                pos: pos.add(new classes_5.Pos({ "z": i })),
                rotate,
                color,
                placeValue: placeValue * Math.pow(2, i)
            }));
        }
        super({
            key: key,
            children: bits
        });
        this._bits = bits;
    }
    get bits() { return this._bits; }
    getBit(place) { return this.bits[place]; }
    get reset() {
        const ids = new classes_3.KeylessFutureId();
        for (let bit of this._bits) {
            ids.addId(bit.resetId);
        }
        return ids;
    }
    set(map) {
        const ids = new classes_3.KeylessFutureId();
        for (let i = 0; i < this._bits.length; i++) {
            if (i >= map.mask.length)
                ids.addId(this._bits[i].resetId);
            else if (map.mask[i])
                ids.addId(this.bits[i].setId); // enabled
            else
                ids.addId(this.bits[i].resetId); // disabled
        }
        return ids;
    }
}
exports.Bits = Bits;
class Nibble extends Bits {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), }) {
        super({
            key: key,
            depth: 4,
            pos: pos,
            rotate: rotate,
            color: color
        });
    }
    get bit0() { return super.getBit(0); }
    get bit1() { return super.getBit(1); }
    get bit2() { return super.getBit(2); }
    get bit3() { return super.getBit(3); }
}
exports.Nibble = Nibble;
class Byte extends Bits {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), }) {
        super({
            key: key,
            depth: 8,
            pos: pos,
            rotate: rotate,
            color: color
        });
    }
    get bit0() { return super.getBit(0); }
    get bit1() { return super.getBit(1); }
    get bit2() { return super.getBit(2); }
    get bit3() { return super.getBit(3); }
    get bit4() { return super.getBit(4); }
    get bit5() { return super.getBit(5); }
    get bit6() { return super.getBit(6); }
    get bit7() { return super.getBit(7); }
}
exports.Byte = Byte;
//# sourceMappingURL=classes.js.map