"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logic = exports.Block = void 0;
/// basic Scrap Mechanic block classes
const classes_1 = require("../../containers/classes");
const classes_2 = require("../../support/colors/classes");
const enums_1 = require("../../support/colors/enums");
const classes_3 = require("../../support/context/classes");
const classes_4 = require("../../support/logic/classes");
const enums_2 = require("../../support/logic/enums");
const classes_5 = require("../../support/spatial/classes");
const shapeIds_1 = require("../shapeIds");
class Block extends classes_1.Unit {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), color = new classes_2.Color(), shapeId = shapeIds_1.ShapeIds.Logic, // temp
     }) {
        super({ pos, rotate, color });
        this._addProps(["shapeId", "_id"]);
        this.pos = pos;
        this.rotation = rotate;
        this.color = color;
        this._id = new classes_3.Id(key);
        this.shapeId = shapeId;
    }
    get id() { return this._id; }
    build(offset = new classes_5.Pos({})) {
        let json = {
            "color": this.color,
            "controller": {
                "active": false,
                "controllers": null,
                "id": this.id.id,
                "joints": null
            },
            "pos": this.pos.add(offset).build(),
            "shapeId": this.shapeId,
            "xaxis": -3,
            "zaxis": 1
        };
        return JSON.stringify(json);
    }
}
exports.Block = Block;
// note: SM connections work as an id in the logic "sender"
class Logic extends Block {
    constructor({ key, pos = new classes_5.Pos({}), rotate = new classes_5.Rotate({}), operation = new classes_4.Operation({}), color = new classes_2.Color(enums_1.Colors.Lightgrey), connections = new classes_4.Connections(), }) {
        super({ pos, rotate, key, shapeId: shapeIds_1.ShapeIds.Logic });
        this._addProps(["op", "_color", "_conns"]);
        this.colorSet = false;
        this.op = operation;
        this._conns = connections;
        if (!this.updateTypeColor())
            this.color = color;
    }
    updateTypeColor() {
        this.colorSet = false;
        switch (this.op.operation) {
            case enums_2.LogicalOperation.Input:
                this.color = new classes_2.Color(enums_1.Colors.SM_Input);
                return true;
            case enums_2.LogicalOperation.Output:
                this.color = new classes_2.Color(enums_1.Colors.SM_Output);
                return true;
        }
        return false;
    }
    get operation() { return this.op; }
    set color(color) {
        super.color = color;
        this.colorSet = true;
    }
    ;
    set operation(operation) {
        this.op = operation;
        if (!this.colorSet)
            this.updateTypeColor();
    }
    get connections() { return this._conns.connections; }
    build(offset = new classes_5.Pos({})) {
        let json = {
            "color": this.color,
            "controller": {
                "active": false,
                "controllers": this._conns.build(),
                "id": this.id.id,
                "joints": null,
                "mode": this.op.type
            },
            "pos": this.pos.add(offset).build(),
            "shapeId": this.shapeId,
            "xaxis": -3,
            "zaxis": 1
        };
        return JSON.stringify(json);
    }
}
exports.Logic = Logic;
//# sourceMappingURL=basics.js.map