import { CstWorld, CstWorldObjects } from '../Cst'
import Wandering from './Wandering'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Animal extends WorldObject {
  WanderingSteps: Wandering | null

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Animal)
    this.WanderingSteps = null
  }


  StartWandering() {
    this.WanderingSteps = new Wandering(CstWorld.Animal.RandomSteps)
  }
  StopWandering() {
    this.WanderingSteps = null
  }

}