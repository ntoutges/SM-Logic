import { Color } from "../../../support/colors/classes"
import { BasicKey, KeyMap } from "../../../support/context/classes"
import { Delay, Delays, MultiConnections } from "../../../support/logic/classes"
import { Pos, Rotate } from "../../../support/spatial/classes"

export interface DelayUnitInterface {
  key: BasicKey,
  delays: Delays
  pos?: Pos,
  rotate?: Rotate,
  color?: Color,
  connections?: MultiConnections
}

export interface ScaleableDelaysInterface {
  delay: Delay,
  amount: number
}