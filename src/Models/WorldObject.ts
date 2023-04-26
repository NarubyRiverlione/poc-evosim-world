import { IWorldObject } from '../Interfaces/IWorldObject'

export type WorldObjectStart = {
  WorldX: number,
  WorldY: number
  Id: number,
  Energy?: number
}

export default class WorldObject implements IWorldObject {
  Type: string
  WorldX: number
  WorldY: number
  Id: string
  Name?: string | undefined
  Exist: boolean
  Energy: number
  IsMoveable: boolean

  constructor(startValues: WorldObjectStart, type: string, IsMoveable = false) {
    this.Type = type
    this.Id = type.substring(0, 1) + startValues.Id
    this.Exist = true
    this.WorldX = startValues.WorldX
    this.WorldY = startValues.WorldY
    this.IsMoveable = IsMoveable
    this.Energy = startValues.Energy || 1
  }

  Thick() {
    // Universal rule: no energy = not existing
    if (this.Energy <= 0) {
      this.Exist = false
      this.WorldX = -1
      this.WorldY = -1
      this.IsMoveable = false
    }
  }
}