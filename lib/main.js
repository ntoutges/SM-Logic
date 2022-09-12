"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const basics_1 = require("./classes/blocks/basics");
const classes_1 = require("./containers/classes");
const classes_2 = require("./support/context/classes");
const classes_3 = require("./support/logic/classes");
const classes_4 = require("./support/spatial/classes");
class Body extends classes_1.GenericBody {
    constructor() {
        super({});
    }
    build() {
        const key = this.key;
        var keys = [];
        for (var i = 0; i < 11; i++) {
            keys.push(new classes_2.UniqueCustomKey({
                key: key,
                identifier: "key" + i
            }));
        }
        var logics = [];
        for (var i = 0; i < 10; i++) {
            logics.push(new basics_1.Logic({
                key: keys[i],
                pos: new classes_4.Pos({
                    x: i
                }),
                connections: (i != 0) ? new classes_3.Connections(new classes_2.Id(keys[i - 1]))
                    : new classes_3.Connections([])
            }));
        }
        logics.push(new basics_1.Logic({
            key: keys[10],
            pos: new classes_4.Pos({
                x: 10
            }),
            connections: new classes_3.Connections([
                new classes_2.Id(keys[4]),
                new classes_2.Id(keys[9]),
                new classes_2.Id(keys[0])
            ])
        }));
        console.log(key.getDelay(new classes_2.Id(keys[10]), new classes_2.Id(keys[0])));
        return new classes_1.Container({
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
exports.Body = Body;
//# sourceMappingURL=main.js.map