import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, Operation, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, DelayUnit, SevenSegment, SevenSegmentNumber, SimpleBitMap, SmartDelayUnit } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;

    var delayUnit = new SmartDelayUnit({
      key: key,
      delays: new Delays([
        new Delay({
          delay: 100
        }),
        new Delay({
          delay: 20
        }),
        new Delay({
          delay: 15
        }),
        new Delay({
          delay: 2
        })
      ])
    });
    var button = new Container({
      child: new Button({
        key,
        rotate: new Rotate({
          direction: Direction.Up
        }),
        connections: new Connections(
          delayUnit.startId
        )
      }),
      pos: new Pos({
        z: 3
      })
    });

    var output = new Logic({
      key,
      pos: new Pos({
        y:1
      }),
      rotate: new Rotate({
        direction: Direction.Up
      })
    });

    delayUnit.getTimer(0).connectTo(output);
    
    return new Container({
      children: [
        delayUnit,
        button,
        output
      ]
    });

    // var map = new SimpleBitMap({
    //   key: key,
    //   frame: new Frame({
    //     width: 5,
    //     height: 5,
    //     value: [
    //       new BitMask([true,true,true,true,true]),
    //       new BitMask([false,false,true,false,false]),
    //       new BitMask([false,true,false,false,false]),
    //       new BitMask([true,false,false,false,false]),
    //       new BitMask([true,true,true,false,false])
    //     ]
    //   })
    // })

    // return new Container({
    //   children: [
    //     map,
    //     new Switch({
    //       key: key,
    //       pos: new Pos({
    //         x: 5
    //       }),
    //       connections: new Connections(
    //         map.getEnableId(0)
    //       )
    //     })
    //   ]
    // })
  }
}