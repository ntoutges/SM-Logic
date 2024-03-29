/// assemblies of prebuilt structures

import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { UniqueCustomKey, Id, BasicKey, Key, KeylessFutureId, Identifier, KeylessIds, KeyMap } from "../../../support/context/classes";
import { BitIdentifiers } from "../../../support/context/enums";
import { BitMask, Connections, MultiConnections, Operation } from "../../../support/logic/classes";
import { LogicalOperation } from "../../../support/logic/enums";
import { Offset, Pos, Rotate } from "../../../support/spatial/classes";
import { Logic } from "../../blocks/basics";
import { BitInterface, BitsInterface, ByteInterface, SmallBitInterface } from "./interfaces";

export class Bit extends Container {
  private _io: Map<string,Key>;
  readonly placeValue: number;
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    placeValue = 1,
    connections = new MultiConnections([])
  }: BitInterface) {
    const setBitKey = new UniqueCustomKey({ key: key, identifier: "bit0" });
    const resetBitKey = new UniqueCustomKey({ key: key, identifier: "bit1" });
    const bufferBitKey = new UniqueCustomKey({ key: key, identifier: "bit2" });
    super({
      pos,
      rotate,
      children: [
        new Logic({
          key: setBitKey,
          connections: new Connections([
            new Id(resetBitKey)
          ].concat(
            connections.getConnection(
              new Identifier([
                BitIdentifiers.Set,
                BitIdentifiers.Not
              ])
            ).connections
          )),
          operation: new Operation( LogicalOperation.Or ),
          pos: new Pos({"x": -1}),
          color
        }),
        new Logic({
          key: resetBitKey,
          connections: new Connections([
            new Id(bufferBitKey)
          ].concat(
            connections.getConnection(
              new Identifier([
                BitIdentifiers.Reset,
                BitIdentifiers.Output
              ])
            ).connections
          )),
          operation: new Operation( LogicalOperation.And ),
          pos: new Pos({"y": -1}),
          color
        }),
        new Logic({
          key: bufferBitKey,
          connections: new Connections([ new Id(setBitKey) ].concat(connections.getConnection(BitIdentifiers.Buffer).connections)),
          pos: new Pos({"x": 1}),
          color
        })
      ]
    });
    this._io = new Map<string,Key>();
    this._io.set("set", setBitKey);
    this._io.set("reset", resetBitKey);
    this.placeValue = placeValue;
  }
  get setId(): Id { return new Id(this._io.get("set")); }
  get resetId(): Id { return new Id(this._io.get("reset")); }
  get readId(): Id { return new Id(this._io.get("reset")); }
  get read(): Logic { return this.children[1] as Logic; }
}

export class OldBit extends Container {
  private _io: Map<string,Key>;
  readonly placeValue: number;
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    placeValue = 1,
    connections = new MultiConnections([])
  }: BitInterface) {
    const setBitKey = new UniqueCustomKey({ key: key, identifier: "bit0" });
    const resetBitKey = new UniqueCustomKey({ key: key, identifier: "bit1" });
    const bufferBitKey = new UniqueCustomKey({ key: key, identifier: "bit2" });
    super({
      pos,
      rotate,
      children: [
        new Logic({
          key: setBitKey,
          connections: new Connections([
            new Id(resetBitKey)
          ].concat(
            connections.getConnection(
              new Identifier([
                BitIdentifiers.Set,
                BitIdentifiers.Not
              ])
            ).connections
          )),
          operation: new Operation( LogicalOperation.Nor ),
          pos: new Pos({"x": -1}),
          color
        }),
        new Logic({
          key: resetBitKey,
          connections: new Connections([
            new Id(bufferBitKey)
          ].concat(
            connections.getConnection(
              new Identifier([
                BitIdentifiers.Reset,
                BitIdentifiers.Output
              ])
            ).connections
          )),
          operation: new Operation( LogicalOperation.Nor ),
          pos: new Pos({"y": -1}),
          color
        }),
        new Logic({
          key: bufferBitKey,
          connections: new Connections([ new Id(setBitKey) ].concat(connections.getConnection(BitIdentifiers.Buffer).connections)),
          pos: new Pos({"x": 1}),
          color
        })
      ]
    });
    this._io = new Map<string,Key>();
    this._io.set("set", setBitKey);
    this._io.set("reset", resetBitKey);
    this.placeValue = placeValue;
  }
  get setId(): Id { return new Id(this._io.get("set")); }
  get resetId(): Id { return new Id(this._io.get("reset")); }
  get readId(): Id { return new Id(this._io.get("reset")); }
  get notRead(): Logic { return this.children[0] as Logic; }
  get read(): Logic { return this.children[1] as Logic; }
}

export class Bits extends Container {
  private readonly _bits: Array<Bit>;
  constructor({
    key,
    depth = 8,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    placeValue = 1,
    connections = new MultiConnections([])
  }: BitsInterface
  ) {
    if (depth < 1)
      throw new Error("Bit depth must be at least 1");

    let bits: Array<Bit> = [];
    for (let i = 0; i < depth; i++) {
      const thisPlaceValue = placeValue * Math.pow(2,i);
      bits.push(
        new Bit({
          key: key,
          pos: new Pos({"z": i}),
          placeValue: thisPlaceValue,
          connections: connections.getMetaConnection( thisPlaceValue.toString() )
        })
      );
    }
    
    super({
      children: bits,
      pos,
      rotate,
      color
    });
    this._bits = bits;
  }
  get bits(): Array<Bit> { return this._bits; }
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
    connections
  }: ByteInterface
  ) {
    super({
      key,
      depth: 4,
      pos,
      rotate,
      color,
      connections
    });
  }
  get bit0(): Bit { return super.bits[0]; }
  get bit1(): Bit { return super.bits[1]; }
  get bit2(): Bit { return super.bits[2]; }
  get bit3(): Bit { return super.bits[3]; }
}

export class Byte extends Bits {
  constructor({
    key,
    pos = new Pos({}),
    rotate = new Rotate({}),
    color = new Color(),
    connections
  }: ByteInterface
  ) {
    super({
      key,
      depth: 8,
      pos,
      rotate,
      color,
      connections
    });
  }
  get bit0(): Bit { return super.bits[0]; }
  get bit1(): Bit { return super.bits[1]; }
  get bit2(): Bit { return super.bits[2]; }
  get bit3(): Bit { return super.bits[3]; }
  get bit4(): Bit { return super.bits[4]; }
  get bit5(): Bit { return super.bits[5]; }
  get bit6(): Bit { return super.bits[6]; }
  get bit7(): Bit { return super.bits[7]; }
}

// requires a 1-tick pulse to toggle
export class SmallBit extends Logic {
  constructor({
    key,
    pos,
    rotate,
    color,
    connections = new Connections()
  }: SmallBitInterface) {
    super({
      key,pos,rotate,color,connections,
      operation: new Operation(LogicalOperation.Xor)
    });
    this.connectTo(this); // connect this logic to itself
  }

  get read(): Logic { return this; } // maintain compatibility with larger bit
}