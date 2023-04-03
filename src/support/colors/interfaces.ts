import { Color, RGB } from "./classes"
import { Colors } from "./enums"

export interface RGBInterface {
  r?: number,
  g?: number,
  b?: number,
}

export interface RGBColorInterface {
  rgb: RGB,
  map?: {
    r?: [ min:number, max:number ],
    g?: [ min:number, max:number ],
    b?: [ min:number, max:number ]
  }
}

export interface RGBGreyscaleInterface {
  rWeight?: number,
  gWeight?: number,
  bWeight?: number
}

export interface ColorListInterface {
  colors: Color[]
}

export interface ColorNameListInterface {
  colors: Colors[]
}