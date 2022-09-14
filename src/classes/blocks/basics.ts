/// basic Scrap Mechanic block classes
import { Unit } from "../../containers/classes";
import { Color } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Id } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { LogicalOperation } from "../../support/logic/enums";
import { Pos, Rotate } from "../../support/spatial/classes";
import { ShapeIds } from "../shapeIds";
import { BlockInterface, LogicInterface } from "./interfaces";

export abstract class Block extends Unit {
  private _id: Id;
  readonly shapeId: ShapeIds;
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    shapeId = ShapeIds.Logic, // temp
  }: BlockInterface) {
    super({pos,rotate,color});
    this._addProps(["shapeId", "_id"]);

    this.pos = pos;
    this.rotation = rotate;
    this.color = color;
    this._id = new Id(key);
    this.shapeId = shapeId;
  }
  get id() { return this._id; }

  abstract build(offset: Pos);
}

// note: SM connections work as an id in the logic "sender"
export class Logic extends Block {
  private op: Operation;
  private colorSet: boolean; // should not be used in checking equality
  private _conns: Connections;
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    operation = new Operation({}),
    color = new Color(Colors.Lightgrey),
    connections = new Connections(),
  }: LogicInterface
  ) {
    super({pos, rotate, key, shapeId: ShapeIds.Logic});
    this._addProps(["op","_color", "_conns"]);
    this.colorSet = false;
    this.op = operation;
    this._conns = connections;
    
    for (let id of connections.connections) { key.addConnection(this.id, id); }

    if ( !this.updateTypeColor() )
      this.color = color;
  }
  updateTypeColor(): boolean { // returns if color was updated
    this.colorSet = false;
    switch (this.op.operation) {
      case LogicalOperation.Input:
        this.color = new Color(Colors.SM_Input);  
        return true;
      case LogicalOperation.Output:
        this.color = new Color(Colors.SM_Output);
        return true;
    }
    return false;
  }

  get operation(): Operation { return this.op; }
  set color(color: Color) {
    super.color = color;
    this.colorSet = true;
  };
  get color(): Color { return super.color; }
  set operation(operation: Operation) {
    this.op = operation;
    if (!this.colorSet)
      this.updateTypeColor();
  }
  get connections(): Array<Id> { return this._conns.connections; }

  build(offset=new Pos({})) {
    let json = {
      "color": this.color.hex,
      "controller": {
        "active": false,
        "controllers": this._conns.build(),
        "id": this.id.ids[0],
        "joints": null,
        "mode": this.op.type
      },
      "pos": this.pos.add(offset).add( this.rotation.offset ).build(),
      "shapeId": this.shapeId,
      "xaxis": this.rotation.xAxis,
      "zaxis": this.rotation.zAxis
    }
    return JSON.stringify(json);
  }
}