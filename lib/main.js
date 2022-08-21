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
        return new classes_1.Container({
            pos: new classes_4.Pos({
                "x": 4
            }),
            children: [
                new basics_1.Logic({
                    key: new classes_2.CustomKey({
                        key: key,
                        identifier: "test",
                    })
                }),
                new basics_1.Logic({
                    key: key,
                    pos: new classes_4.Pos({ x: 1 }),
                }),
                new basics_1.Logic({
                    key: key,
                    pos: new classes_4.Pos({ x: -1 }),
                    connections: new classes_3.Connections([
                        new classes_2.Id(new classes_2.CustomKey({
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