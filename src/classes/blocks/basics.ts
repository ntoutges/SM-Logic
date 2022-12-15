/// basic Scrap Mechanic block classes

import { Unit } from "../../containers/classes";
import { Color } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Id } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { LogicalOperation, Time } from "../../support/logic/enums";
import { Bounds, Offset, Pos, Rotate } from "../../support/spatial/classes";
import { Direction } from "../../support/spatial/enums";
import { DraggableIds, ShapeIds } from "../shapeIds";
import { BlockInterface, LogicInterface, ButtonInterface, BasicLogicInterface, TimerInterface, ScalableInterface } from "./interfaces";

export abstract class Block extends Unit {
  readonly shapeId: ShapeIds;
  constructor({
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
    this.shapeId = shapeId;
  }
  
  abstract build(offset: Offset);
}

export class Scalable extends Block {
  readonly bounds: Bounds;
  constructor({
    bounds,
    color = new Color(Colors.Pink),
    pos,
    rotate
  }: ScalableInterface, shapeId: DraggableIds) {
    super({
      pos,rotate,color,
      shapeId: shapeId as unknown as ShapeIds
    });
    this.bounds = bounds;
    this._addProps(["bounds"]);
  }
  /*
    doc test
  */
  build(offset: Offset = new Offset({})) {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.rotate(rotation).add(offset.pos).add( rotation.offset );
    const json = {
      "bounds": this.bounds.rotate(rotation).build(),
      "color": this.color.hex,
      "pos": pos.build(),
      "shapeId": this.shapeId,
      "xaxis": 1,
      "zaxis": 3
    }
    return JSON.stringify(json);
  }
}

export abstract class BasicLogic extends Block {
  private _conns: Connections;
  private _id: Id;
  constructor({
    key,
    pos,
    rotate,
    color,
    shapeId,
    connections = new Connections()
  }: BasicLogicInterface) {
    super({ pos,rotate,color,shapeId })
    this._id = new Id(key);
    this._addProps(["_conns"]);
    this._conns = connections;

    for (let id of connections.connections) { key.addConnection(this.id, id); }
  }
  get connections(): Array<Id> { return this._conns.connections; }
  get conns(): Connections { return this._conns; }
  get id() { return this._id; }
  abstract get controller();
  connectTo(other: BasicLogic) { this.conns.addConnection(other.id); }
  build(offset=new Offset({})) {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.rotate(rotation).add(offset.pos).add( rotation.offset );
    const json = {
      "color": this.color.hex,
      "controller": this.controller,
      "pos": pos.build(),
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
    operation = new Operation(),
    color = null,
    connections
  }: LogicInterface
  ) {
    super({pos, rotate, key, shapeId: ShapeIds.Logic, connections});
    this._addProps(["op","colorSet"]);
    this.colorSet = color != null;
    this.op = operation;
    
    if (this.colorSet)
      this.color = color;
    else if ( !this.updateTypeColor() )
      this.color = new Color(Colors.Grey);
      
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
  readonly delay: Delay;
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
    this.delay = delay;
  }
  get controller() {
    const timeDelay = this.delay.build();
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