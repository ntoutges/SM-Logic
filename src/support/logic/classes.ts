import { Id, KeylessId } from "../context/classes";
import { Pos } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { LogicalOperation, LogicalType, Time } from "./enums";
import { DelayInterface, OperationInterface } from "./interfaces";

export class Operation extends Equatable {
  private op: LogicalOperation;
  constructor({
    operation = LogicalOperation.And,
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
    super(["_mask"]);
    this.mask = mask;
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