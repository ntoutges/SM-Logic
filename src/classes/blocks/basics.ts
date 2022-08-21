/// basic Scrap Mechanic block classes
import { Unit } from "../../containers/classes";
import { Color } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Id } from "../../support/context/classes";
import { Connections, Operation } from "../../support/logic/classes";
import { LogicalOperation } from "../../support/logic/enums";
import { Pos, Rotate } from "../../support/spatial/classes";
import { ShapeIds } from "../shapeIds";
import { BlockInterface, LogicInterface } from "./interfaces";

export class Block extends Unit {
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

  build(offset=new Pos({})) {
    let json = {
      "color": this.color,
      "controller": {
        "active": false,
        "controllers": null, 
        "id": this.id.id,
        "joints": null
      },
      "pos": this.pos.add(offset).build(),
      "shapeId": this.shapeId,
      "xaxis": -3,
      "zaxis": 1
    }
    return JSON.stringify(json);
  }
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
  set operation(operation: Operation) {
    this.op = operation;
    if (!this.colorSet)
      this.updateTypeColor();
  }
  get connections(): Array<Id> { return this._conns.connections; }

  build(offset=new Pos({})) {
    let json = {
      "color": this.color,
      "controller": {
        "active": false,
        "controllers": this._conns.build(),
        "id": this.id.id,
        "joints": null,
        "mode": this.op.type
      },
      "pos": this.pos.add(offset).build(),
      "shapeId": this.shapeId,
      "xaxis": -3,
      "zaxis": 1
    }
    return JSON.stringify(json);
  }
}