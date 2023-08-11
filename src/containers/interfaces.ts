import { Color } from "../support/colors/classes";
import { BasicKey, Key } from "../support/context/classes";
import { Bounds, Bounds2d, Pos, Rotate } from "../support/spatial/classes";
import { Unit } from "./classes";
import { AlignH, AlignV } from "./enums";
import { ExportType } from "./jsonformat";

export interface UnitInterface {
  pos?: Pos
  rotate?: Rotate
  color?: Color
}

export interface UnitInterface2 extends UnitInterface {
  bounds?: Bounds
}

export interface ContainerInterface extends UnitInterface {
  child?: Unit
  children?: Array<Unit>
}

export interface GridInterface extends ContainerInterface {
  size: Bounds
  spacing?: Bounds
}

export interface PackagerInterface extends ContainerInterface {
  packageA: string
}

export interface BlocInterface extends UnitInterface {
  child: Unit
  size: Bounds
}

export interface BodyInterface {
  key?: BasicKey
  title?: string
  description?: string
  debug?: boolean
}

export interface StandardPlateInterface extends UnitInterface {
  gridSize?: Bounds2d
  gridSpacing?: Bounds2d
  children: Unit[]
  horizontalAlign?: AlignH
  verticalAlign?: AlignV
}

export interface DeconstructorInterface extends UnitInterface {
  key: BasicKey
  toDeconstruct: ExportType
}