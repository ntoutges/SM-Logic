import { Builder } from "./builders/classes";
import { Logic } from "./classes/blocks/basics";
import { Bit, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey } from "./support/context/classes";
import { Connections, Delay, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;

    var keys: Array<UniqueCustomKey> = [];
    for (var i = 0; i < 11; i++) {
      keys.push(
        new UniqueCustomKey({
          key: key,
          identifier: "key" + i
        })
      );
    }

    var logics: Array<Logic> = [];
    for (var i = 0; i < 10; i++) {
      logics.push(
        new Logic({
          key: keys[i],
          pos: new Pos({
            x: i
          }),
          connections: (i != 0) ? new Connections(
            new Id( keys[i - 1] )
          )
          : new Connections( [] )
        })
      );
    }

    logics.push(
      new Logic({
        key: keys[10],
        pos: new Pos({
          x: 10
        }),
        connections: new Connections(
          [
            new Id( keys[4] ),
            new Id( keys[9] ),
            new Id( keys[0] )
          ]
        )
      })
    )

    console.log(
      key.getDelay(
        new Id(keys[10]),
        new Id(keys[0])
      )
    );
    return new Container({
      children: logics
    });
    // return new Container({
    //   pos: new Pos({"x":4}),
    //   children: [
    //     new Logic({
    //       key: new CustomKey({
    //         key: key,
    //         identifier: "test",
    //       })
    //     }),
    //     new Builder(() => {
    //       let bit = new Bit({
    //         key: key
    //       });
    //       let input = new Logic({
    //         key: key,
    //         connections: new Connections([ bit.setId ])
    //       })
    //       return new Container({
    //         children: [
    //           bit,
    //           input
    //         ],
    //         pos: new Pos({z:4})
    //       });
    //     }),
    //     new Logic({
    //       key: key,
    //       pos: new Pos({x:-1}),
    //       connections: new Connections([
    //         new Id(
    //           new CustomKey({
    //             key: key,
    //             identifier: "test",
    //           }),
    //         ),
    //       ]),
    //     })
    //   ]
    // });
  }
}