import { Deconstructor } from "../../../containers/deconstructor";
import { SSPReceiverInterface, SSPSenderInterface } from "./interface";
import { receiver, sender } from "./deconstructable";
import { Container } from "../../../containers/classes";
import { BasicLogic, Logic } from "../../blocks/basics";
import { KeylessFutureId, KeylessId } from "../../../support/context/classes";
import { Color } from "../../../support/colors/classes";
import { Colors } from "../../../support/colors/enums";
import { Pos } from "../../../support/spatial/classes";
import { LogicType, TimerControllerType } from "../../../containers/jsonformat";

export class SSPReceiver extends Container {
  readonly input: KeylessFutureId;
  constructor({
    color,pos,rotate,
    key,
    signal = [],
    extensions = 0
  }: SSPReceiverInterface) {
    if (signal.length > 1) {
      throw new Error("Signal must be of either length 1 or 0");
    }

    const body = new Deconstructor({
      key,
      toDeconstruct: receiver.body,
      pos: new Pos({ x: -7, y: 1, z: -4 })
    });

    let prevBody: Deconstructor = body;
    const exts: Deconstructor[] = [];
    const map = [2,4,7,1,6,0,5,3];
    // [6,0,4,5,3,7,2,1]
    // [V,V,V,V,V, ,V, ]
    const map2 = [7,4,1,6,0,2,5,3];
    //           [V, ,V,V,V,V,V, ]
    for (let i = 0; i < extensions; i++) {
      const ext = new Deconstructor({
        key,
        toDeconstruct: receiver.extension,
        pos: new Pos({
          x: 27,
          y: -34 + 5*(i+1),
          z: -2
        })
      });

      // connect previous body to ext
      const multibitInput = ext.getColoredInputs( new Color(Colors.SM_LightBlue2) );
      const dataInput = ext.getColoredInputs( new Color(Colors.SM_LightGrey) );
      const transferInput = new KeylessId( ext.getColoredInputs( new Color(Colors.SM_LightBlue4) ).ids[0] );

      body.coloredInputsConnectTo(
        new Color(Colors.SM_Yellow),
        multibitInput
      );

      prevBody.coloredInputConnectTo(
        new Color( (i == 0) ? Colors.SM_Brown2 : Colors.SM_LightBlue4),
        (i == 0) ? 0 : 1,
        transferInput
      );
      if (i > 0) { // "daisychaining" extenders
        ext.coloredInputsConnectTo(
          new Color(Colors.SM_YellowGreen2),
          new KeylessId(
            prevBody.getColoredInputs(
              new Color(Colors.SM_LightBlue3)
            ).ids[1]
          )
        );     
        for (let j = 0; j < 8; j++) {
          prevBody.coloredInputConnectTo(
            new Color(Colors.SM_DarkGrey),
            j,
            new KeylessId(dataInput.ids[map2[j]])
          );
        }
      }
      else {
        for (let j = 0; j < 8; j++) {
          prevBody.coloredInputConnectTo(
            new Color(Colors.SM_DarkGrey),
            j,
            new KeylessId(dataInput.ids[map[j]])
          );
        }
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
    if (index >= this.children.length*8) { throw new Error("Not enough Databits to handle index"); }

    // const map = [3,2,1,6,4,5,0,7];
    const map = [6,2,5,0,4,7,3,1];
    const map2 = [6,0,4,5,3,7,2,1];
    (this.children[Math.floor(index / 8)] as Deconstructor).coloredInputConnectTo(
      new Color(
        Colors.SM_DarkGrey
      ),
      (index >= 8) ? map2[index % 8] : map[index],
      other
    );
  }
}

export class SSPSender extends Container {
  readonly input: KeylessFutureId;
  readonly output: KeylessFutureId;
  readonly send: KeylessFutureId;
  constructor({
    color,pos,rotate,
    key,
    signal = [],
    extensions = 0,
    legacy = false
  }: SSPSenderInterface) {
    const body = new Deconstructor({
      key,
      toDeconstruct: sender.body,
      pos: new Pos({
        x: 5,
        y: 14,
        z: -3
      })
    });

    const inputs = body.getColoredInputs(new Color(Colors.SM_DarkGrey));

    if (extensions == 0) { // cut off multipulse bit
      body.coloredInputsConnectTo(
        new Color(Colors.SM_Yellow),
        body.getColoredInputs(
          new Color(Colors.SM_LightGrey)
        )
      );
    }

    let prevBody = body;
    const bodyOutput = body.getColoredInputs(
      new Color(Colors.SM_Red)
    );
    const exts: Deconstructor[] = [];

    const extIdMap = [3,2,1,4,5,0,6,7]
    for (let i = 0; i < extensions; i++) {
      const ext = new Deconstructor({
        key,
        pos: new Pos({
          x: 1,
          y: -2 + 2*(1+i),
          z: 0
        }),
        toDeconstruct: sender.extension
      });
      
      if (!legacy) { // decrease timer delay to 50ms
        const timerController = ((ext.getColoredLogicObject(
          new Color(Colors.SM_Green1)
        ) as LogicType).controller as TimerControllerType);
        timerController.seconds = 0;
        timerController.ticks = 2;
      }

      ext.coloredInputsConnectTo(
        new Color(Colors.SM_DarkGrey),
        bodyOutput
      );
      ext.coloredInputsConnectTo(
        new Color(Colors.SM_Yellow),
        bodyOutput
      );
      ext.coloredInputsConnectTo(
        new Color(Colors.SM_White),
        bodyOutput
      );

      const extIds = ext.getColoredInputs(
        new Color(Colors.SM_DarkGrey)
      );
      for (let i in extIds.ids) {
        inputs.addId(
          extIds.ids[
            extIdMap[i]
          ]
        );
      }

      if (i == extensions-1) { // cut off multipulse bit
        ext.coloredInputsConnectTo(
          new Color(Colors.SM_LightGrey),
          ext.getColoredInputs(
            new Color(Colors.SM_Yellow2)
          )
        );
      }

      prevBody.coloredInputsConnectTo(
        new Color(Colors.SM_Red1),
        ext.getColoredInputs(
          new Color(Colors.SM_Green1)
        )
      );

      exts.push(ext);
      prevBody = ext;
    }

    super({
      color,pos,rotate,
      children: [ body ].concat(exts)
    });

    this.input = inputs;
    this.output = body.getColoredInputs(new Color(Colors.SM_Red));
    this.send = body.getColoredInputs(new Color(Colors.SM_Green));

    if (signal.length > 0) this.connectInputSignal(signal);
  }

  connectInputSignal(signal: BasicLogic[]) {
    if (signal.length > this.children.length*8) {
      throw new Error(`Signal length of ${signal.length} too great for only ${this.children.length-1} extensions`);
    }
    for (let i = 0; i < signal.length; i++) {
      signal[i].connectTo(
        new KeylessId(
          this.input.ids[i]
        )
      );
    }
  }
}