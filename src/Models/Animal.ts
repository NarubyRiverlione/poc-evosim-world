import { CstWorld, CstWorldObjects } from '../Cst'
import Wandering from './Wandering'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Animal extends WorldObject {
  WanderingSteps: Wandering

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Animal, true)
    this.WanderingSteps = new Wandering(CstWorld.Animal.RandomSteps)
  }


  Thick() {
    this.WanderingSteps.NewLocation(this)
    super.Thick()
  }
}