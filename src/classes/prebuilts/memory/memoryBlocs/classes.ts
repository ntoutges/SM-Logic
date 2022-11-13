import { Bloc, Container } from "../../../../containers/classes";
import { Bounds, Pos } from "../../../../support/spatial/classes";
import { Wood } from "../../../blocks/basics";
import { MemoryGrid } from "../memoryUnits/classes";
import { MemoryGridInterface } from "../memoryUnits/interfaces";

export class MemoryGridBloc extends Container {
  gridUnit: MemoryGrid;
  constructor({
    key,
    signal,
    bitKeys,
    connections,
    color,
    pos,
    rotate,
    size
  }: MemoryGridInterface) {
    super({
      pos, rotate, color,
      child: new Bloc({
        key,
        child: new MemoryGrid({
          key,
          signal,
          bitKeys,
          connections,
          size,
          pos: new Pos({
            y: 4
          })
        }),
        size: new Bounds({
          x: 10 + size.x*4,
          y: 8 + size.y*6,
          z: 10
        })
      })
    })
  }
}