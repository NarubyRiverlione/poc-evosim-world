import { CstAnimal, CstWorld } from '../Cst'
import { IMovement } from '../Interfaces/IMovement'
import Movement, { distanceTo } from './Movement'
import WorldObject, { WorldObjectStart, WorldObjectTypes } from './WorldObject'


export function ThirstEnergyFactor(thirst: number, thirstThreshold: number) {
  return Math.round(thirst / (thirstThreshold * 2)) + 1
}


export default class Animal extends WorldObject {
  Movement: IMovement
  private _target: WorldObject | null
  private _seeRange: number
  private _thirst: number
  private _age: number
  private _closestDistance

  constructor(startValues: WorldObjectStart, seeRange = CstAnimal.SeeRange) {
    super(startValues, WorldObjectTypes.Animal, true)
    // default behavior is start wandering
    this.Movement = new Movement(CstAnimal.RandomSteps)
    this._seeRange = seeRange
    this._target = null
    this.Energy = startValues.Energy || CstWorld.StartEnergy[WorldObjectTypes.Animal]
    this._thirst = 0
    this._age = 0
    this._closestDistance = 0
  }

  get Age() { return this._age }
  get SeeRange() { return this._seeRange }
  get Thirst() { return this._thirst }
  get Target() { return this._target }

  Thick() {
    this._age += 1
    this.Movement.NewLocation(this)
    // thirst above threshold: movement cost more energy
    this.Energy -= CstAnimal.MoveEnergy * ThirstEnergyFactor(this.Thirst, CstAnimal.ThirstThreshold)
    this._thirst += CstAnimal.ThirstThick
    super.Thick()
  }

  get Distance(): number {
    return parseInt(this._closestDistance.toFixed(1))
  }

  Eat(addEnergy: number) {
    this.Energy += addEnergy
  }
  Drink() {
    this._thirst = 0
  }

  DirectionToTarget() {
    if (this.Movement.IsWandering) {
      // console.debug('wandering, no direction to target')
      return
    }
    if (!this._target) {
      // console.debug('no target to determine direction, start wandering')
      this.Movement.IsWandering = true
      return
    }

    this.Movement.DirectionToGoal(this.WorldX, this.WorldY, this._target.WorldX, this._target.WorldY)
  }

  ClosestTarget(targets: WorldObject[]) {
    this._closestDistance = 0
    this._target = null

    targets.forEach(target => {
      const distToTarget = distanceTo(this.WorldX, this.WorldY, target.WorldX, target.WorldY)
      // only if target is inside SeeRange
      if (distToTarget <= this._seeRange) {
        if (this._closestDistance === 0 || distToTarget < this._closestDistance) {
          this._closestDistance = distToTarget  // first target distance 
          this._target = target
          this.Movement.IsWandering = false // a target found, stop wandering
        }
      }
    })
  }
}