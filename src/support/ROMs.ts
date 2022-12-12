import { MappedROMFrame, RawROMFrame, ROMFrame, StringROMFrame } from "./frames/classes";

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
        map: { "default": 0b00, "signs": 0b01, "shop": 0b10, "key": 0b11 }
      }
  ],
    jsonData: [
      { doors: 0b0011, locked: 0b01, flavor: 0b11 }, // doesn't actually impact map, just provides system setup; 0b00,110,111 (exit @ 110,111 -> x=3,y=7)
      { doors: 0b0011 },
      { doors: 0b0011 },
      { doors: 0b1010, locked: "down" },
      { doors: 0b0001 },
      { doors: 0b0011, flavor: "key" },
      { doors: 0b1010, locked: "down" },
      { doors: 0b1000, locked: "down" },

      { doors: 0b1101, locked: "left" },
      { doors: 0b1110, locked: "right" },
      { doors: 0b1000, locked: "down" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b1001, locked: "down" },
      { doors: 0b0011 },
      { doors: 0b0111 },
      { doors: 0b1110, locked: "right" },

      { doors: 0b1100, locked: "right" },
      { doors: 0b1101, locked: "left" },
      { doors: 0b1110, locked: "right" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b1101, locked: "left" },
      { doors: 0b1011, locked: "right" },
      { doors: 0b1010, locked: "left" },
      { doors: 0b0100, flavor: "key" },

      { doors: 0b1100, locked: "right" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b0100 },
      { doors: 0b0100, flavor: "key" },
      { doors: 0b0100 },
      { doors: 0b1100},
      { doors: 0b0101 },
      { doors: 0b1010, locked: "right" },

      { doors: 0b1100, locked: "right"},
      { doors: 0b0101 },
      { doors: 0b0011 },
      { doors: 0b0011 },
      { doors: 0b1110, locked: "down" },
      { doors: 0b1100, locked: "down"},
      { doors: 0b1001, locked: "down" },
      { doors: 0b1110, locked: "right" },
      
      { doors: 0b1101, locked: "left" },
      { doors: 0b1010, locked: "right" },
      { doors: 0b1001, locked: "left" },
      { doors: 0b0011 },
      { doors: 0b0110 },
      { doors: 0b1100, locked: "right" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b0100, flavor: "key" },
      
      { doors: 0b1100, locked: "right" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b1100, locked: "right" },
      { doors: 0b1001, locked: "down" },
      { doors: 0b0011 },
      { doors: 0b0110 },
      { doors: 0b1101, locked: "left" },
      { doors: 0b0010 },

      { doors: 0b0101 },
      { doors: 0b0111 },
      { doors: 0b0110 },
      { doors: 0b1100, locked: "right" },
      { doors: 0b0001 },
      { doors: 0b0011 },
      { doors: 0b0111 },
      { doors: 0b0010 }
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