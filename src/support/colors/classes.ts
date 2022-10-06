import { Equatable } from "../support/classes";
import { Colors } from "./enums";
import { RGBInterface } from "./interfaces";

export class RGB extends Equatable {
  private _r: number;
  private _g: number;
  private _b: number;
  constructor({
    r = 0,
    g = 0,
    b = 0,
  }: RGBInterface
  ) {
    super(["_r","_g","_b"]);
    this._r = r;
    this._g = g;
    this._b = b;
  }
  get r(): number { return this.r; }
  get g(): number { return this.g; }
  get b(): number { return this.b; }
  set r(r:number) { this._r = r; }
  set g(g:number) { this._g = g; }
  set b(b:number) { this._b = b; }
}

export class Color extends Equatable {
  private _color: Colors;
  constructor(color: Colors = Colors.Lightgrey) {
    super(["_color"]);
    this._color = color;
  }
  _hexToRGB(hex: string): RGB {
    hex = hex.replace("#", ""); // remove any '#' if they are passed in
    let rgbNum: number = parseInt(hex, 16);
    // extract rgb values from [rgbNum]
    let r: number = Math.floor(rgbNum / Math.pow(256,2)) % 256;
    let g: number = Math.floor(rgbNum /          256   ) % 256;
    let b: number =            rgbNum                    % 256;
    return new RGB({r,g,b});
  }
  get rgb(): RGB { return this._hexToRGB(this._color); }
  get hex(): string { return this._color; }
  get color(): Colors { return this._color; }
  set color(color: Colors) { this._color = color };
}

export class HexColor extends Color {
  constructor(rgb: String) {
    super(rgb as Colors);
  }
}