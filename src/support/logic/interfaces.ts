import { Id, Identifier } from "../context/classes";
import { Bounds2d } from "../spatial/classes";
import { BitMask, Connections, Frame, MultiConnections, Operation } from "./classes";
import { LogicalType, Time } from "./enums";

export interface DelayInterface {
  delay: number,
  unit?: Time
}

export interface BitMaskExtendInterface {
  newLength: number,
  fallback?: boolean
}

export interface MultiConnectionsType {
  conns: Connections | MultiConnections,
  id: Identifier
}

export interface MetaMultiConnectionsType {
  conns: MultiConnections,
  id: Identifier
}

export interface FrameInterface {
  size: Bounds2d,
  value: Array<BitMask>,
  fallback?: boolean
}

export interface dataDumpInterface {
  lineSize?: number,
  chunkSize?: number
}1

export interface VFrameInterface {
  data: Array<string>,
  offCharacter?: string,
  size?: Bounds2d
}

export interface FramerInterface {
  frames: Array<Frame>,
  combinatorFunction?: Operation
}

export interface FramesInterface {
  frames: Array<Frame>,
  size?: Bounds2d
}

export interface PhysicalFrameInterface {
  frame: Frame,
  id: Id
}

export interface SpriteInterface {
  frame: Frame,
  movement?: Bounds2d,
  step?: Bounds2d
}

export interface BasicROMFrameInterface {
  frame: Frame
}

export interface ROMFrameInterface {
  format: ROMFormat | Array<ROMFormat>,
  jsonData: any | Array<any>,
  depth?: number,
  reverseBits?: boolean,
  reverseOrder?: boolean
}

export interface MappedRomFrameInterface {
  format: MappedROMFormat | Array<MappedROMFormat>,
  jsonData: any, // { valueName: valueNumber, ... }
  depth?: number,
  reverseBits?: boolean,
  reverseOrder?: boolean
}

export interface ROMFormat {
  name: string,
  bits: number
}

export interface MappedROMFormat extends ROMFormat {
  map?: any // { namedValue: numberValue, ... }
}

export interface RawROMFrameInterface {
  data: Array<number> | string,
  depth?: number
}

export interface StringROMFrameInterface {
  data: string
}