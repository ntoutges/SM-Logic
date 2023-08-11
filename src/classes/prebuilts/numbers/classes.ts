import { Bits } from "../memory/classes";
import { Color } from "../../../support/colors/classes";
import { Id, KeylessFutureId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { BitMask, Connections, MultiConnections, Operation, RawBitMask } from "../../../support/logic/classes";
import { Bounds, Pos, Rotate } from "../../../support/spatial/classes";
import { ConstantCompareInterface, CounterInterface, EqualsConstantInterface, IntegerInterface } from "./interfaces";
import { Container, Grid } from "../../../containers/classes";
import { BasicLogic, Logic } from "../../blocks/basics";
import { LogicalOperation } from "../../../support/logic/enums";
import { CompareIdentifiers } from "../../../support/context/enums";
import { CompareOperation, IntegerTypes } from "./enums";
import { SmallBit } from "../memory/classes";
import { Direction } from "../../../support/spatial/enums";
import { IntegerValue } from "../../../support/numbers/classes";

// export class Integer extends Bits {
//   setNumber(value: number): Id {
//     if (value < 0 || value >= Math.pow(2,this.bits.length) )
//     throw new Error(`The value [${value}] cannot be stored in a ${this.bits.length} bit Integer`);    

//     return super.set( (new RawBitMask(value, this.bits.length)).reverse() );
//   }
//   get signal(): Array<Logic> {
//     const logics: Array<Logic> = [];
//     this.bits.forEach((bit) => {
//       logics.push(bit.read);
//     });
//     return logics;
//   }
//   get maxInt(): number { return Math.pow(2,this.bits.length) - 1; }
// }

export class Integer extends Container {
  readonly signal: Logic[] = [];
  constructor({
    bits,
    color,pos,rotate
  }: IntegerInterface) {
    super({
      child: bits,
      color,pos,rotate
    });

    for (const bit of bits.bits) {
      this.signal.push(bit.read);
    }
  }

  get bits() { return this.children[0] as Bits | Counter; }
  // get reset() { return (this.children[0] as Bits).reset; }
  // set(map: BitMask): Id { return (this.children[0] as Bits).set(map); }

  get value(): IntegerValue {
    return new IntegerValue({
      signal: this.signal
    });
  }
}

export class Counter extends Container {
  readonly bits: SmallBit[];
  readonly inc: Logic;
  readonly dec: Logic;
  readonly reset: Logic;
  constructor({
    key,
    depth=8,
    connections=new MultiConnections([]),
    pos,color,rotate
  }: CounterInterface) {
    if (depth < 1)
      throw new Error("Bit depth must be at least 1");

    const increment = new Logic({
      key,
      operation: new Operation(LogicalOperation.Input),
      pos: new Pos({ x: 2, z: 2 })
    });
    const decrement = new Logic({
      key,
      operation: new Operation(LogicalOperation.Input),
      pos: new Pos({ x: 2, z: 1 })
    });
    const reset = new Logic({
      key,
      operation: new Operation(LogicalOperation.Reset),
      pos: new Pos({ x: 2, z: 0 })
    })

    const bits: SmallBit[] = [];
    const distributersF: Logic[] = [];
    const distributersB: Logic[] = [];
    const confirmersF: Logic[] = [];
    const confirmersB: Logic[] = [];
    const resetBuffers: Logic[] = [];
    const resetChecks: Logic[] = [];

    for (let i = 0; i < depth; i++) {
      const bit = new SmallBit({
        key,
        connections: connections.getConnection(Math.pow(2,i).toString())
      });
      const distributerF = new Logic({
        key,
        rotate: new Rotate({ direction: Direction.Backwards }),
        operation: new Operation(LogicalOperation.And)
      });
      const distributerB = new Logic({
        key,
        rotate: new Rotate({ direction: Direction.Backwards }),
        operation: new Operation(LogicalOperation.Nor)
      });
      const confirmerF = new Logic({
        key,
        operation: new Operation(LogicalOperation.And)
      });
      const confirmerB = new Logic({
        key,
        operation: new Operation(LogicalOperation.And)
      });
      const resetBuffer = new Logic({
        key,
        operation: new Operation(LogicalOperation.Buffer)
      });
      const resetCheck = new Logic({
        key,
        operation: new Operation(LogicalOperation.And)
      });

      bits.push(bit);
      distributersF.push(distributerF);
      distributersB.push(distributerB);
      confirmersF.push(confirmerF);
      confirmersB.push(confirmerB);
      resetBuffers.push(resetBuffer);
      resetChecks.push(resetCheck);

      bit.connectTo(distributerF);
      // distributerF.connectTo(confirmerF);
      confirmerF.connectTo(bit);
      
      bit.connectTo(distributerB);
      // distributerB.connectTo(confirmerB);
      confirmerB.connectTo(bit);

      bit.connectTo(resetBuffer);
      resetBuffer.connectTo(resetCheck);
      resetCheck.connectTo(bit);

      increment.connectTo(confirmerF);
      decrement.connectTo(confirmerB);
      reset.connectTo(resetCheck);

      for (let j = 0; j < i; j++) {
        distributersF[j].connectTo(confirmersF[i]);
        distributersB[j].connectTo(confirmersB[i]);
      }
    }

    const size = new Bounds({ z: depth })
    super({
      children: [
        new Grid({
          children: bits,
          size,
          pos: new Pos({ x: 1 })
        }),
        new Grid({
          children: distributersF,
          size,
          pos: new Pos({ y: 2 })
        }),
        new Grid({
          children: distributersB,
          size,
          pos: new Pos({ x: 2, y: 2 })
        }),
        new Grid({
          children: confirmersF,
          size,
          pos: new Pos({ y: 1 })
        }),
        new Grid({
          children: confirmersB,
          size,
          pos: new Pos({ x: 2, y: 1 })
        }),
        new Grid({
          children: resetBuffers,
          size,
          pos: new Pos({ x: 1, y: 1 })
        }),
        new Grid({
          children: resetChecks,
          size,
          pos: new Pos({ x: 1, y: 2 })
        }),
        increment,
        decrement,
        reset
      ],
      pos,color,rotate
    });

    this.bits = bits;
    this.inc = increment;
    this.dec = decrement;
    this.reset = reset;
  }

}

export class ConstantCompare extends Container {
  constructor({
  key,
  value,
  constant,
  operation,
  ifC,
  elseC = null,
  pos,
  color,
  rotate,
  slowMode = true
  }: ConstantCompareInterface) {
    if (elseC != null && elseC.connections.length != 0 && !slowMode)
      throw new Error("Cannot have elseC term when not in \'slowMode\'");

    let operationClass = null;
    switch (operation) {
      case CompareOperation.Equals:
        operationClass = EqualsConstant;
        break;
      case CompareOperation.NotEquals:
        operationClass = NotEqualsConstant;
        break;
      case CompareOperation.GreaterThan:
        operationClass = GreaterThanConstant;
        break;
      case CompareOperation.GreaterThanOrEqual:
        operationClass = GreaterThanOrEqualConstant;
        break;
      case CompareOperation.LessThan:
        operationClass = LessThanConstant;
        break;
      case CompareOperation.LessThanOrEqual:
        operationClass = LessThanOrEqualConstant;
        break;
      default:
        throw new Error("Unrecognized CompareOperation");
    }
    const childContainer: Comparators = new operationClass({
      key,
      value,
      constant,
      slowMode,
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

class EqualsConstant extends Comparators {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    if (constant > Math.pow(2,value.length))
      throw new Error(`Constant value ${constant} greater than maximum Integer value (${Math.pow(2,value.length)-1})`);
    
    const nor = new Logic({
      key,
      operation: new Operation(LogicalOperation.Nor),
    });
    const bufferIdentifier = slowMode ? CompareIdentifiers.BufferIn : CompareIdentifiers.Output;
    const buffer = new Logic({
      key,
      operation: new Operation(LogicalOperation.And),
      pos: new Pos({ z:1 })
    });
    const and = new Logic({
      key,
      operation: new Operation(LogicalOperation.And),
      pos: new Pos({ z:2 })
    });
    const nand = new Logic({
      key,
      operation: new Operation(LogicalOperation.Nand),
      pos: new Pos({ z:3 })
    })

    let connectionPattern = (new RawBitMask(constant, value.length)).reverse();
    for (let i in connectionPattern.mask) {
      value.signal[i].conns.addConnection( (connectionPattern.mask[i] ? buffer.id : nor.id) )
    }

    const children: Logic[] = [];
    if (connectionPattern.has(true)) children.push(buffer)
    if (connectionPattern.has(false)) children.push(nor)

    let output = and;
    let notOutput = null;
    if (slowMode) { // add third logic block
      children.push(and);
      children.push(nand);
      nor.connectTo( and );
      nor.connectTo( nand );
      buffer.connectTo( and );
      buffer.connectTo( nand );
      notOutput = nand;
    }
    else { // connect everything to buffer // 1 tick faster than 'slowMode'
      nor.connectTo( buffer )
      output = buffer;
    }
    super({
      color,pos,rotate,children
    });
    this.output = output;
    this.notOutput = notOutput;
  }
}

class NotEqualsConstant extends Comparators {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    if (constant > Math.pow(2,value.length))
      throw new Error(`Constant value ${constant} greater than maximum Integer value (${Math.pow(2,value.length)-1})`);
    
    const nor = new Logic({
      key,
      operation: new Operation(LogicalOperation.Nor),
    });
    const bufferIdentifier = slowMode ? CompareIdentifiers.BufferIn : CompareIdentifiers.Output;
    const buffer = new Logic({
      key,
      operation: new Operation(LogicalOperation.And),
      pos: new Pos({ z:1 })
    });
    const and = new Logic({
      key,
      operation: new Operation(LogicalOperation.Nand), // would be AND in EQUALS operation
      pos: new Pos({ z:2 })
    });
    const nand = new Logic({
      key,
      operation: new Operation(LogicalOperation.And), // would be NAND in equals operation
      pos: new Pos({ z:3 })
    })

    let connectionPattern = (new RawBitMask(constant, value.length)).reverse();
    for (let i in connectionPattern.mask) {
      value.signal[i].conns.addConnection( (connectionPattern.mask[i] ? buffer.id : nor.id) )
    }

    const children: Logic[] = [];
    if (connectionPattern.has(true)) children.push(buffer)
    if (connectionPattern.has(false)) children.push(nor)

    let output = and;
    let notOutput = null;
    if (slowMode) { // add third logic block
      children.push(and);
      children.push(nand);
      nor.connectTo( and );
      nor.connectTo( nand );
      buffer.connectTo( and );
      buffer.connectTo( nand );
      notOutput = nand;
    }
    else { // connect everything to buffer // 1 tick faster than 'slowMode'
      nor.connectTo( buffer )
      output = buffer;
    }
    super({
      color,pos,rotate,children
    });
    this.output = output;
    this.notOutput = notOutput;
  }
}

// note: these are always in fast mode
class GreaterThanConstant extends Comparators {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    
    const output: Logic = new Logic({
      key,
      operation: new Operation(LogicalOperation.Or)
    });
    const notOutput: Logic = new Logic({
      key,
      operation: new Operation(LogicalOperation.Nor)
    });
    
    if (constant < 0) { // output is always true, because integers can only be positive
      output.connectTo(notOutput);
      super({
        children: [
          output,
          notOutput
        ],
        color,pos,rotate
      });

      // swapped to make 'output' always on
      this.output = notOutput;
      this.notOutput = output;
    }
    else if (constant >= 2 ** value.length - 1) { // output is always false, because integers must be less than [2 ** value.length]
      output.connectTo(notOutput);

      super({
        children: [
          output,
          notOutput
        ],
        color,pos,rotate
      });
      
      this.output = output;
      this.notOutput = notOutput;
    }
    else {
      const opBuffers: Logic[] = []; // inverts the input value based on the constant value
      const ands: Logic[] = []; // ands together opBuffers

      const constantBitmask = new RawBitMask((constant <= Math.pow(2,value.length)) ? constant : 0, value.length);
      let hasSeenOn = false;

      for (let i in constantBitmask.mask) {
        const revI = value.signal.length - +i - 1;
        const bit = constantBitmask.mask[i];
        
        if (bit && !hasSeenOn) {
          hasSeenOn = true;
        }

        if (hasSeenOn) {
          if (!bit) {
            const and = new Logic({
              key,
              operation: new Operation(LogicalOperation.And),
              connections: new Connections([output.id, notOutput.id]),
              // pos: new Pos({
              //   x: +i + 2
              // }),
              // rotate: new Rotate({
              //   direction: Direction.Up
              // })
            });
            ands.push(and);
            value.signal[revI].connectTo(and);

            // connect each buffer to the next [and] in the sequence
            for (let j in opBuffers) { opBuffers[j].connectTo(and); }
          }
          
          if (+i != constantBitmask.mask.length-1) { // on last bit, ignore buffer (it will not connect to anything)
            let bufferType = LogicalOperation.Not; // signal inverted if bit unset
            if (bit) bufferType = LogicalOperation.Buffer; // signal unchanged if bit set
            
            const buffer = new Logic({
              key,
              operation: new Operation(bufferType),
              // pos: new Pos({
              //   x: +i + 2,
              //   y: 1
              // }),
              // rotate: new Rotate({
              //   direction: Direction.Up
              // })
            });

            value.signal[revI].connectTo(buffer);
            opBuffers.push(buffer);
          }
        }
        else { // send directly to output
          value.signal[revI].connectTo(output);
          value.signal[revI].connectTo(notOutput);
        }
      }

      super({
        children: [].concat(
          opBuffers,
          ands,
          output,
          notOutput
        ),
        pos,color,rotate
      });

      this.output = output;
      this.notOutput = notOutput;
    }
  }
}

class GreaterThanOrEqualConstant extends GreaterThanConstant {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    // x >= 10 == x > (10-1) (in integer math) -> subtract 1 from constant
    super({
      key,value,
      constant: constant-1,
      slowMode,
      pos,rotate,color
    });
  }
}

class LessThanOrEqualConstant extends GreaterThanConstant {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    super({
      key,value,constant,slowMode,
      pos,rotate,color
    });

    // x <= 10 == !(x > 10) -> swap output and notOutput
    const temp = this.output;
    this.output = this.notOutput;
    this.notOutput = temp;
  }
}

class LessThanConstant extends LessThanOrEqualConstant {
  constructor({
    key,
    value,
    constant,
    slowMode = true,
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    // x < 10 == x <= (10-1) (in integer math) -> subtract 1 from constant
    super({
      key,value,
      constant: constant-1,
      slowMode,
      pos,rotate,color
    });
  }
}