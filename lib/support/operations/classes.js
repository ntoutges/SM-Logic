"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const classes_1 = require("../support/classes");
const enums_1 = require("./enums");
class Operation extends classes_1.Equatable {
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
//# sourceMappingURL=classes.js.map