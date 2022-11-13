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

export enum RowIdentifier {
  Byte0 = "0",
  Byte1 = "1",
  Byte2 = "2",
  Byte3 = "3",
  Byte4 = "4",
  Byte5 = "5",
  Byte6 = "6",
  Byte7 = "7"
}

export enum CompareIdentifiers {
  Output = "out",
  NotOutput = "nOut",
  BufferIn = "bIn",
  NotIn = "nIn"
}

export enum MemoryIdentifiers {
  Set = "set",
  Set1 = "set1", // only set bottom row
  Reset = "reset",
  Row = "row",
  Selector = "selector",
  Getter = "getter"
}

export function combineIds(...ids: Array<string>): string {
  let output = ""
  for (let id of ids) {
    output += id + ",";
  }
  return output.substring(0, output.length-1); // remove trailing ","
}