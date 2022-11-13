import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer, Wood } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MultiConnections, Operation, RawBitMask } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, MemoryGrid, MemoryGridUnit, MemoryRow, MemoryRowReader, MemorySelector } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;
    const gen = new StringKeyGen(key);

    const byte = new Integer({
      key,
      pos: new Pos({
        x: -40
      }),
      depth: 8
    });

    return new Container({
      children: [
        new MemoryGridUnit({
          key,
          signal: byte.signal
        }),
        byte,
        new Button({
          key,
          pos: new Pos({
            x: -40,
            y: -2,
          }),
          connections: new Connections(
            byte.reset
          )
        })
      ]
    });

    // return new MemoryRowReader({
    //   key: key,
    //   signal: []
    // })

    // const depth = 8;

    // const int = new Integer({
    //   key,
    //   pos: new Pos({ x: -5 }),
    //   depth: 8
    // })

    // return new Container({
    //   children: [
    //     int,
    //     new MemoryGrid({
    //       key,
    //       signal: int.signal
    //     })
    //   ]
    // })
  }
}