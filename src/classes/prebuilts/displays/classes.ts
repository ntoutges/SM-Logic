import { Container, Grid, Unit } from "../../../containers/classes";
import { CustomKey, Id, KeylessFutureId, KeylessId, UniqueCustomKey } from "../../../support/context/classes";
import { BitMask, Connections, Delay, Frame, Frames, Operation, PhysicalFrame, VBitMask } from "../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../support/logic/enums";
import { Bounds, Pos, Rotate } from "../../../support/spatial/classes";
import { Direction } from "../../../support/spatial/enums";
import { Block, Logic, Timer } from "../../blocks/basics";
import { CharacterFrames, Characters, NumToString } from "./enums";
import { BitMapInterface, CharacterDisplayInterface, DelayUnitInterface, FutureBitMapInterface, SevenSegmentInterface, SimpleBitMapInterface, VideoDisplayInterface } from "./interfaces";

export class FutureBitMap extends Grid {
  private readonly _height: number;
  private readonly _width: number;
  constructor({
    key,
    width,
    height,
    pos,
    rotate,
    color
  }: FutureBitMapInterface) {
    let screen: Array<Logic> = [];
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        screen.push(
          new Logic({
            key: key,
            color: color,
            operation: new Operation({
              operation: LogicalOperation.Screen
            })
          })
        );
      }
    }
    super({
      key: key,
      size: new Bounds({
        x: width,
        z: height
      }),
      pos: pos,
      rotate: rotate,
      color: color,
      children: screen
    });
    this._addProps(["_height","_width"]);
    this._height = height;
    this._width = width;
  }
  get height(): number { return this._height; }
  get width(): number { return this._width; }
  getFrameId(frame: Frame): Id {
    const newFrame = frame.resized({
      height: this.height,
      width: this.width
    });
    const newId = new KeylessFutureId();
    for (let z = 0; z < newFrame.rows.length; z++) {
      for (let x = 0; x < newFrame.rows[z].mask.length; x++) {
        if (newFrame.rows[z].mask[x]) {
          newId.addId(
            (
              this.getGridChild(
                new Pos({
                  x: x,
                  z: newFrame.rows.length-z-1
                })
              ) as Block
            ).id
          )
        }
      }
    }
    return newId;
  }
}

export class BitMap extends Grid {
  private readonly _physicalFrames: Array<PhysicalFrame>;
  constructor({
    key,
    frames,
    pos,
    rotate,
    color
  }: BitMapInterface) {
    if (frames.frames.length == 0)
      throw new Error("frames must contain at least one Frame");

    let screen: Array<Logic> = [];
    let enableIds: Array<KeylessFutureId> = [];
    for (let i in frames.frames) {
      enableIds.push(
        new KeylessFutureId()
      );
    }
    for (let z = 0; z < frames.height; z++) {
      for (let x = 0; x < frames.width; x++) {
        const blockKey = new UniqueCustomKey({ key: key, identifier: `screen${x}:${z}` });
        for (let i in frames.frames) {
          if (frames.frames[i].rows[z].mask[x])
            enableIds[i].addId(blockKey.newId);
        }
        screen.push(
          new Logic({
            key: blockKey,
            color: color,
            operation: new Operation({
              operation: LogicalOperation.Screen
            })
          })
        );
      }
    }
    super({
      key,
      size: new Bounds({
        x: frames.width,
        z: frames.height
      }),
      pos,
      rotate,
      color,
      children: screen
    });
    this._addProps(["_physicalFrames"]);
    this._physicalFrames = [];
    for (let i in enableIds) {
      this._physicalFrames.push(
        new PhysicalFrame({
          frame: frames[i],
          id: enableIds[i]
        })
      );
    }
  }
  get physicalFrames(): Array<PhysicalFrame> { return this._physicalFrames; }
  getFrame(i: number): Frame {
    i = (i < 0) ? i + this._physicalFrames.length: i; // emulate python wrap-around id system
    return this._physicalFrames[i].frame;
  }
  getEnableId(i: number): Id {
    i = (i < 0) ? i + this._physicalFrames.length: i; // emulate python wrap-around id system
    return this._physicalFrames[i].id;
  }
}

export class SimpleBitMap extends BitMap {
  constructor({
    key,
    frame,
    color,
    pos,
    rotate
  }: SimpleBitMapInterface) {
    super({
      key,
      frames: new Frames({
        frames: [
          frame
        ]
      }),
      color,
      pos,
      rotate
    });
  }
  get physicalFrame(): PhysicalFrame { return this.physicalFrames[0]; }
  get frame(): Frame { return this.physicalFrames[0].frame; }
  get id(): Id { return this.physicalFrames[0].id }
}

export class SevenSegment extends BitMap {
  constructor({
    key,
    color,
    pos,
    rotate
  }: SevenSegmentInterface) {
    super({
      key,
      frames: new Frames({
        frames: [
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([]),
              new BitMask([]),
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([true]),
              new BitMask([true]),
              new BitMask([true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([true]),
              new BitMask([true]),
              new BitMask([true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([false,false,true]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true])
            ]
          }),
          new Frame({
            height: 5,
            width: 3,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true])
            ]
          }),
        ],
        height: 5,
        width: 3
      }),
      color,
      pos,
      rotate
    });
  }
  get topId(): Id { return this.getEnableId(0); }
  get middleId(): Id { return this.getEnableId(1); }
  get bottomId(): Id { return this.getEnableId(2); }
  get leftAId(): Id { return this.getEnableId(3); }
  get leftBId(): Id { return this.getEnableId(4); }
  get rightAId(): Id { return this.getEnableId(5); }
  get rightBId(): Id { return this.getEnableId(6); }
}

export class SevenSegmentNumber extends SevenSegment {
  constructor({
    key,
    color,
    pos,
    rotate
  }: SevenSegmentInterface) {
    super({ key,color,pos,rotate });
  }
  get num0Id(): Id {
    return this.topId.add([
      this.bottomId,
      this.leftAId,
      this.leftBId,
      this.rightAId,
      this.rightBId
    ]);
  }
  get num1Id(): Id { return this.rightAId.add([ this.rightBId ]); }
  get num2Id(): Id {
    return this.topId.add([
      this.middleId,
      this.bottomId,
      this.leftBId,
      this.rightAId
    ]);
  }
  get num3Id(): Id {
    return this.num1Id.add([
      this.topId,
      this.middleId,
      this.bottomId
    ]);
  }
  get num4Id(): Id {
    return this.num1Id.add([
      this.leftAId,
      this.middleId
    ]);
  }
  get num5Id(): Id {
    return this.topId.add([
      this.middleId,
      this.bottomId,
      this.leftAId,
      this.rightBId
    ]);
  }
  get num6Id(): Id { return this.num5Id.add([ this.leftBId ]); }
  get num7Id(): Id { return this.num1Id.add([ this.topId ]); }
  get num8Id(): Id { return this.num0Id.add([ this.middleId ]); }
  get num9Id(): Id { return this.num5Id.add([ this.rightAId ]); }

  getNumber(num: number) {
    num = Math.floor(num) % 10;
    switch (num) {
      case 0:
        return this.num0Id;
      case 1:
        return this.num1Id;
      case 2:
        return this.num2Id;
      case 3:
        return this.num3Id;
      case 4:
        return this.num4Id;
      case 5:
        return this.num5Id;
      case 6:
        return this.num6Id;
      case 7:
        return this.num7Id;
      case 8:
        return this.num8Id;
      case 9:
        return this.num9Id;
      default:
        throw new Error(`Unrecognized value [${num}] in \'getNumber\'`)
    }
  }
}

export class CharacterDisplay extends FutureBitMap {
  constructor({
    key,
    color,
    pos,
    rotate
  }: CharacterDisplayInterface) {
    super({
      key,color,pos,rotate,
      width: 5,
      height: 7
    })
  }
  getCharacter(char: Characters | string): Id {
    if (typeof char == "string") {
      return this.getCharacter(
        (Characters[char] != undefined) ? Characters[char] :
        (char in NumToString) ? Characters[NumToString[char]] :
        Characters.Undefined
      )
    }
    return this.getFrameId(
      CharacterFrames[char]
    );
  }
}

// export class VideoDisplay extends BitMap {
//   _frameTime: Delay;
//   constructor({
//     key,
//     frames,
//     frameTime = new Delay({ delay: 1, unit: Time.Tick }),
//     color,
//     pos,
//     rotate,
//   }: VideoDisplayInterface) {
//     super({ key,frames,pos,rotate,color });
//     if (frameTime.getDelay(Time.Second) > 60)
//       throw new Error("Too much delay per frame (max of 60 seconds)");
//     this._frameTime = frameTime;
//   }
// }

export class DelayUnit extends Grid {
  private readonly _timerIds: Array<Id>;
  constructor({
    key,
    delays,
    color,
    pos,
    rotate
  }: DelayUnitInterface) {
    const timers: Array<Timer> = [];
    const timerIds: Array<Id> = [];
    for (let i = delays.length-1; i >= 0; i--) {
      timers.push(
        new Timer({
          key,
          delay: delays.delays[i],
          color,
          connections: (timers.length > 0) ? new Connections(
            timers[timers.length - 1].id
          ) : new Connections()
        })
      )
      timerIds.push( timers[timers.length-1].id );
    }

    super({
      size: new Bounds({
        x: delays.length
      }),
      key,color,pos,rotate,
      children: timers
    });
    this._timerIds = timerIds.reverse();
  }

  get startId(): Id { return this._timerIds[0] }
  getTimerId(i: number): Id {
    if (i < 0)
      i += this._timerIds.length; // emulate python wrap-around
    return this._timerIds[i];
  }
  getTimer(i: number): Timer {
    return (this.children[this.children.length - i - 1] as Timer)
  }
}

export class SmartDelayUnit extends Grid {
  private readonly _timerId: Id;
  private readonly _logicId: Id;
  private readonly _outputs: Array<Logic>;
  constructor({
    key,
    delays,
    color,
    pos,
    rotate
  }: DelayUnitInterface) {
    const timerUnits: Array<Container> = [];
    const logicIds: Id = new KeylessFutureId;
    const outputs: Array<Logic> = []
    let prevTimerId: Id = null;
    for (let i = delays.length-1; i >= 0; i--) {
      const logic = new Logic({
        key,
        rotate: new Rotate({
          direction: Direction.Up
        }),
        connections: (prevTimerId != null) ? new Connections(
          prevTimerId
        ) : new Connections()
      });
      logicIds.addId(logic.id);
      outputs.push(logic);
      const timer = new Timer({
        key,
        delay: new Delay({
          delay: delays.delays[i].getDelay(Time.Tick) - 2,
          unit: Time.Tick
        }),
        connections: new Connections( logic.id )
      });
      timerUnits.push(
        new Container({
          children: [
            timer,
            new Container({
              child: logic,
              pos: new Pos({
                z: 2
              })
            })
          ]
        })
      );
      prevTimerId = timer.id;
    }

    super({
      size: new Bounds({
        x: delays.length
      }),
      key,color,pos,rotate,
      children: timerUnits
    });
    this._timerId = prevTimerId;
    this._logicId = logicIds;
    this._outputs = outputs.reverse();
  }
  get startId(): Id { return this._logicId.add([ this._timerId ]) }
  getTimerId(i: number): Id {
    if (i < 0)
      i += this._logicId.ids.length; // emulate python wrap-around
    return new KeylessId(
      this._logicId.ids[this._logicId.ids.length - i - 1]
    );
  }
  getTimer(i: number): Logic { return this._outputs[i]; }
}