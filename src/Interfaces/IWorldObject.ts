export interface IWorldObject {
  Type: string;
  WorldX: number;
  WorldY: number;
  Id: number;
  Name?: string;
  Exist: boolean;
  Energy: number;
  IsMoveable: boolean;
}
