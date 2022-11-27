import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MultiConnections, Operation, RawBitMask, VBitMask } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Pos2d, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap, VideoDisplay } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, MemoryGrid, MemoryRow, MemoryRowReader, MemorySelector } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";
import { MemoryGridBloc } from "./classes/prebuilts/memory/memoryBlocs/classes";
import { Axis, Custom2dShape } from "./classes/prebuilts/support/classes";
import { GenericBody } from "./containers/genericBody";
import { FrameBuilder } from "./support/graphics/classes";
import { Wood } from "./classes/blocks/materials";

export class Body extends GenericBody {
  constructor() {
    super({ debug:true });
  }
  build() {

    const key = this.key;
    const gen = new StringKeyGen(key);

    const builder = new FrameBuilder({
      size: new Bounds2d({ x:21, y:21 }),
      builder: (step, Circle, Rect) => {
        const r = Rect({
          pos: new Pos2d({ x:10,y:10 }),
          bounds: new Bounds2d({ x: 20, y: 2 })
        });
        r.rotateAngle = 10 * step
      }
    })

    const frames = [];
    for (var i = 0; i < 18; i++) {
      frames.push(
        builder.build(i)
      )
    }

    return new VideoDisplay({
      key,
      frames: new Frames({
        frames: frames
      }),
      frameTime: new Delay({
        delay: 5,
        unit: Time.Tick
      })
    })
  }
}