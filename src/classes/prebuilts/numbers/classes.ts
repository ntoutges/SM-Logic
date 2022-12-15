import { Bits } from "../memory/classes";
import { Color } from "../../../support/colors/classes";
import { Id, KeylessFutureId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { BitMask, Connections, Operation, RawBitMask } from "../../../support/logic/classes";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { ConstantCompareInterface, EqualsConstantInterface } from "./interfaces";
import { Container } from "../../../containers/classes";
import { Logic } from "../../blocks/basics";
import { LogicalOperation } from "../../../support/logic/enums";
import { CompareIdentifiers } from "../../../support/context/enums";
import { CompareOperation } from "./enums";

export class Integer extends Bits {
  setNumber(value: number): Id {
    if (value < 0 || value >= Math.pow(2,this.bits.length) )
    throw new Error(`The value [${value}] cannot be stored in a ${this.bits.length} bit Integer`);    

    return super.set( (new RawBitMask(value, this.bits.length)).reverse() );
  }
  get signal(): Array<Logic> {
    const logics: Array<Logic> = [];
    this.bits.forEach((bit) => {
      logics.push(bit.read);
    });
    return logics;
  }
  get maxInt(): number { return Math.pow(2,this.bits.length) - 1; }
}

export class ConstantCompare extends Container {
  constructor({
  key,
  signal,
  constant,
  operation,
  ifC,
  elseC = null,
  pos,
  color,
  rotate,
  slowMode = true,
  bitKeys
  }: ConstantCompareInterface) {
    if (elseC != null && elseC.connections.length != 0 && !slowMode)
      throw new Error("Cannot have elseC term when not in \'slowMode\'");

    let operationClass = null;
    switch (operation) {
      case CompareOperation.Equals:
        operationClass = EqualsConstant;
        break;
      default:
        throw new Error("Unrecognized CompareOperation");
    }
    const childContainer: Comparators = new operationClass({
      key,
      signal,
      constant,
      slowMode,
      bitKeys,
      color,
      rotate
    });
    for (let id of ifC.connections) { childContainer.output.conns.addConnection(id); }
    if (elseC)
      for (let id of elseC.connections) { childContainer.notOutput.conns.addConnection(id); }

    super({
      pos,
      child: childContainer
    });
  }
}

export abstract class Comparators extends Container {
  output: Logic;
  notOutput: Logic;
}

export class EqualsConstant extends Comparators {
  constructor({
    key,
    signal,
    constant,
    slowMode = true,
    bitKeys = new KeyMap(),
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    if (constant > Math.pow(2,signal.length))
      throw new Error(`Constant value ${constant} greater than maximum Integer value (${Math.pow(2,signal.length)})`);
    
    const nor = new Logic({
      key: (bitKeys.ids.has( CompareIdentifiers.NotIn )) ? bitKeys.ids.get( CompareIdentifiers.NotIn ) : key,
      operation: new Operation(LogicalOperation.Nor),
    });
    const bufferIdentifier = slowMode ? CompareIdentifiers.BufferIn : CompareIdentifiers.Output;
    const buffer = new Logic({
      key: (bitKeys.ids.has( bufferIdentifier )) ? bitKeys.ids.get( bufferIdentifier ) : key,
      operation: new Operation(LogicalOperation.And),
      pos: new Pos({ z:1 })
    });
    const and = new Logic({
      key: (bitKeys.ids.has( CompareIdentifiers.Output )) ? bitKeys.ids.get( CompareIdentifiers.BufferIn ) : key,
      operation: new Operation(LogicalOperation.And),
      pos: new Pos({ z:2 })
    });
    const nand = new Logic({
      key: (bitKeys.ids.has( CompareIdentifiers.NotOutput )) ? bitKeys.ids.get( CompareIdentifiers.NotOutput ) : key,
      operation: new Operation(LogicalOperation.Nand),
      pos: new Pos({ z:3 })
    })

    let connectionPattern = (new RawBitMask(constant, signal.length)).reverse();
    for (let i in connectionPattern.mask) {
        signal[i].conns.addConnection( (connectionPattern.mask[i] ? buffer.id : nor.id) )
    }

    const children = [nor,buffer];
    let output = and;
    let notOutput = null;
    if (slowMode) { // add third logic block
      children.push(and);
      children.push(nand);
      nor.conns.addConnection( and.id );
      nor.conns.addConnection( nand.id );
      buffer.conns.addConnection( and.id );
      buffer.conns.addConnection( nand.id );
      notOutput = nand;
    }
    else { // connect everything to buffer // 1 tick faster than 'slowMode'
      nor.conns.addConnection( buffer.id );
      output = buffer;
    }
    super({
      color,pos,rotate,children
    });
    this.output = output;
    this.notOutput = notOutput;
  }
}