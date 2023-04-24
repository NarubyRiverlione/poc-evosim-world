export interface IWorldObject {
  Type: string,
  WorldX: number,
  WorldY: number
  Id: number,
  Name?: string,
  Exist: boolean,
  Energy: number
}

export type WorldObjectStart = {
  WorldX: number,
  WorldY: number
  Id: number,
  Energy: number
}

export default class WorldObject implements IWorldObject {
  Type: string
  WorldX: number
  WorldY: number
  Id: number
  Name?: string | undefined
  Exist: boolean
  Energy: number

  constructor(startValues: WorldObjectStart, type: string) {
    this.Type = type
    this.Id = startValues.Id
    this.Exist = true
    this.WorldX = startValues.WorldX
    this.WorldY = startValues.WorldY
    this.Energy = startValues.Energy
  }

  Thick() {
    // Universal rule: no energy = not existing
    if (this.Energy <= 0) {
      this.Exist = false
      this.WorldX = -1
      this.WorldY = -1
    }
  }
}