import { Block, Logic } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { BasicKey, Id, Key, Keyless } from "../support/context/classes";
import { Delay, Delays } from "../support/logic/classes";
import { Bounds, Pos, Rotate } from "../support/spatial/classes";
import { Equatable } from "../support/support/classes";
import { BodyInterface, ContainerInterface, GridInterface, UnitInterface } from "./interfaces";

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
  private _childs: Array<Unit>;
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
  get children(): Array<Unit> { return this._childs; }
  get key(): Key { return this._key; }

  build(offset=new Pos({})) {
    let childBlueprints: Array<string> = [];
    this._childs.forEach((child: Unit) => {
      childBlueprints.push(
        child.build(
          new Pos({
            "x": this.pos.x,
            "y": this.pos.y,
            "z": this.pos.z
          }).add(offset)
        )
      );
    });
    return childBlueprints.join(",");
  }
}

export class Contracted extends Container {
  build(offset=new Pos({})) {
    // set all shapes to be at the same positino
    this.children.forEach((child: Unit) => {
      child.pos = new Pos({
        x: 0,
        y: 0,
        z: 0
      });
    });
    return super.build(offset);
  }
}

export class Grid extends Container {
  private readonly _size: Bounds;
  private readonly _spacing: Bounds
  constructor({
    pos,
    rotate,
    child,
    children,
    color,
    key = new Keyless(),
    size,
    spacing = new Bounds({})
  }: GridInterface) {
    super({pos,rotate,child,children,color,key});
    this._size = size;
    this._spacing = spacing;
  }
  build(offset=new Pos({})) {
    if (this.children.length != this._size.x * this._size.y * this._size.z)
      throw new Error("Amound of children does not match bounds");
    
    let posCounter: Pos = new Pos({x:0,y:0,z:0});
    let position: Pos = this.pos.add(offset);
    let childBlueprints: Array<string> = [];
    this.children.forEach((child: Unit) => {
      if (posCounter.x >= this._size.x) {
        posCounter = posCounter.add( new Pos({x: -posCounter.x, y:1}) ); // reset x // add 1 to y
        position = position.add( new Pos({ x: -position.x, y:this._spacing.y }) );
        if (posCounter.y >= this._size.y) {
          posCounter = posCounter.add( new Pos({y: -posCounter.y, z:1}) ); // reset y // add 1 to z
          position = position.add( new Pos({ y: -position.y, z:this._spacing.z }) );
        }
      }
      childBlueprints.push( child.build( position.add(offset) ) );
      posCounter = posCounter.add( new Pos({x:1}) );
      position = position.add( new Pos({x:this._spacing.x}) );
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