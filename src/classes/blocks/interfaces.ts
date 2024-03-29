import { UnitInterface } from "../../containers/interfaces";
import { Color } from "../../support/colors/classes";
import { Id, Key } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { Bounds } from "../../support/spatial/classes";
import { ShapeIds } from "../shapeIds";

interface StandardInterface extends UnitInterface {}

export interface BlockInterface extends StandardInterface {
  shapeId: ShapeIds
}

export interface BasicLogicInterface extends BlockInterface {
  key: Key
  connections?: Connections
}

export interface LogicInterface extends StandardInterface {
  key: Key
  connections?: Connections
  operation?: Operation
}

export interface TimerInterface extends LogicInterface {
  delay?: Delay
}

export interface ButtonInterface extends StandardInterface {
  key: Key
  connections?: Connections
}

export interface ScalableInterface extends StandardInterface {
  bounds: Bounds
}

export interface SensorInterface extends StandardInterface {
  key: Key
  connections?: Connections
  range?: number
  colorMode?: Color
  buttonMode?: boolean
}

export interface LightInterface extends StandardInterface {
  key: Key
  luminance?: number
}