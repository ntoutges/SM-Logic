import { ScaleableDelaysInterface } from "../../classes/prebuilts/delays/interfaces";
import { Id, Identifier, KeylessId } from "../context/classes";
import { Bounds, Bounds2d, Pos, Pos2d } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { LogicalOperation, LogicalType, Time } from "./enums";
import { BitMaskExtendInterface, DelayInterface, MultiConnectionsType } from "./interfaces";

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

  operate(...values: Array<boolean>) {
    let trues = 0; // amount of trues in [values] array
    for (let bool of values) { if (bool) trues++; }

    switch (this.type) {
      case LogicalType.And:
        return trues == values.length;
      case LogicalType.Or:
        return trues > 0;
      case LogicalType.Xor:
        return trues % 2 == 1;
      case LogicalType.Nand:
        return trues < values.length;
      case LogicalType.Nor:
        return trues == 0;
      case LogicalType.XNor:
        return trues % 2 == 0;
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
  invert(): BitMask {
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

  hexDump(): string {
    let hexStr: string = "";
    for (let i = 0; i < this.mask.length; i += 4) { // proceed one nibble at a time
      let total = 0;
      for (let j = 0; j < 4 && i+j < this.mask.length; j++) {
        total += this.mask[i + j] ? 2 ** (Math.min(3, this.mask.length-1)-j) : 0;
      }
      hexStr += total.toString(16);
    }

    return hexStr;
  }

  binDump(): string {
    return parseInt(this.hexDump(), 16).toString(2); // use built in functions to convert from (4-bits / char) to (1-bit / char)
  }
}

/// pass in a number, such as 0xfc or 0x00110101
export class RawBitMask extends BitMask {
  constructor(mask: number, length=0) { // align right
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
    this.alignLeft = false;
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
