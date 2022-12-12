import { Frame } from "../../../support/frames/classes";
import { VBitMask } from "../../../support/logic/classes";
import { Bounds2d } from "../../../support/spatial/classes";

export enum Characters {
  A=0,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  DollarSign,
  Set,
  Undefined,
}

const characterSize = new Bounds2d({ x:5,y:7 });
export const CharacterFrames = [
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|||||"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("||||"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|    "),
      new VBitMask("| |||"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|||||"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("|||  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|  | "),
      new VBitMask("| |  "),
      new VBitMask("||   "),
      new VBitMask("| |  "),
      new VBitMask("|  | "),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|| ||"),
      new VBitMask("| | |"),
      new VBitMask("| | |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("||  |"),
      new VBitMask("| | |"),
      new VBitMask("|  ||"),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|||| "),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|    ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|  | "),
      new VBitMask(" || |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|    "),
      new VBitMask(" ||| "),
      new VBitMask("    |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" | | "),
      new VBitMask(" | | "),
      new VBitMask("  |  "),
      new VBitMask("  |  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("| | |"),
      new VBitMask("| | |"),
      new VBitMask("|| ||"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" | | "),
      new VBitMask("  |  "),
      new VBitMask(" | | "),
      new VBitMask("|   |"),
      new VBitMask("|   |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" | | "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("    |"),
      new VBitMask("   | "),
      new VBitMask("  |  "),
      new VBitMask(" |   "),
      new VBitMask("|    "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|  ||"),
      new VBitMask("|  ||"),
      new VBitMask("| | |"),
      new VBitMask("||  |"),
      new VBitMask("||  |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("  |  "),
      new VBitMask(" ||  "),
      new VBitMask("| |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("  |  "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("   | "),
      new VBitMask("  |  "),
      new VBitMask(" |   "),
      new VBitMask("|||||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("    |"),
      new VBitMask("  || "),
      new VBitMask("    |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("   ||"),
      new VBitMask("  | |"),
      new VBitMask(" |  |"),
      new VBitMask("|||||"),
      new VBitMask("    |"),
      new VBitMask("    |"),
      new VBitMask("    |")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||| "),
      new VBitMask("    |"),
      new VBitMask("|   |"),
      new VBitMask(" |||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|    "),
      new VBitMask("|||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" |||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("|||||"),
      new VBitMask("    |"),
      new VBitMask("    |"),
      new VBitMask("   | "),
      new VBitMask("   | "),
      new VBitMask("  |  "),
      new VBitMask("  |  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||| ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||||"),
      new VBitMask("    |"),
      new VBitMask("|   |"),
      new VBitMask(" |||")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("  |  "),
      new VBitMask(" ||| "),
      new VBitMask("| |  "),
      new VBitMask(" ||| "),
      new VBitMask("  | |"),
      new VBitMask(" ||| "),
      new VBitMask("  |  ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask("     "),
      new VBitMask("  |  "),
      new VBitMask("   | "),
      new VBitMask("|||||"),
      new VBitMask("   | "),
      new VBitMask("  |  "),
      new VBitMask("     ")
    ]
  }),
  new Frame({
    size: characterSize,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("    |"),
      new VBitMask("  || "),
      new VBitMask("  |  "),
      new VBitMask("     "),
      new VBitMask("  |  ")
    ]
  }),
]

export const NumToString = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine"
]