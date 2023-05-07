import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 25, Y: 25 },
  StartAmount: {
    [WorldObjectTypes.Food]: 40,
    [WorldObjectTypes.Animal]: 10,
    [WorldObjectTypes.Water]: 10, // 8
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 0,
  },
  StartEnergy: {
    [WorldObjectTypes.Food]: 10,
    [WorldObjectTypes.Animal]: 20,
    [WorldObjectTypes.Water]: 0,
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 100,
  },
}

export const CstAnimal = {
  RandomSteps: 3,
  MoveEnergy: 1, SeeRange: 4,
  MaxAge: 999999, ThirstThreshold: 80,
  ThirstThick: 1, OffspringThresholdEnergy: 100,
}
