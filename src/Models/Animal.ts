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
  private _closestDistance: number
  private _parentId?: string

  constructor(startValues: WorldObjectStart, seeRange = CstAnimal.SeeRange, parentId?: string) {
    super(startValues, WorldObjectTypes.Animal, true)

    this.Movement = new Movement(CstAnimal.RandomSteps)
    this._seeRange = seeRange
    this._target = null
    this.Energy = startValues.Energy || CstWorld.StartEnergy[WorldObjectTypes.Animal]
    this._thirst = 0
    this._age = 0
    this._closestDistance = 0
    this._parentId = parentId
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
    this.DirectionToTarget()
    super.Thick()
  }

  get Parent() { return this._parentId }
  get Distance(): number {
    return parseFloat(this._closestDistance.toFixed(1))
  }

  Eat(addEnergy: number) {
    this.Energy += addEnergy
    this._target = null
  }
  Drink() {
    this._thirst = 0
    this._target = null
  }
  CreateOffspring(x: number, y: number, newId: number): Animal {
    // TODO mutation SeeRange
    const newSeeRange = this.SeeRange

    const offspring = new Animal({ WorldX: x, WorldY: y, Id: newId }, newSeeRange, this.Id)

    // remove energy from parent to prevent continues offspring creation
    this.Energy -= CstWorld.StartEnergy[WorldObjectTypes.Animal] * 2

    return offspring
  }

  DirectionToTarget() {
    if (this.Movement.IsWandering) {
      // console.debug('wandering, no direction to target')
      return
    }
    if (!this._target) {
      // console.debug('no target to determine direction, start wandering')
      this.Movement.StartWandering()
      return
    }

    this.Movement.DirectionToGoal(this.WorldX, this.WorldY, this._target.WorldX, this._target.WorldY)
  }

  ClosestTarget(targets: WorldObject[]) {
    // as long target exist, don't look for new one (prevent flip-flop)
    if (this._target && this._target?.Exist) return


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