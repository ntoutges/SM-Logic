import { UnitInterface } from "../../../containers/interfaces";
import { Color } from "../../../support/colors/classes";
import { Frame } from "../../../support/frames/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { DraggableIds } from "../../shapeIds";

export interface AxisInterface {
  pos?: Pos,
  rotate?: Rotate
}

export interface Custom2dShapeInterface extends UnitInterface {
  frame: Frame,
  trueMaterial?: DraggableIds,
  falseMaterial?: DraggableIds
}