import { IWorldObject } from './IWorldObject'

export interface IMovement {
  DirectionX: number;
  DirectionY: number;
  StepsToMake: number;

  NewLocation: (worldObject: IWorldObject) => void
}
