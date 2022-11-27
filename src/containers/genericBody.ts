import { Axis } from "../classes/prebuilts/support/classes";
import { BasicKey } from "../support/context/classes";
import { Container, Unit } from "./classes";
import { BodyInterface } from "./interfaces";

export abstract class GenericBody {
  private readonly _key: BasicKey;
  private readonly _title: string;
  private readonly _desc: string;
  private readonly _debug: boolean;
  constructor({
    key = new BasicKey({}),
    name = "SM Logic Creation",
    description = "V2 of generating scrap mechanic logic-based creations",
    debug = false
  }: BodyInterface
  ) {
    this._key = key;
    this._title = name;
    this._desc = description;
    this._debug = debug;
  }
  get key(): BasicKey { return this._key; }
  get description(): string {
    return `{
      \"description\": \"${this._desc}\",
      \"name\": \"${this._title}\",
      \"type\": \"Blueprint\",
      \"version\": 0
    }`
  }

  preBuild(): Unit {
    if (this._debug)
      return new Container({
        children: [
          this.build(),
          new Axis({})
        ]
      });
    return this.build();
  }

  abstract build(): Unit;
}