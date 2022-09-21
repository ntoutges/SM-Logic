import { Color } from "../../../support/colors/classes";
import { BasicKey } from "../../../support/context/classes";
import { MultiConnections } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";

export interface BitInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections
}

export interface BitsInterface {
  key: BasicKey,
  depth: number,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections
}

export interface ByteInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number,
  connections?: MultiConnections
}