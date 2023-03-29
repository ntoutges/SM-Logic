import { DraggableIds } from "../../classes/shapeIds";
import { Color } from "../colors/classes";
import { Frame } from "../frames/classes";
import { Bounds2d } from "../spatial/classes";
import { Layer, Material } from "./classes";

export interface MaterialInterface {
  type: DraggableIds
  color?: Color
}

export interface LayerInterface {
  material: Material
  frame: Frame
  size?: Bounds2d
}

export interface LayersInterface {
  layers: Layer[]
  size?: Bounds2d
}