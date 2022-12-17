import { Color } from "../../../support/colors/classes";
import { BasicKey, CustomKey, KeyMap, Keys } from "../../../support/context/classes";
import { Connections, MultiConnections } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";

export interface BitInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections,
  bitKeys?: KeyMap
}

export interface BitsInterface {
  key: BasicKey,
  depth: number,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections,
  bitKeys?: KeyMap
}

export interface ByteInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections,
  bitKeys?: KeyMap
}

export interface SmallBitInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  connections?: Connections
}