"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delays = exports.NoDelay = exports.Delay = exports.RawBitMask = exports.BitMask = exports.Connections = exports.Operation = void 0;
const classes_1 = require("../context/classes");
const classes_2 = require("../support/classes");
const enums_1 = require("./enums");
class Operation extends classes_2.Equatable {
    constructor({ operation = enums_1.LogicalOperation.And, }) {
        super(["op"]);
        this.op = operation;
    }
    get operation() { return this.op; }
    set operation(op) { this.op = op; }
    get type() {
        switch (this.op) {
            case enums_1.LogicalOperation.And:
            case enums_1.LogicalOperation.Output:
                return enums_1.LogicalType.And;
            case enums_1.LogicalOperation.Or:
            case enums_1.LogicalOperation.Input:
            case enums_1.LogicalOperation.Buffer:
                return enums_1.LogicalType.Or;
            case enums_1.LogicalOperation.Xor:
                return enums_1.LogicalType.Xor;
            case enums_1.LogicalOperation.Nand:
                return enums_1.LogicalType.Nand;
            case enums_1.LogicalOperation.Nor:
            case enums_1.LogicalOperation.Not:
                return enums_1.LogicalType.Nor;
            case enums_1.LogicalOperation.XNor:
                return enums_1.LogicalType.XNor;
            default:
                return enums_1.LogicalType.And;
        }
    }
}
exports.Operation = Operation;
class Connections extends classes_2.Equatable {
    constructor(connections = []) {
        super(["_conns"]);
        this._conns = [];
        if (connections instanceof classes_1.Id)
            for (let numId of connections.ids) {
                this._conns.push(new classes_1.KeylessId(numId));
            }
        else
            this._conns = connections;
    }
    get connections() { return this._conns; }
    addConnection(id) {
        for (let numId of id.ids) {
            this._conns.push(new classes_1.KeylessId(numId));
        }
    }
    build() {
        if (this._conns.length == 0)
            return null;
        let connections = [];
        this._conns.forEach((id) => {
            connections = connections.concat(id.build());
        });
        return connections;
    }
}
exports.Connections = Connections;
class BitMask extends classes_2.Equatable {
    constructor(mask) {
        super(["_mask"]);
        this.mask = mask;
    }
}
exports.BitMask = BitMask;
/// pass in a number, such as 0xfc or 0x00110101
class RawBitMask extends BitMask {
    constructor(mask) {
        const newMask = [];
        const itts = Math.floor(Math.log(mask) / Math.LN2);
        for (let i = 0; i <= itts; i++) {
            let pow = Math.pow(2, itts - i);
            console.log(mask, pow);
            if (mask >= pow) {
                mask -= pow;
                newMask.push(true);
            }
            else
                newMask.push(false);
        }
        console.log(newMask);
        super(newMask);
    }
}
exports.RawBitMask = RawBitMask;
class Delay extends classes_2.Equatable {
    constructor({ delay, unit = enums_1.Time.Tick }) {
        super(["_delay"]);
        this._delay = Math.round(delay * unit); // don't allow fractional components
    }
    getDelay(unit = enums_1.Time.Tick) { return this._delay / unit; }
    add(delay) {
        return new Delay({
            delay: this.getDelay() + delay.getDelay(),
        });
    }
}
exports.Delay = Delay;
class NoDelay extends Delay {
    constructor() { super({ delay: -1 }); }
    add(delay) { return new NoDelay(); } // do nothing
}
exports.NoDelay = NoDelay;
class Delays extends classes_2.Equatable {
    constructor(delays) {
        super(["_delays"]);
        this._delays = delays;
    }
    add(delay) { this._delays.push(delay); }
    concat(delays) {
        for (let delay of delays) {
            this.add(delay);
        }
    }
    get length() { return this._delays.length; }
    get delays() { return this._delays; }
    get validDelays() {
        let valids = [];
        for (let delay of this._delays) {
            if (delay.getDelay() != -1)
                valids.push(delay);
        }
        return valids;
    }
}
exports.Delays = Delays;
//# sourceMappingURL=classes.js.map