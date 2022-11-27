import { UnitInterface } from "../../containers/interfaces";
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

export interface ButtonInterface extends LogicInterface {}

export interface ScalableInterface extends StandardInterface {
  bounds: Bounds
}