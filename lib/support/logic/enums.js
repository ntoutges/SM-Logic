"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = exports.LogicalOperation = exports.LogicalType = void 0;
var LogicalType;
(function (LogicalType) {
    LogicalType[LogicalType["And"] = 0] = "And";
    LogicalType[LogicalType["Or"] = 1] = "Or";
    LogicalType[LogicalType["Xor"] = 2] = "Xor";
    LogicalType[LogicalType["Nand"] = 3] = "Nand";
    LogicalType[LogicalType["Nor"] = 4] = "Nor";
    LogicalType[LogicalType["XNor"] = 5] = "XNor";
})(LogicalType = exports.LogicalType || (exports.LogicalType = {}));
var LogicalOperation;
(function (LogicalOperation) {
    LogicalOperation[LogicalOperation["And"] = 0] = "And";
    LogicalOperation[LogicalOperation["Or"] = 1] = "Or";
    LogicalOperation[LogicalOperation["Xor"] = 2] = "Xor";
    LogicalOperation[LogicalOperation["Nand"] = 3] = "Nand";
    LogicalOperation[LogicalOperation["Nor"] = 4] = "Nor";
    LogicalOperation[LogicalOperation["XNor"] = 5] = "XNor";
    LogicalOperation[LogicalOperation["Input"] = 6] = "Input";
    LogicalOperation[LogicalOperation["Output"] = 7] = "Output";
    LogicalOperation[LogicalOperation["Buffer"] = 8] = "Buffer";
    LogicalOperation[LogicalOperation["Not"] = 9] = "Not";
})(LogicalOperation = exports.LogicalOperation || (exports.LogicalOperation = {}));
var Time;
(function (Time) {
    Time[Time["Tick"] = 1] = "Tick";
    Time[Time["Millisecond"] = 0.025] = "Millisecond";
    Time[Time["Second"] = 40] = "Second";
    Time[Time["Minute"] = 2400] = "Minute";
})(Time = exports.Time || (exports.Time = {}));
//# sourceMappingURL=enums.js.map