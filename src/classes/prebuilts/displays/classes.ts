import { Container, Grid, Unit } from "../../../containers/classes";
import { BasicKey, CustomKey, Id, Identifier, Key, KeylessFutureId, KeylessId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { combineIds } from "../../../support/context/enums";
import { CharFrame, Frame, Frames, PhysicalFrame } from "../../../support/frames/classes";
import { BitMask, Connections, Delay, MultiConnections, Operation, ScaleableDelays, VBitMask } from "../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../support/logic/enums";
import { MultiConnectionsType } from "../../../support/logic/interfaces";
import { Bounds, Bounds2d, Pos, Rotate } from "../../../support/spatial/classes";
import { BasicLogic, Block, Logic, Timer } from "../../blocks/basics";
import { DelayUnit } from "../delays/classes";
import { CharacterFrames, numberFrames, NumToString } from "./enums";
import { CHARACTERS, Charsets, SPACING } from "./graphics";
import { BitMapInterface, CharacterDisplayInterface, FutureBitMapInterface, SevenSegmentInterface, SimpleBitMapInterface, VideoDisplayInterface } from "./interfaces";

export class FutureBitMap extends Grid {
  constructor({
    key,
    size,
    pos,
    rotate,
    color,
  }: FutureBitMapInterface) {
    let screen: Array<Logic> = [];
    for (let z = 0; z < size.y; z++) {
      for (let x = 0; x < size.x; x++) {
        const identifierString = combineIds(x.toString(),z.toString());
        screen.push(
          new Logic({
            key,
            color: color,
            operation: new Operation( LogicalOperation.Screen )
          })
        );
      }
    }
    super({
      size: size.to3d({ yMap:"z" }),
      pos,
      rotate,
      color,
      children: screen
    });
    this._addProps(["_height","_width"]);
  }
  getFrameId(frame: Frame): Id {
    if (frame.width != this.width || frame.height != this.height) {
      frame = frame.resize(
        new Bounds2d({
          x: this.width,
          y: this.height
        })
      );
    }

    const newId = new KeylessFutureId();
    for (let z = 0; z < frame.rows.length; z++) {
      for (let x = 0; x < frame.rows[z].mask.length; x++) {
        if (frame.rows[z].mask[x]) {
          newId.addId(
            (
              this.getGridChild(
                new Pos({
                  x: x,
                  z: frame.rows.length-z-1
                })
              ) as BasicLogic
            ).id
          )
        }
      }
    }
    if (newId.isReady) return newId;
    return undefined; // a space character
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
          if (frames.frames[i].rows[frames.height-z-1].mask[x]) // reverses y
            enableIds[i].addId(blockKey.newId);
        }
        screen.push(
          new Logic({
            key: blockKey,
            color: color,
            operation: new Operation( LogicalOperation.Screen )
          })
        );
      }
    }
    super({
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
    if (i < 0 || i >= this._physicalFrames.length) throw new Error("Invalid id number");
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
    const frameSize = new Bounds2d({
      x: 3,
      y: 5
    });
    super({
      key,
      frames: new Frames({
        frames: [
          new Frame({
            size: frameSize,
            value: [
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([]),
              new BitMask([]),
              new BitMask([true,true,true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([true]),
              new BitMask([true]),
              new BitMask([true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([true]),
              new BitMask([true]),
              new BitMask([true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([false,false,true]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true])
            ]
          }),
          new Frame({
            size: frameSize,
            value: [
              new BitMask([]),
              new BitMask([]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true]),
              new BitMask([false,false,true])
            ]
          }),
        ],
        size: frameSize,
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

  getNumberId(num: number): KeylessFutureId {
    if (num >= numberFrames.length) throw new Error("Invalid number, must be in range [0,9]");
    let numControls = numberFrames[Math.floor(num)];
    const ids = new KeylessFutureId();
    for (var i = 7; i >= 0; i--) {
      if (numControls >= 2**i) {
        numControls -= 2**i;
        ids.addId(this.getEnableId(i));
      }
    }
    return ids;
  }
}

export class CharacterDisplay extends FutureBitMap {
  readonly charset: Charsets;
  constructor({
    key,
    color,
    pos,
    rotate,
    charset = Charsets.HP48
  }: CharacterDisplayInterface) {
    super({
      key,color,pos,rotate,
      size: new Bounds2d({
        x: SPACING[charset].x,
        y: SPACING[charset].y
      })
    });
    this.charset = charset;
  }
  getCharacter(char: string): Id {
    return this.getFrameId(
      new CharFrame({
        char: char,
        charset: this.charset
      })
    );
  }
}

export class VideoDisplay extends Container {
  _frameTime: Delay;
  readonly bitMap: BitMap
  readonly delayUnit: DelayUnit
  constructor({
    key,
    frames,
    frameTime = new Delay({ delay: 1, unit: Time.Tick }),
    color,
    pos,
    rotate,
  }: VideoDisplayInterface) {
    if (frameTime.getDelay(Time.Second) > 60)
      throw new Error("Too much delay per frame (max of 60 seconds)");

    const bitMap = new BitMap({
      key,frames
    });

    const keys = new Map<string,UniqueCustomKey>();
    const connections:Array<MultiConnectionsType> = [];
    for (let i = 0; i < frames.frames.length; i++) {
      keys.set(
        i.toString(),
        new UniqueCustomKey({
          identifier: i.toString(),
          key: key
        })
      );
      connections.push({
        conns: new Connections(bitMap.getEnableId(frames.frames.length-i-1)), // reverse the reversed order of frames (put frames back in the right order)
        id: new Identifier(i.toString())
      });
    }
    
    const delayUnit = new DelayUnit({
      key,
      delays: new ScaleableDelays({
        delay: frameTime,
        amount: frames.frames.length
      }),
      pos: new Pos({
        y: 1
      }),
      connections: new MultiConnections(connections)
    });
    delayUnit.compress();
    
    super({
      pos,rotate,color,
      children: [
        bitMap,
        delayUnit
      ]
    })
    
    this.bitMap = bitMap;
    this.delayUnit = delayUnit;

    this._frameTime = frameTime;
  }
}
