import WorldObject from './WorldObject'

export default class Wandering {
  DirectionX: number
  DirectionY: number
  StepsToMake: number
  MaxSteps: number

  constructor(maxSteps: number) {
    this.DirectionX = Math.floor(Math.random() * 2) - 1
    this.DirectionY = Math.floor(Math.random() * 2) - 1
    this.StepsToMake = Math.floor(Math.random() * maxSteps) + 1
    this.MaxSteps = maxSteps
  }


  NewLocation(worldObject: WorldObject) {
    // step done, new direction
    // TODO dry new wandering vs constructor
    if (this.StepsToMake === 0) {
      this.DirectionX = Math.floor(Math.random() * 2) - 1
      this.DirectionY = Math.floor(Math.random() * 2) - 1
      // new wandering has to be minimal 2 steps as there will be immediately 1 used
      this.StepsToMake = Math.floor(Math.random() * this.MaxSteps) + 2
    }

    worldObject.WorldX += this.DirectionX
    worldObject.WorldY += this.DirectionY
    this.StepsToMake -= 1
  }
}

