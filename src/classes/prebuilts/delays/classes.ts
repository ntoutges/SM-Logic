import { Container, Grid } from "../../../containers/classes";
import { BasicKey, Id, KeylessFutureId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { Connections, Delay, MultiConnections } from "../../../support/logic/classes";
import { Bounds, Pos } from "../../../support/spatial/classes";
import { Logic, Timer } from "../../blocks/basics";
import { DelayUnitInterface } from "./interfaces";

export class DelayUnit extends Grid {
  constructor({
    key,
    delays,
    pos,
    rotate,
    color,
    connections = new MultiConnections([])
  }: DelayUnitInterface) {
    let timers: Array<Timer> = [];
    let timerKeys: Array<UniqueCustomKey> = [];
    for (let i in delays.delays) {
      timerKeys.push(
        new UniqueCustomKey({
          identifier: `delays${i}`,
          key
        })
      );
    }
    for (let [i, delay] of delays.delays.entries()) {
      const conns = ((i == 0) ? [] : [ new Id(timerKeys[i-1]) ]).concat(
        connections.getConnection(i.toString()).connections
      );
      
      timers.push(
        new Timer({
          key: timerKeys[i],
          delay,
          connections: new Connections(conns)
        })
      );
    }

    super({
      pos,rotate,color,
      size: new Bounds({ x: delays.length }),
      spacing: new Bounds({ x: 1 }),
      children: timers
    });
  }
  getTimer(i: number): Timer {
    if (i < 0) i += this.children.length;
    return this.children[i] as Timer;
  }
  getFirstTimer(): Timer { return this.getTimer(-1); }
  getTimerIds(delay: Delay): Id {
    const id = new KeylessFutureId();
    for (let timer of this.children) {
      if ((timer as Timer).delay._equals(delay)) {
        id.addId((timer as Timer).id);
      }
    }
    return id;
  }
}

// will replace 0-tick delays with a Logic block, instead of a Delay block
export class SmartDelayUnit extends Grid {
  constructor({
    key,
    delays,
    pos,
    rotate,
    color,
    connections = new MultiConnections([])
  }: DelayUnitInterface) {
    let timers: Array<Timer | Logic> = [];
    let timerKeys: Array<BasicKey> = [];
    for (let i in delays.delays) {
      timerKeys.push(key)
    }
    for (let [i, delay] of delays.delays.entries()) {
      const conns = ((i == 0) ? [] : [ new Id(timerKeys[i-1]) ]).concat(
        connections.getConnection(i.toString()).connections
      );

      timers.push(
        delay.getDelay() == 0 ? 
          new Timer({
            key: timerKeys[i],
            delay,
            connections: new Connections(conns)
          }) : 
          new Logic({
            key: timerKeys[i],
            connections: new Connections(conns)
          })
      );
    }

    super({
      pos,rotate,color,
      size: new Bounds({ x: delays.length }),
      spacing: new Bounds({ x: 1 }),
      children: timers
    });
  }
  getTimer(i: number): Timer | Logic { return this.children[i] as Timer | Logic; }
  getTimerIds(delay: Delay): Id {
    const id = new KeylessFutureId();
    for (let timer of this.children) {
      if (timer instanceof Timer && timer.delay._equals(delay)) {
        id.addId((timer as Timer).id);
      }
    }
    return id;
  }
}