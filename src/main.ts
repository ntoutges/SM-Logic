import { Builder } from "./builders/classes";
import { Logic } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey } from "./support/context/classes";
import { Connections, Delay, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;

    // var keys: Array<UniqueCustomKey> = [];
    // for (var i = 0; i < 11; i++) {
    //   keys.push(
    //     new UniqueCustomKey({
    //       key: key,
    //       identifier: "key" + i
    //     })
    //   );
    // }

    // var logics: Array<Logic> = [];
    // for (var i = 0; i < 10; i++) {
    //   logics.push(
    //     new Logic({
    //       key: keys[i],
    //       pos: new Pos({
    //         x: i
    //       }),
    //       connections: (i != 0) ? new Connections(
    //         new Id( keys[i - 1] )
    //       )
    //       : new Connections( [] )
    //     })
    //   );
    // }

    // logics.push(
    //   new Logic({
    //     key: keys[10],
    //     pos: new Pos({
    //       x: 10
    //     }),
    //     connections: new Connections(
    //       [
    //         new Id( keys[4] ),
    //         new Id( keys[9] ),
    //         new Id( keys[0] )
    //       ]
    //     )
    //   })
    // )

    // console.log(
    //   key.getDelay(
    //     new Id(keys[10]),
    //     new Id(keys[0])
    //   )
    // );
    // return new Container({
    //   children: logics
    // });

    return new Bits({
      key: key,
      depth: 100
    })
  }
}