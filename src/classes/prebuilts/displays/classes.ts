import { Container, Grid, Unit } from "../../../containers/classes";
import { BasicKey, CustomKey, Id, Identifier, Key, KeylessFutureId, KeylessId, KeyMap, UniqueCustomKey } from "../../../support/context/classes";
import { combineIds } from "../../../support/context/enums";
import { Frame, Frames, PhysicalFrame } from "../../../support/frames/classes";
import { BitMask, Connections, Delay, MultiConnections, Operation, ScaleableDelays, VBitMask } from "../../../support/logic/classes";
import { LogicalOperation, Time } from "../../../support/logic/enums";
import { MultiConnectionsType } from "../../../support/logic/interfaces";
import { Bounds, Bounds2d, Pos, Rotate } from "../../../support/spatial/classes";
import { BasicLogic, Block, Logic, Timer } from "../../blocks/basics";
import { DelayUnit } from "../delays/classes";
import { CharacterFrames, Characters, NumToString } from "./enums";
import { BitMapInterface, CharacterDisplayInterface, FutureBitMapInterface, SevenSegmentInterface, SimpleBitMapInterface, VideoDisplayInterface } from "./interfaces";

export class FutureBitMap extends Grid {
  constructor({
    key,
    size,
    pos,
    rotate,
    color,
    bitKeys = new KeyMap()
  }: FutureBitMapInterface) {
    let screen: Array<Logic> = [];
    for (let z = 0; z < size.y; z++) {
      for (let x = 0; x < size.x; x++) {
        const identifierString = combineIds(x.toString(),z.toString());
        screen.push(
          new Logic({
            key: bitKeys.ids.has(identifierString) ? bitKeys.ids.get(identifierString) : key,
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
    const newFrame = frame.resize(
      new Bounds2d({
        x: this.width,
        y: this.height
      })
    );
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
              ) as BasicLogic
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
    color,
    bitKeys = new KeyMap()
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
        const identifierString = combineIds(x.toString(),z.toString());
        if (bitKeys.ids.has(identifierString))
          bitKeys.ids.set(identifierString, blockKey);

        for (let i in frames.frames) {
          if (frames.frames[i].rows[z].mask[x])
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
    return this._physicalFrames[i].id;
  }
}

export class SimpleBitMap extends BitMap {
  constructor({
    key,
    frame,
    color,
    pos,
    rotate,
    bitKeys
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
      rotate,
      bitKeys
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
    rotate,
    bitKeys
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
      rotate,
      bitKeys
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
  // constructor({
  //   key,
  //   color,
  //   pos,
  //   rotate,
  //   bitKeys
  // }: SevenSegmentInterface) {
  //   super({ key,color,pos,rotate,bitKeys });
  // }
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
    rotate,
    bitKeys
  }: CharacterDisplayInterface) {
    super({
      key,color,pos,rotate,bitKeys,
      size: new Bounds2d({
        x: 5,
        y: 7
      })
    })
  }
  getCharacter(char: Characters | string): Id {
    if (typeof char == "string") {
      return this.getCharacter(
        (isNaN(parseInt(char)))
          ? (Characters[char] == undefined)
            ? Characters.Undefined
            : Characters[char]
          : Characters[NumToString[char]]
      )
    }
    return this.getFrameId(
      CharacterFrames[char]
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
      bitKeys: new KeyMap( keys ),
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
