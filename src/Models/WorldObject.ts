interface IWorldObject {
  Type: string,
  WorldX: number,
  WorldY: number
  Id: number,
  Name?: string,
  Exist: boolean
}


export default class WorldObject implements IWorldObject {
  Type: string
  WorldX: number
  WorldY: number
  Id: number
  Name?: string | undefined
  Exist: boolean

  constructor() {
    this.Type = ''
    this.Id = -1
    this.Exist = false
    this.WorldX = -1
    this.WorldY = -1
  }
}