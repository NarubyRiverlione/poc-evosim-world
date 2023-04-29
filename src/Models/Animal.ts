import { CstWorld } from '../Cst'
import { IMovement } from '../Interfaces/IMovement'
import Movement, { distanceTo } from './Movement'
import WorldObject, { WorldObjectStart, WorldObjectTypes } from './WorldObject'

export default class Animal extends WorldObject {
  Movement: IMovement
  SeeRange: number
  Target: WorldObject | null
  Energy: number
  private _closestDistance

  constructor(startValues: WorldObjectStart, seeRange = CstWorld.Animal.SeeRange) {
    super(startValues, WorldObjectTypes.Animal, true)
    // default behavior is start wandering
    this.Movement = new Movement(CstWorld.Animal.RandomSteps)
    this.SeeRange = seeRange
    this.Target = null
    this.Energy = startValues.Energy || CstWorld.StartEnergy[WorldObjectTypes.Animal]
    this._closestDistance = 0
  }


  Thick() {
    this.Movement.NewLocation(this)
    this.Energy -= CstWorld.Animal.MoveEnergy
    super.Thick()
  }

  get Distance() {
    return this._closestDistance.toFixed(1)
  }

  Eat(addEnergy: number) {
    this.Energy += addEnergy
  }

  DirectionToTarget() {
    if (this.Movement.IsWandering) {
      console.debug('wandering, no direction to target')
      return
    }
    if (!this.Target) {
      console.debug('no target to determine direction, start wandering')
      this.Movement.IsWandering = true
      // this.Movement.WanderingStepsToMake = 0
      return
    }

    this.Movement.DirectionToGoal(this.WorldX, this.WorldY, this.Target.WorldX, this.Target.WorldY)
  }

  ClosestTarget(targets: WorldObject[]) {
    this._closestDistance = 0
    this.Target = null

    targets.forEach(target => {
      const distToTarget = distanceTo(this.WorldX, this.WorldY, target.WorldX, target.WorldY)
      // only if target is inside SeeRange
      if (distToTarget <= this.SeeRange) {
        if (this._closestDistance === 0 || distToTarget < this._closestDistance) {
          this._closestDistance = distToTarget  // first target distance 
          this.Target = target
          this.Movement.IsWandering = false // a target found, stop wandering
        }
      }
    })
  }
}