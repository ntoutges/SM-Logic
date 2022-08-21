import { Builder } from "./builders/classes";
import { Logic } from "./classes/blocks/basics";
import { Bit } from "./classes/prebuilts/classes";
import { Container, GenericBody, Unit } from "./containers/classes";
import { CustomKey, BasicKey, Id } from "./support/context/classes";
import { Connections } from "./support/logic/classes";
import { Pos, Rotate } from "./support/spatial/classes";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;
    return new Container({
      pos: new Pos({
        "x": 4
      }),
      children: [
        new Logic({
          key: new CustomKey({
            key: key,
            identifier: "test",
          })
        }),
        new Builder(() => {
          let bit = new Bit({
            key: key
          });
          let input = new Logic({
            key: key,
            connections: new Connections([ bit.setId ])
          })
          return new Container({
            children: [
              bit,
              input
            ],
            pos: new Pos({z:4})
          });
        }),
        new Logic({
          key: key,
          pos: new Pos({x: -1}),
          connections: new Connections([
            new Id(
              new CustomKey({
                key: key,
                identifier: "test",
              }),
            ),
          ]),
        })
      ]
    })
  }
}