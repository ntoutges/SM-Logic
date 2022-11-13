import { Glass, Wood } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { BasicKey, Key, Keyless } from "../support/context/classes";
import { Bounds, Offset, Pos, Rotate } from "../support/spatial/classes";
import { Equatable } from "../support/support/classes";
import { BlocInterface, BodyInterface, ContainerInterface, GridInterface, UnitInterface } from "./interfaces";

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
  
  abstract build(offset: Offset): string;
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
    this._addProps(["_childs"]);
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

  build(offset=new Offset({})) {
    let childBlueprints: Array<string> = [];
    const newOffset = new Offset({
      pos: this.pos,
      rotate: this.rotation
    }).add(offset);

    this._childs.forEach((child: Unit) => {
      child.pos = child.pos.rotate(newOffset.rotate);
      childBlueprints.push(
        child.build(newOffset)
      );
    });
    return childBlueprints.join(",");
  }
}

export class Contracted extends Container {
  build(offset=new Offset({})) {
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
  getGridChild(pos: Pos): Unit {
    if (pos.x >= this._size.x || pos.y >= this._size.y || pos.z >= this._size.z)
      throw new Error(`Grid Child position outside working bounds (${this._size.x},${this._size.y},${this._size.z})`);
    const index = (pos.z*this._size.x*this._size.y) + (pos.y*this._size.y) + (pos.x);
    return this.children[index];
  }
  get width() { return this._size.x; }
  get depth() { return this._size.y; }
  get height() { return this._size.z; }
  build(offset=new Offset({})) {
    if (this.children.length != this._size.x * this._size.y * this._size.z)
      throw new Error("Amount of children does not match bounds");
    
    let posCounter: Pos = new Pos({x:0,y:0,z:0});
    let position: Pos = this.pos;
    let childBlueprints: Array<string> = [];
    this.children.forEach((child: Unit) => {
      if (posCounter.x >= this._size.x) {
        position = position.add( new Pos({ x: -posCounter.x, y:this._spacing.y }) );
        posCounter = posCounter.add( new Pos({x: -posCounter.x, y:1}) ); // reset x // add 1 to y
        if (posCounter.y >= this._size.y) {
          position = position.add( new Pos({ y: -posCounter.y, z:this._spacing.z }) );
          posCounter = posCounter.add( new Pos({y: -posCounter.y, z:1}) ); // reset y // add 1 to z
        }
      }
      const totalRotation = offset.rotate.add(this.rotation);
      let localOffset: Offset = new Offset({
        pos: position.rotate(totalRotation).add(offset.pos),
        rotate: totalRotation
      });

      childBlueprints.push( child.build( localOffset ) );
      posCounter = posCounter.add( new Pos({x:1}) );
      position = position.add( new Pos({x:this._spacing.x}) );
    });
    return childBlueprints.join(",");
  }
}

export class Bloc extends Container {
  readonly size: Bounds;
  readonly inner: Unit;
  constructor({
    key,
    size,
    child,
    color,
    pos,
    rotate
  }: BlocInterface) {
    const flooring = new Wood({
      key,
      bounds: new Bounds({
        x: size.x + 2,
        y: size.y + 2
      }),
      pos: new Pos({
        x: -1,
        y: -1,
        z: -1
      })
    });
    const ceiling = new Wood({
      key,
      bounds: new Bounds({
        x: size.x + 2,
        y: size.y + 2
      }),
      pos: new Pos({
        x: -1,
        y: -1,
        z: size.z + 1
      })
    });
    const wall1 = new Glass({
      key,
      bounds: new Bounds({
        x: size.x,
        z: size.z
      }),
      pos: new Bounds({
        y: -1
      })
    });
    const wall2 = new Glass({
      key,
      bounds: new Bounds({
        x: size.x,
        z: size.z
      }),
      pos: new Pos({
        y: size.y + 2
      })
    });
    const wall3 = new Glass({
      key,
      bounds: new Bounds({
        y: size.y,
        z: size.z
      }),
      pos: new Pos({
        x: -1
      })
    });
    const wall4 = new Glass({
      key,
      bounds: new Bounds({
        y: size.y,
        z: size.z
      }),
      pos: new Pos({
        x: size.x + 2
      })
    });

    const xPos = [-1, size.x+2];
    const yPos = [-1, size.y+2];
    const pillars: Array<Wood> = []
    
    for (let x of xPos) {
      for (let y of yPos) {
        pillars.push(
          new Wood({
            key,
            bounds: new Bounds({ z: size.z }),
            pos: new Pos({ x,y })
          })
        )
      }
    }
    super({
      children: [child, flooring,ceiling, wall1,wall2,wall3,wall4].concat(pillars),
      pos: pos.add(
        new Pos({ x:1, y:1, z:1 })
      ),
      color,key,rotate});
    this._addProps(["size"]);
    this.size = size;
    this.inner = child;
  }
  build(offset=new Offset({})) {
    return super.build(offset);
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