import { Equatable } from "../support/classes";
import { Colors } from "./enums";
import { ColorListInterface, ColorNameListInterface, RGBColorInterface, RGBInterface } from "./interfaces";

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
    this._r = Math.round(r);
    this._g = Math.round(g);
    this._b = Math.round(b);
  }
  get r(): number { return this._r; }
  get g(): number { return this._g; }
  get b(): number { return this._b; }
  set r(r:number) { this._r = r; }
  set g(g:number) { this._g = g; }
  set b(b:number) { this._b = b; }

  get hex(): string {
    // garuntee leading '0's in hex string
    return (16777216 + (this._r * 65536) + (this._g * 256) + (this._b)).toString(16).substring(1,7);
  }
  greyscale(weights:RGB = new RGB({ r:1,g:1,b:1 })): number {
    const weightTotal = (weights.r + weights.g + weights.b);
    return (this.r*weights.r + this.g*weights.g + this.b*weights.b) / (weightTotal | 1);
  }

  difference(other: RGB) {
    return new RGB({
      r: Math.abs(this.r - other.r),
      g: Math.abs(this.g - other.g),
      b: Math.abs(this.b - other.b)
    });
  }
}

export class MonoRGB extends RGB {
  constructor(monocolor: number) {
    super({
      r: monocolor,
      g: monocolor,
      b: monocolor
    });
  }
}

export class Color extends Equatable {
  private color: Colors;
  constructor(color: Colors = Colors.Lightgrey) {
    super(["_color"]);
    this.color = color;
  }
  private _hexToRGB(hex: string): RGB {
    hex = hex.replace("#", ""); // remove any '#' if they are passed in
    let rgbNum: number = parseInt(hex, 16);
    // extract rgb values from [rgbNum]
    let r: number = Math.floor(rgbNum / Math.pow(256,2)) % 256;
    let g: number = Math.floor(rgbNum /          256   ) % 256;
    let b: number =            rgbNum                    % 256;
    return new RGB({r,g,b});
  }
  get rgb(): RGB { return this._hexToRGB(this.color); }
  get hex(): string { return this.color; }
}

export class HexColor extends Color {
  constructor(rgb: String) {
    super(rgb as Colors);
  }
}

export class RGBColor extends HexColor {
  constructor({
    rgb,
    map = {}
  }: RGBColorInterface) {
    let colors = [ rgb.r, rgb.g, rgb.b ];
    const colorKey = ["r", "g", "b"]
    let maps = [ map.r, map.g, map.b ];
    
    for (let i in colors) {
      if (maps[i] == undefined) { maps[i] = [0, 255]; } // define with default value
      const color = colors[i];
      const name = colorKey[i];
      const cMap = maps[i]
      if (cMap[0] == cMap[1]) throw new Error(`map.${name} [min] and [max] values cannot be the same. (${cMap[0]} == ${cMap[1]})`);
      if (color < cMap[0]) throw new Error(`red value (${color}) less than [min] (${cMap[0]})`);
      if (color > cMap[1]) throw new Error(`red value (${color}) greater than [max] (${cMap[1]})`);
      colors[i] = Math.round(255 * (color - cMap[0]) / (cMap[1] - cMap[0] ))
    }

    // ensures that strings are always of length 2, and will contain a leading "0", if necessary
    const rStr = ("0" + colors[0].toString(16)).slice(-2);
    const gStr = ("0" + colors[1].toString(16)).slice(-2);
    const bStr = ("0" + colors[2].toString(16)).slice(-2);

    super(rStr + gStr + bStr)
  }
}

export class ColorList extends Equatable {
  readonly colors: Color[];
  constructor({
    colors
  }: ColorListInterface) {
    super(["colors"]);
    this.colors = colors;
  }

  isEmpty() { return this.colors.length == 0; }
}

export class ColorNameList extends ColorList {
  constructor({
    colors
  }: ColorNameListInterface) {
    const colorClasses: Color[] = [];
    for (const color of colors) {
      colorClasses.push( new Color(color) );
    }
    super({ colors: colorClasses });
  }
}