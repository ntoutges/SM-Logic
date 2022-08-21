/// assemblies of prebuilt structures

import { Container } from "../../containers/classes";
import { UniqueCustomKey, Id, BasicKey, Key } from "../../support/context/classes";
import { Connections, Operation } from "../../support/logic/classes";
import { LogicalOperation } from "../../support/logic/enums";
import { Pos } from "../../support/spatial/classes";
import { Block, Logic } from "../blocks/basics";
import { ShapeIds } from "../shapeIds";
import { BitInterface } from "./interfaces";

export class Bit extends Container {
  private _io: Map<string,Key>
  constructor({
    key
  }: BitInterface) {
    const setBitKey = new UniqueCustomKey({ key: key, identifier: "bit0" });
    const resetBitKey = new UniqueCustomKey({ key: key, identifier: "bit1" });
    const bufferBitKey = new UniqueCustomKey({ key: key, identifier: "bit2" });
    super({
      key: key,
      children: [
        new Logic({
          key: setBitKey,
          connections: new Connections([ new Id(resetBitKey) ]),
          operation: new Operation({ operation: LogicalOperation.Nor }),
          pos: new Pos({"x": -1})
        }),
        new Logic({
          key: resetBitKey,
          connections: new Connections([ new Id(bufferBitKey) ]),
          operation: new Operation({ operation: LogicalOperation.Nor }),
          pos: new Pos({"y": 1})
        }),
        new Logic({
          key: bufferBitKey,
          connections: new Connections([ new Id(setBitKey) ]),
          pos: new Pos({"x": 1})
        })
      ]
    });
    this._io = new Map<string,Key>();
    this._io.set("set", setBitKey);
    this._io.set("reset", resetBitKey);
  }
  get setId(): Id { return new Id(this._io.get("set")); }
  get resetId(): Id { return new Id(this._io.get("reset")); }

  build(offset=new Pos({})) {
    return (
      new Container({
        children: this.children
      })
    ).build(offset);
  }
}