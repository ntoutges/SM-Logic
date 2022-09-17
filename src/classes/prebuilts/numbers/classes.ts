import { Bits } from "../memory/classes";
import { Color } from "../../../support/colors/classes";
import { Id, KeylessFutureId } from "../../../support/context/classes";
import { RawBitMask } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { IntegerInterface } from "./interfaces";

export class Integer extends Bits {
  setNumber(value: number): Id {
    if (value < 0 || value >= Math.pow(2,this.bits.length) )
    throw new Error(`The value [${value}] cannot be stored in a ${this.bits.length} bit Integer`);    

    return super.set( new RawBitMask(value) );
  }
  get signal(): Id {
    const ids = new KeylessFutureId();
    this.bits.forEach((bit) => {
      ids.addId(bit.readId);
    });
    return ids;
  }
}

