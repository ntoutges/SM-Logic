import { UnitInterface } from "../../../containers/interfaces"
import { Logic } from "../../blocks/basics";

export interface SSPReceiverInterface extends UnitInterface {
  signal: Array<Logic>
}