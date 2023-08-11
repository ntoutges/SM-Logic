/// basic Scrap Mechanic block classes

import { Unit } from "../../containers/classes";
import { DraggableType, LightControllerType, LogicControllerType, LogicType, SensorControllerType, SwitchControllerType, TimerControllerType, UniBlockType, UniControllerType } from "../../containers/jsonformat";
import { Color } from "../../support/colors/classes";
import { Colors } from "../../support/colors/enums";
import { Id } from "../../support/context/classes";
import { Connections, Delay, Operation } from "../../support/logic/classes";
import { LogicalOperation, Time } from "../../support/logic/enums";
import { Area, Bounds, Offset, Pos, Rotate } from "../../support/spatial/classes";
import { Direction, convertToRay } from "../../support/spatial/enums";
import { DraggableIds, LogicIds, ShapeIds } from "../shapeIds";
import { BlockInterface, LogicInterface, ButtonInterface, BasicLogicInterface, TimerInterface, ScalableInterface, SensorInterface, LightInterface } from "./interfaces";

export abstract class Block extends Unit {
  readonly shapeId: ShapeIds;
  constructor({
    pos,
    rotate,
    color,
    shapeId
  }: BlockInterface) {
    super({pos,rotate,color});
    this._addProps(["shapeId", "_id"]);
    
    this.shapeId = shapeId;
  }
  
  abstract build(offset: Offset): UniBlockType[];
}

export class Scalable extends Block {
  constructor({
    bounds,
    color = new Color(Colors.Pink),
    pos,
    rotate = new Rotate({})
  }: ScalableInterface, shapeId: DraggableIds) {
    super({
      pos,color,
      shapeId: shapeId as unknown as ShapeIds
    });
    this.boundingBox = new Area({
      origin: this.boundingBox.origin,
      bounds: bounds.rotate(rotate)
    });
    this._addProps(["bounds"]);
  }
  build(offset: Offset = new Offset({})): DraggableType[] {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.add(offset.pos).sub( new Pos({ x:1, y:1 }) ); // constant offset that is required
    const json = {
      "bounds": this.boundingBox.bounds.rotate(rotation).build(),
      "color": this.color.hex,
      "pos": pos.build(),
      "shapeId": this.shapeId as unknown as DraggableIds,
      "xaxis": 1,
      "zaxis": 3
    };
    return [json]; 
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
  abstract get controller(): UniControllerType;
  connectTo(other: BasicLogic | Id) {
    this.conns.addConnection((other instanceof BasicLogic) ? other.id : other);
  }
  build(offset=new Offset({})): LogicType[] {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.rotate(offset.rotate).add(offset.pos).add( rotation.offset );
    const json = {
      "color": this.color.hex,
      "controller": this.controller,
      "pos": pos.build(),
      "shapeId": this.shapeId as unknown as LogicIds,
      "xaxis": rotation.xAxis,
      "zaxis": rotation.zAxis
    }
    return [json];
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
    color = undefined,
    connections
  }: LogicInterface
  ) {
    super({pos, rotate, key, shapeId: ShapeIds.Logic, connections});
    this._addProps(["op","colorSet"]);
    this.colorSet = color != undefined;
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
      case LogicalOperation.Reset:
        this.color = new Color(Colors.SM_Red);
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
  get controller(): LogicControllerType {
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
  get controller(): TimerControllerType {
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
  get controller(): SwitchControllerType {
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
  get controller(): SwitchControllerType {
    return {
      "active": false,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null
    }
  }
}

export class Sensor extends BasicLogic {
  readonly range: number;
  readonly colorMode: Color;
  readonly buttonMode: boolean;
  constructor({
    key,
    pos,color,
    rotate = new Rotate({}),
    connections,
    range=20,
    colorMode=null,
    buttonMode=true
  }: SensorInterface) {
    super({
      key,pos,color,
      shapeId: ShapeIds.Sensor,
      connections,
      rotate: convertToRay(rotate)
    });

    this._addProps(["range", "colorMode", "buttonMode"]);

    this.range = range;
    this.colorMode = colorMode;
    this.buttonMode = buttonMode;
  }

  get controller(): SensorControllerType {
    return {
      "audioEnabled": false,
      "buttonMode": this.buttonMode,
      "color": (this.colorMode != null) ? this.colorMode.hex : "FFFFFF",
      "colorMode": this.colorMode != null,
      "controllers": this.conns.build(),
      "id": this.id.ids[0],
      "joints": null,
      "range": this.range
    }
  }
}

export class Light extends BasicLogic {
  readonly luminance: number;
  constructor({
    key,
    pos,color,
    rotate = new Rotate({}),
    luminance
  }: LightInterface) {
    super({
      key,pos,color,
      shapeId: ShapeIds.Light,
      rotate: convertToRay(rotate)
    });

    this._addProps(["luminance"]);

    this.luminance = luminance;
  }

  get controller(): LightControllerType {
    return {
      "color": this.color.hex,
      "coneAngle": 0,
      "controllers": null, // cannot be connected to anything
      "id": this.id.ids[0],
      "joints": null,
      "luminance": this.luminance
    }
  }
}