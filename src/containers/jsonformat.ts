import { DraggableIds, LogicIds, ShapeIds } from "../classes/shapeIds"

export type VectorType = {
  x: number
  y: number
  z: number
};

export type ControllerControllerType = {
  controllers: null | Array<{"id": number}>
  id: number
  joints: null
  playMode: 1 | 2
  timePerFrame: number
};

export type LogicControllerType = {
  active: boolean
  mode: number
  controllers: null | Array<{"id": number}>
  id: number
  joints: null
};

export type TimerControllerType = {
  active: boolean
  controllers: null | Array<{"id": number}>
  id: number
  joints: null
  seconds: number
  ticks: number
};

// export type PistonControllerType = {
//   active: boolean
//   controllers: null | number
//   id: number
//   joints: null
//   seconds: number
//   ticks: number
// };

export type SensorControllerType = {
  controllers: null | Array<{"id": number}>
  id: number
  audioEnabled: boolean
  buttonMode: boolean
  color: null | string
  colorMode: boolean
  joints: null
  range: number
};

export type LightControllerType = {
  color: string,
  coneAngle: number
  controllers: null | Array<{"id": number}>
  id: number
  joints: null
  luminance: number
};

export type SwitchControllerType = {
  active: boolean,
  controllers: null | Array<{"id": number}>
  id: number
  joints: null
};

export type UniControllerType = ControllerControllerType | LogicControllerType | TimerControllerType | SensorControllerType | LightControllerType | SwitchControllerType;



export type BlockType = {
  color: string
  pos: VectorType
  shapeId: string
  xaxis: number
  zaxis: number
};

export type DraggableType = {
  color: string
  pos: VectorType
  bounds: VectorType
  shapeId: string
  xaxis: number
  zaxis: number
};

export type LogicType = {
  color: string
  pos: VectorType
  shapeId: string
  xaxis: number
  zaxis: number
  controller: UniControllerType
};

export type UniBlockType = BlockType | DraggableType | LogicType;

export type ChildsType = {
  childs: Array<BlockType | DraggableType | LogicType>
}

export type ExportType = {
  bodies: Array<ChildsType>
  version: number
}

export function isBlockType(unknownType: UniBlockType): unknownType is BlockType {
  return !(isDraggableType(unknownType) || isLogicType(unknownType));
}

export function isDraggableType(unknownType: UniBlockType): unknownType is DraggableType {
  return "bounds" in unknownType
}

export function isLogicType(unknownType: UniBlockType): unknownType is LogicType {
  return "controller" in unknownType
}
