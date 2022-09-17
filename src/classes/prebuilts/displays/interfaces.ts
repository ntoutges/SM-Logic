import { Color } from "../../../support/colors/classes";
import { BasicKey } from "../../../support/context/classes";
import { BitMask, Frame } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";

export interface FrameInterface {
  width: number,
  height: number,
  value: Array<BitMask>,
  fallback?: boolean
}

export interface FrameResizeInterface {
  width?: number
  height?: number
}

export interface BitMapInterface {
  key: BasicKey,
  frame: Frame,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}