import { AreaInterface, Bounds2dInterface, Bounds2dRemapInterface, BoundsInterface, OffsetInterface, Pos2dInterface, PosInterface, RelativePosInterface, RotateInterface } from "./interfaces";
import { addDirectionTable, addOrientationTable, Corners, Direction, DirectionCornerTable, Orientation, rotateTable } from "./enums";
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
  sub(other: Pos): Pos {
    return new Pos({
      "x": this.x - other.x,
      "y": this.y - other.y,
      "z": this.z - other.z
    });
  }
  scale(other: Pos | number) {
    if (other instanceof Pos) {
      return new Pos({
        "x": this.x * other.x,
        "y": this.y * other.y,
        "z": this.z * other.z
      });
    }
    return new Pos({
      "x": this.x * other,
      "y": this.y * other,
      "z": this.z * other
    })
  }
  get magnitude() {
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
  }
  get unit() {
    const mag = this.magnitude;
    return new Pos({
      "x": this.x / mag,
      "y": this.y / mag,
      "z": this.z / mag
    });
  }
  // rotates about the origin (0,0)
  rotate(other: Rotate): Pos { // mostly only pays attention to direction (forwards/backwards/left/right)
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
      case Direction.Up:
      case Direction.Down:
        // UP + UP -> swap y/z
        // DOWN + DOWN -> swap y/z
        if (
          other.direction == Direction.Up && other.orientation == Orientation.Up ||
          other.direction == Direction.Down && other.orientation == Orientation.Down
          ) {
          y = this.z;
          z = this.y;
          break;
        }
        // UP + DOWN -> swap y/-z
        // DOWN + UP -> swap y/-z
        if (
          other.direction == Direction.Up && other.orientation == Orientation.Down ||
          other.direction == Direction.Down && other.orientation == Orientation.Up
        ) {
          y = this.z;
          z = -this.y;
          break;
        }
        // UP + RIGHT -> swap x/z
        // DOWN + LEFT -> swap x/z 
        if (
          other.direction == Direction.Up && other.orientation == Orientation.Right ||
          other.direction == Direction.Down && other.orientation == Orientation.Left
        ) {
          x = this.z;
          z = this.x;
          break;
        }
        // UP + LEFT -> swap x/-z
        // DOWN + RIGHT -> swap x/-z
        if (
          other.direction == Direction.Up && other.orientation == Orientation.Left ||
          other.direction == Direction.Down && other.orientation == Orientation.Right
        ) {
          x = this.z;
          z = -this.x;
          break;
        }
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

export class Pos2d extends Pos {
  constructor({
    x=0,
    y=0
  }: Pos2dInterface) {
    super({x,y});
  }

  to3d({
    xMap="x",
    yMap="y"
  }: Bounds2dRemapInterface) {
    if (xMap == yMap)
      throw new Error("xMap and yMap cannot have the same value");
    var x = this.x;
    var y = this.y;
    var z = 1;
    switch (xMap) {
      case "y":
        y = this.x;
        x = this.y;
        break;
      case "z":
        z = this.x;
        x = this.z;
        break;
    }
    switch (yMap) {
      case "x":
        x = this.y;
        y = this.x;
      case "z":
        z = this.y;
        y = this.z;
    }
    return new Pos({ x,y,z });
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
  rotate(other: Rotate) {
    if (other.direction == Direction.Forwards || other.direction == Direction.Backwards)
      return new Bounds({
        x: this.x,
        y: this.y,
        z: this.z
      });
    else if (other.direction == Direction.Right || other.direction == Direction.Left) {
      return new Bounds({ // swap x amd y
        x: this.y,
        y: this.x,
        z: this.z
      });
    }
    // else if (other.direction == Direction.Up || other.direction == Direction.Down) {
      if (other.orientation == Orientation.Up || other.orientation == Orientation.Down) {
        // bring back to top
        return new Bounds({ // swap y and z
          x: this.x,
          y: this.z,
          z: this.y
        })
      }
      // else if (other.orientation == Orientation.Left || other.orientation == Orientation.Right) {
        // bring left to top
        return new Bounds({ // swap x and z
          x: this.z,
          y: this.y,
          z: this.x
        })
      // }
    // }
  }

  scale(other: Bounds | number) {
    if (other instanceof Bounds) {
      return new Bounds({
        "x": this.x * other.x,
        "y": this.y * other.y,
        "z": this.z * other.z
      });
    }
    return new Bounds({
      "x": this.x * other,
      "y": this.y * other,
      "z": this.z * other
    })
  }

  get volume(): number {
    return this.x * this.y * this.z;
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
  get direction(): Direction { return this.dir; }
  get orientation(): Orientation { return this.or; }
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

export class Bounds2d extends Bounds {
  constructor({
    x=1,
    y=1
  }: Bounds2dInterface) {
    super({x,y});
  }

  to3d({
    xMap="x",
    yMap="y"
  }: Bounds2dRemapInterface) {
    if (xMap == yMap)
      throw new Error("xMap and yMap cannot have the same value");
    var x = this.x;
    var y = this.y;
    var z = 1;
    switch (xMap) {
      case "y":
        y = this.x;
        x = this.y;
        break;
      case "z":
        z = this.x;
        x = this.z;
        break;
    }
    switch (yMap) {
      case "x":
        x = this.y;
        y = this.x;
      case "z":
        z = this.y;
        y = this.z;
    }
    return new Bounds({ x,y,z });
  }

  get area(): number { return this.volume; }
}

export class Offset extends Equatable {
  readonly pos: Pos;
  readonly rotate: Rotate;
  constructor({
    pos = new Pos({}),
    rotate = new Rotate({})
  }: OffsetInterface
  ) {
    super(["pos", "rotate"])
    this.pos = pos
    this.rotate = rotate
  }
  add(offset: Offset): Offset {
    return new Offset({
      pos: this.pos.rotate(offset.rotate).add(offset.pos),
      rotate: this.rotate.add(offset.rotate)
    })
  }
}

export class Area extends Equatable {
  readonly origin: Pos;
  readonly bounds: Bounds;
  constructor({
    origin,
    bounds
  }: AreaInterface) {
    super(["origin", "size"]);
    this.origin = origin;
    this.bounds = bounds;
  }

  getCorner(rotation: Rotate, cornerType: Corners = Corners.BottomLeft) {
    let origin: Pos = this.origin.rotate(rotation);
    let bounds: Bounds = this.bounds.rotate(rotation);

    return origin.sub(
      new Pos({
        x: (bounds.x-1) * DirectionCornerTable[cornerType][rotation.direction].x,
        y: (bounds.y-1) * DirectionCornerTable[cornerType][rotation.direction].y
      })
    )

    // switch (rotation.direction) {
    //   case Direction.Backwards:
    //     return origin.sub(
    //       new Pos({
    //         x: this.bounds.x-1,
    //         y: this.bounds.y-1
    //       })
    //     );
    //   case Direction.Left:
    //     return origin.sub(
    //       new Pos({
    //         y: this.bounds.x-1
    //       })
    //     );
    //   case Direction.Right:
    //     return origin.sub(
    //       new Pos({
    //         x: this.bounds.y-1
    //       })
    //     )
    //   default:
    //     return origin;
    // }
  }
}