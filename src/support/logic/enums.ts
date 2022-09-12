export enum LogicalType {
  And,
  Or,
  Xor,
  Nand,
  Nor,
  XNor,
}

export enum LogicalOperation {
  And,
  Or,
  Xor,
  Nand,
  Nor,
  XNor,
  Input,
  Output,
  Buffer,
  Not,
}

export enum Time {
  Tick = 1,
  Millisecond = 0.025,
  Second = 40,
  Minute = 2400
}