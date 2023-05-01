import { IWorldObject } from './IWorldObject'

export interface IMovement {
  DirectionX: number;
  DirectionY: number;
  WanderingStepsToMake: number;
  IsWandering: boolean

  StartWandering: () => void
  Stop: () => void
  NewLocation: (worldObject: IWorldObject) => void
  DirectionToGoal: (currentX: number, currentY: number, goalX: number, goalY: number) => void
}
