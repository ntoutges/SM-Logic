import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
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
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis } from "./classes/prebuilts/support/classes";
import { Custom2dShape, Mural } from "./classes/prebuilts/transcribers/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Concrete, GlassTile, Wood } from "./classes/blocks/materials";
import { DraggableIds } from "./classes/shapeIds";
import { ROMs } from "./support/ROMs";
import { SSPReceiver } from "./classes/prebuilts/SSP/classes";
import { Charsets } from "./support/frames/graphics";
import { Layer, Layers, Material } from "./support/layers/classes";
import { ColorSets } from "./support/frames/enums";
import { StandardUnit } from "./containers/standard";
import { AlignH, AlignV } from "./containers/enums";

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({ debug: false });
  }
  async build() {
    const key = this.key;
    
    var c = new Byte({
      key,
      rotate: new Rotate({
        direction: Direction.Backwards
      })
    });
    // console.log(c.origin)
    // return c;

    return new StandardUnit({
      children: [
        new Counter({
          key,
          rotate: new Rotate({
            direction: Direction.Backwards
          })
        }),
        new Byte({
          key
        }),
        new Byte({
          key
        }),
        new Byte({
          key
        }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        new Byte({
          key,
          pos: new Pos({
            x: 5
          })
        }),
        new Logic({
          key
        }),
        new Wood({
          bounds: new Bounds({})
        })
        // new Wood({
        //   bounds: new Bounds({
        //     x: 5,
        //     y: 4
        //   }),
        //   color: new Color(Colors.SM_Red)
        // }),
        // new Wood({
        //   bounds: new Bounds({
        //     x: 4,
        //     y: 3
        //   }),
        //   color: new Color(Colors.SM_Orange)
        // }),
        // new Wood({
        //   bounds: new Bounds({
        //     x: 4,
        //     y: 2
        //   }),
        //   color: new Color(Colors.SM_Yellow)
        // }),
        // new Wood({
        //   bounds: new Bounds({
        //     x: 4,
        //     y: 1
        //   }),
        //   color: new Color(Colors.SM_Green)
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // }),
        // new Byte({
        //   key
        // })
      ]
    })
  }
}