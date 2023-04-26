import { IMovement } from '../Interfaces/IMovement'
import { IWorldObject } from '../Interfaces/IWorldObject'

function randomDirection() { return Math.random() > 0.5 ? 1 : -1 }

export default class Wandering implements IMovement {
  DirectionX: number
  DirectionY: number
  StepsToMake: number
  MaxSteps: number

  constructor(maxSteps: number) {
    this.DirectionX = 0
    this.DirectionY = 0
    this.StepsToMake = 0
    this.MaxSteps = maxSteps
    this.Start()
  }

  Start() {
    this.DirectionX = randomDirection()
    this.DirectionY = randomDirection()
    this.StepsToMake = Math.floor(Math.random() * this.MaxSteps) + 1
  }

  Stop() {
    this.DirectionX = 0
    this.DirectionY = 0
    this.StepsToMake = -1
  }

  NewLocation(worldObject: IWorldObject) {
    // StepsToMake done, new direction
    if (this.StepsToMake === 0) {
      this.Start()
    }

    worldObject.WorldX += this.DirectionX
    worldObject.WorldY += this.DirectionY
    this.StepsToMake -= 1
  }
}

