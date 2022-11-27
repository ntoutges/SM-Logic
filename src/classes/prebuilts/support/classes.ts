import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { Colors } from "../../../support/colors/enums";
import { Bounds, Pos, Rotate } from "../../../support/spatial/classes";
import { Scalable } from "../../blocks/basics";
import { Glass, Wood } from "../../blocks/materials";
import { DraggableIds, ShapeIds } from "../../shapeIds";
import { AxisInterface, Custom2dShapeInterface } from "./interfaces";

export class Axis extends Container {
  constructor({
    pos = new Pos({}),
    rotate = new Rotate({})
  }: AxisInterface) {
    const xAxis = new Wood({
      bounds: new Bounds({ x: 5 }),
      pos: new Pos({ x: 1 }),
      color: new Color( Colors.Red )
    });
    const yAxis = new Wood({
      bounds: new Bounds({ y: 5 }),
      pos: new Pos({ y: 1 }),
      color: new Color( Colors.Green )
    });
    const zAxis = new Wood({
      bounds: new Bounds({ z: 5 }),
      pos: new Pos({ z: 1 }),
      color: new Color( Colors.Blue )
    });

    const mid = new Wood({
      bounds: new Bounds({ }),
      color: new Color( Colors.White )
    });
    // prevents axis from spawning under the ground
    const fix = new Glass({
      bounds: new Bounds({}),
      pos: new Pos({ x:1, y:1 })
    })


    super({
      pos,rotate,
      children: [
        xAxis,
        yAxis,
        zAxis,
        mid,
        fix
      ]
    });
  }
}

export class Custom2dShape extends Container {
  constructor({
    pos,
    color,
    rotate,
    frame,
    material = DraggableIds.Wood
  }: Custom2dShapeInterface) {
    const children: Array<Scalable> = [];

    let x = 0;
    let y = frame.rows.length - 1;
    for (let row of frame.rows) {
      for (let bit of row.mask) {
        if (bit) {
          children.push(
            new Scalable({
              bounds: new Bounds({}),
              pos: new Pos({
                x,y
              }),
              color: color
            }, material)
          )
        }
        x++;
      }
      y--;
      x = 0;
    }

    super({
      pos,color,rotate,
      children
    })
  }
}