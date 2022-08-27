"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const basics_1 = require("./classes/blocks/basics");
const classes_1 = require("./containers/classes");
const classes_2 = require("./support/spatial/classes");
class Body extends classes_1.GenericBody {
    constructor() {
        super({});
    }
    build() {
        const key = this.key;
        var gridChilds = [];
        for (var i = 0; i < 1000; i++) {
            gridChilds.push(new basics_1.Logic({
                key: key
            }));
        }
        return new classes_1.Grid({
            size: new classes_2.Bounds({
                x: 10,
                y: 10,
                z: 10
            }),
            spacing: new classes_2.Bounds({
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
exports.Body = Body;
//# sourceMappingURL=main.js.map