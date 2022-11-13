import { Identifier } from "../context/classes";
import { Bounds2d } from "../spatial/classes";
import { Connections, Frame, MultiConnections } from "./classes";
import { LogicalOperation, Time } from "./enums";

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

export interface SpriteInterface {
  frame: Frame,
  movement?: Bounds2d,
  step?: Bounds2d
}