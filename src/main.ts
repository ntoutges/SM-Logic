import { Builder } from "./builders/classes";
import { Button, Logic, Switch } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId } from "./support/context/classes";
import { BitMask, Connections, Delay, Frame, Frames, Operation, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap } from "./classes/prebuilts/displays/classes";
import { LogicalOperation } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;

    var display = new CharacterDisplay({
      key: key
    });

    var letters: Array<Unit> = []
    for (var i = 0; i < 37; i++) {
      letters.push(
        new Container({
          child: new Switch({
            key: key,
            connections: new Connections(
              display.getCharacter(i)
            ),
            rotate: new Rotate({
              direction: Direction.Forwards
            })
          }),
          pos: new Pos({
            x: i - 18,
            z: 8
          })
        })
      )
    }

    return new Container({
      children: letters.concat([
        display
      ])
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