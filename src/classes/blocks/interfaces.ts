import { UnitInterface } from "../../containers/interfaces";
import { Id, Key } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { Bounds } from "../../support/spatial/classes";
import { ShapeIds } from "../shapeIds";

interface StandardInterface extends UnitInterface {
  key: Key
}

export interface BlockInterface extends StandardInterface {
  shapeId: ShapeIds
}

export interface BasicLogicInterface extends BlockInterface {
  connections?: Connections
}

export interface LogicInterface extends StandardInterface {
  operation?: Operation,
  connections?: Connections
}

export interface TimerInterface extends StandardInterface {
  delay?: Delay,
  connections?: Connections
}

export interface ButtonInterface extends StandardInterface {
  connections?: Connections
}

export interface ScalableInterface extends StandardInterface {
  bounds: Bounds
}