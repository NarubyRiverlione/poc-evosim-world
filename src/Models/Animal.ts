import { CstWorld, CstWorldObjects } from '../Cst'
import Wandering from './Wandering'
import WorldObject from './WorldObject'

export default class Animal extends WorldObject {
  Energy: number
  Steps: Wandering | null

  constructor(x: number, y: number) {
    super()
    this.Type = CstWorldObjects.Animal
    this.WorldX = x
    this.WorldY = y
    this.Energy = CstWorld.Animal.StartEnergy
    this.Steps = null
  }

  StartWandering() {
    this.Steps = new Wandering(CstWorld.Animal.RandomSteps)
  }
  StopWandering() {
    this.Steps = null
  }

}