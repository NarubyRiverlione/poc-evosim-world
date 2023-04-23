import WorldObject from './WorldObject'

export default class Wandering {
  DirectionX: number
  DirectionY: number
  Steps: number
  MaxSteps: number

  constructor(maxSteps: number) {
    this.DirectionX = Math.floor(Math.random() * 2) - 1
    this.DirectionY = Math.floor(Math.random() * 2) - 1
    this.Steps = Math.floor(Math.random() * maxSteps)
    this.MaxSteps = maxSteps
  }


  NewLocation(worldObject: WorldObject, energy: number) {
    // only if the is energy
    if (energy === 0) return
    // step done, new direction
    // TODO dry new wandering vs constructor
    if (this.Steps === 0) {
      this.DirectionX = Math.floor(Math.random() * 2) - 1
      this.DirectionY = Math.floor(Math.random() * 2) - 1
      this.Steps = Math.floor(Math.random() * this.MaxSteps)
    }

    worldObject.WorldX += this.DirectionX
    worldObject.WorldY += this.DirectionY
    this.Steps -= 1
  }
}

