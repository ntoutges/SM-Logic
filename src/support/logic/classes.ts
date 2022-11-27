import { ScaleableDelaysInterface } from "../../classes/prebuilts/delays/interfaces";
import { Id, Identifier, KeylessId } from "../context/classes";
import { Bounds, Bounds2d, Pos, Pos2d } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { LogicalOperation, LogicalType, Time } from "./enums";
import { BitMaskExtendInterface, DelayInterface, FrameInterface, FramesInterface, MappedRomFrameInterface, MetaMultiConnectionsType, MultiConnectionsType, PhysicalFrameInterface, ROMFrameInterface, SpriteInterface } from "./interfaces";

export class Operation extends Equatable {
  private op: LogicalOperation;
  constructor( operation: LogicalOperation = LogicalOperation.And ) {
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

export class MultiConnections extends Equatable {
  private _conns: Map<string,Connections>;
  constructor(
    connections: MultiConnectionsType | Array<MultiConnectionsType>
  ) {
    super(["_conns"]);
    this._conns = new Map();
    if (Array.isArray(connections)) {
      for (let connection of connections) {
        this.addConnection(connection.conns, connection.id);
      }
    }
    else
      this.addConnection(connections.conns, connections.id);
  }
  get multiConnections(): Map<string,Connections> { return this._conns; }
  addConnection(conn: Connections | MultiConnections, ids: Identifier): void {
    if (conn instanceof Connections)
      this.addRawConnection(conn, ids);
    else // conn instanceof MultiConnections
      this.addMultiConnection(conn, ids);
  }
  private addRawConnection(conn: Connections, ids: Identifier): void {
    for (let id of ids.ids) {
      this._conns.set(id, conn);
    }
  }
  private addMultiConnection(conn: MultiConnections, ids: Identifier): void {
    for (let id of ids.ids) {
      conn.conns.forEach((metaConn, metaId) => {
        const connId = `${id}?+:${metaId}`;
        this._conns.set(connId, metaConn);
      });
    }
  }
  getConnection(id: Identifier | string): Connections {
    if ((typeof id) == "string")
      return this.getConnection(
        new Identifier(
          id as string
        )
      );
    const conns = new Connections([]);
    for (let identifier of (id as Identifier).ids) {
      if (this._conns.has(identifier)) {
        for (let connectionId of this._conns.get(identifier).connections) {
          conns.addConnection(connectionId);
        }
      }
    }
    return conns;
  }
  getMetaConnection(id: Identifier | string): MultiConnections {
    if ((typeof id) == "string")
      return this.getMetaConnection(
        new Identifier(
          id as string
        )
      );
    const conns = new MultiConnections([]);
    for (let identifier of (id as Identifier).ids) {
      this._conns.forEach((val, id) => {
        if (id.replace(/\?\+:.+/, "") == identifier) { // regex gives only text before first ?+: (indicates different levels of MultiConnections)
          conns.addConnection(
            this._conns.get(id),
            new Identifier(
              id.replace(/.*?\?\+:/, "") // regex gives only text after first ?+: (indicates different levels of MultiConnections)
            )
          );
        }
      })
    }
    return conns;
  }
  get conns(): Map<string,Connections> { return this._conns; }
}

export class BitMask extends Equatable {
  readonly mask: Array<boolean>;
  alignLeft: boolean; // determines which side to add [fallback] to when extending mask
  constructor(mask: Array<boolean>) {
    super(["mask"]);
    this.mask = mask;
    this.alignLeft = true;
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
    if (this.alignLeft) {
      for (let i = 0; i < newLength; i++) {
        mask.push( (this.length > i) ? this.mask[i] : fallback );
      }
    }
    else { // align right
      for (let i = 0; i < newLength; i++) {
        const j = i - newLength + this.mask.length
        mask.push( (j < 0) ? fallback : this.mask[j] )
      }
    }
    return new BitMask(mask);
  }
  reverse(): BitMask {
    const mask: Array<boolean> = [];
    for (let i = this.mask.length-1; i >= 0; i--) {
      mask.push(this.mask[i]);
    }
    return new BitMask(mask);
  }
  // shift right by 'count' bits
  shift(count: number) {
    if (count < 0)
      count = (count % this.mask.length) + this.mask.length;

    const mask: Array<boolean> = [];
    for (let i in this.mask) {
      mask.push(
        this.mask[(+i + count) % this.mask.length]
      )
    }
    return new BitMask(mask);
  }
}

/// pass in a number, such as 0xfc or 0x00110101
export class RawBitMask extends BitMask {
  constructor(mask: number, length=0) {
    const newMask: Array<boolean> = [];
    const itts = (length == 0) ? Math.floor(Math.log(mask) / Math.LN2) : length-1;
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
    this.alignLeft = false; // align right
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
  build() {
    const seconds = Math.min( Math.floor(this.getDelay(Time.Second)), 59 );
    const ticks = this.getDelay(Time.Tick) - (seconds * Time.Second);
    return {
      "seconds": seconds,
      "ticks": ticks
    }
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

export class ScaleableDelays extends Delays {
  constructor({
    delay = new Delay({ delay: 0, unit: Time.Tick }),
    amount=1
  }: ScaleableDelaysInterface) {
    const delays: Array<Delay> = [];
    for (let i = 0; i < amount; i++) {
      delays.push(delay);
    }
    super(delays);
  }
}

export class Frame extends Equatable {
  private _size: Bounds2d;
  private _value: Array<BitMask>;
  public fallback: boolean
  constructor({
    size,
    value,
    fallback=false
  }: FrameInterface) {
    super(["_width","_height","_value"]);
    this._size = size;
    this._value = value;
    this.fallback = fallback;
    
    this.selfResize(this._size);
  }
  get rows(): Array<BitMask> { return this._value; }
  get height(): number { return this._size.y; }
  get width(): number { return this._size.x; }
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
      size: this._size,
      value: value
    });
  }
  private selfResize(size: Bounds2d): void { // modify this frame
    const value: Array<BitMask> = []
    for (let y = 0; y < size.y; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: size.x,
          fallback: this.fallback
        })
      );
    }
    this._value = value;
  }
  resize(size: Bounds2d): Frame { // return new modified frame
    const value: Array<BitMask> = []
    for (let y = 0; y < size.y; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: size.x,
          fallback: this.fallback
        })
      );
    }
    return new Frame({
      size,
      value: value
    })
  }
  shift(count:Pos2d) {
    let y = count.y;
    if (y < 0)
      y = (count.y % this._value.length) + this._value.length;

    const value = [];
    for (let i in this._value) {
      this._value[i] = this._value[(+i + count.y) % this._value.length].shift(count.x);
    }

    return new Frame({
      size: this._size,
      value: value,
      fallback: this.fallback
    });
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
    size = null
  }: FramesInterface) {
    super(["_frames", "_width","_height"]);
    this._frames = frames;

    let maxHeight = 0;
    let maxWidth = 0;
    for (let i in frames) {
      maxHeight = Math.max(maxHeight, frames[i].height);
      maxWidth = Math.max(maxWidth, frames[i].width);
    }
    this._height = (size) ? size.y : maxHeight;
    this._width = (size) ? size.x: maxWidth;
    if (size == null)
      size = new Bounds2d({
        x: this._width,
        y: this._height
      });
    for (let i in frames) {
      frames[i] = frames[i].resize(size);
    }
  }
  get height(): number { return this._height; }
  get width(): number { return this._width; }
  get frames(): Array<Frame> { return this._frames; }
}

export class FrameSprite extends Frames {
  constructor({
    frame,
    movement = new Bounds2d({x: 5, y:5}),
    step = new Bounds2d({})
  }: SpriteInterface) {
    const frames = []
    const size = new Bounds2d({
      x: frame.width + movement.x*step.x,
      y: frame.height + movement.y*step.y
    });

    for (let x = 0; x < movement.x; x++) {
      for (let y = 0; y < movement.y; y++) {
        frames.push(
          frame.resize(size).shift(
            new Pos2d({
              x: x * step.x,
              y: y * step.y
            })
          )
        );
      }
    }
    super({ frames });
  }
  getPos(position: Pos2d): Frame {
    const index: number = position.y + (position.x * this.height);
    if (index > this.frames.length)
      throw new Error(`Invalid sprite position (${position.x},${position.y})`);
    return this.frames[index];
  }
}

export class ROMFrame extends Frame {
  constructor({
    format,
    jsonData,
    depth = -1,
    reverseBits = false, // if true: will reverse data bits (based on format); if false: will do nothing
    reverseOrder = false // if true: will reverse order of data bits (based on format); if false: will do nothing
  }: ROMFrameInterface) {
    if (!Array.isArray(format))
      format = [format]; // convert [format] into an array
    if (!Array.isArray(jsonData))
      jsonData = [jsonData]; // convert [jsonData] into an array
    
    if (reverseOrder)
      format.reverse();

    let totalLength = 0;
    for (let romFormat of format) {
      if (romFormat.bits < 1)
        throw new Error(`[format] cannot have ${romFormat.bits} bits (minimum of 1)`)
      totalLength += romFormat.bits;
    }

    if (depth != -1 && totalLength > depth)
      throw new Error(`depth (${depth}) too small for ${totalLength} bits`);
    if (depth == -1)
      depth = totalLength;

    const bitMasks = [];
    for (let data of jsonData) {
      // individual packets of data
      let bitMaskData: number = 0; // theoretically safe up to 53 bits
      let localDepth = 0;
      for (let romFormat of format) {
        // retrieve information in the form of [format] from [data]
        if (romFormat.name in data) {
          if ((typeof data[romFormat.name]) != "number")
            throw new Error(`[data] values must be numbers, not ${typeof data[romFormat.name]}`);
          if (data[romFormat.name] >= 2**romFormat.bits)
            throw new Error(`[data] value too high. [format] specifies ${romFormat.bits} bits, giving a maximum value of ${2**romFormat.bits-1}`)

          let dataNumber = data[romFormat.name]
          if (reverseBits) {
            let dataStr = dataNumber.toString(2); // convert to binary
            for (let i = dataStr.length; i < romFormat.bits; i++) {
              dataStr = "0" + dataStr; // fill out with requisite placeholder '0's
            }
            dataNumber = parseInt(dataStr.split("").reverse().join(""), 2); // reverse string 
          }
          bitMaskData += dataNumber * (2**localDepth);
        }
        localDepth += romFormat.bits
      }
      bitMasks.push(
        new RawBitMask(
          bitMaskData,
          depth
        )
      )
    }

    super({
      size: new Bounds2d({
        x: depth,
        y: bitMasks.length
      }),
      value: bitMasks
    });
  }
}

export class MappedROMFrame extends ROMFrame {
  constructor({
    format,
    jsonData,
    depth = -1,
    reverseBits = false, // if true: will reverse data bits (based on format); if false: will do nothing
    reverseOrder = false // if true: will reverse order of data bits (based on format); if false: will do nothing
  }: MappedRomFrameInterface) {
    if (!Array.isArray(format))
      format = [format]; // convert [format] into an array
    if (!Array.isArray(jsonData))
      jsonData = [jsonData]; // convert [jsonData] into an array

    for (let data of jsonData) {
      for (let mappedFormat of format) {
        if (!( mappedFormat.name in data )) // value doesnt' exist, so don't try to convert
          continue;

        if ("map" in mappedFormat && (typeof data[mappedFormat.name] == "string")) {
          // data[mappedFormat.name]  // the input value
          // mappedFormat.map      // possible values and their conversions
          if (!(data[mappedFormat.name] in mappedFormat.map))
            throw new Error(`[${data[mappedFormat.map]} is not a valid value given the format of name ${mappedFormat.name}]`);
          data[mappedFormat.name] = mappedFormat.map[data[mappedFormat.name]]; // convert values via the map
        }
      }
    }

    super({ format,jsonData,depth,reverseBits,reverseOrder });
  }
}