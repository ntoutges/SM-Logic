import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, MultiConnections, Operation, RawBitMask, VBitMask } from "./support/logic/classes";
import { FileFrame, Frame, Framer, Frames, MappedROMFrame, RawROMFrame, readFile, ROMFrame, VFrame } from "./support/frames/classes"
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
import { SSPReceiver } from "./classes/prebuilts/SSP/classes";

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  async build() {
    const key = this.key;
    const gen = new StringKeyGen(key);

    const shapes = [];
    const file = await readFile("tester.png");

    return new SSPReceiver({
      key
    })
  }
}