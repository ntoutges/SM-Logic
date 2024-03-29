import { Container } from "../../../containers/classes";
import { Color } from "../../../support/colors/classes";
import { Frame } from "../../../support/frames/classes";
import { Bounds, Bounds2d, Pos } from "../../../support/spatial/classes";
import { Scalable } from "../../blocks/basics";
import { DraggableIds } from "../../shapeIds";
import { Custom2dShapeInterface, MuralInterface } from "./interfaces";

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

export class Mural extends Container {
  constructor({
    pos,color,rotate,
    layers,
    bounds = null
  }: MuralInterface) {
    // determine bounds based on maximum width and height if not yet defined
    if (bounds == null) {
      let xBound = 1;
      let yBound = 1;
      for (let layer of layers.layers) {
        xBound = Math.max(xBound, layer.frame.width);
        yBound = Math.max(yBound, layer.frame.height);
      }
      bounds = new Bounds2d({
        x: xBound,
        y: yBound
      });
    }

    const children: Scalable[] = [];
    const blacklist = new Map<string,boolean>() // prevent rectangles from overlapping

    // fill final array with scalables
    for (let y = 0; y < bounds.y; y++) {
      const yInt = +y;
      for (let x = 0; x < bounds.x; x++) {
        const xInt = +x;
        const originPosStr = `${xInt},${yInt}`;
        if (blacklist.has(originPosStr)) { continue; } // ignore blacklisted origins
        
        for (let i in layers.layers) {
          if (!layers.layers[i].frame.rows[y].mask[x] || layers.layers[i].material.type == DraggableIds.None) { continue; } // ignore non-existant materials

          const frame = layers.layers[i].frame;
          let xBound = xInt + 1;
          let yBound = yInt + 1;

          // optimization! expand rectangle to max y-height without getting any "false" bits in the bounds
          let yExited = false;
          for (let y2 = yInt+1; y2 < frame.rows.length; y2++) {
            const posStr = `${xInt},${y2}`;
            if (blacklist.has(posStr) || !frame.rows[y2].mask[xInt]) {
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
              if (blacklist.has(posStr) || !frame.rows[y2].mask[x2]) {
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
              }),
              color: layers.layers[i].material.color
            }, layers.layers[i].material.type)
          );
          break;
        }
      }
    }

    super({
      pos,rotate,color,
      children
    });
  }
}