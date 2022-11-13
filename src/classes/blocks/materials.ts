import { Color, HexColor } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Bounds, Offset } from "../../support/spatial/classes";
import { ShapeIds } from "../shapeIds";
import { Block } from "./basics";
import { ScalableInterface } from "./interfaces";

export class Scalable extends Block {
  readonly bounds: Bounds;
  constructor({
    key,
    bounds,
    color = new Color(Colors.Pink),
    pos,
    rotate
  }: ScalableInterface, shapeId: ShapeIds) {
    super({ key,pos,rotate,color,shapeId });
    this.bounds = bounds;
    this._addProps(["bounds"]);
  }
  /*
    doc test
  */
  build(offset: Offset = new Offset({})) {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.rotate(rotation).add(offset.pos).add( rotation.offset );
    const json = {
      "bounds": this.bounds.rotate(rotation).build(),
      "color": this.color.hex,
      "pos": this.pos.build(),
      "shapeId": this.shapeId,
      "xaxis": 1,
      "zaxis": 3
    }
    return JSON.stringify(json);
  }
}

// essentials
export class Wood extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.SM_Default);
    super(opt, ShapeIds.Wood);
  }
}

export class Glass extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.White);
    super(opt, ShapeIds.Glass);
  }
}

// variety
export class Cardboard extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Beige);
    super(opt, ShapeIds.Cardboard);
  }
}

export class Concrete extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.SM_Black);
    super(opt, ShapeIds.Concrete);
  }
}

export class Metal extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Silver);
    super(opt, ShapeIds.Metal);
  }
}

export class Barrier extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Yellow);
    super(opt, ShapeIds.Caution);
  }
}
export const Caution = Barrier;

export class Bricks extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Crimson);
    super(opt, ShapeIds.Bricks);
  }
}

