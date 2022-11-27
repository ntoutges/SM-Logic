import { Glass, Wood } from "../classes/blocks/materials";
import { Bounds, Offset, Pos } from "../support/spatial/classes";
import { Container, Unit } from "./classes";
import { BlocInterface } from "./interfaces";

export class Bloc extends Container {
  readonly size: Bounds;
  readonly inner: Unit;
  constructor({
    key,
    size,
    child,
    color,
    pos = new Pos({}),
    rotate
  }: BlocInterface) {
    const flooring = new Wood({
      bounds: new Bounds({
        x: size.x + 2,
        y: size.y + 2
      }),
      pos: new Pos({
        x: -1,
        y: -1,
        z: -1
      })
    });
    const ceiling = new Wood({
      bounds: new Bounds({
        x: size.x + 2,
        y: size.y + 2
      }),
      pos: new Pos({
        x: -1,
        y: -1,
        z: size.z
      })
    });
    const wall1 = new Glass({
      bounds: new Bounds({
        x: size.x,
        z: size.z
      }),
      pos: new Pos({
        y: -1
      })
    });
    const wall2 = new Glass({
      bounds: new Bounds({
        x: size.x,
        z: size.z
      }),
      pos: new Pos({
        y: size.y
      })
    });
    const wall3 = new Glass({
      bounds: new Bounds({
        y: size.y,
        z: size.z
      }),
      pos: new Pos({
        x: -1
      })
    });
    const wall4 = new Glass({
      bounds: new Bounds({
        y: size.y,
        z: size.z
      }),
      pos: new Pos({
        x: size.x
      })
    });

    const xPos = [-1, size.x];
    const yPos = [-1, size.y];
    const pillars: Array<Wood> = []
    
    for (let x of xPos) {
      for (let y of yPos) {
        pillars.push(
          new Wood({
            bounds: new Bounds({ z: size.z }),
            pos: new Pos({ x,y })
          })
        )
      }
    }
    super({
      children: [child, flooring,ceiling, wall1,wall2,wall3,wall4].concat(pillars),
      pos: pos.add(
        new Pos({ x:1, y:1, z:1 })
      ),
      color,key,rotate});
    this._addProps(["size"]);
    this.size = size;
    this.inner = child;
  }
  build(offset=new Offset({})) {
    return super.build(offset);
  }
}