const Jimp = require("jimp");

import { CHARACTERS, Charsets, SPACING } from "./graphics";
import { Id } from "../context/classes";
import { BitMask, Operation, RawBitMask, VBitMask } from "../logic/classes";
import { LogicalOperation } from "../logic/enums";
import { Bounds2d, Pos2d } from "../spatial/classes";
import { Equatable } from "../support/classes";
import { AnimatedSpriteInterface, AutoFileFramesInterface, CharacterFrameInterface, CharactersFrameInterface, DataDumpInterface, FileFrameInterface, FileFramesInterface, FrameInterface, FramerInterface, FramesInterface, FullFrameInterface, MappedRomFrameInterface, PhysicalFrameInterface, RawROMFrameInterface, ROMFrameInterface, SpriteInterface, StringROMFrameInterface, VFrameInterface } from "./interface";
import { Color, ColorList, MonoRGB, RGB, RGBColor } from "../colors/classes";
import { DraggableIds } from "../../classes/shapeIds";
import { Layer, Layers, Material } from "../layers/classes";

export class Frame extends Equatable {
  private _size: Bounds2d;
  private _value: Array<BitMask>;
  public fallback: boolean
  constructor({
    size,
    value,
    fallback=false
  }: FrameInterface) {
    super(["_width","_height","_value"]);
    this._size = size;
    this._value = value;
    this.fallback = fallback;
    
    this.selfResize(this._size);
  }
  get rows(): Array<BitMask> { return this._value; }
  get height(): number { return this._size.y; }
  get width(): number { return this._size.x; }
  add(
    others: Frame | Frame[],
    combinatorFunction: Operation = new Operation(LogicalOperation.Or)
  ): Frame {
    let frames: Array<Frame>;;
    if (Array.isArray(others)) frames = others;
    else frames = [others];

    const frameData: Array<Array<boolean>> = [];
    for (const frame of frames) {
      for (let y in frame.rows) {
        if (frameData.length == +y) frameData.push([]);
        for (let x in frame.rows[y].mask) {
          const oldData = (frameData[y].length > +x) ? (frameData[y][x] ? 1 : 0) : -1;
          const newBit = frame.rows[y].mask[x];

          let combinedBit = false;
          if (oldData != -1) combinedBit = combinatorFunction.operate(newBit, oldData == 1);
          else combinedBit = combinatorFunction.operate(newBit);

          frameData[y][x] = combinedBit;
        }
      }
    }
    const height = frameData.length;
    let width = 1;

    const frameMasks: Array<BitMask> = [];
    for (let i in frameData) {
      const maskData = frameData[i];
      frameMasks.push(new BitMask(maskData));
      width  = Math.max(width, maskData.length);
    }

    return new Frame({
      value: frameMasks,
      size: new Bounds2d({
        x: width,
        y: height
      })
    });
  }
  private selfResize(size: Bounds2d): void { // modify this frame
    const value: Array<BitMask> = []
    for (let y = 0; y < size.y; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: size.x,
          fallback: this.fallback
        })
      );
    }
    this._value = value;
  }

  // changes the dimensions of the frame
  // acts as if each BitMask is independent, ie:
  //   12             120
  //   34 -> (3x3) -> 340
  //   56             560
  // where '0's are brand new data
  resize(size: Bounds2d): Frame { // return new modified frame
    const value: Array<BitMask> = []
    for (let y = 0; y < size.y; y++) {
      let thisMask = (this.rows.length > y) ? this.rows[y] : new BitMask([]);
      value.push(
        thisMask.extend({
          newLength: size.x,
          fallback: this.fallback
        })
      );
    }
    return new Frame({
      size,
      value: value
    });
  }
  shift(count: Pos2d): Frame {
    let y = count.y;
    if (y < 0)
      y = (count.y % this._value.length) + this._value.length;

    const value = [];
    for (let i in this._value) {
      value[i] = this._value[(+i + y) % this._value.length].shift(count.x);
    }

    return new Frame({
      size: this._size,
      value: value,
      fallback: this.fallback
    });
  }

  // changes the dimensions of the frame
  // acts as if each BitMask is connected to the previous BitMask, and changing the size of the
  // frame moves where the bitmasks are. eg:
  //   12             123
  //   34 -> (3x3) -> 456
  //   56             000
  // where '0's are brand new data
  remap(size: Bounds2d): Frame {
    let allBits: Array<boolean> = []; // create an array with all the bits to make resizing easier
    for (let bitmask of this.rows) {
      allBits = allBits.concat(bitmask.mask);
    }

    const bitmasks: Array<BitMask> = [];
    let i = 0;
    for (let address = 0; address < size.y; address++) {
      const maskData: Array<boolean> = [];
      for (let bitDepth = 0; bitDepth < size.x; bitDepth++) {
        maskData.push( i < allBits.length ? allBits[i] : false );
        i++;
      }
      bitmasks.push(new BitMask(maskData) );
    }

    return new Frame({
      size,
      value: bitmasks
    });
  }

  invert(): Frame {
    const bitmasks: Array<BitMask> = [];
    for (let bitmask of this._value) {
      bitmasks.push( bitmask.invert() );
    }

    return new Frame({
      size: this._size,
      value: bitmasks
    })
  }

  hFlip(): Frame {
    const bitmasks: Array<BitMask> = [];
    for (let bitmask of this._value) {
      bitmasks.push(bitmask.reverse());
    }
    return new Frame({
      size: this._size,
      value: bitmasks
    })
  }

  vFlip(): Frame {
    const bitmasks: Array<BitMask> = [];
    for (let i = this._value.length-1; i >= 0; i--) { bitmasks.push(this._value[i]); } // reverse list
    return new Frame({
      size: this._size,
      value: bitmasks
    });
  }

  hexDump({
    lineSize=0,
    chunkSize=4
  }: DataDumpInterface): Array<string> {
    const hexArr: Array<string> = [];
    for (let bitMask of this.rows) {
      hexArr.push(bitMask.hexDump());
    }

    if (lineSize > 0) {
      const data = hexArr.join(""); // ignore default spacing
      
      const lineLength = lineSize + Math.ceil(lineSize / chunkSize) - 1;
      const asciiLength = Math.ceil(lineLength / 2);
      for (let i = 0; i < data.length; i += lineSize) {
        const workingData = data.substring(i,i+lineSize);
        let printedData = "";
        let ascii = "|";
        for (let j = 0; j < workingData.length; j += chunkSize) { // separate data into readable chunks
          if (j != 0)
            printedData += " " // separates chunks from other chunks
          const chunk = workingData.substring(j, j+chunkSize);
          printedData += chunk;
        }
        for (let j = 0; j < workingData.length; j += 2) { // try to read ascii from data
          const chunk = workingData.substring(j, j+2);
          const numChunk = parseInt(chunk, 16);
          ascii += (numChunk >= 32 && numChunk <= 126) ? String.fromCharCode(numChunk) : "."
        }

        for (let j = printedData.length; j < lineLength; j++) { // right fill for ascii chart
          printedData += ((j+1) % (chunkSize+1)) == 0 ? " " : ".";
        }
        for (let j = ascii.length; j < asciiLength; j++) { ascii += "."; } // right fill for ascii chart wall
        ascii += "|"

        console.log(printedData + "  " + ascii)
      }
    }
    return hexArr;
  }

  // hex dump, but printing out the raw binary -- more useful on small scales 
  binDump({
    lineSize=0,
    chunkSize=8
  }: DataDumpInterface): Array<string> {
    const binArr: Array<string> = [];
    for (let bitMask of this.rows) {
      binArr.push(bitMask.binDump());
    }

    if (lineSize > 0) {
      const data = binArr.join("");

      const lineLength = lineSize + Math.ceil(lineSize / chunkSize) - 1;
      for (let i = 0; i < data.length; i += lineSize) {
        const workingData = data.substring(i, i+lineSize);
        let printedData = "";
        for (let j = 0; j < workingData.length; j += chunkSize) {
          if (j != 0)
            printedData += " ";
          printedData += workingData.substring(j, j+chunkSize);
        }
        for (let j = printedData.length; j < lineLength; j++) { // right fill for ascii chart
          printedData += ((j+1) % (chunkSize+1)) == 0 ? " " : ".";
        }

        console.log(printedData);
      }
    }

    return binArr;
  }
}

export class FullFrame extends Frame {
  constructor({
    size,
    fill=true
  }: FullFrameInterface) {
    const value: BitMask[] = [];
    
    for (let y = 0; y < size.y; y++) {
      const data: boolean[] = [];
      for (let x = 0; x < size.x; x++) { data.push(fill) }
      value.push( new BitMask(data) );
    }
    super({
      size,
      value
    })
  }
}

export class CharacterFrame extends Frame {
  constructor({
    char,
    charset=Charsets.OLDPC
  }: CharacterFrameInterface) {
    if (!(char in CHARACTERS[charset])) char = "unknown";
    const graphic: string[] = CHARACTERS[charset][char];
    const value: BitMask[] = [];
    
    for (let row of graphic) { value.push(new VBitMask(row)); }
    super({
      size: new Bounds2d({
        "x": SPACING[charset].x,
        "y": SPACING[charset].y
      }),
      value,
      fallback: false
    })
  }
}

export class CharactersFrame extends Frame {
  constructor({
    chars,
    charset=Charsets.OLDPC,
    size=null
  }: CharactersFrameInterface) {
    let minX = 1;
    let minY = 1;
    let line = [];
    const charArr: Array<Array<string>> = [];
    for (let char of chars) {
      if (char == "\n") {
        if (line.length > minX) minX = line.length;
        charArr.push(line);
        line = [];
        minY++;
      }
      else if (char in CHARACTERS[charset]) line.push(char);
      else line.push("unknown")
    }
    if (line.length > 0) {
      charArr.push(line);
      if (line.length > minX) minX = line.length;
    }

    if (size == null) size = new Bounds2d({ "x": minX, "y": minY });
    else if (size.x < minX) throw new Error(`String too long to fit inside ${size.x} columns`);
    else if (size.y < minY) throw new Error(`String too tall to fit inside ${size.y} rows`);

    const charData: BitMask[] = [];
    for (let y in charArr) {
      const charHeight = (+y == charArr.length-1) ? SPACING[charset].y : SPACING[charset].yS;
      for (let charY = 0; charY < charHeight; charY++) {
        let row = "";
        for (let x = 0; x < charArr[y].length; x++) {
          const charWidth = (+x == charArr[y].length-1) ? SPACING[charset].x : SPACING[charset].xS;
          const char: Array<string> = CHARACTERS[charset][charArr[y][x]];
          for (let charX = 0; charX < charWidth; charX++) {
            row += (charY < char.length && charX < char[charY].length) ? char[charY][charX] : " ";
          }
        }
        charData.push( new VBitMask(row) );
      }
    }

    super({
      size: new Bounds2d({
        "x": (size.x-1) * SPACING[charset].xS + SPACING[charset].x,
        "y": (size.y-1) * SPACING[charset].yS + SPACING[charset].y
      }),
      value: charData
    })
  }
}

export class VFrame extends Frame {
  constructor({
    data,
    offCharacter = " ",
    size = null
  }: VFrameInterface) {
    const value: Array<VBitMask> = [];
    const height = data.length; // get height
    let width = 1;
    for (let i in data) {
      width = Math.max(width, data[i].length); // get width
      
      let mask = new VBitMask(data[i], offCharacter);
      if (size != null && data[i].length != size.x)
        mask = mask.extend({ newLength: size.x });

      value.push(mask);
    }

    super({
      size: new Bounds2d({
        x: width,
        y: height
      }),
      value
    });
  }
}

export class PhysicalFrame extends Equatable {
  readonly frame: Frame;
  readonly id: Id;
  constructor({
    frame,
    id
  }: PhysicalFrameInterface) {
    super(["_frame", "_id"]);
    this.frame = frame;
    this.id = id;
  }
}

export class Frames extends Equatable {
  readonly frames: Array<Frame>;
  readonly width: number;
  readonly height: number;
  constructor({
    frames,
    size = null
  }: FramesInterface) {
    super(["_frames", "_width","_height"]);
    this.frames = frames;

    let maxHeight = 0;
    let maxWidth = 0;
    for (let i in frames) {
      maxHeight = Math.max(maxHeight, frames[i].height);
      maxWidth = Math.max(maxWidth, frames[i].width);
    }
    this.height = (size) ? size.y : maxHeight;
    this.width = (size) ? size.x: maxWidth;
    if (size == null)
      size = new Bounds2d({
        x: this.width,
        y: this.height
      });
    for (let i in frames) {
      frames[i] = frames[i].resize(size);
    }
  }
}

export class FrameSprite extends Frames {
  readonly spriteWidth: number;
  readonly spriteHeight: number;
  readonly spriteMovement: Bounds2d;
  readonly spriteStep: Bounds2d;
  constructor({
    frame,
    movement,
    step = new Bounds2d({})
  }: SpriteInterface) {
    const frames: Array<Frame> = []
    const size = new Bounds2d({
      x: frame.width + movement.x*step.x,
      y: frame.height + movement.y*step.y
    });

    const sizedFrame = frame.resize(size);
    for (let x = 0; x <= movement.x; x++) {
      for (let y = 0; y <= movement.y; y++) {
        frames.push(
          sizedFrame.shift(
            new Pos2d({
              x: x * step.x,
              y: -y * step.y
            })
          )
        );
      }
    }
    super({ frames, size });

    this.spriteWidth = frame.width;
    this.spriteHeight = frame.height;
    this.spriteMovement = movement;
    this.spriteStep = step;
  }
  getPosIndex(position: Pos2d): number {
    if (position.y > this.spriteMovement.y) throw new Error(`Invalid y position (${position.y} > ${this.spriteMovement.y})`);
    if (position.x > this.spriteMovement.x) throw new Error(`Invalid x position (${position.x} > ${this.spriteMovement.x})`);
    return position.y + position.x*(this.spriteMovement.y+1);
  }
  getPos(position: Pos2d): Frame {
    return this.frames[this.getPosIndex(position)];
  }
}

export class AnimatedFrameSprite extends Frames {
  readonly spriteWidth: number;
  readonly spriteHeight: number;
  readonly spriteMovement: Bounds2d;
  readonly spriteStep: Bounds2d;
  readonly animationCount: number
  constructor({
    frames,
    movement,
    step = new Bounds2d({})
  }: AnimatedSpriteInterface) {
    const allFrames: Array<Frame> = [];
    const size = new Bounds2d({
      x: frames.width + movement.x*step.x,
      y: frames.height + movement.y*step.y
    });

    for (let i in frames.frames) {
      const frame = frames.frames[i].resize(size);
      for (let x = 0; x <= movement.x; x++) {
        for (let y = 0; y <= movement.y; y++) {
          allFrames.push(
            frame.shift(
              new Pos2d({
                x: x * step.x,
                y: -y * step.y
              })
            )
          );
        }
      }
    }
    super({ size, frames: allFrames });
    this.spriteWidth = size.x;
    this.spriteHeight = size.y;
    this.spriteMovement = movement;
    this.spriteStep = step;
    this.animationCount = frames.frames.length;
  }
  getPosIndex(
    position: Pos2d,
    animation: number
  ) {
    if (position.y > this.spriteMovement.y) throw new Error(`Invalid y position (${position.y} > ${this.spriteMovement.y})`);
    if (position.x > this.spriteMovement.x) throw new Error(`Invalid x position (${position.x} > ${this.spriteMovement.x})`);
    if (animation >= this.animationCount) throw new Error(`Invalid animation index (${animation} >= ${this.frames.length})`)
    return position.y + position.x*(this.spriteMovement.y+1) + animation*(this.spriteMovement.y+1)*(this.spriteMovement.x+1);
  }
  getPos(
    position: Pos2d,
    animation: number
  ): Frame {
    return this.frames[this.getPosIndex(position, animation)];
  }
}

// ROM - Read Only Memory
// width indicates bit depth, height indicates different addresses
export class ROMFrame extends Frame {
  constructor({
    format,
    jsonData,
    depth = -1,
    reverseBits = false, // if true: will reverse data bits (based on format, 001 -> 100, 110, -> 001); if false: will do nothing
    reverseOrder = false // if true: will reverse order of data bits (based on format); if false: will do nothing
  }: ROMFrameInterface) {
    if (!Array.isArray(format))
      format = [format]; // convert [format] into an array
    if (!Array.isArray(jsonData))
      jsonData = [jsonData]; // convert [jsonData] into an array
    
    if (!reverseOrder)
      format.reverse();

    let totalLength = 0;
    for (let romFormat of format) {
      if (romFormat.bits < 1)
        throw new Error(`[format] cannot have ${romFormat.bits} bits (minimum of 1)`)
      totalLength += romFormat.bits;
    }

    if (depth != -1 && totalLength > depth)
      throw new Error(`depth (${depth}) too small for ${totalLength} bits`);
    if (depth == -1)
      depth = totalLength;

    const bitMasks: Array<BitMask> = [];
    for (let data of jsonData) {
      // individual packets of data
      let bitMaskData: number = 0; // theoretically safe up to 53 bits
      let localDepth = 0;
      for (let romFormat of format) {
        // retrieve information in the form of [format] from [data]
        if (romFormat.name in data) {
          if ((typeof data[romFormat.name]) != "number")
            throw new Error(`[data] values must be numbers, not ${typeof data[romFormat.name]}`);
          if (data[romFormat.name] >= 2**romFormat.bits)
            throw new Error(`[data] value too high. [format] specifies ${romFormat.bits} bits, giving a maximum value of ${2**romFormat.bits-1}`)

          let dataNumber = data[romFormat.name]
          if (reverseBits) {
            let dataStr = dataNumber.toString(2); // convert to binary
            for (let i = dataStr.length; i < romFormat.bits; i++) {
              dataStr = "0" + dataStr; // fill out with requisite placeholder '0's
            }
            dataNumber = parseInt(dataStr.split("").reverse().join(""), 2); // reverse string 
          }
          bitMaskData += dataNumber * (2**localDepth);
        }
        localDepth += romFormat.bits
      }

      const mask = new RawBitMask( bitMaskData );
      mask.alignLeft = false;

      bitMasks.push(
        mask.length == depth ? mask : mask.extend({ newLength: depth })
      );
    }

    super({
      size: new Bounds2d({
        x: depth,
        y: bitMasks.length
      }),
      value: bitMasks
    });
  }
}

// works best for creating ROM that must fit a specific format
export class MappedROMFrame extends ROMFrame {
  constructor({
    format,
    jsonData,
    depth = -1,
    reverseBits = false, // if true: will reverse data bits (based on format); if false: will do nothing
    reverseOrder = false // if true: will reverse order of data bits (based on format); if false: will do nothing
  }: MappedRomFrameInterface) {
    if (!Array.isArray(format))
      format = [format]; // convert [format] into an array
    if (!Array.isArray(jsonData))
      jsonData = [jsonData]; // convert [jsonData] into an array

    for (let data of jsonData) {
      for (let mappedFormat of format) {
        if (!( mappedFormat.name in data )) // value doesnt' exist, so don't try to convert
          continue;

        if ("map" in mappedFormat && (typeof data[mappedFormat.name] == "string")) {
          // data[mappedFormat.name]  // the input value
          // mappedFormat.map      // possible values and their conversions
          if (!(data[mappedFormat.name] in mappedFormat.map))
            throw new Error(`[${data[mappedFormat.map]} is not a valid value given the format of name ${mappedFormat.name}]`);
          data[mappedFormat.name] = mappedFormat.map[data[mappedFormat.name]]; // convert values via the map
        }
      }
    }

    super({ format,jsonData,depth,reverseBits,reverseOrder });
  }
}

// works best for entering raw numbers
export class RawROMFrame extends ROMFrame {
  constructor({
    data,
    depth=8
  }: RawROMFrameInterface) {
    const jsonData: Array<{data: number}> = [];
    for (let value of data) {
      jsonData.push({ "data": +value });
    }

    super({
      format: {
        bits: depth,
        name: "data"
      },
      jsonData,
      depth
    })
  }
}

// works best for encoding text (can only effectively store values 32-126)
export class StringROMFrame extends RawROMFrame {
  constructor({
    data
  }: StringROMFrameInterface) {
    const numData: Array<number> = [];
    for (let char of data) {
      numData.push(char.charCodeAt(0)); // convert string to ascii
    }

    super({
      data: numData,
      depth: 8
    })
  }
}

export class FileFrame extends Frame {
  constructor({
    imageData,
    activeRange = [0,127], // active on blacks by default,
    preview = false
  }: FileFrameInterface) {
    const size = new Bounds2d({
      x: imageData.bitmap.width,
      y: imageData.bitmap.height
    });

    let dashes = "";
    if (preview) {
      for (let i = 0; i < size.x; i++) { dashes += "--"; }
      console.log("+-" + dashes + "-+");
    }

    const bitmasks: Array<BitMask> = [];
    for (let y = 0; y < size.y; y++) {
      const bitmaskData: Array<boolean> = [];
      for (let x = 0; x < size.x; x++) {
        const raw = Jimp.intToRGBA(imageData.getPixelColor(x,y));

        const avg = ((raw.r + raw.g + raw.b) / 3) * (raw.a / 255)
        bitmaskData.push( avg >= activeRange[0] && avg <= activeRange[1] );
      }
      bitmasks.push(new BitMask(bitmaskData));
      if (preview) console.log("[ " + bitmaskData.join("").replace(/false/g, "  ").replace(/true/g, "||") + " ]")
    }
    if (preview) console.log("+-" + dashes + "-+");

    super({size: size, value: bitmasks});
  }
}

export class FileFrames extends Frames {
  private colors: ColorList;
  constructor({
    imageData,
    colors,
  }: FileFramesInterface) {
    const size = new Bounds2d({
      x: imageData.bitmap.width,
      y: imageData.bitmap.height
    });

    if (colors.isEmpty()) throw new Error("Must have at least one color in ColorList");

    const colorBitmasks: BitMask[][] = [];
    for (let i in colors.colors) { colorBitmasks[i] = []; } // initialze with empty arrays
    for (let y = size.y-1; y >= 0; y--) {
      const bitmaskData: boolean[][] = [];
      for (let i in colors.colors) { bitmaskData.push([]); } // initialize with empty arrays
      for (let x = size.x-1; x >= 0; x--) {
        const raw = Jimp.intToRGBA(imageData.getPixelColor(x,y));
        const rgb = new RGB({
          r: raw.r,
          g: raw.g,
          b: raw.b
        });
        let minDiffIndex = -1;
        let minDiff = 0;
        for (let i in colors.colors) {
          const difference = rgb.difference(colors.colors[i].rgb).greyscale();
          if (minDiffIndex == -1 || difference < minDiff) {
            minDiffIndex = +i;
            minDiff = difference;
          }
        }
        for (let i in colors.colors) { bitmaskData[i].push(+i == minDiffIndex) } // only set the closest color to a true
      }
      for (let i in colors.colors) {
        colorBitmasks[i].push( new BitMask(bitmaskData[i]) );
      }
    }

    const frames: Frame[] = [];
    for (let mask of colorBitmasks) {
      frames.push(
        new Frame({
          size,
          value: mask
        })
      );
    }

    super({
      frames,
      size
    });

    this.colors = colors;
  }

  genLayers(type:DraggableIds = DraggableIds.Concrete) {
    const layers = [];
    for (let i in this.colors.colors) {
      layers.push(
        new Layer({
          frame: this.frames[i],
          material: new Material({
            type,
            color: this.colors.colors[i]
          })
        })
      );
    }
    return new Layers({ layers });
  }
}

export class AutoFileFrames extends FileFrames {
  constructor({
    imageData,
    colorStep = new MonoRGB(64),
    greyscale = false
  }: AutoFileFramesInterface) {
    const size = new Bounds2d({
      x: imageData.bitmap.width,
      y: imageData.bitmap.height
    });
    
    // find all colors to use
    const rawColors: Color[] = [];
    const colorSet: Set<string> = new Set<string>();
    for (let y = size.y-1; y >= 0; y--) {
      for (let x = size.x-1; x >= 0; x--) {
        const raw = Jimp.intToRGBA(imageData.getPixelColor(x,y));
        let r: number;
        let g: number;
        let b: number;
        if (greyscale) {
          const avg = Math.min(Math.round((raw.r + raw.g + raw.b) / (colorStep.r * 3)) * colorStep.r, 255);
          [r,g,b] = [avg,avg,avg];
        }
        else {
          r = Math.min(Math.round(raw.r / colorStep.r) * colorStep.r, 255);
          g = Math.min(Math.round(raw.g / colorStep.g) * colorStep.g, 255);
          b = Math.min(Math.round(raw.b / colorStep.b) * colorStep.b, 255);
        }
        const color = new RGBColor({
          rgb: new RGB({ r,g,b })
        });
        if (!colorSet.has(color.hex)) {
          colorSet.add(color.hex);
          rawColors.push(color);
        }
      }
    }
    const colors = new ColorList({ colors: rawColors });

    super({
      imageData,
      colors
    })
  }
}

export function readFile(filename) {
  return Jimp.read(`_assets/${filename}`);
}
