import { Connections, Delay, Delays, NoDelay } from "../logic/classes";
import { Equatable } from "../support/classes";
import { CustomKeyInterface, KeyInterface } from "./interfaces";

export abstract class Key extends Equatable {
  abstract get newId(): number;
  abstract addConnection(from:Id, to:Id): void;
  abstract getDelay(from:Id, to:Id): Delays;
}

export class BasicKey extends Key {
  private ids: number;
  private customIds: Map<string,number>;
  private allConns: Map<number,Connections>
  constructor({
    startId = 2000
  }: KeyInterface
  ) {
    super(["ids", "customIds"]);
    this.ids = startId;
    this.customIds = new Map<string,number>();
    this.allConns = new Map<number,Connections>();
  }
  get newId(): number { return this.ids++; }
  get lastId(): number { return this.ids - 1; }
  get nextId(): number { return this.ids; }
  customId(identifier: string): number {
    if (this.customIds.has(identifier)) // get
      return this.customIds.get(identifier);
    // set
    let newId = this.newId;
    this.customIds.set(identifier, newId);
    return newId;
  }
  addConnection(from:Id, to:Id) {
    if (from.ids.length != 1)
      throw new Error("Connection must have exactly 1 [from] numerical id");
    if (this.allConns.has(from.ids[0])) {
      this.allConns.get(from.ids[0]).addConnection(to);
    }
    else {
      this.allConns.set(
        from.ids[0],
        new Connections( to )
      )
    }
  }
  getDelay(from:Id, to:Id, preChecked:Map<number,boolean>=new Map<number,boolean>() ): Delays {
    if (from.ids[0] == to.ids[0]) {
      return new Delays([
        new Delay({
          delay: 0
        })
      ]);
    }
    if (preChecked.has(from.ids[0]) || !this.allConns.has(from.ids[0])) // already checked // no connections
      return new Delays([]);

    let paths: Array<Delay> = [];
    preChecked.set(from.ids[0], true); // add to prevent infinite recursion
    for (let id of this.allConns.get(from.ids[0]).connections) {
      let path: Delays = this.getDelay(id,to, preChecked);
      for (let delay of path.validDelays) {
        paths.push(
          delay.add(
            new Delay({ delay: 1 })
          )
        );
      }
    }
    preChecked.delete(from.ids[0]); // remove to allow multiple instances of the same path be checked
    
    return new Delays(paths);
  }
}

export class CustomKey extends BasicKey {
  readonly key: BasicKey;
  readonly identifier: string;
  constructor({
    key,
    identifier
  }: CustomKeyInterface
  ) {
    super({});
    this.key = key;
    this.identifier = identifier;
  }

  // pass throughs
  get newId(): number { return this.key.customId( this.customIdIdentifier ); }
  get lastId(): number { return this.key.lastId; }
  get nextId(): number { return this.key.nextId; }
  customId(identifier: string): number { return this.key.customId(identifier); }
  addConnection(from:Id, to:Id) { this.key.addConnection(from,to); }
  getDelay(from:Id, to:Id) { return this.key.getDelay(from,to); }

  get customIdIdentifier(): string { return this.identifier; }
}

export class UniqueCustomKey extends CustomKey {
  private _customId: number;
  constructor({
    key,
    identifier
  }: CustomKeyInterface
  ) {
    super({key,identifier})
    this._customId = -1
  }
  get newId(): number {
    if (this._customId == -1) // unset
      this._customId = this.key.customId( this.customIdIdentifier );
    return this._customId;
  }
  get customIdIdentifier(): string { return `@${this.identifier}-#${this.key.lastId}?`; }
}

export class Keys extends Equatable {
  readonly keys: Array<BasicKey>;
  constructor(keys: Array<BasicKey>) {
    super(["keys"]);
    this.keys = keys;
  }
  addKey(key: BasicKey) { this.keys.push(key); }
}

export class KeyGen extends Equatable {
  private readonly _key: BasicKey;
  private readonly keys: Map<number,number>;
  constructor(key: BasicKey) {
    super(["_key","keys"]);
    this._key = key;
    this.keys = new Map<number,number>;
  }
  key(id: number): CustomKey {
    if (this.keys.has(id)) {
      return new CustomKey({
        key: this._key,
        identifier: "kG#?+" + id.toString()
      });
    }
    let newId = this._key.newId;
    this.keys.set(id, newId);
    return this.key(id);
  }
  id(id: number): Id {
    return new Id(this.key(id));
  }
  range(start: number, end: number): Array<CustomKey> {
    const keys = [];
    for (let i = start; i < end; i++) {
      keys.push(this.key(i));
    }
    return keys;
  }
}

export class StringKeyGen extends Equatable {
  private readonly _key: BasicKey;
  private readonly keys: Map<string,number>;
  constructor(key: BasicKey) {
    super(["_key", "keys"]);
    this._key = key;
    this.keys = new Map<string,number>;
  }
  key(id: string): CustomKey {
    if (this.keys.has(id)) {
      return new CustomKey({
        key: this._key,
        identifier: "kG#?+" + id
      });
    }
    let newId = this._key.newId;
    this.keys.set(id, newId);
    return this.key(id);
  }
  id(id: string): Id {
    return new Id(this.key(id));
  }
  range(identifier: Identifier | Array<string>): KeyMap {
    if (Array.isArray(identifier))
      return this.range(new Identifier(identifier));
    
    const keys = new Map<string,CustomKey>();
    for (let id of identifier.ids) {
      keys.set(id, this.key(id));
    }
    return new KeyMap(keys);
  }
}

export class KeyMap extends Equatable {
  readonly ids: Map<string,CustomKey>;
  constructor(
    ids: Map<string,CustomKey> = new Map<string,CustomKey>()
  ) {
    super(["ids"]);
    this.ids = ids;
  }
  narrow(ids: Identifier | string): KeyMap {
    if ((typeof ids) == "string")
      return this.narrow( new Identifier(ids as string) )
    
    const map = new Map<string,CustomKey>;
    this.ids.forEach((key, id) => {
      for (let idStr of (ids as Identifier).ids) { // inefficient - O(n^2)
        if (id.replace(/,.*/, "") == idStr) {
          map.set(
            id.replace(/.*?,/, ""),
            key
          );
        }
      }
    });
    return new KeyMap(map);
  }
  get(ids: Identifier): Array<CustomKey> {
    const keys: Array<CustomKey> = [];
    for (let id of ids.ids) {
      if (this.ids.has(id)) {
        keys.push(this.ids.get(id));
      }
    }
    return keys;
  }
  get1(ids: Identifier): CustomKey {
    for (let id of ids.ids) {
      if (this.ids.has(id)) {
        return this.ids.get(id)
      }
    }
  }
}

export class Keyless extends Key {
  constructor() {
    super([]);
  }
  get newId(): number { return -1; }
  addConnection(from:Id, to:Id) { throw new Error("Cannot add connection to type [Keyless]"); }
  getDelay(from:Id, to:Id): Delays { throw new Error("Cannot get delay from type [Keyless]"); }
}

export class Identifier extends Equatable {
  private _ids: Array<string>;
  constructor(identifier: string | Array<string>) {
    super(["_id"]);
    if (Array.isArray(identifier))
      this._ids = identifier;
    else
      this._ids = [identifier];
  }
  get ids(): Array<string> { return this._ids; }
  addId(identifier: string) {
    for (let i in this._ids) {
      if (this._ids[i] == identifier) // check for duplicates
        return;
    }
    this._ids.push(identifier);
  }
}

export class Id extends Equatable {
  private _ids: Array<number>;
  constructor(key: Key) {
    super(["_id"]);
    this._ids = [key.newId];
  }
  get ids(): Array<number> { return this._ids; }
  addKey(key: Key): void {
    // check if [id] already exists in this Id
    let id = key.newId;
    for (let i in this._ids) {
      if (this._ids[i] == id) {
        return;
      }
    }
    this._ids.push(id)
  }
  addId(id: number | Id): void {
    if (id instanceof Id) {
      for (let numId of id.ids) { this.addId(numId); }
      return; 
    }
    // check if [id] already exists in this Id
    for (let checkId of this.ids) {
      if (checkId == id) {
        return;
      }
    }
    this.ids.push(id);
  }
  add(ids: Array<Id>): Id {
    let newId = new KeylessFutureId();
    newId.addId(this);
    for (let id of ids) {
      newId.addId(id);
    }
    return newId;
  }
  build() {
    let ids = [];
    this._ids.forEach((id) => {
      ids.push({ "id": id });
    });
    return ids;
  }
  _resetKeys() { this._ids.splice(0); }
}

export class KeylessId extends Id {
  constructor(id: number) {
    super( new BasicKey({ startId:id  }) );
  }
  addKey(key: Key): void { throw new Error("Cannot add key to a keyless id, try using [addId]"); }
}

export class KeylessIds extends KeylessId {
  constructor(ids: Array<number>) {
    if (ids.length == 0)
      throw new Error("KeylessIds must have at least one id");
    super(ids[0]);
    for (let i = 1; i < ids.length; i++) {
      this.addId(ids[i]);
    }
  }
}

/// A KeylessId to be used when the id number has not yet been decided
export class KeylessFutureId extends KeylessId {
  private setId: boolean;
  constructor() {
    super(-1);
    this.setId = false;
  }
  addId(id: number | Id): void {
    if (!this.setId) {
      super._resetKeys();
      this.setId = true;
    }
    super.addId(id)
  }
  get ids(): Array<number> {
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