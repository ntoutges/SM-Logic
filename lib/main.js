"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const basics_1 = require("./classes/blocks/basics");
const classes_1 = require("./classes/prebuilts/memory/classes");
const classes_2 = require("./containers/classes");
const classes_3 = require("./support/logic/classes");
const classes_4 = require("./support/spatial/classes");
class Body extends classes_2.GenericBody {
    constructor() {
        super({});
    }
    build() {
        const key = this.key;
        const byte = new classes_1.Byte({ key: key });
        return new classes_2.Container({
            children: [
                byte,
                new basics_1.Logic({
                    key: key,
                    pos: new classes_4.Pos({ x: 3 }),
                    connections: new classes_3.Connections(byte.reset)
                }),
                new basics_1.Logic({
                    key: key,
                    pos: new classes_4.Pos({ x: 4 }),
                    connections: new classes_3.Connections(byte.set(new classes_3.RawBitMask(0b11000011)))
                })
            ]
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
exports.Body = Body;
//# sourceMappingURL=main.js.map