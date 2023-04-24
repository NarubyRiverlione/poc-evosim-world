import { CstWorldObjects } from '../Cst'
import WorldObject from './WorldObject'

export default class Food extends WorldObject {

  constructor(x: number, y: number, id: number, energy: number) {
    super()
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