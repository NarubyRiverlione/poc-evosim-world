import { WorldObjectTypes } from '../Models/WorldObject'

export interface IWorldObject {
  Type: WorldObjectTypes;
  WorldX: number;
  WorldY: number;
  Id: string;
  Exist: boolean;
  IsMoveable: boolean;
}
