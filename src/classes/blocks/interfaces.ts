import { UnitInterface } from "../../containers/interfaces";
import { Id, Key } from "../../support/context/classes";
import { Connections, Operation } from "../../support/logic/classes";
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

export interface ButtonInterface extends StandardInterface {
  connections?: Connections
}
