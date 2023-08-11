import { Deconstructor } from "../../../containers/deconstructor";
import { SSPReceiverInterface } from "./interface";
import { receiver, extender } from "./deconstructable";
import { Container } from "../../../containers/classes";
import { BasicLogic, Logic } from "../../blocks/basics";
import { KeylessFutureId, KeylessId } from "../../../support/context/classes";
import { Color } from "../../../support/colors/classes";
import { Colors } from "../../../support/colors/enums";
import { Pos } from "../../../support/spatial/classes";

export class SSPReceiver extends Container {
  readonly input: KeylessFutureId;
  constructor({
    color,pos,rotate,
    key,
    signal = [],
    extensions
  }: SSPReceiverInterface) {
    if (signal.length > 1) {
      throw new Error("Signal must be of either length 1 or 0");
    }

    const body = new Deconstructor({
      key,
      toDeconstruct: receiver,
      offset: new Pos({ x: -7, y: 1, z: -4 })
    });

    let prevBody: Deconstructor = body;
    const exts: Deconstructor[] = [];
    const map = [2,4,7,1,6,0,5,3];
    for (let i = 0; i < extensions; i++) {
      const ext = new Deconstructor({
        key,
        toDeconstruct: extender,
        offset: new Pos({
          x: 27,
          y: -34 + 5*(i+1),
          z: -2
        })
      });

      // connect previous body to ext
      const multibitInput = ext.getColoredInputs( new Color(Colors.SM_LightBlue2) );
      const dataInput = ext.getColoredInputs( new Color(Colors.SM_LightGrey) );
      const transferInput = new KeylessId( ext.getColoredInputs( new Color(Colors.SM_LightBlue4) ).ids[0] );

      prevBody.coloredInputsConnectTo(
        new Color(Colors.SM_Yellow),
        multibitInput
      );
      prevBody.coloredInputsConnectTo(
        new Color(Colors.SM_Brown2),
        transferInput
      );
      for (let j = 0; j < 8; j++) {
        prevBody.coloredInputConnectTo(
          new Color(Colors.SM_DarkGrey),
          j,
          new KeylessId(dataInput.ids[map[j]])
        );
      }

      exts.push(ext);
      prevBody = ext;
    }

    super({
      pos,rotate,color,
      children: [body].concat(exts)
    });

    this.input = body.getColoredInputs(
      new Color(
        Colors.SM_Green
      )
    );

    if (signal.length > 0) signal[0].connectTo(this.input);
  }

  connectMultipulseTo(other: BasicLogic) {
    (this.children[0] as Deconstructor).coloredInputsConnectTo(
      new Color(
        Colors.SM_Yellow
      ),
      other
    );
  }

  connectSignalTo(other: BasicLogic[]) {
    for (let i in other) {
      this.connectDatabitTo(+i, other[i]);
    }
  }
  
  connectDatabitTo(index: number, other: BasicLogic) {
    if (index >= 8) { throw new Error("Not enough Databits to handle index"); }

    (this.children[0] as Deconstructor).coloredInputConnectTo(
      new Color(
        Colors.SM_DarkGrey
      ),
      index,
      other
    );
  }
}
