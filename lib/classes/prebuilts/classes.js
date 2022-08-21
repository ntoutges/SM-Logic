"use strict";
/// assemblies of prebuilt structures
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bit = void 0;
const classes_1 = require("../../containers/classes");
const classes_2 = require("../../support/context/classes");
const classes_3 = require("../../support/logic/classes");
const enums_1 = require("../../support/logic/enums");
const classes_4 = require("../../support/spatial/classes");
const basics_1 = require("../blocks/basics");
class Bit extends classes_1.Container {
    constructor({ key }) {
        const setBitKey = new classes_2.UniqueCustomKey({ key: key, identifier: "bit0" });
        const resetBitKey = new classes_2.UniqueCustomKey({ key: key, identifier: "bit1" });
        const bufferBitKey = new classes_2.UniqueCustomKey({ key: key, identifier: "bit2" });
        super({
            key: key,
            children: [
                new basics_1.Logic({
                    key: setBitKey,
                    connections: new classes_3.Connections([new classes_2.Id(resetBitKey)]),
                    operation: new classes_3.Operation({ operation: enums_1.LogicalOperation.Nor }),
                    pos: new classes_4.Pos({ "x": -1 })
                }),
                new basics_1.Logic({
                    key: resetBitKey,
                    connections: new classes_3.Connections([new classes_2.Id(bufferBitKey)]),
                    operation: new classes_3.Operation({ operation: enums_1.LogicalOperation.Nor }),
                    pos: new classes_4.Pos({ "y": 1 })
                }),
                new basics_1.Logic({
                    key: bufferBitKey,
                    connections: new classes_3.Connections([new classes_2.Id(setBitKey)]),
                    pos: new classes_4.Pos({ "x": 1 })
                })
            ]
        });
        this._io = new Map();
        this._io.set("set", setBitKey);
        this._io.set("reset", resetBitKey);
    }
    get setId() { return new classes_2.Id(this._io.get("set")); }
    get resetId() { return new classes_2.Id(this._io.get("reset")); }
    build(offset = new classes_4.Pos({})) {
        return (new classes_1.Container({
            children: this.children
        })).build(offset);
    }
}
exports.Bit = Bit;
//# sourceMappingURL=classes.js.map