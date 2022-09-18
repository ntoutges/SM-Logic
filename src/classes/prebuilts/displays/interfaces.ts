import { Color } from "../../../support/colors/classes";
import { BasicKey, Id } from "../../../support/context/classes";
import { BitMask, Delay, Delays, Frame, Frames } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";

export interface FrameInterface {
  width: number,
  height: number,
  value: Array<BitMask>,
  fallback?: boolean
}

export interface FramesInterface {
  frames: Array<Frame>,
  height?: number,
  width?: number
}

export interface FrameResizeInterface {
  width?: number
  height?: number
}

export interface PhysicalFrameInterface {
  frame: Frame,
  id: Id
}

export interface FutureBitMapInterface {
  key: BasicKey,
  height: number,
  width: number,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface BitMapInterface {
  key: BasicKey,
  frames: Frames,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface SimpleBitMapInterface {
  key: BasicKey,
  frame: Frame,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface SevenSegmentInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface CharacterDisplayInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface VideoDisplayInterface {
  key: BasicKey,
  frames: Frames,
  frameTime?: Delay,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface DelayUnitInterface {
  key: BasicKey,
  delays: Delays
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}