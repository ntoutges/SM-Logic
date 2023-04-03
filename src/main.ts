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

    const c1 = new Logic({ key, operation: new Operation(LogicalOperation.Not) })
    const c2 = new Logic({ key, connections: new Connections(c1.id) })
    const c3 = new Logic({ key, connections: new Connections(c2.id) })
    c1.connectTo(c3)

    const player = new AnimatedFrameSprite({
      frames: new Frames({
        frames: [
          new FileFrame({ imageData: await readFile("Small test.png") }),
          new FileFrame({ imageData: await readFile("Small test.png") }).invert()
        ]
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

    const combiners1: Logic[] = []
    const combiners2: Logic[] = []
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        combiners1.push(
          new Logic({
            key,
            operation: new Operation(LogicalOperation.And),
            connections: new Connections(
              screen.physicalFrames[
                player.getPosIndex(
                  new Pos2d({
                    x,y
                  }),
                  0
                )
              ].id
            ),
            rotate: new Rotate({ direction: Direction.Up })
          })
        )
        combiners2.push(
          new Logic({
            key,
            operation: new Operation(LogicalOperation.And),
            connections: new Connections(
              screen.physicalFrames[
                player.getPosIndex(
                  new Pos2d({
                    x,y
                  }),
                  1
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
        conns.push(combiners1[x + W*i].id)
        conns.push(combiners2[x + W*i].id)
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
        conns.push(combiners2[W*y + i].id)
        conns.push(combiners1[W*y + i].id)
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

    const a_EN = new Logic({
      key,
      pos: new Pos({
        x: 1,
        y: 3
      }),
      connections: new Connections(combiners1.map((val) => { return val.id }))
    })
    const b_EN = new Logic({
      key,
      pos: new Pos({
        x: 1,
        y: 3,
        z: 1
      }),
      operation: new Operation(LogicalOperation.Not),
      connections: new Connections(combiners2.map((val) => { return val.id }))
    });

    const p = new Logic({
      key,
      connections: new Connections([ xC.inc.id, xC.dec.id, yC.inc.id, yC.dec.id ])
    })
    c1.connectTo(p)
    c2.connectTo(p)

    xC.inc.operation = new Operation(LogicalOperation.And);
    xC.dec.operation = new Operation(LogicalOperation.And);
    yC.inc.operation = new Operation(LogicalOperation.And);
    yC.dec.operation = new Operation(LogicalOperation.And);

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
          children: combiners1,
          pos: new Pos({
            x: 2,
            y: 3
          }),
        }),
        new Container({
          children: combiners2,
          pos: new Pos({
            x: 2,
            y: 3,
            z: 1
          }),
        }),
        a_EN,
        b_EN,
        new Switch({
          key,
          connections: new Connections([a_EN.id, b_EN.id]),
          pos: new Pos({
            x: -6,
            z: 3
          })
        }),
        new Button({
          key,
          connections: new Connections(xC.inc.id),
          pos: new Pos({
            x: -2,
            z: 1,
            y: -1
          })
        }),
        new Button({
          key,
          connections: new Connections(xC.dec.id),
          pos: new Pos({
            x: -4,
            z: 1,
            y: -1
          })
        }),
        new Button({
          key,
          connections: new Connections(yC.inc.id),
          pos: new Pos({
            x: -3,
            z: 0,
            y: -1
          })
        }),
        new Button({
          key,
          connections: new Connections(yC.dec.id),
          pos: new Pos({
            x: -3,
            z: 2,
            y: -1
          })
        }),
        new Container({
          children: [
            c1,c2,c3,p
          ],
          pos: new Pos({
            y: 3
          })
        })
      ]
    })
  }
}