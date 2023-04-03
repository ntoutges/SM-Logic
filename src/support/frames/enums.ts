import { HexColor } from "../colors/classes";
import { Colors } from "../colors/enums";

export const ColorSets = {
  CGA: [
    [
      new HexColor("000000"), // black
      new HexColor("00AA00"),
      new HexColor("AA0000"),
      new HexColor("AA5500"),
    ],
    [
      new HexColor("000000"), // black
      new HexColor("55FF55"), // light green
      new HexColor("FF5555"), // light red
      new HexColor("AAAAAA"), // dark gray
    ],
    [
      new HexColor("000000"), // black
      new HexColor("00AAAA"), // cyan
      new HexColor("AA00AA"), // magenta
      new HexColor("AA5500"), // brown
    ],
    [
      new HexColor("000000"), // black
      new HexColor("55FFFF"), // light cyan
      new HexColor("FF55FF"), // light magenta
      new HexColor("FFFFFF"), // white
    ],
    [
      new HexColor("000000"), // black
      new HexColor("0000AA"), // blue
      new HexColor("00AA00"), // green
      new HexColor("00AAAA"), // cyan
      new HexColor("AA0000"), // red
      new HexColor("AA00AA"), // magenta
      new HexColor("AA5500"), // brown
      new HexColor("AAAAAA"), // light gray
      new HexColor("555555"), // dark gray
      new HexColor("5555FF"), // light blue
      new HexColor("55FF55"), // light green
      new HexColor("55FFFF"), // light cyan
      new HexColor("FF5555"), // light red
      new HexColor("FF55FF"), // light magenta
      new HexColor("FFFF55"), // yellow
      new HexColor("FFFFFF"), // white
    ],
  ]
}