import { Equatable } from "../support/classes";
import { CustomKeyInterface, KeyInterface } from "./interfaces";

export abstract class Key extends Equatable {
  abstract get newId(): number;
}

export class BasicKey extends Key {
  private ids: number;
  private customIds: Map<string,number>;
  constructor({
    startId = 2000,
  }: KeyInterface
  ) {
    super(["ids", "customIds"]);
    this.ids = startId;
    this.customIds = new Map<string,number>();
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
    super([])
  }
  get newId(): number { return -1; }
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