import { LogicalOperation, Time } from "./enums";

export interface OperationInterface {
  operation?: LogicalOperation
}

export interface DelayInterface {
  delay: number,
  unit?: Time
}

export interface BitMaskExtendInterface {
  newLength: number,
  fallback?: boolean
}