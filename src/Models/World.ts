import { CstWorld, CstWorldObjects, CstWorldTerrain } from '../Cst'
import { IWorldObject } from '../Interfaces/IWorldObject'
import Animal from './Animal'
import Food from './Food'
import WorldObject from './WorldObject'


export default class World {
  private _Grid: string[]                    // grid of passable terrain
  private _Places: (WorldObject | null)[][]  // potential content of a terrain
  private _Items: WorldObject[]              // all world objects ever in existence in the world
  SizeX: number
  SizeY: number

  constructor(sizeX: number, sizeY: number) {
    if (sizeX <= 0) throw new Error('Invalid size for X when creating world')
    if (sizeY <= 0) throw new Error('Invalid size for Y when creating world')
    this.SizeX = sizeX
    this.SizeY = sizeY

    this._Items = []

    this._Grid = []

    this._Places = []
    this.initWorld()
  }

  // create empty places
  private initWorld() {
    for (let y = 0; y < this.SizeY; y++) {
      const emptyPlaceRow: null[] = []
      for (let x = 0; x < this.SizeX; x++) {
        emptyPlaceRow.push(null)
      }
      this._Places.push(emptyPlaceRow)
    }
  }
  // create movable grid for pathfinding
  private _createGrid() {
    this._Grid = []
    for (let y = 0; y < this.SizeY; y++) {
      let terrainRow = ''
      for (let x = 0; x < this.SizeX; x++) {
        const isOccupied = this._Places[y][x]?.Exist ? '1' : '0'
        terrainRow = `${terrainRow}${isOccupied},`
      }
      terrainRow = terrainRow.substring(0, terrainRow.length - 1) // remove last ','
      this._Grid.push(terrainRow)
    }

  }
  // add terrain types as world objects
  SeedTerrain() {
    for (let addWater = 0; addWater < CstWorld.Size.AmountWater; addWater++) {
      const { x, y } = this.RandomCoord()
      const water = new WorldObject({ WorldX: x, WorldY: y, Id: addWater }, CstWorldTerrain.Water)
      this.AddObject(x, y, water)
    }
    for (let addMountain = 0; addMountain < CstWorld.Size.AmountMountains; addMountain++) {
      const { x, y } = this.RandomCoord()
      const mountain = new WorldObject({ WorldX: x, WorldY: y, Id: addMountain }, CstWorldTerrain.Mountain)
      this.AddObject(x, y, mountain)
    }
  }

  GetPlace(x: number, y: number) {
    try {
      return this._Places[y][x]
    } catch (ex) {
      const fout = ex as Error
      throw new Error(`Error GetPlace (${x}/${y}), World size:${this.SizeX / this.SizeY}. \n ${fout.message} `)
    }
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
  Guard(x: number, y: number) {
    let checkedX = x
    let checkedY = y
    if (x < 0) checkedX = 0
    if (y < 0) checkedY = 0
    if (x > this.SizeX - 1) checkedX = this.SizeX - 1
    if (y > this.SizeY - 1) checkedY = this.SizeY - 1

    return { checkedX, checkedY }
  }

  Thick() {
    this._createGrid()
    // Thick all existing WorldObjects
    this._Items.forEach(worldObject => {
      // doesn't exist any more --> no need for thick
      if (worldObject.Exist) {
        const { WorldX: orgX, WorldY: orgY } = worldObject

        worldObject.Thick()

        // check & execute movement
        if (worldObject.IsMoveable) {
          // TODO generic type of moveable object instead of animal ?
          const animal = worldObject as Animal
          // don't move of the world
          const { checkedX, checkedY } = this.Guard(worldObject.WorldX, worldObject.WorldY)
          worldObject.WorldX = checkedX; worldObject.WorldY = checkedY

          // Collision detected 
          // ==> don't move into occupied place, stay in previous place & stop movement
          // ==> check if collision is with Food --> eat food
          const occupied = this._Places[checkedY][checkedX]
          if (occupied) { this.collisionDetected(occupied, animal, orgX, orgY) }

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

  private collisionDetected(occupied: IWorldObject, animal: Animal, orgX: number, orgY: number) {
    // cancel move
    animal.WorldX = orgX
    animal.WorldY = orgY
    animal.Movement.Stop()

    // collision with Food --> eat food (add energy, remove this food, add new food)
    if (occupied.Type === CstWorldObjects.Food) {
      const food = occupied as Food
      animal.Eat(food.Energy)
      food.Eaten()
      // remove food immediately, not in next thick
      this._Places[occupied.WorldY][occupied.WorldX] = null
      //  add new food 
      const { x, y } = this.RandomCoord()
      const newFood = new Food({
        WorldX: x, WorldY: y, Id: this._Items.length,
        Energy: CstWorld.Food.Energy,
      })
      this.AddObject(x, y, newFood)
    }
  }



}
