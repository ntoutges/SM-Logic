import { Container, Grid, Packager, Unit } from "../../../../containers/classes";
import { Color  } from "../../../../support/colors/classes";
import { Colors } from "../../../../support/colors/enums";
import { CustomKey, Id, Identifier, KeylessFutureId, KeylessId, KeyMap, UniqueCustomKey } from "../../../../support/context/classes";
import { combineIds, MemoryIdentifiers } from "../../../../support/context/enums";
import { BitMask, Connections, Delay, Frame, MultiConnections, Operation } from "../../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../../support/logic/enums";
import { MultiConnectionsType } from "../../../../support/logic/interfaces";
import { Bounds, Bounds2d, Pos, Rotate } from "../../../../support/spatial/classes";
import { Direction } from "../../../../support/spatial/enums";
import { Logic, Timer } from "../../../blocks/basics";
import { Wood } from "../../../blocks/materials";
import { DraggableIds } from "../../../shapeIds";
import { Integer } from "../../numbers/classes";
import { Custom2dShape } from "../../support/classes";
import { AddressableMemoryRowInterface, CardROMInterface, CardROMPackageInterface, MemoryGridInterface, MemoryRowInterface, MemorySelectorInterface, ROMInterface, ROMPackageInterface } from "./interfaces";

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
        conns: (ids.isReady) ? new Connections(ids) : new Connections()
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

export class ROMPackage extends Packager {
  readonly rom: ROM;
  constructor({
    key,
    pos,
    // rotate,
    color,
    data
  }: ROMPackageInterface) {
    
    data.resize( // force this size to fit within package
      new Bounds2d({
        x: 8,
        y: 8
      }),
    );

    const address: Array<Logic> = []
    for (let i = 0; i < 8; i++) {
      address.push(
        new Logic({
          key
        })
      )
    }

    super({
      pos,
      // rotate,
      color,
      packageA: '[{"color":"7F7F7F","pos":{"x":-1,"y":1,"z":0},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":-2,"zaxis":-3},{"color":"7F7F7F","pos":{"x":0,"y":0,"z":8},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":-1,"zaxis":-2},{"color":"7F7F7F","pos":{"x":-1,"y":0,"z":0},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":-1,"zaxis":2},{"color":"7F7F7F","pos":{"x":0,"y":0,"z":5},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":-1,"zaxis":-2},{"bounds":{"x":5,"y":1,"z":8},"color":"222222","pos":{"x":-1,"y":0,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"color":"7F7F7F","pos":{"x":-1,"y":1,"z":8},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":-1,"zaxis":-2},{"color":"7F7F7F","pos":{"x":4,"y":-1,"z":1},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":2,"zaxis":1},{"color":"7F7F7F","pos":{"x":0,"y":-1,"z":1},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":-1,"zaxis":2},{"color":"7F7F7F","pos":{"x":-1,"y":1,"z":4},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":-1,"zaxis":-2},{"color":"7F7F7F","pos":{"x":5,"y":1,"z":8},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":-2,"zaxis":1},{"color":"7F7F7F","pos":{"x":5,"y":1,"z":8},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":-2,"zaxis":3},{"color":"7F7F7F","pos":{"x":5,"y":0,"z":0},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":2,"zaxis":-3},{"color":"7F7F7F","pos":{"x":5,"y":0,"z":0},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":2,"zaxis":1},{"color":"7F7F7F","pos":{"x":5,"y":0,"z":1},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":2,"zaxis":1},{"color":"7F7F7F","pos":{"x":5,"y":0,"z":4},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":2,"zaxis":1},{"bounds":{"x":2,"y":1,"z":8},"color":"4A4A4A","pos":{"x":1,"y":-1,"z":0},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":1,"z":7},"color":"222222","pos":{"x":4,"y":0,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"bounds":{"x":5,"y":1,"z":1},"color":"4A4A4A","pos":{"x":-1,"y":-1,"z":-1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"color":"1C8687","pos":{"x":4,"y":0,"z":9},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":2,"zaxis":-3},{"color":"7F7F7F","pos":{"x":-1,"y":0,"z":8},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":2,"zaxis":3},{"color":"7F7F7F","pos":{"x":5,"y":-1,"z":7},"shapeId":"07232236-22eb-4912-8774-ab185f368bb9","xaxis":2,"zaxis":-1},{"color":"7F7F7F","pos":{"x":-1,"y":1,"z":5},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":-1,"zaxis":-2},{"color":"7F7F7F","pos":{"x":4,"y":-1,"z":1},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":2,"zaxis":-3},{"color":"7F7F7F","pos":{"x":4,"y":0,"z":8},"shapeId":"4f1c0036-389b-432e-81de-8261cb9f9d57","xaxis":-2,"zaxis":3},{"color":"7F7F7F","pos":{"x":5,"y":0,"z":7},"shapeId":"bbc5cc77-443d-4aa7-a175-ebdeb09c2df3","xaxis":-2,"zaxis":-1},{"bounds":{"x":5,"y":1,"z":1},"color":"4A4A4A","pos":{"x":-1,"y":-1,"z":8},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3}]',
      children: [
        new ROM({
          key,
          signal: address,
          data
        }),
        new Grid({
          children: address,
          size: new Bounds({ z: 8 }),
          pos: new Pos({x: 4}),
          color: new Color(Colors.SM_Green)
        })
      ]
    });
  }
}

// ROM in the form of cardboard blocks
export class CardROM extends Container {
  constructor({
    data,
    support=false,
    front=false, // change row[0] to white cardboard, instead of black glass
    pos,
    rotate,
    color
  }: CardROMInterface) {
    const cardValue: BitMask = data.rows[0]; // makes up the front of the ROM, constructed from the first row of data
    const glassValue: Array<BitMask> = []; // makes up the main body of the ROM, constructed from all but the first row of data
    for (let i = 1; i < data.height; i++) {
      glassValue.push( data.rows[i] );
    }

    const cardData = new Frame({
      size: new Bounds2d({
        x: data.width,
        y: 1
      }),
      value: [cardValue]
    });

    const glassData = new Frame({
      size: new Bounds2d({
        x: data.width,
        y: data.height-1
      }),
      value: glassValue.reverse()
    });

    super({
      pos,
      rotate,
      color,
      children: ([
        new Custom2dShape({
          frame: cardData,
          trueMaterial: front ? DraggableIds.Cardboard : DraggableIds.GlassTile,
          color: new Color(front ? Colors.SM_White : Colors.SM_Black),
          pos: new Pos({
            z: (support ? 1 : 0)
          })
        }),
        new Custom2dShape({
          frame: glassData,
          trueMaterial: DraggableIds.GlassTile,
          color: new Color(Colors.SM_Black),
          pos: new Pos({
            y: 1,
            z: (support ? 1 : 0)
          })
        })
      ] as Array<Unit>).concat(
        support ? new Wood({
          bounds: new Bounds({
            x: data.width,
            y: data.height
          }),
          color: new Color(Colors.SM_M_Wood)
        }) : []
      )
    });
  }
}

export class CardROMPackage extends Packager {
  constructor({
    data,
    pos = new Pos({}),
    // rotate,
    color
  }: CardROMPackageInterface) {
    if (data.width != 16 || data.height != 16)
      throw new Error(`Data bounds of [${data.width}x${data.height}] do not match required bounds of [16x16]`)
    
    // set data up to be put into a cartrige
    // cartrige data is read right->left; block=0, air=1
    data = data.hFlip().invert();
    super({
      pos: pos.add(
        new Pos({
          x: 27,
          y: -11,
          z: -1
        })
      ),
      // rotate,
      color,
      packageA: '[{"bounds":{"x":16,"y":15,"z":1},"color":"222222","pos":{"x":-27,"y":12,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"bounds":{"x":18,"y":1,"z":2},"color":"222222","pos":{"x":-28,"y":27,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":16,"z":2},"color":"222222","pos":{"x":-11,"y":11,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":16,"y":1,"z":1},"color":"EEEEEE","pos":{"x":-27,"y":11,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":16,"z":2},"color":"222222","pos":{"x":-28,"y":11,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3}]',
      child: new CardROM({
        data: data,
        front: true,
        pos: new Pos({
          x: -26,
          y: 11,
          z: 2
        })
      })
    })
  }
}

// Double Density
export class DDCardROMPackage extends Packager {
  constructor({
    data,
    pos = new Pos({}),
    // rotate,
    color
  }: CardROMPackageInterface) {
    if (data.width != 32 || data.height != 16)
      throw new Error(`Data bounds of [${data.width}x${data.height}] do not match required bounds of [32x16]`)

    // set data up to be put into a cartrige
    // cartrige data is read right->left; block=0, air=1
    data = data.hFlip().invert();

    const topData: Array<BitMask> = [];
    const midData: Array<BitMask> = [];
    const lowData: Array<BitMask> = [];

    let topMaskData: Array<boolean> = [];
    let midMaskData: Array<boolean> = [];
    let lowMaskData: Array<boolean> = [];
    let byte = "";

    for (let i in data.rows) {
      const mask = data.rows[i].mask
      for (let j = 0; j < mask.length; j += 2) {
        // a/b in reference to truth tables
        const a = mask[j+1];
        const b = mask[j];
        
        topMaskData.push( a && b );
        midMaskData.push( a );
        lowMaskData.push( a || b );

        // console.log(parseInt((a ? 1:0) + "" + (b ? 1:0), 2))
      }
      topData.push(new BitMask(topMaskData));
      midData.push(new BitMask(midMaskData));
      lowData.push(new BitMask(lowMaskData));
      topMaskData = [];
      midMaskData = [];
      lowMaskData = [];
    }

    const frameSize = new Bounds2d({ x: 16,y:16 })

    super({
      pos: new Pos({
        x: -2,
        y: -7,
        z: -1
      }),
      // rotate,
      color,
      packageA: '[{"bounds":{"x":1,"y":17,"z":4},"color":"222222","pos":{"x":18,"y":8,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":14,"y":1,"z":4},"color":"EEEEEE","pos":{"x":3,"y":7,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":17,"z":1},"color":"222222","pos":{"x":1,"y":8,"z":4},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":1,"z":3},"color":"222222","pos":{"x":2,"y":7,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":16,"y":1,"z":1},"color":"222222","pos":{"x":2,"y":23,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":1,"y":18,"z":3},"color":"222222","pos":{"x":1,"y":7,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":2,"y":1,"z":1},"color":"222222","pos":{"x":1,"y":7,"z":4},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":2,"y":1,"z":4},"color":"222222","pos":{"x":17,"y":7,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":16,"y":1,"z":4},"color":"222222","pos":{"x":2,"y":24,"z":1},"shapeId":"628b2d61-5ceb-43e9-8334-a4135566df7a","xaxis":1,"zaxis":3},{"bounds":{"x":16,"y":15,"z":1},"color":"222222","pos":{"x":2,"y":8,"z":1},"shapeId":"df953d9c-234f-4ac2-af5e-f0490b223e71","xaxis":1,"zaxis":3}]',
      child: new Container({
        children: [
          new CardROM({
            data: new Frame({
              value: topData,
              size: frameSize
            }),
            front: false,
            pos: new Pos({ z: 2 })
          }),
          new CardROM({
            data: new Frame({
              value: midData,
              size: frameSize
            }),
            front: false,
            pos: new Pos({ z: 1 })
          }),
          new CardROM({
            data: new Frame({
              value: lowData,
              size: frameSize
            }),
            front: false,
            pos: new Pos({ z: 0 })
          })
        ],
        pos: new Pos({
          x: 3,
          y: 8,
          z: 2
        })
      })
    })
  }
}