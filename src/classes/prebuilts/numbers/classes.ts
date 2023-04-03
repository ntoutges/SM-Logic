import { Bits } from "../memory/classes";
import { Color } from "../../../support/colors/classes";
import { Id, KeylessFutureId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { BitMask, Connections, MultiConnections, Operation, RawBitMask } from "../../../support/logic/classes";
import { Bounds, Pos, Rotate } from "../../../support/spatial/classes";
import { ConstantCompareInterface, CounterInterface, EqualsConstantInterface } from "./interfaces";
import { Container, Grid } from "../../../containers/classes";
import { BasicLogic, Logic } from "../../blocks/basics";
import { LogicalOperation } from "../../../support/logic/enums";
import { CompareIdentifiers } from "../../../support/context/enums";
import { CompareOperation } from "./enums";
import { SmallBit } from "../memory/classes";
import { Direction } from "../../../support/spatial/enums";

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

export class Counter extends Container {
  readonly signal: SmallBit[];
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

    this.signal = bits;
    this.inc = increment;
    this.dec = decrement;
    this.reset = reset;
  }

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
  slowMode = true
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
    pos,
    rotate,
    color
  }: EqualsConstantInterface) {
    if (constant > Math.pow(2,signal.length))
      throw new Error(`Constant value ${constant} greater than maximum Integer value (${Math.pow(2,signal.length)-1})`);
    
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

    let connectionPattern = (new RawBitMask(constant, signal.length)).reverse();
    for (let i in connectionPattern.mask) {
      signal[i].conns.addConnection( (connectionPattern.mask[i] ? buffer.id : nor.id) )
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
