import { Bloc } from "../../../../containers/bloc";
import { Container } from "../../../../containers/classes";
import { Bounds, Bounds2d, Pos } from "../../../../support/spatial/classes";
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
    size = new Bounds2d({ x:8, y:8 })
  }: MemoryGridInterface) {
    const gridUnit = new MemoryGrid({
      key,
      signal,
      bitKeys,
      connections,
      size,
      pos: new Pos({
        x: 4,
        y: 6
      })
    });
    super({
      pos, rotate, color,
      child: new Bloc({
        child: gridUnit,
        size: new Bounds({
          x: 23 + size.x*6,
          y: 3 + size.y*6,
          z: 10
        })
      })
    });

    this.gridUnit = gridUnit;
  }
}