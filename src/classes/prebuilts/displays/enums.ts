import { Frame, VBitMask } from "../../../support/logic/classes";

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

export const CharacterFrames = [
  new Frame({
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
    value: [
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||||"),
      new VBitMask("    |"),
      new VBitMask("    |"),
      new VBitMask("    |")
    ]
  }),
  new Frame({
    width: 5,
    height: 7,
    value: [
      new VBitMask("|||||"),
      new VBitMask("|    "),
      new VBitMask("|    "),
      new VBitMask("|||| "),
      new VBitMask("    |"),
      new VBitMask("    |"),
      new VBitMask("||||")
    ]
  }),
  new Frame({
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
    value: [
      new VBitMask(" ||| "),
      new VBitMask("|   |"),
      new VBitMask("|   |"),
      new VBitMask(" ||||"),
      new VBitMask("    |"),
      new VBitMask("    |"),
      new VBitMask(" |||")
    ]
  }),
  new Frame({
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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
    width: 5,
    height: 7,
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