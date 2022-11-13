import { Color } from "../../../../support/colors/classes";
import { BasicKey, KeyMap } from "../../../../support/context/classes";
import { MultiConnections } from "../../../../support/logic/classes";
import { Bounds2d, Pos, Rotate } from "../../../../support/spatial/classes";
import { Logic } from "../../../blocks/basics";

export interface MemoryRowInterface {
  key: BasicKey,
  bitKeys?: KeyMap,
  connections?: MultiConnections
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  length?: number
}

export interface AddressableMemoryRowInterface extends MemoryRowInterface {
  signal: Array<Logic>,
  padding?: number
}

export interface MemoryGridInterface {
  key: BasicKey,
  signal: Array<Logic>
  bitKeys?: KeyMap,
  connections?: MultiConnections
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  size?: Bounds2d,
  padding?: number
}

export interface MemorySelectorInterface {
  key: BasicKey,
  signal: Array<Logic>
  bitKeys?: KeyMap,
  size?: Bounds2d,
  connections?: MultiConnections
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}
