import { CstWorld, CstWorldObjects } from '../Cst'
import Animal from './Animal'
import Food from './Food'
import WorldObject from './WorldObject'


export default class World {
  private _Places: (WorldObject | null)[][]
  private _Items: WorldObject[]
  SizeX: number
  SizeY: number

  constructor(sizeX: number, sizeY: number) {
    if (sizeX <= 0) throw new Error('Invalid size for X when creating world')
    if (sizeY <= 0) throw new Error('Invalid size for Y when creating world')
    this.SizeX = sizeX
    this.SizeY = sizeY

    this._Places = []
    this.initPlaces()

    this._Items = []
  }

  initPlaces() {
    for (let y = 0; y < this.SizeY; y++) {
      const emptyRow: null[] = []
      for (let x = 0; x < this.SizeX; x++) {
        emptyRow.push(null)
      }
      this._Places.push(emptyRow)
    }
  }
  GetPlace(x: number, y: number) {
    return this._Places[y][x]
  }
  AddObject(x: number, y: number, worldObject: WorldObject) {
    this._Places[y][x] = worldObject
    this._Items.push(worldObject)
  }
  RemoveObject(x: number, y: number) {
    this._Places[y][x] = null
    // keep not-existing world object in items array for history analyse
  }
  RandomCoord() {
    const x = Math.floor(Math.random() * this.SizeX)
    const y = Math.floor(Math.random() * this.SizeY)
    return { x, y }
  }

  Thick() {
    // Thick all existing WorldObjects
    this._Items.forEach(worldObject => {
      // doesn't exist any more --> no need for thick
      if (worldObject.Exist) {
        const { WorldX: orgX, WorldY: orgY } = worldObject

        worldObject.Thick()

        // check & execute movement
        if (worldObject.IsMoveable) {
          // don't move of the world
          const { checkedX, checkedY } = this.Guard(worldObject.WorldX, worldObject.WorldY)
          worldObject.WorldX = checkedX; worldObject.WorldY = checkedY

          // Collision detection : don't move into occupied place, stay in previous place
          const occupied = this._Places[checkedY][checkedX]
          if (occupied) {
            worldObject.WorldX = orgX
            worldObject.WorldY = orgY
            // collision with Food --> eat food (add energy, remove food)
            if (occupied.Type === CstWorldObjects.Food) {
              const food = occupied as Food
              const animal = worldObject as Animal
              animal.Eat(food.Energy)
              food.Eaten()
              // remove food immediately, not in next thick
              this._Places[checkedY][checkedX] = null
              // TODO add new food ?
            }
          }
          //  remove previous location, add new location
          if (orgX != worldObject.WorldX || orgY != worldObject.WorldY) {
            this._Places[orgY][orgX] = null
            this._Places[worldObject.WorldY][worldObject.WorldX] = worldObject
          }
        }
        // remove World object without energy
        if (worldObject.Energy <= 0) { this._Places[orgY][orgX] = null }
      }
    })
  }

  Guard(x: number, y: number) {
    let checkedX = x
    let checkedY = y
    if (x < 0) checkedX = 0
    if (y < 0) checkedY = 0
    if (x > this.SizeX - 1) checkedX = this.SizeX - 1
    if (y > this.SizeY - 1) checkedY = this.SizeY - 1

    return { checkedX, checkedY }
  }


}
