import { Id } from "../context/classes";
import { Pos } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { LogicalOperation, LogicalType } from "./enums";
import { OperationInterface } from "./interfaces";

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
    connections: Array<Id> = [],
  ) {
    super(["_conns"]);
    this._conns = connections;
  }
  get connections(): Array<Id> { return this._conns; }
  build() {
    if (this._conns.length == 0)
      return null;
    let connections = [];
    this._conns.forEach((id: Id) => {
      connections.push({ "id": id.id });
    });
    return connections;
  }
}