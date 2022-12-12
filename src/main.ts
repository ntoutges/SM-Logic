import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Framer, Frames, MappedROMFrame, MultiConnections, Operation, RawBitMask, RawROMFrame, ROMFrame, VBitMask, VFrame } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, CardROM, CardROMPackage, DDCardROMPackage, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM, ROMPackage } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color, HexColor, RGB, RGBColor } from "./support/colors/classes";
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

    const frame0 = new VFrame({
      data: [
        "  |||||||",
        "  |     |",
        "  |     |",
        "   |   |",
        "    | |",
        "     |",
        "    | |",
        "   |   |",
        "  |     |",
        "  |     |",
        "  |||||||"
      ]
    });
    const frame1 = new VFrame({
      data: [
        "      ||",
        "     |  |",
        "     |   |",
        "     |    |",
        "     |    |",
        " |||||||||",
        "||||||",
        "||||||",
        " |||||",
        "  ||||",
        "   ||"
      ]
    });
    const frame2 = new VFrame({
      data: [
        "",
        "",
        "|||     |||",
        "||||   |  |",
        "||||| |   |",
        "||||||    |",
        "||||| |   |",
        "||||   |  |",
        "|||     |||",
        "",
        ""
      ]
    });
    const frame3 = new VFrame({
      data: [
        "   ||",
        "  ||||",
        " |||||",
        "||||||",
        "||||||",
        "||||||||||",
        "     |    |",
        "     |    |",
        "     |   |",
        "     |  |",
        "     |||"
      ]
    });
    const fill1 = new VFrame({
      data: [
        "",
        "   |||||",
        "   |||||",
        "    |||",
        "     |",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    })
    
    const fill2 = new VFrame({
      data: [
        "",
        "",
        "   |||||",
        "    |||",
        "     |",
        "",
        "     |",
        "     |",
        "     |",
        "     |",
        ""
      ]
    });
    const fill3 = new VFrame({
      data: [
        "",
        "",
        "",
        "    |||",
        "     |",
        "",
        "     |",
        "     |",
        "     |",
        "    |||",
        ""
      ]
    });
    const fill4 = new VFrame({
      data: [
        "",
        "",
        "",
        "",
        "     |",
        "",
        "     |",
        "     |",
        "    |||",
        "   |||||",
        ""
      ]
    });
    const fill5 = new VFrame({
      data: [
        "",
        "",
        "",
        "",
        "",
        "",
        "     |",
        "    |||",
        "   |||||",
        "   |||||",
        ""
      ]
    })

    return new VideoDisplay({
      key,
      frames: new Frames({
        size: new Bounds2d({
          x: 11,
          y: 11
        }),
        frames: [
          new Framer({ frames: [frame0, fill1] }),
          new Framer({ frames: [frame0, fill2] }),
          new Framer({ frames: [frame0, fill3] }),
          new Framer({ frames: [frame0, fill4] }),
          new Framer({ frames: [frame0, fill5] }),
          frame1,
          frame2,
          frame3
        ]
      }),
      frameTime: new Delay({ delay: 200, unit: Time.Millisecond })
    })
  }
}