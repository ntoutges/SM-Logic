import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MultiConnections, Operation, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, DelayUnit, SevenSegment, SevenSegmentNumber, SimpleBitMap, SmartDelayUnit } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { BitIdentifiers, ByteIdentifiers } from "./classes/prebuilts/memory/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;

    var outputKey = new CustomKey({
      key: key,
      identifier: "abcd"
    });

    var byte = new Byte({
      key: key,
      connections: new MultiConnections([
        {
          conns: new MultiConnections([
            {
              conns: new Connections([
                new Id(
                  outputKey
                )
              ]),
              id: new Identifier(
                BitIdentifiers.Output
              )
            }
          ]),
          id: new Identifier(
            ByteIdentifiers.Bit0
          )
        }
      ])
    });

    return new Container({
      children: [
        byte,
        new Logic({
          key: outputKey,
          pos: new Pos({
            x: 5
          })
        }),
        new Button({
          key: key,
          pos: new Pos({
            x: -2
          }),
          connections: new Connections(
            byte.bit0.setId
          )
        }),
        new Button({
          key: key,
          pos: new Pos({
            x: -2,
            z: 1
          }),
          connections: new Connections(
            byte.bit0.resetId
          )
        })
      ]
    })

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