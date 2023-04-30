import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 25, Y: 25 },
  StartAmount: {
    [WorldObjectTypes.Food]: 12,
    [WorldObjectTypes.Animal]: 3,
    [WorldObjectTypes.Water]: 5,
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
  MoveEnergy: 1, SeeRange: 4,
  MaxAge: 999, ThirstThreshold: 50,
  ThirstThick: 1,
}


export const CstWorldTerrain = {
  Empty: '0',
  Water: '1',
  Mountain: '2',
}