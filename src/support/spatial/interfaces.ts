import { Pos, Rotate } from "./classes";
import { Direction, Orientation } from "./enums";

export interface PosInterface {
  x?: number,
  y?: number,
  z?: number,
}

export interface RelativePosInterface {
  x?: number,
  y?: number,
  z?: number,
  pos: Pos,
}

export interface BoundsInterface extends PosInterface {}

export interface RotateInterface {
  direction?: Direction,
  orientation?: Orientation,
}

export interface OffsetInterface {
  pos?: Pos,
  rotate?: Rotate  
}