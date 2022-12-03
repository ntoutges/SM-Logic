import { Equatable } from "../support/support/classes";
import { Color } from "../support/colors/classes";
import { Key, Keyless } from "../support/context/classes";
import { Bounds, Offset, Pos, Rotate } from "../support/spatial/classes";
import { ContainerInterface, GridInterface, PackagerInterface, UnitInterface } from "./interfaces";

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
  compressed: boolean;
  constructor({
    pos,
    rotate,
    child,
    color,
    children
  }: ContainerInterface
  ) {
    super({pos,rotate,color});
    this._addProps(["_childs"]);
    
    if (child != null && children != null)
      throw new Error("Cannot have both [child] and [children] property in a container");
    else if (child != null)
      this._childs = [child];
    else if (children != null)
      this._childs = children;

      if (color != undefined) {
        for (let child of this._childs) {
          child.color = color;
        }
      }
  }
  get children(): Array<Unit> { return this._childs; }

  compress() {
    const zeroPos = new Pos({}); // x=0, y=0, z=0
    for (let child of this._childs) {
      child.pos = zeroPos;
    }
    this.compressed = true;
  }

  build(offset=new Offset({})) {
    let childBlueprints: Array<string> = [];
    const newOffset = new Offset({
      pos: this.pos,
      rotate: this.rotation
    }).add(offset);

    this._childs.forEach((child: Unit) => {
      child.pos = child.pos.rotate(newOffset.rotate);
      const built = child.build(newOffset);
      if (built != "") // some Units, such as [Custom2dShape], may return an empty string, as they have no data to add
        childBlueprints.push( built );
    });

    return childBlueprints.join(",");
  }
}

// export class Contracted extends Container {
//   build(offset=new Offset({})) {
//     // set all shapes to be at the same positino
//     this.children.forEach((child: Unit) => {
//       child.pos = new Pos({
//         x: 0,
//         y: 0,
//         z: 0
//       });
//     });
//     return super.build(offset);
//   }
// }

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

      let localOffset: Offset;
      if (!this.compressed) {
        localOffset = new Offset({
          pos: position.rotate(totalRotation).add(offset.pos),
          rotate: totalRotation
        });
      }
      else {
        localOffset = new Offset({
          pos: (new Pos({})).rotate(totalRotation).add(offset.pos),
          rotate: totalRotation
        });
      }

      const built = child.build( localOffset );
      if (built != "") // some Units, such as [Custom2dShape], may return an empty string, as they have no data to add
        childBlueprints.push( built );

      posCounter = posCounter.add( new Pos({x:1}) );
      position = position.add( new Pos({x:this._spacing.x}) );
    });
    return childBlueprints.join(",");
  }
}

export class Packager extends Container {
  package: string; // the prebuilt blueprint that will be merged with the container
  constructor({
    pos,
    rotate,
    child,
    color,
    children,
    packageA
  }: PackagerInterface
  ) {
    super({pos,rotate,color, child, children});
    this._addProps(["packageA"]);
    this.package = packageA;
  }

  build(offset=new Offset({})) {
    // offset package
    let packageJSON = JSON.parse(this.package);

    const packageOffset = offset.add(
      new Offset({
        pos: this.pos
      })
    );

    for (let i in packageJSON) {
      const object = packageJSON[i];
      const pos = new Pos({
        x: object.pos.x,
        y: object.pos.y,
        z: object.pos.z
      });

      object.pos = pos.add(packageOffset.pos).build(); // ignore rotation... for now
    }
    let packageStr = JSON.stringify(packageJSON);
    packageStr = packageStr.substring(1, packageStr.length-1);

    let built = super.build(offset);
    if (built != "") // some Units, such as [Custom2dShape], may return an empty string, as they have no data to add
      built += ","

    return built + packageStr;
  }
}