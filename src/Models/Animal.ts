import { CstWorld, CstWorldObjects } from '../Cst'
import Wandering from './Wandering'
import WorldObject from './WorldObject'

export default class Animal extends WorldObject {
  WanderingSteps: Wandering | null

  constructor(x: number, y: number) {
    super()
    this.Type = CstWorldObjects.Animal
    this.WorldX = x
    this.WorldY = y
    this.Energy = CstWorld.Animal.StartEnergy
    this.WanderingSteps = null
  }

  StartWandering() {
    this.WanderingSteps = new Wandering(CstWorld.Animal.RandomSteps)
  }
  StopWandering() {
    this.WanderingSteps = null
  }

}