import { CstWorld, CstWorldObjects } from '../Cst'
import { IMovement } from '../Interfaces/IMovement'
import Movement from './Movement'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Animal extends WorldObject {
  Movement: IMovement

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Animal, true)
    // default behavior is start wandering
    this.Movement = new Movement(CstWorld.Animal.RandomSteps)
  }


  Thick() {
    this.Movement.NewLocation(this)
    this.Energy -= CstWorld.Animal.MoveEnergy
    super.Thick()
  }

  Eat(addEnergy: number) {
    this.Energy += addEnergy
  }

  MoveToGoal(x: number, y: number) {
    this.Movement.DirectionToGoal(this.WorldX, this.WorldY, x, y)
  }
}