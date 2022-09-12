"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeylessFutureId = exports.KeylessId = exports.Id = exports.Keyless = exports.UniqueCustomKey = exports.CustomKey = exports.BasicKey = exports.Key = void 0;
const classes_1 = require("../logic/classes");
const classes_2 = require("../support/classes");
class Key extends classes_2.Equatable {
}
exports.Key = Key;
class BasicKey extends Key {
    constructor({ startId = 2000, }) {
        super(["ids", "customIds"]);
        this.ids = startId;
        this.customIds = new Map();
        this.allConns = new Map();
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
    addConnection(from, to) {
        if (from.ids.length != 1)
            throw new Error("Connection must have exactly 1 [from] numerical id");
        if (this.allConns.has(from.ids[0])) {
            this.allConns.get(from.ids[0]).addConnection(to);
        }
        else {
            this.allConns.set(from.ids[0], new classes_1.Connections(to));
        }
    }
    getDelay(from, to, preChecked = new Map()) {
        if (from.ids[0] == to.ids[0]) {
            return new classes_1.Delays([
                new classes_1.Delay({
                    delay: 0
                })
            ]);
        }
        if (preChecked.has(from.ids[0]) || !this.allConns.has(from.ids[0])) // already checked // no connections
            return new classes_1.Delays([]);
        let paths = [];
        preChecked.set(from.ids[0], true); // add to prevent infinite recursion
        for (let id of this.allConns.get(from.ids[0]).connections) {
            let path = this.getDelay(id, to, preChecked);
            for (let delay of path.validDelays) {
                paths.push(delay.add(new classes_1.Delay({ delay: 1 })));
            }
        }
        preChecked.delete(from.ids[0]); // remove to allow multiple instances of the same path be checked
        return new classes_1.Delays(paths);
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
    addConnection(from, to) { this.key.addConnection(from, to); }
    getDelay(from, to) { return this.key.getDelay(from, to); }
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
    addConnection(from, to) { throw new Error("Cannot add connection to type [Keyless]"); }
    getDelay(from, to) { throw new Error("Cannot get delay from type [Keyless]"); }
}
exports.Keyless = Keyless;
class Id extends classes_2.Equatable {
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