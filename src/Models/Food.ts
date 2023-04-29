import { CstWorld } from '../Cst'
import WorldObject, { WorldObjectStart, WorldObjectTypes } from './WorldObject'

export default class Food extends WorldObject {
  Energy: number
  constructor(startValues: WorldObjectStart) {
    super(startValues, WorldObjectTypes.Food)
    this.Energy = startValues.Energy || CstWorld.StartEnergy[WorldObjectTypes.Food]
  }

  Eaten() {
    this.Energy = 0
    // this.Exist = false
  }

  Thick(): void {
    super.Thick()
  }
}