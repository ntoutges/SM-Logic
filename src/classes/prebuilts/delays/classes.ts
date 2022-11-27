import { Container } from "../../../containers/classes";
import { BasicKey, Id, KeylessFutureId, KeyMap } from "../../../support/context/classes";
import { Connections, Delay, MultiConnections } from "../../../support/logic/classes";
import { Bounds, Pos } from "../../../support/spatial/classes";
import { Timer } from "../../blocks/basics";
import { DelayUnitInterface } from "./interfaces";

export class DelayUnit extends Container {
  constructor({
    key,
    delays,
    pos,
    rotate,
    color,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([]),
    compressed = false
  }: DelayUnitInterface) {
    let timers: Array<Timer> = [];
    let timerKeys: Array<BasicKey> = [];
    for (let i in delays.delays) {
      timerKeys.push(
        bitKeys.ids.has(i) ? bitKeys.ids.get(i) : key 
      )
    }
    for (let [i, delay] of delays.delays.entries()) {
      const conns = ((i == 0) ? [] : [ new Id(timerKeys[i-1]) ]).concat(
        connections.getConnection(i.toString()).connections
      );
      
      timers.push(
        new Timer({
          key: timerKeys[i],
          delay,
          connections: new Connections(conns),
          pos: new Pos({
            // x: (i == delays.delays.length-1) ? 0 : ( compressed ? 1 : i )
            x: compressed ? ((i == delays.delays.length-1) ? 1 : 0) : i
          })
        })
      );
    }

    super({
      pos,rotate,color,
      // size: new Bounds({ x: delays.length }),
      // spacing: new Bounds({ x: 1 }),
      children: timers
    });
  }
  getTimer(i: number): Timer { return this.children[i] as Timer; }
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

// export class SmartDelayUnit extends Grid {
  
// }