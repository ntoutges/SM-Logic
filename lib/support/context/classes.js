"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Id = exports.Keyless = exports.CustomKey = exports.BasicKey = exports.Key = void 0;
const classes_1 = require("../support/classes");
class Key extends classes_1.Equatable {
}
exports.Key = Key;
class BasicKey extends Key {
    constructor({ startId = 2000, }) {
        super(["ids", "customIds"]);
        this.ids = startId;
        this.customIds = new Map();
    }
    get newId() {
        return this.ids++;
    }
    customId(identifier) {
        if (this.customIds.has(identifier)) // get
            return this.customIds.get(identifier);
        // set
        let newId = this.newId;
        this.customIds.set(identifier, newId);
        return newId;
    }
}
exports.BasicKey = BasicKey;
class CustomKey extends Key {
    constructor({ key, identifier, }) {
        super(["key", "identifier"]);
        this.key = key;
        this.identifier = identifier;
    }
    get newId() {
        return this.key.customId(this.identifier);
    }
}
exports.CustomKey = CustomKey;
class Keyless extends Key {
    constructor() {
        super([]);
    }
    get newId() { return -1; }
}
exports.Keyless = Keyless;
class Id extends classes_1.Equatable {
    constructor(key) {
        super(["id"]);
        this._id = key.newId;
    }
    get id() { return this._id; }
}
exports.Id = Id;
//# sourceMappingURL=classes.js.map