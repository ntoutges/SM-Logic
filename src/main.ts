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
import { AddressableMemoryRow, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM, ROMPackage } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis, Custom2dShape } from "./classes/prebuilts/support/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Wood } from "./classes/blocks/materials";
import { DraggableIds } from "./classes/shapeIds";
import { ROMs } from "./support/ROMs";

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  build() {

    const key = this.key;
    const gen = new StringKeyGen(key);

    return new Container({
      children: [
        new ROMPackage({
          key,
          data: ROMs.RPG,
          pos: new Pos({
            z: 1
          })
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