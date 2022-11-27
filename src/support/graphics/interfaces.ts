import { Bounds2d, Pos2d } from "../spatial/classes";
import { Circle, Rect } from "./classes"

export interface FrameBuilderInterface {
  size: Bounds2d,
  defaultFill?: boolean,
  builder: (
    step: number,
    Circle: (param: CircleInterface) => Circle,
    Rect:   (param: RectInterface) => Rect
  ) => void;
}

export interface ShapeInterface {
  pos: Pos2d,
  fill?: boolean,
  rotateAngle?: number
}

export interface CircleInterface extends ShapeInterface {
  radius: number
}

export interface RectInterface extends ShapeInterface {
  bounds: Bounds2d
}