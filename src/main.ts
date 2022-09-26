import { Builder } from "./builders/classes";
import { Button, Logic, Switch, Timer } from "./classes/blocks/basics";
import { Bit, Bits, Byte } from "./classes/prebuilts/memory/classes";
import { Container, GenericBody, Grid, Unit } from "./containers/classes";
import { ConstantCompare, Integer } from "./classes/prebuilts/numbers/classes";
import { CustomKey, BasicKey, Id, UniqueCustomKey, KeylessFutureId, Identifier, KeyGen, Keys, StringKeyGen, KeyMap, KeylessId } from "./support/context/classes";
import { BitMask, Connections, Delay, Delays, Frame, Frames, MultiConnections, Operation, RawBitMask } from "./support/logic/classes";
import { Bounds, Bounds2d, Pos, Rotate } from "./support/spatial/classes";
import { Direction, Orientation } from "./support/spatial/enums";
import { BitMap, CharacterDisplay, SevenSegment, SevenSegmentNumber, SimpleBitMap } from "./classes/prebuilts/displays/classes";
import { LogicalOperation, Time } from "./support/logic/enums";
import { Characters } from "./classes/prebuilts/displays/enums";
import { DelayUnit } from "./classes/prebuilts/delays/classes";
import { BitIdentifiers, ByteIdentifiers, combineIds, MemoryIdentifiers } from "./support/context/enums";
import { CompareOperation } from "./classes/prebuilts/numbers/enums";
import { AddressableMemoryRow, MemoryGrid, MemoryRow, MemorySelector } from "./classes/prebuilts/memory/memoryUnits/classes";
import { Color } from "./support/colors/classes";
import { Colors } from "./support/colors/enums";

export class Body extends GenericBody {
  constructor() {
    super({});
  }
  build() {
    const key = this.key;
    const gen = new StringKeyGen(key)

    const depth = 8;

    // const bitKeys = [];
    // for (let i = 0; i < depth; i++) {
    //   bitKeys.push( combineIds(Math.pow(2,i).toString(), BitIdentifiers.Set) )
    //   bitKeys.push( combineIds(Math.pow(2,i).toString(), BitIdentifiers.Reset) )
    // }
    // const integer = new Integer({
    //   key,
    //   depth: depth,
    //   bitKeys: gen.range(bitKeys)
    // });

    // const setButtons = [];
    // const resetButtons = [];
    // for (var i = 0; i < depth; i++) {
    //   setButtons.push(
    //     new Button({
    //       key,
    //       pos: new Pos({
    //         z: i
    //       }),
    //       connections: new Connections(
    //         gen.id(
    //           combineIds(Math.pow(2,i).toString(), BitIdentifiers.Set)
    //         )
    //       )
    //     })
    //   );
    // }
    // for (var i = 0; i < depth; i++) {
    //   resetButtons.push(
    //     new Button({
    //       key,
    //       pos: new Pos({
    //         z: i
    //       }),
    //       connections: new Connections(
    //         gen.id(
    //           combineIds(Math.pow(2,i).toString(), BitIdentifiers.Reset)
    //         )
    //       )
    //     })
    //   );
    // }

    // const charDisplay = new CharacterDisplay({
    //   key: key,
    //   pos: new Pos({
    //     x: 5
    //   })
    // });

    // const compares = [];
    // const characters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','DollarSign','Set','Undefined']
    // for (var i = 0; i < characters.length; i++) {
    //   compares.push(
    //     new ConstantCompare({
    //       key,
    //       signal: integer.signal,
    //       constant: i+1,
    //       ifC: new Connections( charDisplay.getCharacter(characters[i]) ),
    //       operation: CompareOperation.Equals,
    //       pos: new Pos({
    //         x: -i - 2
    //       })
    //     })
    //   );
    // }

    // const setButtonContainer = new Container({
    //   children: setButtons,
    //   pos: new Pos({
    //     x: -1,
    //     y: -1
    //   })
    // });
    // const resetButtonContainer = new Container({
    //   children: resetButtons,
    //   pos: new Pos({
    //     x: 1,
    //     y: -1
    //   })
    // })

    // return new Container({
    //   children: [
    //     integer,
    //     setButtonContainer,
    //     resetButtonContainer,
    //     charDisplay,
    //     new Button({
    //       key,
    //       pos: new Pos({
    //         y: -1,
    //         x: -2
    //       }),
    //       connections: new Connections( integer.reset )
    //     })
    //   ].concat(compares)
    // });

    const integer = new Integer({
      key,
      depth: 8,
      pos: new Pos({
        x: -5
      })
    });

    const row = new MemoryGrid({
      key,
      signal: integer.signal,
    });

    // const selector = new MemorySelector({
    //   key,
    //   signal: integer.signal
    // })

    return new Container({
      children: [
        new Button({
          key,
          connections: new Connections(integer.reset),
          pos: new Pos({
            x: -7
          })
        }),
        // new Button({
        //   key,
        //   connections: new Connections( gen.id(combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Set)) ),
        //   pos: new Pos({
        //     x: -7,
        //     z: 1
        //   })
        // }),
        // new Button({
        //   key,
        //   connections: new Connections( gen.id(combineIds(MemoryIdentifiers.Selector, MemoryIdentifiers.Reset)) ),
        //   pos: new Pos({
        //     x: -7,
        //     z: 2
        //   }),
        //   color: new Color(Colors.SM_Red2)
        // }),
        row,
        // selector,
        integer
      ]
    })

    // var map = new SimpleBitMap({
    //   key: key,
    //   frame: new Frame({
    //     width: 5,
    //     height: 5,
    //     value: [
    //       new BitMask([true,true,true,true,true]),
    //       new BitMask([false,false,true,false,false]),
    //       new BitMask([false,true,false,false,false]),
    //       new BitMask([true,false,false,false,false]),
    //       new BitMask([true,true,true,false,false])
    //     ]
    //   })
    // })

    // return new Container({
    //   children: [
    //     map,
    //     new Switch({
    //       key: key,
    //       pos: new Pos({
    //         x: 5
    //       }),
    //       connections: new Connections(
    //         map.getEnableId(0)
    //       )
    //     })
    //   ]
    // })
  }
}