import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, MultiConnections, Operation, RawBitMask, VBitMask } from "./support/logic/classes";
import { CharacterFrame, CharactersFrame, FileFrame, Frame, Frames, MappedROMFrame, RawROMFrame, readFile, ROMFrame, VFrame } from "./support/frames/classes"
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, FutureBitMap, SevenSegment, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, CardROM, CardROMPackage, DDCardROMPackage, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM, ROMPackage } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color, HexColor, RGB, RGBColor } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis } from "./classes/prebuilts/support/classes";
import { Custom2dShape } from "./classes/prebuilts/transcribers/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Wood } from "./classes/blocks/materials";
import { DraggableIds } from "./classes/shapeIds";
import { ROMs } from "./support/ROMs";
import { SSPReceiver } from "./classes/prebuilts/SSP/classes";
import { Charsets } from "./support/frames/graphics";

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  async build() {
    const key = this.key;
    const gen = new StringKeyGen(key);

    const txt = new CharactersFrame({
      chars: "HELLO, WORLD!\nPROGRAMMED\nTO WORK ",
      charset: Charsets.PETSCII
    })

    const display = new FutureBitMap({
      key,
      size: new Bounds2d({
        x: txt.width,
        y: txt.height
      })
    });
    
    const en = new Switch({
      key,
      connections: new Connections(display.getFrameId(txt)),
      pos: new Pos({
        z: -1
      })
    })

    return new Container({
      children: [
        display,
        en
      ]
    })
  }
}