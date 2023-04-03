import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Counter, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, MultiConnections, Operation, RawBitMask, VBitMask } from "./support/logic/classes";
import { AutoFileFrames, CharacterFrame, CharactersFrame, FileFrame, FileFrames, Frame, Frames, FrameSprite, FullFrame, MappedROMFrame, RawROMFrame, readFile, ROMFrame, VFrame } from "./support/frames/classes"
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

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  async build() {
    const key = this.key;
    const gen = new StringKeyGen(key);

    const W = 32
    const H = 16

    const xC = new Counter({
      key,
      depth: 5,
      pos: new Pos({
        x: -3
      })
    });
    const yC = new Counter({
      key,
      depth: 4,
      pos: new Pos({
        x: -6
      })
    })

    const player = new FrameSprite({
      frame: new FileFrame({
        imageData: await readFile("Small test.png")
      }),
      movement: new Bounds2d({
        x: W-1,
        y: H-1
      }),
      step: new Bounds2d({
        x: 1,
        y: 1
      })
    })

    const screen = new BitMap({
      key,
      frames: player
    })

    const combiners: Logic[] = []
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        combiners.push(
          new Logic({
            key,
            operation: new Operation(LogicalOperation.And),
            connections: new Connections(
              screen.physicalFrames[
                player.getPosIndex(
                  new Pos2d({
                    x,y
                  })
                )
              ].id
            ),
            rotate: new Rotate({ direction: Direction.Up })
          })
        )
      }
    }

    const comparesX: ConstantCompare[] = []
    const comparesY: ConstantCompare[] = []
    for (let x = 0; x < W; x++) {
      const conns: Id[] = []
      for (let i = 0; i < H; i++) {
        conns.push(combiners[x + W*i].id)
      }
      comparesX.push(
        new ConstantCompare({
          key,
          signal: xC.signal,
          constant: x,
          ifC: new Connections(conns),
          operation: CompareOperation.Equals
        })
      )
    }
    for (let y = 0; y < H; y++) {
      const conns: Id[] = [];
      for (let i = 0; i < W; i++) {
        conns.push(combiners[W*y + i].id)
      }
      comparesY.push(
        new ConstantCompare({
          key,
          signal: yC.signal,
          constant: y,
          ifC: new Connections(conns),
          operation: CompareOperation.Equals
        })
      )
    }

    return new Container({
      children: [
        screen,
        new Grid({
          children: comparesX,
          size: new Bounds({
            x: W
          }),
          pos: new Pos({
            y: 1
          })
        }),
        new Grid({
          children: comparesY,
          size: new Bounds({
            x: H
          }),
          pos: new Pos({
            y: 2
          })
        }),
        xC,
        yC,
        new Container({
          children: combiners,
          pos: new Pos({
            x: 2,
            y: 3
          }),
          // size: new Bounds({
          //   x: W,
          //   y: H
          // })
        })
      ]
    })
  }
}