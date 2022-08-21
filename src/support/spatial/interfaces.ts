import { Pos } from "./classes";
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

export interface RotateInterface {
  direction?: Direction,
  orientation?: Orientation,
}