"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const classes_1 = require("./builders/classes");
const basics_1 = require("./classes/blocks/basics");
const classes_2 = require("./classes/prebuilts/classes");
const classes_3 = require("./containers/classes");
const classes_4 = require("./support/context/classes");
const classes_5 = require("./support/logic/classes");
const classes_6 = require("./support/spatial/classes");
class Body extends classes_3.GenericBody {
    constructor() {
        super({});
    }
    build() {
        const key = this.key;
        return new classes_3.Container({
            pos: new classes_6.Pos({
                "x": 4
            }),
            children: [
                new basics_1.Logic({
                    key: new classes_4.CustomKey({
                        key: key,
                        identifier: "test",
                    })
                }),
                new classes_1.Builder(() => {
                    let bit = new classes_2.Bit({
                        key: key
                    });
                    let input = new basics_1.Logic({
                        key: key,
                        connections: new classes_5.Connections([bit.setId])
                    });
                    return new classes_3.Container({
                        children: [
                            bit,
                            input
                        ],
                        pos: new classes_6.Pos({ z: 4 })
                    });
                }),
                new basics_1.Logic({
                    key: key,
                    pos: new classes_6.Pos({ x: -1 }),
                    connections: new classes_5.Connections([
                        new classes_4.Id(new classes_4.CustomKey({
                            key: key,
                            identifier: "test",
                        })),
                    ]),
                })
            ]
        });
    }
}
exports.Body = Body;
//# sourceMappingURL=main.js.map