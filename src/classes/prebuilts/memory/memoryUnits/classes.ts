import { Container, Grid } from "../../../../containers/classes";
import { Color } from "../../../../support/colors/classes";
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
import { AddressableMemoryRowInterface, MemoryGridInterface, MemoryRowInterface, MemorySelectorInterface } from "./interfaces";

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
}

export class AddressableMemoryRow extends Container {
  readonly setId: Id;
  readonly resetId: Id;
  constructor({
    key,
    signal,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([]),
    color,
    pos,
    rotate,
    length = 8
  }: AddressableMemoryRowInterface) {
    const memoryRow = new MemoryRow({
      key,connections,
      pos: new Pos({
        x: length + 2
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

    const resetConns: Array<Id> = [];
    for (let x = 0; x < length; x++) {
      const logic = selector.matrix.getGridChild( new Pos({ x,z:8 }) ) as Logic;
      resetConns.push( logic.id );
      logic.color = new Color(Colors.SM_Red1)
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
        new Container({
          child: timer,
          pos: new Pos({
            y: 1,
            z: 5
          })
        }),
        new Container({
          child: reset,
          pos: new Pos({
            x: 2,
            y: 1,
            z: 5
          })
        }),
        new Container({
          child: resetAll,
          pos: new Pos({
            x: 2,
            y: 1,
            z: 6
          })
        })
      ]
    });
    this.resetId = resetAll.id;
    this.setId = reset.id;
  }
}

export class MemoryGrid extends Container {
  readonly resetId: Id;
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

    const resetIds = new KeylessFutureId();
    const selectorConnections: Array<MultiConnectionsType> = [];
    for (let y = 0; y < size.y; y++) {
      const memoryRow = new AddressableMemoryRow({
        key,
        signal: xSignal,
        connections: connections.getMetaConnection(y.toString()),
        bitKeys: bitKeys.narrow(y.toString()),
        length: size.x
      });
      memoryRows.push(memoryRow);
      selectorConnections.push({
        conns: new Connections(memoryRow.setId),
        id: new Identifier(combineIds(y.toString(), "0"))
      });
      resetIds.addId(memoryRow.resetId);
    }

    const bitKeyEnable = new Map<string, CustomKey>();
    bitKeyEnable.set(
      MemoryIdentifiers.Set,
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
        y: 1
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
          children: memoryRows,
          pos: new Pos({
            x: 10
          })
        }),
        new Container({
          child: selector,
          pos: new Pos({
            y: (size.y * 2),
            z: 1
          })
        })
      ],
      color,
      pos,
      rotate
    });
    this.resetId = resetIds;
  }
}

export class MemoryGridUnit extends Container {
  readonly resetId: Id;
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
    const memoryGrid = new MemoryGrid({
      key,signal,bitKeys,connections,size,
      pos: new Pos({
        x: 1,
        y: 1
      })
    });

    super({
      pos,
      color,
      rotate,
      children: [
        memoryGrid
      ]
    })
  }
}

export class MemorySelector extends Container {
  readonly enable: Logic;
  readonly matrix: Grid;
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

    super({
      color,
      pos,
      rotate,
      children: [
        matrixGrid,
        new Container({
          children: xBits,
          pos: new Pos({ y: 1, z: size.y-1 })
        })
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
  }
}