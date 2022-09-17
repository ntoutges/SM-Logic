import { Container } from "../../../containers/classes";
import { CustomKey, Id, KeylessFutureId, UniqueCustomKey } from "../../../support/context/classes";
import { Frame, Operation } from "../../../support/logic/classes";
import { LogicalOperation } from "../../../support/logic/enums";
import { Pos } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { BitMapInterface } from "./interfaces";

export class BitMap extends Container {
  private readonly _frame: Frame;
  private readonly _frameEnable: Id;
  constructor({
    key,
    frame,
    pos,
    rotate,
    color
  }: BitMapInterface) {
    let screen: Array<Logic> = [];
    let enableIds = new KeylessFutureId();
    for (let z = 0; z < frame.rows.length; z++) {
      for (let x = 0; x < frame.rows[z].length; x++) {
        const blockKey = new UniqueCustomKey({ key: key, identifier: `screen${x}:${z}` });
        if (frame.rows[z].mask[x])
          enableIds.addId(blockKey.newId);
        screen.push(
          new Logic({
            key: blockKey,
            color: color,
            operation: new Operation({
              operation: LogicalOperation.Screen
            }),
            pos: new Pos({
              x: x,
              z: z
            })
          })
        );
      }
    }
    super({ key,pos,rotate,color, children: screen });
    this._frameEnable = enableIds;
    this._frame = frame;
  }
  get frame(): Frame { return this._frame; }
  get enableId(): Id { return this._frameEnable; }
}

// export class SevenSegment extends BitMap {
  
// }