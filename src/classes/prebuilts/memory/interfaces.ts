import { Color } from "../../../support/colors/classes";
import { BasicKey } from "../../../support/context/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";

export interface BitInterface {
  key: BasicKey,
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  placeValue?: number
}

export interface BitsInterface extends BitInterface {
  depth: number
}

export interface ByteInterface extends BitInterface {}