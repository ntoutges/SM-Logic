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
    trueMaterial = DraggableIds.Wood,
    falseMaterial = DraggableIds.None
  }: Custom2dShapeInterface) {
    const children: Array<Scalable> = [];

    frame = frame.vFlip();

    const blacklist = new Map<string,boolean>(); // prevent rectangles from overlapping
    for (let y in frame.rows) {
      const yInt = +y; // reverse y axis
      for (let x in frame.rows[yInt].mask) {
        const xInt = +x;
        const originPosStr = `${xInt},${yInt}`;
        if (blacklist.has(originPosStr)) { continue; } // ignore blacklisted origins

        const bitType = frame.rows[yInt].mask[xInt]
        if ((trueMaterial == DraggableIds.None && bitType) || (falseMaterial == DraggableIds.None && !bitType)) continue; // skip when nothing would actually be created

        let xBound = xInt + 1;
        let yBound = yInt + 1;

        // optimization! expand rectangle to max y-height without getting any "false" bits in the bounds
        let yExited = false;
        for (let y2 = yInt+1; y2 < frame.rows.length; y2++) {
          const posStr = `${xInt},${y2}`;
          if (blacklist.has(posStr) || frame.rows[y2].mask[xInt] != bitType) {
            yExited = true;
            yBound = y2;
            break;
          }
          blacklist.set(posStr, true);
        }
        if (!yExited) // went all the way to the bottom of the shape without encountering any "false" bits
          yBound = frame.rows.length

        if (yInt == yBound) { continue; } // ignore cases where no block will be made

        // optimization! expand rectangle to max x-height without getting any "false" bits in the bounds
        let xExited = false;
        for (let x2 = xInt+1; x2 < frame.rows.length; x2++) {
          const posStrs: Array<string> = [];
          for (let y2 = yInt; y2 < yBound; y2++) {
            const posStr = `${x2},${y2}`;
            posStrs.push(posStr);
            if (blacklist.has(posStr) || frame.rows[y2].mask[x2] != bitType) {
              xExited = true;
              xBound = x2;
              break;
            }
          }
          if (xExited) { break; }
          for (let posStr of posStrs) { blacklist.set(posStr, true); }
        }
        if (!xExited) // went all the way to the bottom of the shape without encountering any "false" bits
          xBound = frame.rows[yInt].mask.length;

        if (xBound == xInt) { continue; } // ignore cases where no block will be made
        blacklist.set(originPosStr, true);

        children.push(
          new Scalable({
            bounds: new Bounds({
              x: xBound - xInt,
              y: yBound - yInt
            }),
            pos: new Pos({
              x: xInt,
              y: yInt
            })
          }, bitType ? trueMaterial : falseMaterial)
        )

        // if (bit && trueMaterial != DraggableIds.None) {
        //   children.push(
        //     new Scalable({
        //       bounds: new Bounds({}),
        //       pos: new Pos({
        //         x,y
        //       }),
        //       color: color
        //     }, trueMaterial)
        //   )
        // }
        // else if (!bit && falseMaterial != DraggableIds.None) {
        //   children.push(
        //     new Scalable({
        //       bounds: new Bounds({}),
        //       pos: new Pos({
        //         x,y
        //       }),
        //       color: color
        //     }, falseMaterial)
        //   )
        // }
      }
    }

    super({
      pos,color,rotate,
      children
    })
  }
}