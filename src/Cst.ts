import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 25, Y: 25 },
  StartAmount: {
    [WorldObjectTypes.Food]: 20,
    [WorldObjectTypes.Animal]: 10,
    [WorldObjectTypes.Water]: 0, // 8
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 0,
  },
  StartEnergy: {
    [WorldObjectTypes.Food]: 15,
    [WorldObjectTypes.Animal]: 25,
    [WorldObjectTypes.Water]: 0,
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 100,
  },
}

export const CstAnimal = {
  RandomSteps: 5,
  MoveEnergy: 1, SeeRange: 7,
  MaxAge: 999, ThirstThreshold: 999999,
  ThirstThick: 1, OffspringThresholdEnergy: 100,
}
