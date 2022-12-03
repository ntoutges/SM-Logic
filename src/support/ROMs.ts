import { MappedROMFrame, RawROMFrame, ROMFrame, StringROMFrame } from "./logic/classes";

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
        locked: "down",
        flavor: 0b01
      },
      {
        doors: 0b0010,
        locked: "right",
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
        doors: 0b0010,
        locked: "down",
        flavor: 0b10
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
    ]
  }),
  "HW": [ // (H)ello (W)orld test ROMs
    new ROMFrame({
      format: {
        bits: 8,
        name: "c"
      },
      jsonData: [
        { c: 72 },
        { c: 101 },
        { c: 108 },
        { c: 108 },
        { c: 111 },
        { c: 44 },
        { c: 32 },
        { c: 87 },
        { c: 111 },
        { c: 114 },
        { c: 108 },
        { c: 100 },
        { c: 33 }
      ]
    }),
    new RawROMFrame({
      data: [ 72, 101, 108, 108, 111, 44,32, 87, 111, 114, 108, 100, 33 ]
    }),
    new StringROMFrame({
      data: "Hello, World!"
    })
  ]
}