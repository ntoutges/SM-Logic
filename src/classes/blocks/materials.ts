import { Color, HexColor } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { DraggableIds } from "../shapeIds";
import { Scalable } from "./basics";
import { ScalableInterface } from "./interfaces";

// essentials
export class Wood extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.SM_M_Wood);
    super(opt, DraggableIds.Wood);
  }
}

export class Glass extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.White);
    super(opt, DraggableIds.Glass);
  }
}

export class GlassTile extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.White);
    super(opt, DraggableIds.GlassTile);
  }
}

// variety
export class Cardboard extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Beige);
    super(opt, DraggableIds.Cardboard);
  }
}

export class Concrete extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.SM_Black);
    super(opt, DraggableIds.Concrete);
  }
}

export class Metal extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Silver);
    super(opt, DraggableIds.Metal);
  }
}

export class Barrier extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Yellow);
    super(opt, DraggableIds.Caution);
  }
}
export const Caution = Barrier;

export class Bricks extends Scalable {
  constructor(opt: ScalableInterface) {
    (opt.color) ? null : opt.color = new Color(Colors.Crimson);
    super(opt, DraggableIds.Bricks);
  }
}

