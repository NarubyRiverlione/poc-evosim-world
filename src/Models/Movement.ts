import { IMovement } from '../Interfaces/IMovement'
import { IWorldObject } from '../Interfaces/IWorldObject'

function randomDirection() { return Math.random() > 0.5 ? 1 : -1 }

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
    this.IsWandering = true
    this.StartWandering()
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
    this.WanderingStepsToMake = -1
  }

  NewLocation(worldObject: IWorldObject) {
    // is wandering and StepsToMake done, new wandering direction
    if (this.IsWandering && this.WanderingStepsToMake === 0) {
      this.StartWandering()
    }

    worldObject.WorldX += this.DirectionX
    worldObject.WorldY += this.DirectionY
    this.WanderingStepsToMake -= 1
  }

  DirectionToGoal(currentX: number, currentY: number, goalX: number, goalY: number) {
    // move to goal = no wandering
    this.IsWandering = false
    // at goal : stop movement
    // TODO can goal ever be reached with collision detection ?
    if (currentX === goalX && currentY === goalY) {
      this.Stop()
      // TODO restart wandering now goal is reached ?
      // this.IsWandering = true
      return
    }

    this.DirectionX = goalX > currentX ? +1 : -1
    this.DirectionY = goalY > currentY ? +1 : -1

  }
}

