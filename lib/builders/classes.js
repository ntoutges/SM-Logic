"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const basics_1 = require("../classes/blocks/basics");
const shapeIds_1 = require("../classes/shapeIds");
const classes_1 = require("../support/context/classes");
class Builder extends basics_1.Block {
    constructor(builder) {
        super({
            shapeId: shapeIds_1.ShapeIds.None,
            key: new classes_1.Keyless()
        });
        this._builder = builder;
    }
    build(offset) { return this._builder().build(offset); }
}
exports.Builder = Builder;
//# sourceMappingURL=classes.js.map