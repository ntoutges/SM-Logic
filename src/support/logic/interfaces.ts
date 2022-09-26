import { Identifier } from "../context/classes";
import { Connections, MultiConnections } from "./classes";
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