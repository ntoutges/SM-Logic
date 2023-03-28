import { UnitInterface } from "../../../containers/interfaces";
import { Colors } from "../../../support/colors/enums";
import { Frame } from "../../../support/frames/classes";
import { Bounds2d } from "../../../support/spatial/classes";
import { DraggableIds } from "../../shapeIds";

export interface Custom2dShapeInterface extends UnitInterface {
  frame: Frame,
  trueMaterial?: DraggableIds
  falseMaterial?: DraggableIds
}

interface Layer {
  frame: Frame
  material: {
    type: DraggableIds
    color?: Colors
  }
}

export interface MuralInterface extends UnitInterface {
  layers: Layer[]
  bounds: Bounds2d
}