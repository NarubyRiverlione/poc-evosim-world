import { CstWorld, CstWorldObjects, CstWorldTerrain } from '../Cst'
import Animal from './Animal'
import Food from './Food'
import WorldObject from './WorldObject'


export default class World {
  _Grid: string[]                    // grid of passable terrain
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
    // this.seedTerrain()
  }

  // create empty terrain and places
  private initWorld() {
    for (let y = 0; y < this.SizeY; y++) {
      // let emptyTerrainRow = ''
      const emptyPlaceRow: null[] = []
      for (let x = 0; x < this.SizeX; x++) {
        // emptyTerrainRow = emptyTerrainRow + CstWorldTerrain.Empty + ','
        emptyPlaceRow.push(null)
      }
      // emptyTerrainRow = emptyTerrainRow.substring(0, emptyTerrainRow.length - 1) // remove last ','
      // this._Grid.push(emptyTerrainRow)
      this._Places.push(emptyPlaceRow)
    }
  }

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

  // add a terrain type
  // TODO  expand seed in random direction and size
  // AddTerrain(x: number, y: number, terrainType: string) {
  //   const terrainRow = this._Grid[y]
  //   const terrainCols = terrainRow.split(',')
  //   terrainCols[x] = terrainType

  //   let updatedRow = ''
  //   terrainCols.forEach(col => updatedRow = updatedRow + col + ',')
  //   updatedRow = updatedRow.substring(0, updatedRow.length - 1) // remove last ','
  //   this._Grid[y] = updatedRow
  // }

  // GetTerrain(x: number, y: number) {
  //   try {
  //     const row = this._Grid[y]
  //     const tile = row.split(',')[x]
  //     return tile
  //   } catch (ex) {
  //     const fout = ex as Error
  //     throw new Error(`Error GetTerrain (${x}/${y}), World size:${this.SizeX / this.SizeY}. \n ${fout.message} `)
  //   }
  // }
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
