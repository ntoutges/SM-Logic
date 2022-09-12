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
    startId = 2000,
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

export class CustomKey extends Key {
  readonly key: BasicKey;
  readonly identifier: string;
  constructor({
    key,
    identifier
  }: CustomKeyInterface
  ) {
    super(["key", "identifier"]);
    this.key = key;
    this.identifier = identifier;
  }
  get newId(): number { return this.key.customId( this.identifier ); }
  addConnection(from:Id, to:Id) { this.key.addConnection(from,to); }
  getDelay(from:Id, to:Id) { return this.key.getDelay(from,to); }
}

export class UniqueCustomKey extends CustomKey {
  _customId: number;
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
      this._customId = this.key.customId( `@${this.identifier}-#${this.key.lastId}?` );
    return this._customId;
  }
  get customId(): string { return `@${this.identifier}-#${this.key.lastId}?`; }
}

export class Keyless extends Key {
  constructor() {
    super([]);
  }
  get newId(): number { return -1; }
  addConnection(from:Id, to:Id) { throw new Error("Cannot add connection to type [Keyless]"); }
  getDelay(from:Id, to:Id): Delays { throw new Error("Cannot get delay from type [Keyless]"); }
}

export class Id extends Equatable {
  private _ids: Array<number>;
  constructor(key: Key) {
    super(["_id"]);
    this._ids = [key.newId];
  }
  get ids(): Array<number> { return this._ids; }
  addKey(key: Key): void { this._ids.push(key.newId) }
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
  addId(id: number): void { super.ids.push(id); }
  addKey(key: Key): void { throw new Error("Cannot add key to a keyless id, try using [addId]"); }
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
    if (id instanceof Id)
      for (let numId of id.ids) { this.addId(numId); }
    else
      super.addId(id);
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