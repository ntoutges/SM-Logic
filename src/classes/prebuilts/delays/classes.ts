import { Grid } from "../../../containers/classes";
import { BasicKey, Id, KeylessFutureId, KeyMap } from "../../../support/context/classes";
import { Connections, Delay, MultiConnections } from "../../../support/logic/classes";
import { Bounds, Pos } from "../../../support/spatial/classes";
import { Timer } from "../../blocks/basics";
import { DelayUnitInterface } from "./interfaces";

export class DelayUnit extends Grid {
  constructor({
    key,
    delays,
    pos,
    rotate,
    color,
    bitKeys = new KeyMap(),
    connections = new MultiConnections([])
  }: DelayUnitInterface) {
    let timers: Array<Timer> = [];
    let timerKeys: Array<BasicKey> = [];
    for (let i in delays.delays) {
      timerKeys.push(
        bitKeys.ids.has(i) ? bitKeys.ids.get(i) : key 
      )
    }
    for (let [i, delay] of delays.delays.entries()) {
      timers.push(
        new Timer({
          key: timerKeys[i],
          delay,
          pos: new Pos({
            x: i
          }),
          connections: (i == 0) ? undefined : new Connections([
            new Id(timerKeys[i-1])
          ].concat(
            connections.getConnection(i.toString()).connections
          ))
        })
      );
    }

    super({
      pos,rotate,color,
      size: new Bounds({ x: delays.length }),
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