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

  async preBuild(): Promise<Unit> {
    const built = await this.build()
    if (this._debug)
      return new Container({
        children: [
          built,
          new Axis({})
        ]
      });
    return built;
  }

  abstract build(): Promise<Unit>;
}