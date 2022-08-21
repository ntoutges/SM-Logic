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
  private _id: number;
  constructor(key: Key) {
    super(["id"]);
    this._id = key.newId;
  }
  get id() { return this._id; }
}