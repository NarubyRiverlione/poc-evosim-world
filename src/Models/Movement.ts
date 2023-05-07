import { IMovement } from '../Interfaces/IMovement'
import { IWorldObject } from '../Interfaces/IWorldObject'

function randomDirection() { return Math.random() > 0.5 ? 1 : -1 }

function directionTo(goal: number, current: number) {
  return goal === current ? 0 : goal > current ? +1 : -1
}


export function distanceTo(currentX: number, currentY: number, goalX: number, goalY: number) {
  const distX = Math.abs(goalX - currentX)
  const distY = Math.abs(goalY - currentY)
  const distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
  return distance
}

export default class Movement implements IMovement {
  DirectionX: number
  DirectionY: number
  WanderingStepsToMake: number
  WanderingMaxSteps: number
  IsWandering: boolean

  constructor(wanderingMaxSteps = 0) {
    this.DirectionX = 0
    this.DirectionY = 0
    this.WanderingStepsToMake = 0
    this.WanderingMaxSteps = wanderingMaxSteps
    this.IsWandering = false
    // this.StartWandering()
  }

  StartWandering() {
    this.IsWandering = true
    this.DirectionX = randomDirection()
    this.DirectionY = randomDirection()
    this.WanderingStepsToMake = Math.floor(Math.random() * this.WanderingMaxSteps) + 1
  }

  Stop() {
    this.IsWandering = false
    this.DirectionX = 0
    this.DirectionY = 0
    this.WanderingStepsToMake = 0
  }

  NewLocation(worldObject: IWorldObject) {
    // is wandering and StepsToMake done,
    if (this.IsWandering && this.WanderingStepsToMake === 0) {
      this.StartWandering()
    }

    worldObject.WorldX += this.DirectionX
    worldObject.WorldY += this.DirectionY
    if (this.IsWandering) this.WanderingStepsToMake -= 1
  }

  DirectionToGoal(currentX: number, currentY: number, goalX: number, goalY: number) {
    //  actions after collision are done in World thick
    // this "above" other item should 'never' happen
    if (currentX === goalX && currentY === goalY) {
      this.StartWandering()
      return // stay this Thick at current place
    }

    this.DirectionX = directionTo(goalX, currentX)
    this.DirectionY = directionTo(goalY, currentY)

  }
}

