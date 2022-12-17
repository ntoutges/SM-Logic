import { Container } from "../../../containers/classes";
import { SSPReceiverInterface } from "./interface";

export class SSPReceiver extends Container {
  constructor({
    pos,
    rotate,
    color,
    signal
  }: SSPReceiverInterface) {
    
    super({})
  }
}