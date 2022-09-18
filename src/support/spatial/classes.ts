import { BoundsInterface, OffsetInterface, PosInterface, RelativePosInterface, RotateInterface } from "./interfaces";
import { addDirectionTable, addOrientationTable, Direction, Orientation, rotateTable } from "./enums";
import { Equatable } from "../support/classes";

export class Pos extends Equatable {
  private _x: number;
  private _y: number;
  private _z: number;
  constructor({
    x = 0,
    y = 0,
    z = 0,
  }: PosInterface
  ) {
    super(["x","y","z"]);
    this._x = x;
    this._y = y;
    this._z = z;
  }
  get x(): number { return this._x; }
  get y(): number { return this._y; }
  get z(): number { return this._z; }
  
  add(other: Pos): Pos {
    return new Pos({
      "x": this.x + other.x,
      "y": this.y + other.y,
      "z": this.z + other.z
    });
  }
  // rotates about the origin (0,0)
  rotate(other: Rotate) { // only pays attention to direction (forwards/backwards/left/right)
    let x = this.x;
    let y = this.y;
    let z = this.z;
    switch (other.direction) {
      // default:
      // case Direction.Forwards:
      //   break;
      case Direction.Backwards:
        x = -this.x;
        y = -this.y;
        break;
      case Direction.Left:
        x = this.y;
        y = -this.x;
        break;
      case Direction.Right:
        x = -this.y;
        y = this.x;
        break;
    }
    return new Pos({
      x: x,
      y: y,
      z: z
    });
  }
  build() {
    return {
      "x": this.x,
      "y": this.y,
      "z": this.z
    }
  }
}

export class RelativePos extends Pos {
  private other: Pos;
  constructor({
    x = 0,
    y = 0,
    z = 0,
    pos,
  }: RelativePosInterface
  ) {
    super({x,y,z});
    this.other = pos;
  }
  get x(): number { return super.x + this.other.x; }
  get y(): number { return super.y + this.other.y; }
  get z(): number { return super.z + this.other.z; }
}

export class Bounds extends Pos {
  constructor({
    x = 1,
    y = 1,
    z = 1
  }: BoundsInterface) {
    if (x < 1 || y < 1 || z < 1)
      throw new Error("value in Bounds cannot be less than one")
    super({x,y,z});
  }
}

export class Rotate extends Equatable {
  dir: Direction;
  or: Orientation;
  constructor({
    direction = Direction.Forwards,
    orientation = Orientation.Up
  }: RotateInterface
  ) {
    super(["dir", "or"]);
    this.dir = direction;
    this.or = orientation;
  }
  get direction(): Direction {
    return this.dir;
  }
  get orientation(): Orientation {
    return this.or;
  }
  get xAxis(): number { return rotateTable[this.dir][this.or].xAxis; }
  get zAxis(): number { return rotateTable[this.dir][this.or].zAxis; }
  get offset(): Pos {
    let entry = rotateTable[this.dir][this.or];
    return new Pos({
      x: entry.x,
      y: entry.y,
      z: entry.z
    });
  }
  add(other: Rotate): Rotate {
    return new Rotate({
      direction: addDirectionTable[this.direction][other.direction],
      orientation: addOrientationTable[this.orientation][other.orientation]
    });
  }
}

export class Offset extends Equatable {
  private _pos: Pos;
  private _rotate: Rotate;
  constructor({
    pos = new Pos({}),
    rotate = new Rotate({})
  }: OffsetInterface
  ) {
    super(["_pos", "_rotate"])
    this._pos = pos
    this._rotate = rotate
  }
  get pos(): Pos { return this._pos; }
  get rotate(): Rotate { return this._rotate; }
  add(offset: Offset) {
    return new Offset({
      pos: this.pos.rotate(this.rotate).add(offset.pos),
      rotate: this.rotate.add(offset.rotate)
    })
  }
}