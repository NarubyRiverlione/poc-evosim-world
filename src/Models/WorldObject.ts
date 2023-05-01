import { IWorldObject } from '../Interfaces/IWorldObject'

export enum WorldObjectTypes {
  Food = 'F',
  Animal = 'A',
  Water = 'W',
  Mountain = 'M',
  Test = 'T',
}

export type WorldObjectStart = {
  WorldX: number,
  WorldY: number
  Id: number,
  Energy?: number
}

export default class WorldObject implements IWorldObject {
  Type: WorldObjectTypes
  WorldX: number
  WorldY: number
  Id: string
  Name?: string
  Exist: boolean
  Energy: number
  IsMoveable: boolean

  constructor(startValues: WorldObjectStart, type: WorldObjectTypes, IsMoveable = false) {
    this.Type = type
    this.Id = `${type}${startValues.Id}`
    this.Exist = true
    this.WorldX = startValues.WorldX
    this.WorldY = startValues.WorldY
    this.IsMoveable = IsMoveable
    this.Energy = startValues.Energy || 1
  }

  Thick() {
    // Universal rule: no energy left = not existing
    if (this.Energy !== undefined && this.Energy <= 0) {
      this.Exist = false
      // this.WorldX = -1
      // this.WorldY = -1
      this.IsMoveable = false
    }
  }
}