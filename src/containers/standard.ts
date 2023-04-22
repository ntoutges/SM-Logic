import { Wood } from "../classes/blocks/materials";
import { Color, RGB, RGBColor } from "../support/colors/classes";
import { Colors } from "../support/colors/enums";
import { Bounds, Bounds2d, Pos } from "../support/spatial/classes";
import { Container, Unit } from "./classes";
import { AlignH, AlignV } from "./enums";
import { StandardUnitInterface } from "./interfaces";

export class StandardUnit extends Container {
  constructor({
    gridSize = new Bounds2d({ x:4, y:4 }),
    gridSpacing = new Bounds2d({ x:4, y:4 }),
    children=[],
    horizontalAlign=AlignH.Center,
    verticalAlign=AlignV.Back,
    pos,color,rotate
  }: StandardUnitInterface) {
    const gridAvailablility: Array<Array<boolean>> = [];
    for (let y = 0; y < gridSize.y; y++) {
      gridAvailablility.push([]);
      for (let x = 0; x < gridSize.x; x++) {
        gridAvailablility[y].push(false); // nothing yet occupies this grid space
      }
    }

    const gridHeight = gridSpacing.y * gridSize.y;

    const childs: Unit[] = [];
    for (const child of children) {
      const childGridBounds = new Bounds2d({
        x: Math.ceil(child.boundingBox.x / gridSpacing.x),
        y: Math.ceil(child.boundingBox.y / gridSpacing.y)
      });

      let foundSpace = false;
      for (let y = 0; y <= gridSize.y - childGridBounds.y; y++) {
        for (let x = 0; x <= gridSize.x - childGridBounds.x; x++) {
          // check if all spaces to occupy will be empty
          let isBlocked = false;
          for (let y1 = 0; y1 < childGridBounds.y; y1++) {
            for (let x1 = 0; x1 < childGridBounds.x; x1++) {
              if (gridAvailablility[y+y1][x+x1]) {
                isBlocked = true;
                break;
              }
            }
            if (isBlocked) { break; } // search a new set of coordinates
          }
          if (!isBlocked) { // space open to occupy
            for (let y1 = 0; y1 < childGridBounds.y; y1++) {
              for (let x1 = 0; x1 < childGridBounds.x; x1++) {
                gridAvailablility[y+y1][x+x1] = true; // occupy these spaces
              }
            }

            // used to set alignment
            const xOff = Math.round((childGridBounds.x*gridSpacing.x - child.boundingBox.x) * horizontalAlign);
            const yOff = Math.round((childGridBounds.y*gridSpacing.y - child.boundingBox.y) * verticalAlign);

            childs.push(
              new Container({
                child,
                pos: (
                  new Pos({
                    x: x * gridSpacing.x + xOff,
                    y: y * gridSpacing.y + yOff,
                  })
                ).sub(
                  child.origin
                )
              })
            );
            foundSpace = true;
            break;
          }
        }
        if (foundSpace) { break; }
      }
      if (!foundSpace) throw new Error("Unable to find space for Unit");
    }

    super({
      pos,color,rotate,
      children: childs.concat(
        new Wood({
          bounds: gridSize.scale(gridSpacing),
          pos: new Pos({
            z: -1
          })
        })
      )
    })
  }
}