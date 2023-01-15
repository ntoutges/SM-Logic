import { Color } from "../../../support/colors/classes";
import { BasicKey, Id, KeyMap } from "../../../support/context/classes";
import { Frame, Frames } from "../../../support/frames/classes";
import { BitMask, Delay, Delays, MultiConnections } from "../../../support/logic/classes";
import { Bounds2d, Pos, Rotate } from "../../../support/spatial/classes";
import { Charsets } from "../../../support/frames/graphics";

export interface FutureBitMapInterface {
  key: BasicKey,
  size: Bounds2d,
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
  color?: Color,
  charset?: Charsets
}

export interface VideoDisplayInterface {
  key: BasicKey,
  frames: Frames,
  frameTime?: Delay,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}
