import { UnitInterface } from "../../../containers/interfaces"
import { BasicKey } from "../../../support/context/classes";
import { Logic } from "../../blocks/basics";

export interface SSPReceiverInterface extends UnitInterface {
  key: BasicKey
  signal?: Logic[]
  extensions?: number
};

export interface SSPSenderInterface extends UnitInterface {
  key: BasicKey
  signal?: Logic[]
  extensions?: number
  legacy?: boolean
};