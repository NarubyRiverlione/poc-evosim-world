import { CstWorldObjects } from '../Cst'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Food extends WorldObject {

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Food)

  }

  Eat() {
    this.Energy = 0
  }
}