import { FrameInterface, FrameResizeInterface, FramesInterface, PhysicalFrameInterface } from "../../classes/prebuilts/displays/interfaces";
import { Id, KeylessId } from "../context/classes";
import { Equatable } from "../support/classes";
import { LogicalOperation, LogicalType, Time } from "./enums";
import { BitMaskExtendInterface, DelayInterface, OperationInterface } from "./interfaces";

export class Operation extends Equatable {
  private op: LogicalOperation;
  constructor({
    operation = LogicalOperation.And
  }: OperationInterface
  ) {
    super(["op"]);
    this.op = operation;
  }
  get operation(): LogicalOperation { return this.op; }
  set operation(op: LogicalOperation) { this.op = op; }
  get type(): LogicalType {
    switch (this.op) {
      case LogicalOperation.And:
      case LogicalOperation.Output:
        return LogicalType.And;
      case LogicalOperation.Or:
      case LogicalOperation.Input:
      case LogicalOperation.Buffer:
      case LogicalOperation.Screen:
        return LogicalType.Or;
      case LogicalOperation.Xor:
        return LogicalType.Xor;
      case LogicalOperation.Nand:
        return LogicalType.Nand;
      case LogicalOperation.Nor:
      case LogicalOperation.Not:
        return LogicalType.Nor;
      case LogicalOperation.XNor:
        return LogicalType.XNor;
      default:
        return LogicalType.And;
    }
  }
}

export class Connections extends Equatable {
  private _conns: Array<Id>;
  constructor(
    connections: Id | Array<Id> = [],
  ) {
    super(["_conns"]);
    this._conns = [];
    if (connections instanceof Id)
      for (let numId of connections.ids) {
        this._conns.push( new KeylessId(numId) );
      }
    else
      this._conns = connections;
  }
  get connections(): Array<Id> { return this._conns; }
  addConnection(id: Id) {
    for (let numId of id.ids) {
      this._conns.push( new KeylessId(numId) );
    }
  }
  build() {
    if (this._conns.length == 0)
      return null;
    let connections = [];
    this._conns.forEach((id: Id) => {
      connections = connections.concat( id.build() );
    });
    return connections;
  }
}

export class BitMask extends Equatable {
  readonly mask: Array<boolean>;
  constructor(mask: Array<boolean>) {
    super(["mask"]);
    this.mask = mask;
  }
  get length() { return this.mask.length; }
  add(other: BitMask): BitMask {
    const maxI = Math.max(this.length,other.length);
    const mask: Array<boolean> = [];
    for (let i = 0; i < maxI; i++) {
      mask.push(
        (this.length > i && this.mask[i]) || 
        (other.length > i && other.mask[i])
      )
    }
    return new BitMask(mask);
  }
  not(): BitMask {
    const mask: Array<boolean> = [];
    for (let val of this.mask) {
      mask.push(!val);
    }
    return new BitMask(mask);
  }
  extend({
    newLength,
    fallback = false
  }: BitMaskExtendInterface): BitMask {
    const mask: Array<boolean> = [];
    for (let i = 0; i < newLength; i++) {
      mask.push( (this.length > i) ? this.mask[i] : fallback );
    }
    return new BitMask(mask);
  }
}

/// pass in a number, such as 0xfc or 0x00110101
export class RawBitMask extends BitMask {
  constructor(mask: number) {
    const newMask: Array<boolean> = [];
    const itts = Math.floor(Math.log(mask) / Math.LN2);
    for (let i = 0; i <= itts; i++) {
      let pow = Math.pow(2,itts-i);
      if (mask >= pow) {
        mask -= pow
        newMask.push(true)
      }
      else
        newMask.push(false)
    }
    super(newMask);
  }
}

// V stands for visual, but is shorter and works better when in its intended use case (visually creating bit masks)
export class VBitMask extends BitMask {
  constructor(mask: string, offCharacter=" ") {
    const newMask: Array<boolean> = [];
    for (let i = 0; i < mask.length; i++) {
      newMask.push(mask[i] != offCharacter);
    }
    super(newMask);
  }
}

export class Delay extends Equatable {
  private _delay: number; // measured in ticks
  constructor({
    delay,
    unit = Time.Tick
  }: DelayInterface) {
    super(["_delay"]);
    this._delay = Math.round(delay * unit); // don't allow fractional components
  }
  getDelay(unit:Time = Time.Tick): number { return this._delay / unit; }
  add(delay: Delay): Delay {
    return new Delay({
      delay: this.getDelay() + delay.getDelay(),
    });
  }
}

export class NoDelay extends Delay {
  constructor() { super({ delay: -1 }); }
  add(delay: Delay): Delay { return new NoDelay() } // do nothing
}

export class Delays extends Equatable {
  private _delays: Array<Delay>;
  constructor(delays: Array<Delay>) {
    super(["_delays"])
    this._delays = delays;
  }
  add(delay: Delay) { this._delays.push(delay) }
  concat(delays: Array<Delay>) {
    for (let delay of delays) {
      this.add(delay);
    }
  }
  get length() { return this._delays.length; }
  get delays() { return this._delays; }
  get validDelays(): Array<Delay> {
    let valids = [];
    for (let delay of this._delays) {
      if (delay.getDelay() != -1)
        valids.push(delay);
    }
    return valids;
  }
}

export class Frame extends Equatable {
  private _width: number;
  private _height: number;
  private _value: Array<BitMask>;
  public fallback: boolean
  constructor({
    width,
    height,
    value,
    fallback=false
  }: FrameInterface) {
    super(["_width","_height","_value"]);
    this._width = width;
    this._height = height;
    this._value = value;
    this.fallback = fallback;
    
    this.resize({
      height: height,
      width: width
    });
  }
  get rows(): Array<BitMask> { return this._value; }
  get height(): number { return this._height; }
  get width(): number { return this._width; }
  add(other: Frame): Frame {
    let newWidth: number = Math.max(this.width, other.width);
    let newHeight: number = Math.max(this.height, other.height);
    const value = [];
    for (let y = 0; y < newHeight; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      let otherMask = (other.rows.length > y) ? other.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: newWidth,
          fallback: this.fallback
        }).add(
          otherMask
          )
        );
    }
    return new Frame({
      width: newWidth,
      height: newHeight,
      value: value
    });
  }
  resize({
    width=this.width,
    height=this.height
  }: FrameResizeInterface): void {
    const value: Array<BitMask> = []
    for (let y = 0; y < height; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: width,
          fallback: this.fallback
        })
      );
    }
    this._value = value;
  }
  resized({
    width=this.width,
    height=this.height
  }: FrameResizeInterface): Frame {
    const value: Array<BitMask> = []
    for (let y = 0; y < height; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: width,
          fallback: this.fallback
        })
      );
    }
    return new Frame({
      width: width,
      height: height,
      value: value
    })
  }
}

export class PhysicalFrame extends Equatable {
  private readonly _frame: Frame;
  private readonly _id: Id;
  constructor({
    frame,
    id
  }: PhysicalFrameInterface) {
    super(["_frame", "_id"]);
    this._frame = frame;
    this._id = id;
  }
  get frame(): Frame { return this._frame; }
  get id(): Id { return this._id; }
}

export class Frames extends Equatable {
  private readonly _frames: Array<Frame>;
  private readonly _width: number;
  private readonly _height: number;
  constructor({
    frames,
    width=0,
    height=0
  }: FramesInterface) {
    super(["_frames", "_width","_height"]);
    this._frames = frames;

    let maxHeight = 0;
    let maxWidth = 0;
    for (let i in frames) {
      maxHeight = Math.max(maxHeight, frames[i].height);
      maxWidth = Math.max(maxWidth, frames[i].width);
    }
    this._height = (height == 0) ? maxHeight : height;
    this._width = (height == 0) ? maxWidth : width;
    for (let i in frames) {
      frames[i].resize({
        height: this._height,
        width: this._width
      });
    }
  }
  get height(): number { return this._height; }
  get width(): number { return this._width; }
  get frames(): Array<Frame> { return this._frames; }
}