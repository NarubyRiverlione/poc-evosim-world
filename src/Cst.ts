import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 30, Y: 30 },
  StartAmount: {
    [WorldObjectTypes.Food]: 20,
    [WorldObjectTypes.Animal]: 3,
    [WorldObjectTypes.Water]: 8,
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
  RandomSteps: 5,
  MoveEnergy: 1, SeeRange: 4,
  MaxAge: 999, ThirstThreshold: 50,
  ThirstThick: 1, OffspringThresholdEnergy: 100,
}
