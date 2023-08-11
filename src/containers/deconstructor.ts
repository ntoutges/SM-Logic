import { BasicLogic } from "../classes/blocks/basics";
import { Color } from "../support/colors/classes";
import { Id, KeylessFutureId } from "../support/context/classes";
import { Connections } from "../support/logic/classes";
import { Offset, Pos, Rotate } from "../support/spatial/classes";
import { Container, Unit } from "./classes";
import { DeconstructorInterface } from "./interfaces";
import { LogicType, UniBlockType, isLogicType } from "./jsonformat";

export class Deconstructor extends Unit {
  readonly toDeconstruct: UniBlockType[];
  private readonly logics: LogicType[];
  constructor({
    pos,
    rotate, // currently does nothing, because I am lazy
    color,
    toDeconstruct,
    key
  }: DeconstructorInterface) {
    super({
      pos,
      rotate,
      color
    });

    const idMap: Map<number, number> = new Map<number, number>();
    const logics: LogicType[] = [];

    this.toDeconstruct = JSON.parse(JSON.stringify(toDeconstruct.bodies[0].childs)); // create copy of specific part

    for (const child of this.toDeconstruct) {
      if (isLogicType(child)) {
        const oldId = child.controller.id;
        const newId = key.newId;
        idMap.set(oldId, newId); // store how to convert from old to new
        child.controller.id = newId;
        
        logics.push(child);
      }
    }
    
    for (const logic of logics) {
      const oldIds: Array<{id: number}> | null = logic.controller.controllers;
      if (oldIds != null) { // empty list, ignore
        const newIds: Array<{id: number}> = [];
        for (const oldId of oldIds) {
          newIds.push({
            "id": idMap.get(oldId.id)
          }); // convert ids
        }
        logic.controller.controllers = newIds; // save new ids
      }
    }
    
    this.logics = logics;
  }

  getColoredLogicObject(
    color: Color,
    index: number = 0
  ): UniBlockType {
    let counter = 0;
    for (const logic of this.logics) {
      if (color.hex == logic.color) {
        if (counter == index) {
          return logic;
        }
        counter++;
      }
    }
    return null;
  }

  getColoredInputs(color: Color): KeylessFutureId { // find all logic gates of a color, and return a key with their ids
    const ids = new KeylessFutureId();
    for (const logic of this.logics) {
      if (color.hex == logic.color) ids.addId(logic.controller.id); // same color
    }
    return ids;
  }

  coloredInputsConnectTo(color: Color, other: BasicLogic | Id): number { // returns the amount this connects to
    let count = 0;
    for (const logic of this.logics) {
      if (color.hex == logic.color) { // same color
        if (logic.controller.controllers == null) {
          logic.controller.controllers = [];
        }
        
        if (other instanceof BasicLogic) other = other.id;

        for (const id of other.ids) {
          logic.controller.controllers.push({
            "id": id
          });
        }

        count++;
      }
    }
    return count;
  }

  // connects to the index'th logic of that color
  coloredInputConnectTo(
    color: Color,
    index: number,
    other: BasicLogic | Id
  ): boolean {
    let count = 0;
    for (const logic of this.logics) {
      if (color.hex == logic.color && count++ == index) { // same color        
        if (logic.controller.controllers == null) {
          logic.controller.controllers = [];
        }
        
        if (other instanceof BasicLogic) other = other.id;

        for (const id of other.ids) {
          logic.controller.controllers.push({
            "id": id
          });
        }
        return true;
      }
    }
    return false;
  }

  build(offset: Offset = new Offset({})): UniBlockType[] {
    const rotation = this.rotation.add(offset.rotate);
    const pos = this.pos.rotate(offset.rotate).add(offset.pos).add( rotation.offset );
        
    const children: UniBlockType[] = [];
    for (const child of this.toDeconstruct) {
      const newChild: UniBlockType = JSON.parse(JSON.stringify(child)); // create deep copy of child
      newChild.pos = (new Pos(child.pos)).add(pos).build();
      children.push(newChild);
    }

    return children;
  }
}