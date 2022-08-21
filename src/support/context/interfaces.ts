import { BasicKey } from "./classes";

export interface KeyInterface {
  startId?: number,
}

export interface CustomKeyInterface {
  key: BasicKey,
  identifier: string,
}