import { Block } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { BasicKey, Key, Keyless } from "../support/context/classes";
import { Pos, Rotate } from "../support/spatial/classes";
import { Equatable } from "../support/support/classes";
import { BodyInterface, ContainerInterface, UnitInterface } from "./interfaces";

export abstract class Unit extends Equatable {
  private _pos: Pos;
  private _rot: Rotate;
  private _color: Color;
  constructor({
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
  }: UnitInterface
  ) {
    super(["_pos", "_rot", "_color"]);
    this._pos = pos;
    this._rot = rotate;
    this._color = color;
  }

  get pos(): Pos { return this._pos; }
  get rotation(): Rotate { return this._rot; }
  get color(): Color { return this._color; }
  set pos(pos: Pos) { this._pos = pos; }
  set rotation(rotation: Rotate) { this._rot = rotation; }
  set color(color: Color) { this._color = color; }
  abstract build(offset: Pos): string;
}

export class Container extends Unit {
  private _childs: Array<Block>;
  private readonly _key: Key;
  constructor({
    pos,
    rotate,
    child,
    color,
    children,
    key = new Keyless(),
  }: ContainerInterface
  ) {
    super({pos,rotate,color});
    this._addProps(["_childs"])
    this._key = key;

    if (child != null && children != null)
      throw new Error("Cannot have both [child] and [children] property in a container");
    else if (child != null)
      this._childs = [child];
    else if (children != null)
      this._childs = children;
  }
  get children(): Array<Block> { return this._childs; }
  get key(): Key { return this._key; }

  build(offset=new Pos({})) {
    let childBlueprints: Array<string> = [];
    this._childs.forEach((child: Block) => {
      childBlueprints.push(
        child.build(
          new Pos({
            "x": this.pos.x,
            "y": this.pos.y,
            "z": this.pos.z
          })
        )
      );
    });
    return childBlueprints.join(",");
  }
}

export abstract class GenericBody {
  private readonly _key: BasicKey;
  private readonly _title: string;
  private readonly _desc: string;
  constructor({
    key = new BasicKey({}),
    name = "SM Logic Creation",
    description = "V2 of generating scrap mechanic logic-based creations",
  }: BodyInterface
  ) {
    this._key = key;
    this._title = name;
    this._desc = description;
  }
  get key(): BasicKey { return this._key; }
  get description(): string {
    return `{
      \"description\": \"${this._desc}\",
      \"name\": \"${this._title}\",
      \"type\": \"Blueprint\",
      \"version\": 0
    }`
  }

  abstract build(): Unit;
}