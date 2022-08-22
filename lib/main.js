"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const classes_1 = require("./classes/prebuilts/memory/classes");
const classes_2 = require("./containers/classes");
class Body extends classes_2.GenericBody {
    constructor() {
        super({});
    }
    build() {
        const key = this.key;
        return new classes_1.Byte({
            key: key,
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