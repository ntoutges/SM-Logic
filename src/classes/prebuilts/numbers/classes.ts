import { Bits } from "../memory/classes";
import { Color } from "../../../support/colors/classes";
import { Id } from "../../../support/context/classes";
import { RawBitMask } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { IntegerInterface } from "./interfaces";

export class Integer extends Bits {
  // constructor({
  //   key,
  //   depth = 8,
  //   pos = new Pos({}),
  //   rotate = new Rotate({}),
  //   color = new Color()
  // }: IntegerInterface
  // ) {
  //   super({key,depth,pos,rotate,color});
  // }
  setNumber(value: number): Id {
    const bits = this.bits;
    if (value < 0 || value >= Math.pow(2,this.bits.length) )
    throw new Error(`The value [${value}] cannot be stored in a ${this.bits.length} bit Integer`);    

    return super.set( new RawBitMask(value) );
  }
}

