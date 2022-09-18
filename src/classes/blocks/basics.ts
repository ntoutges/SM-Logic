/// basic Scrap Mechanic block classes
import { Unit } from "../../containers/classes";
import { Color } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Id } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { LogicalOperation, Time } from "../../support/logic/enums";
import { Offset, Pos, Rotate } from "../../support/spatial/classes";
import { Direction } from "../../support/spatial/enums";
import { ShapeIds } from "../shapeIds";
import { BlockInterface, LogicInterface, ButtonInterface, BasicLogicInterface, TimerInterface } from "./interfaces";

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

  abstract build(offset: Offset);
}

export abstract class BasicLogic extends Block {
  private _conns: Connections;
  constructor({
    key,
    pos,
    rotate,
    color,
    shapeId,
    connections = new Connections()
  }: BasicLogicInterface) {
    super({ key,pos,rotate,color,shapeId })
    this._addProps(["_conns"]);
    this._conns = connections;

    for (let id of connections.connections) { key.addConnection(this.id, id); }
  }
  get connections(): Array<Id> { return this._conns.connections; }
  get conns(): Connections { return this._conns; }
  abstract get controller();
  connectTo(other: BasicLogic) { this.conns.addConnection(other.id); }
  build(offset=new Offset({})) {
    let rotation = this.rotation.add(offset.rotate);
    let pos = this.pos.rotate(rotation);
    let json = {
      "color": this.color.hex,
      "controller": this.controller,
      "pos": pos.add(offset.pos).add( rotation.offset ).build(),
      "shapeId": this.shapeId,
      "xaxis": rotation.xAxis,
      "zaxis": rotation.zAxis
    }
    return JSON.stringify(json);
  }
}

// note: SM connections work as an id in the logic "sender"
export class Logic extends BasicLogic {
  private op: Operation;
  private colorSet: boolean; // should not be used in checking equality
  constructor({
    key,
    pos,
    rotate,
    operation = new Operation({}),
    color = new Color(Colors.Grey),
    connections
  }: LogicInterface
  ) {
    super({pos, rotate, key, shapeId: ShapeIds.Logic, connections});
    this._addProps(["op","_color"]);
    this.colorSet = false;
    this.op = operation;
    
    if ( !this.updateTypeColor() )
      this.color = color;
  }
  updateTypeColor(): boolean { // returns if color was updated
    this.colorSet = false;
    switch (this.op.operation) {
      case LogicalOperation.Input:
        this.color = new Color(Colors.SM_Input);  
        break;
      case LogicalOperation.Output:
        this.color = new Color(Colors.SM_Output);
        break;
      case LogicalOperation.Screen:
        this.color = new Color(Colors.SM_Black);
        break;
      default:
        return false;
    }
    return true;
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
  get controller() {
    return {
      "active": false,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null,
      "mode": this.op.type
    };
  }
}

export class Timer extends BasicLogic {
  _delay: Delay;
  constructor({
    key,
    delay = new Delay({ delay:0, unit: Time.Tick }),
    pos,
    rotate = new Rotate({ direction: Direction.Up }),
    color,
    connections
  }: TimerInterface) {
    if (delay.getDelay(Time.Second) > 60)
      throw new Error("Timer cannot have delay greater than 60 seconds")
    super({
      key,pos,rotate,color,connections,
      shapeId: ShapeIds.Timer
    });
    this._delay = delay;
  }
  get controller() {
    const timeDelay = this._delay.build();
    return {
      "active": false,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null,
      "seconds": timeDelay.seconds,
      "ticks": timeDelay.ticks
    };
  }
}

export class Button extends BasicLogic {
  constructor({
    key,
    pos,
    rotate,
    color,
    connections
  }: ButtonInterface) {
    super({
      key,pos,rotate,color,
      shapeId: ShapeIds.Button,
      connections
    });
  }
  get controller() {
    return {
      "active": false,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null
    }
  }
}

export class Switch extends BasicLogic {
  constructor({
    key,
    pos,
    rotate,
    color,
    connections
  }: ButtonInterface) {
    super({
      key,pos,rotate,color,
      shapeId: ShapeIds.Switch,
      connections
    });
  }
  get controller() {
    return {
      "active": false,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null
    }
  }
}