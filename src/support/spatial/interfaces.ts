import { Bounds, Pos, Rotate } from "./classes";
import { Direction, Orientation } from "./enums";

export interface PosInterface {
  x?: number,
  y?: number,
  z?: number,
}

export interface Pos2dInterface {
  x?: number,
  y?: number
}

export interface RelativePosInterface {
  x?: number,
  y?: number,
  z?: number,
  pos: Pos,
}

export interface BoundsInterface extends PosInterface {}
export interface Bounds2dInterface extends Pos2dInterface {}

export interface Bounds2dRemapInterface {
  xMap?: string,
  yMap?: string
}

export interface RotateInterface {
  direction?: Direction,
  orientation?: Orientation,
}

export interface OffsetInterface {
  pos?: Pos,
  rotate?: Rotate  
}

export interface AreaInterface {
  origin: Pos,
  bounds: Bounds
}