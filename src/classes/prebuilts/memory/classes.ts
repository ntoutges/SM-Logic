/// assemblies of prebuilt structures

import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { UniqueCustomKey, Id, BasicKey, Key } from "../../../support/context/classes";
import { Connections, Operation } from "../../../support/logic/classes";
import { LogicalOperation } from "../../../support/logic/enums";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { BitInterface, ByteInterface } from "./interfaces";

export class Bit extends Container {
  private _io: Map<string,Key>
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color()
  }: BitInterface) {
    const setBitKey = new UniqueCustomKey({ key: key, identifier: "bit0" });
    const resetBitKey = new UniqueCustomKey({ key: key, identifier: "bit1" });
    const bufferBitKey = new UniqueCustomKey({ key: key, identifier: "bit2" });
    super({
      key,
      pos,
      rotate,
      children: [
        new Logic({
          key: setBitKey,
          connections: new Connections([ new Id(resetBitKey) ]),
          operation: new Operation({ operation: LogicalOperation.Nor }),
          pos: pos.add(new Pos({"x": -1})),
          color
        }),
        new Logic({
          key: resetBitKey,
          connections: new Connections([ new Id(bufferBitKey) ]),
          operation: new Operation({ operation: LogicalOperation.Nor }),
          pos: pos.add(new Pos({"y": 1})),
          color
        }),
        new Logic({
          key: bufferBitKey,
          connections: new Connections([ new Id(setBitKey) ]),
          pos: pos.add(new Pos({"x": 1})),
          color
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

export class Byte extends Container {
  private readonly _bits: Array<Bit>;
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
  }: ByteInterface
  ) {
    let bits: Array<Bit> = [];
    for (let i = 0; i < 8; i++) {
      bits.push(
        new Bit({
          key: key,
          pos: pos.add(new Pos({"y": i})),
          rotate,
          color
        })
      )
    }
    super({
      key: key,
      children: bits
    });
    this._bits = bits;
  }
  get bit0(): Bit { return this._bits[0]; }
  get bit1(): Bit { return this._bits[1]; }
  get bit2(): Bit { return this._bits[2]; }
  get bit3(): Bit { return this._bits[3]; }
  get bit4(): Bit { return this._bits[4]; }
  get bit5(): Bit { return this._bits[5]; }
  get bit6(): Bit { return this._bits[6]; }
  get bit7(): Bit { return this._bits[7]; }
}