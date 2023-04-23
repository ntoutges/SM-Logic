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
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis } from "./classes/prebuilts/support/classes";
import { Custom2dShape, Mural } from "./classes/prebuilts/transcribers/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Concrete, GlassTile, Wood } from "./classes/blocks/materials";
import { DraggableIds } from "./classes/shapeIds";
import { ROMs } from "./support/ROMs";
// import { SSPReceiver } from "./classes/prebuilts/SSP/classes";
import { Charsets } from "./support/frames/graphics";
import { Layer, Layers, Material } from "./support/layers/classes";
import { ColorSets } from "./support/frames/enums";
import { StandardPlate } from "./containers/standard";
import { AlignH, AlignV } from "./containers/enums";

const Jimp = require("jimp");

export class Body extends GenericBody {
  constructor() {
    super({
      debug: false
    });
  }
  async build() {
    const key = this.key;

    const depth = 8

    // quick proof of concept to show the possible speed of programmitcally generating logic
    var sensors = []
    var bits = []
    var resets = []
    var layers = []
    
    for (var i = 0; i < depth; i++) { layers.push([]) }

    for (var j = 0; j < 64; j++) {
      var bits1 = new Bits({
        key,
        depth
      });
      resets.push(bits1.reset);

      var selectors: Logic[] = [];
      var conns = []
      for (var i = 0; i < depth; i++) {
        selectors.push(
          new Logic({
            key,
            operation: new Operation(LogicalOperation.And),
            connections: new Connections(bits1.getBit(i).setId),
            pos: new Pos({
              z: i
            })
          })
        );
        conns.push(selectors[i].id)
        layers[i].push(selectors[i].id)
      }
      bits.push(
        new Container({
          children: [].concat([bits1], selectors)
        })
      )

      sensors.push(
        new Sensor({
          key,
          range: depth,
          rotate: new Rotate({
            direction: Direction.Down
          }),
          connections: new Connections(conns)
        })
      );
    }

    var counter = new Counter({
      key,
      depth: Math.floor(Math.log2(depth)),
      pos: new Pos({
        x: -15
      })
    })
    var demultiplexer = []
    for (let i = 0; i < depth; i++) {
      demultiplexer.push(
        new ConstantCompare({
          key,
          constant: i,
          operation: CompareOperation.Equals,
          signal: counter.signal,
          ifC: new Connections(layers[i])
        })
      )
    }

    return new Container({
      children: [
        new StandardPlate({
          children: bits,
          gridSize: new Bounds2d({
            x: 8,
            y: 8
          })
        }),
        new Grid({
          size: new Bounds({
            x: 8,
            y: 8
          }),
          children: sensors,
          pos: new Pos({
            x: -9
          })
        }),
        new Logic({
          key: new CustomKey({
            key,
            identifier: "inv"
          }),
          connections: new Connections(resets),
          operation: new Operation(LogicalOperation.Not),
          pos: new Pos({
            y: -1
          })
        }),
        new Button({
          key,
          connections: new Connections(
            new Id( new CustomKey({key, identifier: "inv"}) )
          ),
          pos: new Pos({
            y: -2
          })
        }),
        counter,
        new Container({
          children: demultiplexer,
          pos: new Pos({
            x: -15,
            y: 5
          })
        })
      ]
    })
  }
}