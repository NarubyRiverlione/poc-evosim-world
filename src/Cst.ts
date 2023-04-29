import { WorldObjectTypes } from './Models/WorldObject'

export const CstWorld = {
  Size: { X: 20, Y: 30 },
  StartAmount: {
    [WorldObjectTypes.Food]: 10,
    [WorldObjectTypes.Animal]: 1,
    [WorldObjectTypes.Water]: 0,
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

  Animal: {
    RandomSteps: 3,
    MoveEnergy: 1, SeeRange: 4,
  },
}


export const CstWorldTerrain = {
  Empty: '0',
  Water: '1',
  Mountain: '2',
}