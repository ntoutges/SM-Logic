import { Axis } from "../classes/prebuilts/support/classes";
import { BasicKey } from "../support/context/classes";
import { Container, Unit } from "./classes";
import { BodyInterface } from "./interfaces";

export abstract class GenericBody {
  readonly key: BasicKey;
  private readonly _title: string;
  private readonly _desc: string;
  private readonly _debug: boolean;
  constructor({
    key = new BasicKey({}),
    title = "SM Logic Creation",
    description = "V2 of programmatically generating Scrap Mechanic logic-based creations",
    debug = false
  }: BodyInterface
  ) {
    this.key = key;
    this._title = title;
    this._desc = description;
    this._debug = debug;
  }
  get description(): string {
    return `{
      \"description\": \"${this._desc}\",
      \"name\": \"${this._title}\",
      \"type\": \"Blueprint\",
      \"version\": 0
    }`
  }

  async preBuild(): Promise<Unit> {
    const built = await this.build();
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