import { CstWorldObjects } from '../Cst'
import WorldObject, { WorldObjectStart } from './WorldObject'

export default class Food extends WorldObject {

  constructor(startValues: WorldObjectStart) {
    super(startValues, CstWorldObjects.Food)

  }

  Eaten() {
    this.Energy = 0
  }

  Thick(): void {
    super.Thick()
  }
}