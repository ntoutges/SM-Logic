import { Id, Identifier } from "../context/classes";
import { Bounds2d } from "../spatial/classes";
import { BitMask, Connections, MultiConnections, Operation } from "./classes";
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
