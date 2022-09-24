import { Color } from "../../../support/colors/classes";
import { BasicKey, Id, KeyMap } from "../../../support/context/classes";
import { BitMask, Delay, Delays, Frame, Frames } from "../../../support/logic/classes";
import { Bounds2d, Pos, Rotate } from "../../../support/spatial/classes";

export interface FrameInterface {
  size: Bounds2d,
  value: Array<BitMask>,
  fallback?: boolean
}

export interface FramesInterface {
  frames: Array<Frame>,
  size?: Bounds2d
}

export interface PhysicalFrameInterface {
  frame: Frame,
  id: Id
}

export interface FutureBitMapInterface {
  key: BasicKey,
  size: Bounds2d,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface BitMapInterface {
  key: BasicKey,
  frames: Frames,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface SimpleBitMapInterface {
  key: BasicKey,
  frame: Frame,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface SevenSegmentInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface CharacterDisplayInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface VideoDisplayInterface {
  key: BasicKey,
  frames: Frames,
  frameTime?: Delay,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  bitKeys?: KeyMap
}

export interface DelayUnitInterface {
  key: BasicKey,
  delays: Delays
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}