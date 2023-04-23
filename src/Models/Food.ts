import { CstWorld, CstWorldObjects } from '../Cst'
import WorldObject from './WorldObject'

export default class Food implements WorldObject {
  Type: string
  Name?: string
  Id: number
  WorldX: number
  WorldY: number
  Energy: number
  Exist: boolean

  constructor(x: number, y: number, id: number, energy = CstWorld.Food.Energy) {
    this.Type = CstWorldObjects.Food
    this.Id = id
    this.Exist = true
    this.WorldX = x
    this.WorldY = y
    this.Energy = energy
  }

  Eat() {
    this.Exist = false
    this.Energy = 0
  }
}