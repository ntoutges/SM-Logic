import { Builder } from "./builders/classes";
import { Button, Light, Logic, Sensor, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Counter, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, MultiConnections, Operation, RawBitMask, VBitMask } from "./support/logic/classes";
import { AnimatedFrameSprite, AutoFileFrames, CharacterFrame, CharactersFrame, FileFrame, FileFrames, Frame, Frames, FrameSprite, FullFrame, MappedROMFrame, RawROMFrame, readFile, ROMFrame, VFrame } from "./support/frames/classes"
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, FutureBitMap, SevenSegment, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, CardROM, CardROMPackage, DDCardROMPackage, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector, ROM, ROMPackage } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color, ColorList, ColorNameList, HexColor, MonoRGB, RGB, RGBColor } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";
import { Axis } from "./classes/prebuilts/support/classes";
import { Custom2dShape, Mural } from "./classes/prebuilts/transcribers/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Concrete, GlassTile, Wood } from "./classes/blocks/materials";
import { DraggableIds, ShapeIds } from "./classes/shapeIds";
import { ROMs } from "./support/ROMs";
// import { SSPReceiver } from "./classes/prebuilts/SSP/classes";
import { Charsets } from "./support/frames/graphics";
import { Layer, Layers, Material } from "./support/layers/classes";
import { ColorSets } from "./support/frames/enums";
import { StandardPlate } from "./containers/standard";
import { AlignH, AlignV } from "./containers/enums";
import { SSPReceiver } from "./classes/prebuilts/SSP/classes";
import { Deconstructor } from "./containers/deconstructor";

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({
      debug: false
    });
  }
  async build() {
    const key = this.key;
    
    const passthrough = new Logic({
      key,
      pos: new Pos({
        y: -1,
        z: 0
      })
    })
    
    const button = new Button({
      key,
      pos: new Pos({
        y: -1,
        z: 2
      }),
      rotate: new Rotate({
        direction: Direction.Forwards
      }),
      connections: new Connections(passthrough.id)
    })

    const obj = new SSPReceiver({
      key,
      signal: [passthrough],
      extensions: 1
    });

    const lights = []
    for (var i = 0; i < 8; i++) {
      lights.push(
        new Light({
          key,
          pos: new Pos({
            x: 5,
            y: -5+2*i
          })
        })
      )
    }

    obj.connectSignalTo(lights)

    return new Container({
      children: [
        obj,
        button,
        passthrough
      ].concat(lights)
    });
  }
}