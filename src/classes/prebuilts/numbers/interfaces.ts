import { UnitInterface } from "../../../containers/interfaces";
import { Color } from "../../../support/colors/classes";
import { BasicKey } from "../../../support/context/classes";
import { Connections, MultiConnections } from "../../../support/logic/classes";
import { IntegerValue } from "../../../support/numbers/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { Bits } from "../memory/classes";
import { Counter, Integer } from "./classes";
import { CompareOperation, IntegerTypes } from "./enums";

export interface IntegerInterface extends UnitInterface {
  bits: Bits | Counter,
  // type?: IntegerTypes
}

export interface ConstantCompareInterface {
  key: BasicKey,
  value: IntegerValue,
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
  value: IntegerValue,
  constant: number
  pos?: Pos,
  color?: Color,
  rotate?: Rotate
  slowMode?: boolean
}

export interface CounterInterface extends UnitInterface {
  key: BasicKey
  depth?: number
  connections?: MultiConnections
}
