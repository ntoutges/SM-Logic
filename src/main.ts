import { Builder } from "./builders/classes";
import { Logic } from "./classes/blocks/basics";
import { Bit, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { CustomKey, BasicKey, Id } from "./support/context/classes";
import { Connections, RawBitMask } from "./support/logic/classes";
import { Bounds, Pos, Rotate } from "./support/spatial/classes";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;
    
    var gridChilds = [];
    for (var i = 0; i < 1000; i++) {
      gridChilds.push(
        new Logic({
          key: key
        }) 
      );
    }
    return new Grid({
      size: new Bounds({
        x: 10,
        y: 10,
        z: 10
      }),
      spacing: new Bounds({
        x: 1,
        y: 1,
        z: 1
      }),
      children: gridChilds
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