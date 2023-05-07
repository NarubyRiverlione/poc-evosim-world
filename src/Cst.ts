import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 25, Y: 25 },
  StartAmount: {
    [WorldObjectTypes.Food]: 50,
    [WorldObjectTypes.Animal]: 10,
    [WorldObjectTypes.Water]: 0, // 8
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 0,
  },
  StartEnergy: {
<<<<<<< HEAD
    [WorldObjectTypes.Food]: 10,
    [WorldObjectTypes.Animal]: 20,
=======
    [WorldObjectTypes.Food]: 20,
    [WorldObjectTypes.Animal]: 25,
>>>>>>> 7ae2d06a153f03e22152522dec4db81d3b8dcb92
    [WorldObjectTypes.Water]: 0,
    [WorldObjectTypes.Mountain]: 0,
    [WorldObjectTypes.Test]: 100,
  },
}

export const CstAnimal = {
  RandomSteps: 5,
  MoveEnergy: 1, SeeRange: 6,
  MaxAge: 999999, ThirstThreshold: 999999,
  ThirstThick: 1, OffspringThresholdEnergy: 200,
}
