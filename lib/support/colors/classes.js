"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = exports.RGB = void 0;
const classes_1 = require("../support/classes");
const enums_1 = require("./enums");
class RGB extends classes_1.Equatable {
    constructor({ r = 0, g = 0, b = 0, }) {
        super(["_r", "_g", "_b"]);
        this._r = r;
        this._g = g;
        this._b = b;
    }
    get r() { return this.r; }
    get g() { return this.g; }
    get b() { return this.b; }
    set r(r) { this._r = r; }
    set g(g) { this._g = g; }
    set b(b) { this._b = b; }
}
exports.RGB = RGB;
class Color extends classes_1.Equatable {
    constructor(color = enums_1.Colors.Lightgrey) {
        super(["_color"]);
        this._color = color;
    }
    hexToRGB(hex) {
        hex = hex.replace("#", ""); // remove any '#' if they are passed in
        let rgbNum = parseInt(hex, 16);
        // extract rgb values from [rgbNum]
        let r = Math.floor(rgbNum / Math.pow(256, 2)) % 256;
        let g = Math.floor(rgbNum / 256) % 256;
        let b = rgbNum % 256;
        return new RGB({ r, g, b });
    }
    get rgb() { return this.hexToRGB(this._color); }
    get hex() { return this._color; }
    get color() { return this._color; }
    set color(color) { this._color = color; }
    ;
}
exports.Color = Color;
//# sourceMappingURL=classes.js.map