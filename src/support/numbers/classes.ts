import { Logic } from "../../classes/blocks/basics";
import { Id } from "../context/classes";
import { IntegerValueInterface } from "./enums";

export class IntegerValue {
  readonly signal: Array<Logic>;
  constructor({
    signal
  }: IntegerValueInterface) {
    this.signal = signal;
  }

  getSignalAt(placeValue: number): Id { return this.signal[placeValue].id; }
  get length() { return this.signal.length; }
}