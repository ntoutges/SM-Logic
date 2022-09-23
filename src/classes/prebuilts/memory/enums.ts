export enum BitIdentifiers {
  Set = "set",
  Reset = "reset",
  Output = "out",
  Not = "not",
  Buffer = "buffer"
}

export enum ByteIdentifiers {
  Bit0 = "1",
  Bit1 = "2",
  Bit2 = "4",
  Bit3 = "8",
  Bit4 = "16",
  Bit5 = "32",
  Bit6 = "64",
  Bit7 = "128"
}

export function combineIds(...ids: Array<string>): string {
  let output = ""
  for (let id of ids) {
    output += id + ",";
  }
  return output.substring(0, output.length-1); // remove trailing ","
}