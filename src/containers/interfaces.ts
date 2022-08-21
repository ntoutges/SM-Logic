import { Block } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { BasicKey, Key } from "../support/context/classes";
import { Pos, Rotate } from "../support/spatial/classes";

export interface UnitInterface {
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
}

export interface ContainerInterface extends UnitInterface {
  child?: Block,
  children?: Array<Block>,
  key?: Key,
}

export interface BodyInterface {
  key?: BasicKey,
  name?: string,
  description?: string
}