import { Logic } from "./classes/blocks/basics";
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
        new Logic({
          key: key,
          pos: new Pos({x: 1}),
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