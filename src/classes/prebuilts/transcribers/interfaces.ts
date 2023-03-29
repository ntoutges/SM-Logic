import { UnitInterface } from "../../../containers/interfaces";
import { Colors } from "../../../support/colors/enums";
import { Frame } from "../../../support/frames/classes";
import { Layers } from "../../../support/layers/classes";
import { Bounds2d } from "../../../support/spatial/classes";
import { DraggableIds } from "../../shapeIds";

export interface Custom2dShapeInterface extends UnitInterface {
  frame: Frame,
  trueMaterial?: DraggableIds
  falseMaterial?: DraggableIds
}

export interface MuralInterface extends UnitInterface {
  layers: Layers
  bounds?: Bounds2d
}