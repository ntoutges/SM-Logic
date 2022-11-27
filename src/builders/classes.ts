import { Block } from "../classes/blocks/basics";
import { ShapeIds } from "../classes/shapeIds";
import { Keyless } from "../support/context/classes";
import { Offset } from "../support/spatial/classes";

export class Builder extends Block {
  private readonly _builder: Function;
  constructor(builder: Function) {
    super({
      shapeId: ShapeIds.None
    });
    this._builder = builder;
  }
  build(offset: Offset) { return this._builder().build(offset); }
}