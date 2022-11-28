import { MappedROMFrame } from "./logic/classes";

export const ROMs = {
  "RPG": new MappedROMFrame({
    format: [
      {
        name: "doors",
        bits: 4
      },
      {
        name: "locked",
        bits: 2,
        map: { "up": 0b10, "down": 0b01, "left": 0b10, "right": 0b11 }
      },
      {
        name: "flavor",
        bits: 2,
        map: { "default": 0b00 }
      }
  ],
    jsonData: [
      {
        doors: 0b0010 // this data is not actually a room, it just sets up the rest of the machine to work
      },
      {
        doors: 0b0011,
        flavor: 0b11
      },
      {
        doors: 0b1011,
        locked: 0b01,
        flavor: 0b01
      },
      {
        doors: 0b0010,
        flavor: 0b01
      },
      {},{},{},{},
      {
        doors: 0b0100,
        locked: 0b00
      },
      {
        doors: 0b1011
      },
      {
        doors: 0b0110
      },
      {}, {}, {}, {}, {},
      {
        doors: 0b1001
      },
      {
        doors: 0b0110
      },
      {}, {}, {}, {}, {}, {},
      {
        doors: 0b0100,
        locked: 0b11,
        flavor: 0b11
      }
    ],
    reverseOrder: true
  })
}