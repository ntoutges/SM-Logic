import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MappedROMFrame, MultiConnections, Operation, RawBitMask, RawROMFrame, ROMFrame, VBitMask } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, CardROM, CardROMPackage, DDCardROMPackage, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM, ROMPackage } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color, HexColor, RGB } from "./support/colors/classes";
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

    // ROMs.RPG.remap(
    //   new Bounds2d({
    //     x: 32,
    //     y: 16
    //   })
    // ).hFlip().hexDump({
    //   lineSize: 8,
    //   chunkSize: 4
    // })

    // return new Container({
    //   children: [
    //     new DDCardROMPackage({
    //       data: ROMs.RPG.remap(
    //         new Bounds2d({
    //           x: 32,
    //           y: 16
    //         })
    //       )
    //     })
    //   ]
    // })

    const builder = new FrameBuilder({
      size: new Bounds2d({
        x: 41,
        y: 41
      }),
      builder(step, Circle, Rect) {
        Rect({
          pos: new Pos2d({
            x: 20 + 10 * Math.cos(step * 5 * Math.PI/180),
            y: 20 + 10 * Math.sin(step * 5 * Math.PI/180)
          }),
          bounds: new Bounds2d({
            x: 8,
            y: 2
          }),
          rotateAngle: step*5
        })
      },
    })

    const shapes: Array<Unit> = [];
    for (var i = 0; i <= 180; i++) {
      let r = Math.floor(Math.sqrt(1.416 * i/255)*255).toString(16)
      if (r.length == 1) r = "0" + r;

      shapes.push(
        new Custom2dShape({
          frame: builder.build(i),
          pos: new Pos({
            z: i
          }),
          color: new HexColor(
            r + "0000"
          )
        })
      )
    }

    return new Container({
      children: shapes
    })
  }
}