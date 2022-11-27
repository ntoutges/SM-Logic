import { Block } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { BasicKey, Key } from "../support/context/classes";
import { Bounds, Pos, Rotate } from "../support/spatial/classes";
import { Unit } from "./classes";

export interface UnitInterface {
  pos?: Pos,
  rotate?: Rotate,
  color?: Color
}

export interface ContainerInterface extends UnitInterface {
  child?: Unit,
  children?: Array<Unit>,
  key?: Key
}

export interface GridInterface extends ContainerInterface {
  size: Bounds,
  spacing?: Bounds
}

export interface BlocInterface extends UnitInterface {
  key: Key,
  child: Unit,
  size: Bounds
}

export interface BodyInterface {
  key?: BasicKey,
  name?: string,
  description?: string,
  debug?: boolean
}
