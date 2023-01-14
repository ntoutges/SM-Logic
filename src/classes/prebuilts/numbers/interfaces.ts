import { Color } from "../../../support/colors/classes";
import { BasicKey, KeyMap } from "../../../support/context/classes";
import { Connections } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { CompareOperation } from "./enums";

export interface ConstantCompareInterface {
  key: BasicKey,
  signal: Array<Logic>,
  constant: number,
  operation: CompareOperation,
  ifC: Connections,
  elseC?: Connections,
  pos?: Pos,
  color?: Color,
  rotate?: Rotate,
  slowMode?: boolean
}

export interface EqualsConstantInterface {
  key: BasicKey,
  signal: Array<Logic>,
  constant: number
  pos?: Pos,
  color?: Color,
  rotate?: Rotate
  slowMode?: boolean
}