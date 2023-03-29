import { DraggableIds } from "../../classes/shapeIds";
import { Color } from "../colors/classes";
import { Colors } from "../colors/enums";
import { Frame } from "../frames/classes";
import { Bounds2d } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { LayerInterface, LayersInterface, MaterialInterface } from "./interfaces";

export class Material extends Equatable {
  readonly type: DraggableIds;
  readonly color: Color;
  constructor({
    type,
    color = new Color(Colors.SM_Orange)
  }: MaterialInterface) {
    super([ "type", "color" ]);
    this.type = type;
    this.color = color;
  }
}

export class Layer extends Equatable {
  readonly frame: Frame;
  readonly material: Material;
  constructor({
    frame,
    material,
    size = null
  }: LayerInterface) {
    super([ "frame", "material" ]);

    this.frame = (size == null) ? frame : frame.resize( size );
    this.material = material;
  }

  get height() { return this.frame.height; }
  get width() { return this.frame.width; }

  resize(size: Bounds2d) {
    return new Layer({
      frame: this.frame,
      material: this.material
    });
  }
}

export class Layers extends Equatable {
  readonly layers: Layer[];
  constructor({
    layers,
    size = null
  }: LayersInterface) {
    super(["layers"]);

    if (size == null) {
      let maxWidth = 1;
      let maxHeight = 1;
      for (const layer of layers) {
        maxWidth = Math.max(maxWidth, layer.width);
        maxHeight = Math.max(maxHeight, layer.height);
      }
      size = new Bounds2d({
        x: maxWidth,
        y: maxHeight
      });
    }

    this.layers = [];
    for (const layer of layers) {
      this.layers.push( layer.resize(size) );
    }
  }
}