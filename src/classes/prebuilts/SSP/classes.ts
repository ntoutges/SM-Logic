import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { Colors } from "../../../support/colors/enums";
import { Id, Identifier } from "../../../support/context/classes";
import { BitIdentifiers } from "../../../support/context/enums";
import { Connections, Delay, MultiConnections, Operation } from "../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../support/logic/enums";
import { Pos, Rotate } from "../../../support/spatial/classes";
import { Direction, Orientation } from "../../../support/spatial/enums";
import { Logic, Timer } from "../../blocks/basics";
import { Bit, SmallBit } from "../memory/classes";
import { SSPReceiverInterface } from "./interface";

// (S)crap (S)erial (P)rotocol
export class SSPReceiver extends Container {
  readonly input: Logic;
  readonly finishedTransmission: Logic;
  readonly continueBit: Logic;
  readonly signal: Logic[];
  constructor({
    key,
    pos,
    rotate,
    color,
    signal = null
  }: SSPReceiverInterface) {
    const input = new Logic({
      key,
      operation: new Operation(LogicalOperation.Input),
      pos: new Pos({ z:2, x: -2 }),
      rotate: new Rotate({ direction: Direction.Left }),
    });
    if (signal != null) signal.connectTo(input.id);

    const pulseExtender1 = new Logic({
      key,
      operation: new Operation(LogicalOperation.Or),
      pos: new Pos({ x:0, z:2, y:-3 }),
      rotate: new Rotate({ direction: Direction.Right }),
      color: new Color(Colors.SM_Orange)
    });
    const pulseExtender2 = new Logic({
      key,
      operation: new Operation(LogicalOperation.Or),
      pos: new Pos({ x:2, z:2, y:-3 }),
      rotate: new Rotate({ direction: Direction.Right }),
      color: new Color(Colors.SM_Orange)
    });

    const oneTick1 = new Logic({
      key,
      rotate: new Rotate({ direction: Direction.Up }),
      pos: new Pos({ x:2, z:3 }),
      color: new Color(Colors.SM_YellowGreen)
    });
    const oneTick2 = new Logic({
      key,
      operation: new Operation(LogicalOperation.Not),
      rotate: new Rotate({ direction: Direction.Up }),
      pos: new Pos({ x:3, z:3 }),
      connections: new Connections(oneTick1.id),
      color: new Color(Colors.SM_YellowGreen)
    });
    const oneTick3 = new Logic({
      key, operation: new Operation(LogicalOperation.Nor),
      pos: new Pos({ z:3 }),
      color: new Color(Colors.SM_Orange)
    })
    oneTick1.connectTo(oneTick3);

    const isRunning = new Bit({
      key,
      pos: new Pos({ x:1, z:2, y:-2 }),
      rotate: new Rotate({ direction: Direction.Right }),
      connections: new MultiConnections({
        conns: new Connections([oneTick1.id, oneTick2.id]),
        id: new Identifier(BitIdentifiers.Set)
      }),
      color: new Color(Colors.SM_LightBlue3)
    });
    const isRunningReset = new Logic({
      key,
      pos: new Pos({ x:2, y:1, z:2 }),
      connections: new Connections(isRunning.resetId),
      operation: new Operation(LogicalOperation.Not),
      color: new Color(Colors.SM_Purple)
    });

    const syncTimer = new Timer({
      key,
      delay: new Delay({ delay: 1, unit: Time.Tick }),
      pos: new Pos({ y:1, z:2 }),
      rotate: new Rotate({ orientation: Orientation.Left }),
      color: new Color(Colors.SM_Orange)
    });

    const timers: Logic[] = [];
    const matrix: Logic[] = [];
    const data: SmallBit[] = [];
    const resetters: Logic[] = [];
    const resetEnables: Logic[] = [];
    for (let z = 1; z >= 0; z--) {
      for (let x = 0; x < 4; x++) {
        const nextMatrix = new Logic({
          key,
          rotate: new Rotate({ direction: Direction.Backwards }),
          pos: new Pos({ x: -x, z: z, y:-1 }),
          color: new Color(Colors.SM_Yellow3)
        });
        const nextTimer = new Logic({
          key,
          rotate: new Rotate({ direction: Direction.Backwards }),
          pos: new Pos({ x: -x, z: z, y:-2 }),
          connections: new Connections(nextMatrix.id)
        });
        matrix.push(nextMatrix);
        timers.push(nextTimer);

        const resetEnable = new Logic({
          key,
          rotate: new Rotate({ direction: Direction.Up }),
          pos: new Pos({ x, y:2-z, z: 4 })
        });
        resetEnables.push(resetEnable);
        resetters.push(
          new Logic({
            key,
            rotate: new Rotate({ direction: Direction.Up }),
            pos: new Pos({ x, y:2-z, z: 3 }),
            connections: new Connections(resetEnable.id)
          })
        );
        data.push(
          new SmallBit({
            key,
            pos: new Pos({ x, z }),
            rotate: new Rotate({ orientation: Orientation.Left }),
            color: new Color(Colors.SM_DarkGrey)
          })
        );
      }
    }

    const continueBit = new SmallBit({ 
      key,
      pos: new Pos({ x:1, z:2 }),
      color: new Color(Colors.SM_Yellow)
    });
    const continueMatrix = new Logic({
      key,
      rotate: new Rotate({ direction: Direction.Backwards }),
      pos: new Pos({ x: -1, z: 2, y:-1 }),
      connections: new Connections(continueBit.id)
    });
    const continueTimer = new Logic({
      key,
      rotate: new Rotate({ direction: Direction.Backwards }),
      pos: new Pos({ x: -1, z: 2, y:-2 }),
      connections: new Connections([continueMatrix.id, timers[0].id])
    });

    const continueResetEnable = new Logic({
      key,
      rotate: new Rotate({ direction: Direction.Up }),
      pos: new Pos({ x:1, z:4 }),
      connections: new Connections(continueBit.id)
    });
    const continueReset = new Logic({
      key,
      rotate: new Rotate({ direction: Direction.Up }),
      pos: new Pos({ x:1, z:3 }),
      connections: new Connections(continueResetEnable.id)
    });

    oneTick1.connectTo(continueTimer);
    oneTick1.connectTo(continueResetEnable);
    input.connectTo(syncTimer);
    continueBit.connectTo(continueReset);
    syncTimer.connectTo(continueMatrix);
    for (let i = 0; i < timers.length-1; i++) { timers[i].connectTo(timers[i+1]); }
    for (let i in timers) {
      syncTimer.connectTo(matrix[i]);
      matrix[i].connectTo(data[i]);
      data[i].connectTo(resetters[i]);
      oneTick1.connectTo(resetEnables[i]);
      resetEnables[i].connectTo(data[i])
    }
    for (let i = 0; i < 3; i++) { timers[i+5].connectTo(isRunningReset); }


    input.connectTo(pulseExtender1);
    input.connectTo(pulseExtender2);
    input.connectTo(isRunning.setId);
    pulseExtender1.connectTo(pulseExtender2);
    pulseExtender2.connectTo(isRunning.setId);

    super({
      pos,rotate,color,
      children: [ input, pulseExtender1, pulseExtender2, isRunning, oneTick1, oneTick2, isRunningReset, syncTimer, continueBit, continueMatrix, continueTimer, continueResetEnable, continueReset ].concat(data, timers, matrix, resetters, resetEnables)
    });

    this.input = input;
    this.continueBit = continueBit;
    this.finishedTransmission = oneTick3;
    this.signal = data;
  }
}