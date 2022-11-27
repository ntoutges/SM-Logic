import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MappedROMFrame, MultiConnections, Operation, RawBitMask, ROMFrame, VBitMask } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis, Custom2dShape } from "./classes/prebuilts/support/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Wood } from "./classes/blocks/materials";
import { DraggableIds } from "./classes/shapeIds";

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  build() {

    const key = this.key;
    const gen = new StringKeyGen(key);

    const address = new Integer({
      key,
      depth: 8,
      pos: new Pos({
        x: -5
      })
    })

    return new Container({
      children: [
        new ROM({
          key,
          signal: address.signal,
          data: new MappedROMFrame({
            format: [
              {
                name: "rooms",
                bits: 2,
                map: { "closed": 0b01, "open": 0b10 }
              },
              {
                name: "walls",
                bits: 4,
                map: { "up": 0b1000, "down": 0b0100, "left": 0b0010, "right": 0b0001 }
              }
          ],
            jsonData: [
              {
                "rooms": "closed",
                "walls": "up",
              },
              {
                "rooms": "open",
                "walls": 0b0110
              }
            ]
          })
        }),
        address,
        new Button({
          key,
          pos: new Pos({
            x: -5,
            y: -2
          }),
          connections: new Connections(address.reset)
        })
      ]
    })

    // return new Custom2dShape({
    //   frame: new ROMFrame({
    //     format: [
    //       {
    //         name: "rooms",
    //         bits: 2
    //       },
    //       {
    //         name: "walls",
    //         bits: 3
    //       }
    //     ],
    //     jsonData: [
    //       {
    //         "rooms": 1,
    //         "walls": 7,
    //       },
    //       {
    //         "rooms": 2,
    //         "walls": 2
    //       }
    //     ],
    //     reverseBits: false,
    //     reverseOrder: true
    //   }),
    //   trueMaterial: DraggableIds.Wood,
    //   falseMaterial: DraggableIds.Glass,
    //   color: new Color(Colors.SM_White)
    // })
  }
}