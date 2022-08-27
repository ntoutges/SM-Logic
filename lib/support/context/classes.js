"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeylessFutureId = exports.KeylessId = exports.Id = exports.Keyless = exports.UniqueCustomKey = exports.CustomKey = exports.BasicKey = exports.Key = void 0;
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
    get newId() { return this.ids++; }
    get lastId() { return this.ids - 1; }
    get nextId() { return this.ids; }
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
    constructor({ key, identifier }) {
        super(["key", "identifier"]);
        this.key = key;
        this.identifier = identifier;
    }
    get newId() { return this.key.customId(this.identifier); }
}
exports.CustomKey = CustomKey;
class UniqueCustomKey extends CustomKey {
    constructor({ key, identifier }) {
        super({ key, identifier });
        this._customId = -1;
    }
    get newId() {
        if (this._customId == -1) // unset
            this._customId = this.key.customId(`@${this.identifier}-#${this.key.lastId}?`);
        return this._customId;
    }
    get customId() { return `@${this.identifier}-#${this.key.lastId}?`; }
}
exports.UniqueCustomKey = UniqueCustomKey;
class Keyless extends Key {
    constructor() {
        super([]);
    }
    get newId() { return -1; }
}
exports.Keyless = Keyless;
class Id extends classes_1.Equatable {
    constructor(key) {
        super(["_id"]);
        this._ids = [key.newId];
    }
    get ids() { return this._ids; }
    addKey(key) { this._ids.push(key.newId); }
    build() {
        let ids = [];
        this._ids.forEach((id) => {
            ids.push({ "id": id });
        });
        return ids;
    }
    _resetKeys() { this._ids.splice(0); }
}
exports.Id = Id;
class KeylessId extends Id {
    constructor(id) {
        super(new BasicKey({ startId: id }));
    }
    addId(id) { super.ids.push(id); }
    addKey(key) { throw new Error("Cannot add key to a keyless id, try using [addId]"); }
}
exports.KeylessId = KeylessId;
/// A KeylessId to be used when the id number has not yet been decided
class KeylessFutureId extends KeylessId {
    constructor() {
        super(-1);
        this.setId = false;
    }
    addId(id) {
        if (!this.setId) {
            super._resetKeys();
            this.setId = true;
        }
        if (id instanceof Id)
            for (let numId of id.ids) {
                this.addId(numId);
            }
        else
            super.addId(id);
    }
    get ids() {
        if (!this.setId)
            throw new Error("Id not yet set");
        return super.ids;
    }
    build() {
        if (!this.setId)
            throw new Error("Id not yet set");
        return super.build();
    }
}
exports.KeylessFutureId = KeylessFutureId;
//# sourceMappingURL=classes.js.map