import { CstWorld, CstWorldObjects } from '../Cst'
import { IMovement } from '../Interfaces/IMovement'
import Wandering from './Wandering'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Animal extends WorldObject {
  Movement: IMovement

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Animal, true)
    // default behavior is start wandering
    this.Movement = new Wandering(CstWorld.Animal.RandomSteps)
  }


  Thick() {
    this.Movement.NewLocation(this)
    this.Energy -= CstWorld.Animal.MoveEnergy
    super.Thick()
  }

  Eat(addEnergy: number) {
    this.Energy += addEnergy
  }
}