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
        // var keys: Array<UniqueCustomKey> = [];
        // for (var i = 0; i < 11; i++) {
        //   keys.push(
        //     new UniqueCustomKey({
        //       key: key,
        //       identifier: "key" + i
        //     })
        //   );
        // }
        // var logics: Array<Logic> = [];
        // for (var i = 0; i < 10; i++) {
        //   logics.push(
        //     new Logic({
        //       key: keys[i],
        //       pos: new Pos({
        //         x: i
        //       }),
        //       connections: (i != 0) ? new Connections(
        //         new Id( keys[i - 1] )
        //       )
        //       : new Connections( [] )
        //     })
        //   );
        // }
        // logics.push(
        //   new Logic({
        //     key: keys[10],
        //     pos: new Pos({
        //       x: 10
        //     }),
        //     connections: new Connections(
        //       [
        //         new Id( keys[4] ),
        //         new Id( keys[9] ),
        //         new Id( keys[0] )
        //       ]
        //     )
        //   })
        // )
        // console.log(
        //   key.getDelay(
        //     new Id(keys[10]),
        //     new Id(keys[0])
        //   )
        // );
        // return new Container({
        //   children: logics
        // });
        return new classes_1.Bits({
            key: key,
            depth: 100
        });
    }
}
exports.Body = Body;
//# sourceMappingURL=main.js.map