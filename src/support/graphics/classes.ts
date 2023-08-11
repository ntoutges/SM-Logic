import { BitMap, FutureBitMap } from "../../classes/prebuilts/displays/classes";
import { Frame } from "../frames/classes";
import { BitMask } from "../logic/classes";
import { Bounds2d, Pos, Pos2d } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { CircleInterface, FrameBuilderInterface, RectInterface, ShapeInterface } from "./interfaces";

abstract class Shape extends Equatable {
  pos: Pos2d
  fill: boolean;
  rotateAngle: number;
  constructor({
    pos,
    fill=true,
    rotateAngle=0
  }: ShapeInterface) {
    super(["pos", "fill", "rotateAngle"]);
    this.pos = pos;
    this.fill = fill;
    this.rotateAngle = rotateAngle;
  }

  abstract renderAt(pos: Pos2d): boolean;
}

export class Circle extends Shape {
  radius: number;
  constructor({
    pos,fill,rotateAngle,
    radius
  }: CircleInterface) {
    super({ pos, fill, rotateAngle });
    this._addProps(["radius"]);
    this.radius = radius;
  }

  renderAt(pos: Pos2d): boolean {
    const offset = pos.sub(this.pos)
    return (offset.x ** 2) + (offset.y) ** 2 <= (this.radius ** 2);
  }
}

export class Rect extends Shape {
  bounds: Bounds2d;
  constructor({
    pos,fill,rotateAngle,
    bounds
  }: RectInterface) {
    super({ pos, fill, rotateAngle });
    this._addProps(["bounds"]);

    this.bounds = bounds
  }

  renderAt(pos: Pos2d): boolean {
    const degToRad = Math.PI / 180;
    const cos = Math.cos(this.rotateAngle*degToRad);
    const sin = Math.sin(this.rotateAngle*degToRad);

    const offset = pos.sub(this.pos);

    const rotatedOffset = new Pos({
      x: offset.x * cos + offset.y * sin,
      y: offset.y * cos - offset.x * sin
    })

    const horizontal = -this.bounds.x/2 <= rotatedOffset.x && rotatedOffset.x <= this.bounds.x/2;
    const vertical = -this.bounds.y/2 <= rotatedOffset.y && rotatedOffset.y <= this.bounds.y/2

    return horizontal && vertical;
  }
}

export class FrameBuilder extends Equatable {
  readonly size: Bounds2d;
  private builder: Function;
  private group: Array<Shape>;
  readonly defaultFill: boolean;
  constructor({
    size,
    defaultFill=false,
    builder
  }: FrameBuilderInterface) {
    super(["size", "group"]);

    this.size = size;
    this.group = [];
    this.builder = builder;
    this.defaultFill=defaultFill;
  }

  Circle(param: CircleInterface) {
    const shape = new Circle(param)
    this.group.push(shape);
    return shape;
  }

  Rect(param: RectInterface) {
    const shape = new Rect(param)
    this.group.push(shape);
    return shape;
  }

  build(frameNumber=0): Frame {
    this.group.splice(0); // clear the group
    this.builder(
      frameNumber,
      this.Circle.bind(this),
      this.Rect.bind(this)
    );
    
    const frameData: Array<BitMask> = [];
    for (let x = 0; x < this.size.x; x++) {
      const bitMaskData: Array<boolean> = [];
      for (let y = 0; y < this.size.y; y++) {
        bitMaskData.push(this.defaultFill); // fill background with data
        
        const pos = new Pos2d({x,y});
        for (let k = this.group.length-1; k >= 0; k--) {
          const shape = this.group[k];
          if (shape.renderAt( pos )) {
            bitMaskData[y] = shape.fill; // set background to the "color" of the shape
            break;
          }
        }
      }
      frameData.push(new BitMask(bitMaskData));
    }

    return new Frame({
      size: this.size,
      value: frameData
    });
  }
}