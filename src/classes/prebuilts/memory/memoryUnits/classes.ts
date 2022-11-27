import { Container, Grid } from "../../../../containers/classes";
import { Color, HexColor, RGB } from "../../../../support/colors/classes";
import { Colors } from "../../../../support/colors/enums";
import { CustomKey, Id, Identifier, KeylessFutureId, KeylessId, KeyMap, UniqueCustomKey } from "../../../../support/context/classes";
import { combineIds, MemoryIdentifiers } from "../../../../support/context/enums";
import { Connections, Delay, MultiConnections, Operation } from "../../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../../support/logic/enums";
import { MultiConnectionsType } from "../../../../support/logic/interfaces";
import { Bounds, Bounds2d, Pos, Rotate } from "../../../../support/spatial/classes";
import { Direction } from "../../../../support/spatial/enums";
import { Logic, Timer } from "../../../blocks/basics";
import { Integer } from "../../numbers/classes";
import { AddressableMemoryRowInterface, MemoryGridInterface, MemoryRowInterface, MemorySelectorInterface, ROMInterface } from "./interfaces";

export class MemoryRow extends Grid {
  constructor({
    key,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([]),
    color,
    pos,
    rotate,
    length = 8
  }: MemoryRowInterface) {
    const ints: Array<Integer> = [];
    for (let i = 0; i < length; i++) {
      ints.push(
        new Integer({
          key,
          depth: 8,
          connections: connections.getMetaConnection(i.toString()),
          bitKeys: bitKeys.narrow(i.toString()),
        })
      );
    }

    super({
      color,pos,rotate,
      children: ints,
      size: new Bounds({ x: length }),
      spacing: new Bounds({ x: 4 })
    });
  }
  getInteger(index: number): Integer {
    return this.getGridChild(
      new Pos({
        x: index
      })
    ) as Integer
  }
}

export class AddressableMemoryRow extends Container {
  readonly setId: Id;
  readonly resetId: Id;
  readonly reader: MemoryRowReader;
  constructor({
    key,
    signal,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([]),
    color,
    pos,
    rotate,
    length = 8,
    padding = 5
  }: AddressableMemoryRowInterface) {
    const memoryRow = new MemoryRow({
      key,connections,
      pos: new Pos({
        x: 2*length + 2 + padding
      }),
      bitKeys: bitKeys.narrow(MemoryIdentifiers.Row),
      length: length
    });

    const conns: Array<MultiConnectionsType> = [];
    for (let x = 0; x < length; x++) {
      const byte = memoryRow.getGridChild( new Pos({ x }) ) as Integer;
      for (let y = 0; y < 8; y++) {
        const bit = byte.bits[y];
        conns.push({
          conns: new Connections( bit.setId ),
          id: new Identifier( combineIds(x.toString(),y.toString()) )
        });
      }
      conns.push({
        conns: new Connections( byte.reset ),
        id: new Identifier( combineIds(x.toString(),"8") )
      });
    }

    let setId: CustomKey = null;
    if (bitKeys.narrow(MemoryIdentifiers.Selector).ids.has(MemoryIdentifiers.Set)) {
      setId = bitKeys.ids.get(combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Set));
      bitKeys.ids.delete(combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Set));
    }
    const resetId: CustomKey = bitKeys.ids.get(combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Reset)) ?? null;

    // if (!bitKeys.narrow(MemoryIdentifiers.Selector).ids.has(MemoryIdentifiers.Set)) {
    //   bitKeys.ids.set(
    //     combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Set),
    //     new UniqueCustomKey({
    //       key,
    //       identifier: "set"
    //     })
    //   );
    // }

    const selector = new MemorySelector({
      key,signal,
      size: new Bounds2d({
        x: length,
        y: 9 // 1 extra y height for reset capabilities
      }),
      pos: new Pos({
        x: padding + length
      }),
      connections: new MultiConnections(conns),
      bitKeys: bitKeys.narrow(MemoryIdentifiers.Selector)
    });

    const timerConns: Array<Id> = [];
    for (let x = 0; x < length; x++) {
      for (let y = 0; y < 8; y++) {
        timerConns.push(
          (selector.matrix.getGridChild( new Pos({ x, z:y }) ) as Logic).id
        )
      }
    }

    const timer = new Timer({
      key,
      delay: new Delay({
        delay: 2,
        unit: Time.Tick
      }),
      rotate: new Rotate({
        direction: Direction.Right
      }),
      connections: new Connections( timerConns )
    });

    const outSignal: Array<Logic> = [];
    for (let byte = 0; byte < length; byte++) {
      let integerSignal = memoryRow.getInteger(byte).signal
      for (let bit of integerSignal) {
        outSignal.push(bit);
      }
    }
    const reader = new MemoryRowReader({
      key,
      signal: outSignal,
      bitKeys: bitKeys.narrow(MemoryIdentifiers.Getter),
      size: new Bounds2d({
        x: length,
        y: 8
      })
    });

    for (let i = 0; i < selector.header.children.length; i++) {
      let buffer = (selector.header.children[i] as Container).children[0] as Logic;
      let invert = (selector.header.children[i] as Container).children[1] as Logic;

      let step = 2 ** i;
      let isOn = true;
      let ct = 0;
      for (let j = 0; j < length; j++) {
        if (isOn)
          invert.connectTo(reader.getHeader(j));
        else
          buffer.connectTo(reader.getHeader(j));
        
        ct++;
        if (ct >= step) {
          isOn = !isOn
          ct = 0;
        }
      }
    }

    const resetConns: Array<Id> = [];
    for (let x = 0; x < length; x++) {
      const logic = selector.matrix.getGridChild( new Pos({ x,z:8 }) ) as Logic;
      resetConns.push( logic.id );
      logic.color = new Color(Colors.SM_Red1);
    }

    const reset = new Logic({
      key: (setId == null) ? key : setId,
      rotate: new Rotate({
        direction: Direction.Backwards
      }),
      connections: new Connections( resetConns.concat([timer.id]) ),
      operation: new Operation(LogicalOperation.Input)
    });

    const allResetConns: Array<Id> = [];
    for (let x = 0; x < length; x++) {
      allResetConns.push(
        (memoryRow.children[x] as Integer).reset
      )
    }
    const resetAll = new Logic({
      key: (resetId == null) ? key : resetId,
      connections: new Connections( allResetConns ),
      rotate: new Rotate({
        direction: Direction.Backwards
      }),
      color: new Color( Colors.SM_Red2 ),
      operation: new Operation( LogicalOperation.Input )
    });

    super({
      color,
      pos,
      rotate,
      children: [
        memoryRow,
        selector,
        reader,
        new Container({
          child: timer,
          pos: new Pos({
            x: length+padding,
            y: 1,
            z: 5
          })
        }),
        new Container({
          child: reset,
          pos: new Pos({
            x: 2+length+padding,
            y: 1,
            z: 5
          })
        }),
        new Container({
          child: resetAll,
          pos: new Pos({
            x: 2+length+padding,
            y: 1,
            z: 6
          })
        })
      ]
    });
    this.resetId = resetAll.id;
    this.setId = reset.id;
    this.reader = reader;
  }
}

export class MemoryGrid extends Container {
  readonly resetId: Id;
  readonly signal: Array<Logic>;
  constructor ({
    key,
    signal,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([]),
    color,
    pos,
    rotate,
    size = new Bounds2d({ x:8, y:8 })
  }: MemoryGridInterface) {
    const memoryRows: Array<AddressableMemoryRow> = [];
    
    const xBits = Math.ceil(Math.log(size.x) / Math.LN2);
    const yBits = Math.ceil(Math.log(size.y) / Math.LN2);
    const xSignal = signal.slice(0, xBits);
    const ySignal = signal.slice(xBits, xBits+yBits);

    const outputLogics: Array<Logic> = [];
    for (let i = 0; i < 8; i++) {
      outputLogics.push(
        new Logic({
          key,
          operation: new Operation(LogicalOperation.Or)
        })
      )
    }

    const resetIds = new KeylessFutureId();
    const selectorConnections: Array<MultiConnectionsType> = [];
    for (let y = 0; y < size.y; y++) {
      const memoryRow = new AddressableMemoryRow({
        key,
        signal: xSignal,
        connections: connections.getMetaConnection(y.toString()),
        bitKeys: bitKeys.narrow(y.toString()),
        length: size.x,
        padding: 16
      });
      memoryRows.push(memoryRow);
      
      const conn = new Connections();
      for (let child of memoryRow.reader.header.children as Logic[]) {
        conn.addConnection(child.id);
      }

      for (let byteI = 0; byteI < 8; byteI++) {
        let row = memoryRow.reader.getRow(byteI);
        for (let logic of row) {
          logic.connectTo(outputLogics[byteI]);
        }
      }

      selectorConnections.push(
        {
          conns: new Connections(memoryRow.setId),
          id: new Identifier(combineIds(y.toString(), "0"))
        },
        {
          conns: conn,
          id: new Identifier(combineIds(y.toString(), "1"))
        }
      );
      resetIds.addId(memoryRow.resetId);
    }

    const bitKeyEnable = new Map<string, CustomKey>();
    bitKeyEnable.set(
      MemoryIdentifiers.Set1,
      new UniqueCustomKey({
        key,
        identifier: "set"
      })
    );
    const selector = new MemorySelector({
      key,
      signal: ySignal,
      connections: new MultiConnections(selectorConnections),
      bitKeys: new KeyMap( bitKeyEnable ),
      size: new Bounds2d({
        x: size.y,
        y: 2
      }),
      rotate: new Rotate({
        direction: Direction.Right
      })
    });

    super({
      children: [
        new Grid({
          size: new Bounds({ y: size.y }),
          spacing: new Bounds({ y: 6 }),
          children: memoryRows
        }),
        new Container({
          child: selector,
          pos: new Pos({
            x: size.x + 8,
            y: (size.y * 2),
            z: 0
          })
        }),
        new Grid({
          children: outputLogics,
          size: new Bounds({ x: 1, z: 8 }),
          rotate: new Rotate({ direction: Direction.Backwards }),
          pos: new Pos({
            y: -1
          }),
          color: new Color(Colors.SM_Output)
        })
      ],
      color,
      pos,
      rotate
    });
    this.resetId = resetIds;
    this.signal = outputLogics;
  }
}

// export class MemoryGridUnit extends Container {
//   readonly resetId: Id;
//   constructor ({
//     key,
//     signal,
//     bitKeys = new KeyMap(),
//     connections = new MultiConnections([]),
//     color,
//     pos,
//     rotate,
//     size = new Bounds2d({ x:8, y:8 })
//   }: MemoryGridInterface) {
//     const memoryGrid = new MemoryGrid({
//       key,signal,bitKeys,connections,size,
//       pos: new Pos({
//         x: 1,
//         y: 1
//       }),
//       padding: 16
//     });

//     super({
//       pos,
//       color,
//       rotate,
//       children: [
//         memoryGrid
//       ]
//     })
//   }

//   get signal(): Array<Logic> {
//     return (this.children[0] as MemoryGrid).signal;
//   }
// }

export class MemorySelector extends Container {
  readonly enable: Logic;
  readonly matrix: Grid;
  readonly header: Container;
  constructor({
    key,
    signal,
    bitKeys = new KeyMap(),
    size = new Bounds2d({ x:8, y:8 }),
    connections = new MultiConnections([]),
    pos,
    rotate,
    color,
    compressed=true
  }: MemorySelectorInterface) {
    if (size.x < 2)
      throw new Error("Memory Selector must be at least 2x1");
    if (Math.pow(2,signal.length) < size.x)
      throw new Error(`Not enough signal bits (${signal.length}) to address all columns (${size.x}) in MemorySelector`)
    
    const matrix: Array<Logic> = []; // hold bit selectors
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        const identifier = combineIds(j.toString(), i.toString());
        matrix.push(
          new Logic({
            key,
            operation: new Operation(LogicalOperation.And),
            connections: connections.conns.has(identifier) ? connections.conns.get(identifier) : new Connections()
          })
        )
      }
    }
    const matrixGrid = new Grid({
      size: size.to3d({
        xMap: "x",
        yMap: "z"
      }),
      children: matrix
    });

    const xBitCount = Math.ceil(Math.log(size.x) / Math.LN2);
    const xBits: Array<Container> = [];
    for (let i = 0; i < xBitCount; i++) {
      const placeValue = Math.pow(2,i);
      const bufferConnections: Array<Id> = [];
      const invertConnections: Array<Id> = [];
      for (let j = 0; j < size.x; j++) {
        const isInverted = j % (placeValue * 2) < placeValue;
        for (let k = 0; k < size.y; k++) {
          if (isInverted)
            invertConnections.push( matrix[j + k*size.x].id );
          else
            bufferConnections.push( matrix[j + k*size.x].id )
        }
      }
      const buffer = new Logic({
        key,
        operation: new Operation(LogicalOperation.Buffer),
        connections: new Connections(bufferConnections),
        rotate: new Rotate({
          direction: Direction.Backwards
        })
      });
      const invert = new Logic({
        key,
        operation: new Operation(LogicalOperation.Not),
        connections: new Connections(invertConnections),
        pos: new Pos({ z: -1 }),
        rotate: new Rotate({
          direction: Direction.Backwards
        })
      });
      signal[i].conns.addConnection(buffer.id);
      signal[i].conns.addConnection(invert.id);
      
      xBits.push(
        new Container({
          pos: new Pos({ x: i }),
          children: [
            buffer,
            invert
          ]
        })
      );
    }

    let setLogic = null;
    if (bitKeys.ids.has(MemoryIdentifiers.Set)) {
      const conns: Array<Id> = [];
      matrix.forEach((logic) => {
        conns.push(logic.id)
      });
      setLogic = new Logic({
        key: bitKeys.ids.get(MemoryIdentifiers.Set),
        connections: new Connections(conns),
        rotate: new Rotate({ direction: Direction.Backwards })
      })
    }
    else if (bitKeys.ids.has(MemoryIdentifiers.Set1)) {
      const conns: Array<Id> = [];
      for (let i = 0; i < size.x; i++) {
        conns.push(matrix[i].id);
      }
      setLogic = new Logic({
        key: bitKeys.ids.get(MemoryIdentifiers.Set1),
        connections: new Connections(conns),
        rotate: new Rotate({ direction: Direction.Backwards })
      })
    }


    const header = new Container({
      children: xBits,
      pos: new Pos({ y: 1, z: size.y-1 })
    });

    if (compressed)
      matrixGrid.compress();

    super({
      color,
      pos,
      rotate,
      children: [
        matrixGrid,
        header
      ].concat(
        (setLogic == null)
          ? []
          : [
            new Container({
              child: setLogic,
              pos: new Pos({ x: xBitCount, y: 1, z: size.y-1, })
            })
          ]
      )
    });

    this.enable = setLogic;
    this.matrix = matrixGrid;
    this.header = header
  }
}

export class MemoryRowReader extends Container {
  readonly header: Container;
  readonly grid: Grid;
  constructor({
    key,
    signal,
    bitKeys = new KeyMap(),
    size = new Bounds2d({ x:8, y:8 }),
    connections = new MultiConnections([]),
    pos,
    rotate,
    color
  }: MemorySelectorInterface) {
    let logics: Array<Logic> = [];
    for (let i = 0; i < size.y; i++) {
      for (let byte = 0; byte < size.x; byte++) {
        const logic = new Logic({
          key: (bitKeys.get1(
            new Identifier(
              byte + "." + i
            )
          )) || key,
          operation: new Operation( LogicalOperation.And ),
          color: new Color(Colors.SM_Black),
          connections: connections.getConnection(byte + "." + i)
        })
        logics.push(logic);

        if (signal.length > byte*size.x + i)
          signal[byte*size.x + i].connectTo(logic);
      }
    }
    const grid = new Grid({
      size: size.to3d({
        xMap: "x",
        yMap: "z"
      }),
      children: logics
    });

    let headerLogics: Array<Logic> = []; 
    for (let column = 0; column < size.x; column++) {
      let ids = new KeylessFutureId();
      for (let i = 0; i < grid.height; i++) {
        ids.addId(
          (grid.getGridChild(
            new Pos({
              x: column,
              z: i
            })
          ) as Logic).id
        )
      }

      headerLogics.push(
        new Logic({
          key: key,
          pos: new Pos({
            x: column,
            z: size.y
          }),
          connections: new Connections(ids)
        })
      )
    }
    const header = new Container({ children: headerLogics });

    super({
      children: [
        header,
        grid
      ],
      color: color,
      pos: pos,
      rotate: rotate
    });

    this.header = header
    this.grid = grid
  }
  
  getHeader(bitValue: number): Logic {
    return this.header.children[bitValue] as Logic;
  }

  getRow(rowIndex: number): Array<Logic> {
    const row: Array<Logic> = [];
    for (let i = 0; i < this.grid.width; i++) {
      row.push(
        (this.grid.getGridChild(
          new Pos({
            x: i,
            z: rowIndex
          })
        ) as Logic)
      );
    }
    return row;
  }
}

export class ROM extends Container {
  readonly selector: MemorySelector;
  readonly signal: Array<Logic>;
  constructor({
    key,
    signal,
    connections = new MultiConnections([]),
    data,
    pos,
    rotate,
    color
  }: ROMInterface) {
    const outputLogics: Array<Logic> = [];
    for (let i = 0; i < data.width; i++) {
      outputLogics.push(
        new Logic({
          key,
          operation: new Operation(LogicalOperation.Or)
        })
      );
    }
    const output = new Grid({
      children: outputLogics,
      size: new Bounds({
        z: outputLogics.length
      }),
      pos: new Pos({
        x: 1
      }),
      color: new Color(Colors.SM_Orange)
    });

    const innerConnections: Array<MultiConnectionsType> = [];
    for (let [x, bitMask] of data.rows.entries()) {
      const ids = new KeylessFutureId();
      for (let [i,bit] of bitMask.mask.entries()) {
        if (bit)
          ids.addId(outputLogics[bitMask.mask.length-i-1].id);
      }
      innerConnections.push({
        id: new Identifier(
          combineIds(
            x.toString(),
            "0"
          )
        ),
        conns: new Connections(ids)
      });
    }


    const selector = new MemorySelector({
      key,signal,
      connections: new MultiConnections( innerConnections ),
      size: new Bounds2d({ x: data.rows.length })
    });

    super({
      pos,rotate,color,
      children: [
        output,
        selector
      ]
    });

    this.signal = outputLogics;
    this.selector = selector;
  }
}