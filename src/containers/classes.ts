import { Equatable } from "../support/support/classes";
import { Color } from "../support/colors/classes";
import { Key, Keyless } from "../support/context/classes";
import { Bounds, Offset, Pos, Rotate } from "../support/spatial/classes";
import { ContainerInterface, GridInterface, PackagerInterface, UnitInterface2 } from "./interfaces";
import { PosInterface } from "../support/spatial/interfaces";
import { BoundsInterface } from "../support/spatial/interfaces";

export abstract class Unit extends Equatable {
  pos: Pos;
  rotation: Rotate;
  private _color: Color;
  boundingBox: Bounds;
  origin: Pos;
  constructor({
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    bounds = new Bounds({})
  }: UnitInterface2
  ) {
    super(["_pos", "_rot", "_color"]);
    this.pos = pos;
    this.rotation = rotate;
    this._color = color;
    this.boundingBox = bounds;
    this.origin = pos;
  }
  
  get color(): Color { return this._color; }
  set color(color: Color) { this._color = color; }

  abstract build(offset: Offset): string;
}

export class Container extends Unit {
  children: Array<Unit>;
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
    this._addProps(["children"]);

    if (child != null && children != null)
      throw new Error("Cannot have both [child] and [children] property in a container");
    else if (child != null)
      this.children = [child];
    else if (children != null)
      this.children = children;

    if (color != undefined) {
      for (let child of this.children) {
        child.color = color;
      }
    }

    // this system falls apart when any children are rotated... fix this!
    let originData: PosInterface = {};
    let extentData: BoundsInterface = {};
    for (const child of this.children) {
      const rotatedOrigin = child.origin.add(this.pos).rotate(child.rotation);
      if (!("x" in originData) || rotatedOrigin.x < originData.x) originData.x = rotatedOrigin.x;
      if (!("y" in originData) || rotatedOrigin.y < originData.y) originData.y = rotatedOrigin.y;
      if (!("z" in originData) || rotatedOrigin.z < originData.z) originData.z = rotatedOrigin.z;
    }
    this.origin = new Pos(originData);
    for (const child of this.children) {
      const rotatedExtent = child.boundingBox.add(child.origin).rotate(child.rotation);
      if (!("x" in extentData) || rotatedExtent.x > extentData.x) extentData.x = rotatedExtent.x;
      if (!("y" in extentData) || rotatedExtent.y > extentData.y) extentData.y = rotatedExtent.y;
      if (!("z" in extentData) || rotatedExtent.z > extentData.z) extentData.z = rotatedExtent.z;
    }
    this.boundingBox = new Bounds({
      x: Math.max(extentData.x - this.origin.x, 1),
      y: Math.max(extentData.y - this.origin.y, 1),
      z: Math.max(extentData.z - this.origin.z, 1)
    });
  }

  compress(origin=new Pos({})) {
    for (let child of this.children) {
      child.pos = origin;
    }
    this.compressed = true;
  }

  build(offset=new Offset({})) {
    let childBlueprints: Array<string> = [];
    const newOffset = new Offset({
      pos: this.pos,
      rotate: this.rotation
    }).add(offset);

    this.pos.rotate(this.rotation);
    this.children.forEach((child: Unit) => {
      // child.pos = child.pos.rotate(newOffset.rotate); // redundant

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
    children,
    color,
    size,
    spacing = new Bounds({})
  }: GridInterface) {
    super({pos,rotate,children,color});
    this._size = size;
    this._spacing = spacing;
    
    if (this.children.length > this._size.volume) throw new Error("Amount of children too great for bounds");

    // determine [this.boundingBox] and [this.origin]
    let originData: PosInterface = {};
    let extentData: BoundsInterface = {};
    for (let i in this.children) {
      const child = this.children[i];
      const rotatedOrigin = child.origin.add(this.pos).add(this.getOffsetAt(+i));
      if (!("x" in originData) || rotatedOrigin.x < originData.x) originData.x = rotatedOrigin.x;
      if (!("y" in originData) || rotatedOrigin.y < originData.y) originData.y = rotatedOrigin.y;
      if (!("z" in originData) || rotatedOrigin.z < originData.z) originData.z = rotatedOrigin.z;
    }
    this.origin = new Pos(originData);
    for (let i in this.children) {
      const child = this.children[i];
      const rotatedBounds = child.boundingBox.add(child.pos).rotate(child.rotation).add(this.getOffsetAt(+i));
      if (!("x" in extentData) || rotatedBounds.x > extentData.x) extentData.x = rotatedBounds.x;
      if (!("y" in extentData) || rotatedBounds.y > extentData.y) extentData.y = rotatedBounds.y;
      if (!("z" in extentData) || rotatedBounds.z > extentData.z) extentData.z = rotatedBounds.z;
    }
    this.boundingBox = new Bounds({
      x: Math.max(extentData.x - this.origin.x, 1),
      y: Math.max(extentData.y - this.origin.y, 1),
      z: Math.max(extentData.z - this.origin.z, 1)
    });
  }
  getGridChild(pos: Pos): Unit {
    if (pos.x >= this._size.x || pos.y >= this._size.y || pos.z >= this._size.z)
      throw new Error(`Grid Child position outside working bounds (${this._size.x},${this._size.y},${this._size.z})`);
    const index = (pos.z*this._size.x*this._size.y) + (pos.y*this._size.y) + (pos.x);
    return this.children[index];
  }
  getOffsetAt(index: number): Pos {
    if (index < 0) index += this._size.volume;
    if (index < 0 || index >= this._size.volume) throw new Error("Index out of bounds");

    return new Pos({
      x: (index % this._size.x) * this._spacing.x,
      y: (Math.floor(index / this._size.x) % this._size.y) * this._spacing.y,
      z: Math.floor(index / (this._size.x * this._size.y)) * this._spacing.z
    });
  }
  get width(): number { return this._size.x; }
  get depth(): number { return this._size.y; }
  get height(): number { return this._size.z; }
  build(offset=new Offset({})) {
    let posCounter: Pos = new Pos({x:0,y:0,z:0});
    let position: Pos = this.pos;
    let childBlueprints: Array<string> = [];
    this.children.forEach((child: Unit) => {
      if (posCounter.x >= this._size.x) {
        position = position.add( new Pos({ x: -posCounter.x*this._spacing.x, y:this._spacing.y }) );
        posCounter = posCounter.add( new Pos({x: -posCounter.x, y:1}) ); // reset x // add 1 to y
        if (posCounter.y >= this._size.y) {
          position = position.add( new Pos({ y: -posCounter.y*this._spacing.y, z:this._spacing.z }) );
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