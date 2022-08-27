/// assemblies of prebuilt structures

import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { UniqueCustomKey, Id, BasicKey, Key, KeylessFutureId } from "../../../support/context/classes";
import { BitMask, Connections, Operation } from "../../../support/logic/classes";
import { LogicalOperation } from "../../../support/logic/enums";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { BitInterface, BitsInterface, ByteInterface } from "./interfaces";

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

export class Bits extends Container {
  private readonly _bits: Array<Bit>;
  constructor({
    key,
    depth = 8,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
  }: BitsInterface
  ) {
    if (depth < 1)
      throw new Error("Bit depth must be at least 1");
    let bits: Array<Bit> = [];
    for (let i = 0; i < depth; i++) {
      bits.push(
        new Bit({
          key: key,
          pos: pos.add(new Pos({"z": i})),
          rotate,
          color
        })
      );
    }
    super({
      key: key,
      children: bits
    });
    this._bits = bits;
  }
  get bits(): Array<Bit> { return this._bits; }
  getBit(place: number): Bit { return this.bits[place]; }
  get reset(): Id {
    const ids = new KeylessFutureId();
    for (let bit of this._bits) { ids.addId(bit.resetId); }
    return ids;
  }
  set(map: BitMask): Id {
    const ids = new KeylessFutureId();
    for (let i = 0; i < this._bits.length; i++) {
      if (i >= map.mask.length)
        ids.addId( this._bits[i].resetId );
      else if (map.mask[i])
        ids.addId( this.bits[i].setId ); // enabled
      else
        ids.addId( this.bits[i].resetId ); // disabled
    }
    return ids;
  }
}

export class Nibble extends Bits {
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
  }: ByteInterface
  ) {
    super({
      key: key,
      depth: 4,
      pos: pos,
      rotate: rotate,
      color: color
    });
  }
  get bit0(): Bit { return super.getBit(0); }
  get bit1(): Bit { return super.getBit(1); }
  get bit2(): Bit { return super.getBit(2); }
  get bit3(): Bit { return super.getBit(3); }
}

export class Byte extends Bits {
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
  }: ByteInterface
  ) {
    super({
      key: key,
      depth: 8,
      pos: pos,
      rotate: rotate,
      color: color
    });
  }
  get bit0(): Bit { return super.getBit(0); }
  get bit1(): Bit { return super.getBit(1); }
  get bit2(): Bit { return super.getBit(2); }
  get bit3(): Bit { return super.getBit(3); }
  get bit4(): Bit { return super.getBit(4); }
  get bit5(): Bit { return super.getBit(5); }
  get bit6(): Bit { return super.getBit(6); }
  get bit7(): Bit { return super.getBit(7); }
}