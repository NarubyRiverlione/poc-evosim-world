import { CstAnimal, CstWorld } from '../Cst'
import { IWorldObject } from '../Interfaces/IWorldObject'
import Animal from './Animal'
import Food from './Food'
import WorldObject, { WorldObjectTypes } from './WorldObject'

export function RandomCoord(maxX: number, maxY: number) {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY)
  return { x, y }
}

export default class World {
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

  private _addStartObjects(objectType: WorldObjectTypes) {
    const amount: number = CstWorld.StartAmount[objectType]
    for (let id = 0; id < amount; id++) {
      const { x, y } = this.RandomUnoccupiedCoord()
      let newWorldObject: WorldObject | null = null

      switch (objectType) {
        case WorldObjectTypes.Food:
          newWorldObject = new Food({ WorldX: x, WorldY: y, Id: id }); break

        case WorldObjectTypes.Animal:
          newWorldObject = new Animal({ WorldX: x, WorldY: y, Id: id }); break

        case WorldObjectTypes.Water:
        case WorldObjectTypes.Mountain:
          newWorldObject = new WorldObject({ WorldX: x, WorldY: y, Id: id }, objectType); break
      }

      /* istanbul ignore next */
      if (!newWorldObject) throw new Error('Could\'t create world object of type ' + objectType)

      this.AddObject(newWorldObject)
    }
  }

  Seed() {
    this._addStartObjects(WorldObjectTypes.Mountain)
    this._addStartObjects(WorldObjectTypes.Water)
    this._addStartObjects(WorldObjectTypes.Food)
    this._addStartObjects(WorldObjectTypes.Animal)
  }

  GetPlace(x: number, y: number) {
    try {
      return this._Places[y][x]
    } catch (ex) {
      const fout = ex as Error
      throw new Error(`Error GetPlace (${x}/${y}), World size:${this.SizeX / this.SizeY}. \n ${fout.message} `)
    }
  }

  AddObject(worldObject: WorldObject) {
    try {
      this._Places[worldObject.WorldY][worldObject.WorldX] = worldObject
      this._Items.push(worldObject)
    } catch (ex) {
      debugger
    }
  }
  RemoveObject(x: number, y: number) {
    this._Places[y][x] = null
    // keep not-existing world object in items array for history analyse
  }


  RandomUnoccupiedCoord(notX = 0, notY = 0) {
    const { x, y } = RandomCoord(this.SizeX, this.SizeY)
    // check for existing world object
    const checkOccupied = this._Places[y][x]
    if (checkOccupied && checkOccupied.Exist) this.RandomUnoccupiedCoord(notX, notY)
    // extra check : use case new food must not be at original place (animal has'nt moved yet)    
    if (x === notX && y === notY) this.RandomUnoccupiedCoord(notX, notY)
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
    // Thick all existing WorldObjects
    this._Items.forEach(worldObject => {
      // doesn't exist any more --> no need for thick
      if (worldObject.Exist) {
        const { WorldX: orgX, WorldY: orgY } = worldObject
        worldObject.Thick()
        // remove World object that has just stop existing in this thick 
        if (!worldObject.Exist) { this._Places[orgY][orgX] = null }

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
          if (occupied && occupied.Exist) { this.collisionDetected(occupied, animal, orgX, orgY) }

          //  remove previous location, add new location
          if (orgX != worldObject.WorldX || orgY != worldObject.WorldY) {
            this._Places[orgY][orgX] = null
            this._Places[worldObject.WorldY][worldObject.WorldX] = worldObject
          }

          // find closed food --> update direction for next Thick
          this.FindTarget(animal, WorldObjectTypes.Food)
          // only if thirst is above threshold, find water
          if (animal.Thirst > CstAnimal.ThirstThreshold) {
            this.FindTarget(animal, WorldObjectTypes.Water)
          }

          animal.DirectionToTarget()

          // offspring
          if (animal.Energy > CstAnimal.OffspringThresholdEnergy) {
            // new animal spawn at parent previous place
            //  (safe, unoccupied because parent came for that direction ?)    
            const newId = this._Items.filter(item => item.Type === WorldObjectTypes.Animal).length
            const offspring = animal.CreateOffspring(orgX, orgY, newId)
            this.AddObject(offspring)
          }
        }


        // if (worldObject.Energy !== undefined && worldObject.Energy <= 0) { 
        //   this._Places[orgY][orgX] = null }

      }
    })
  }

  FindTarget(animal: Animal, targetType: WorldObjectTypes) {
    const foundItems = this._Items.filter(item => item.Exist && item.Type === targetType)
    animal.ClosestTarget(foundItems)
  }
  AllExistingAnimals() {
    const animals = this._Items.filter(item => item.Exist && item.Type === WorldObjectTypes.Animal)
    return animals as Animal[]
  }
  get AnimalCount() {
    return this.AllExistingAnimals().length
  }

  private collisionDetected(occupied: IWorldObject, animal: Animal, orgX: number, orgY: number) {
    // cancel move
    animal.WorldX = orgX
    animal.WorldY = orgY
    // start wandering in the hope to move around the obstacle 
    animal.Movement.StartWandering()

    // collision with Food --> eat food (add energy, remove this food, add new food)
    if (occupied.Type === WorldObjectTypes.Food) {

      //      animal.Movement.Stop() // trigger new target next thick

      const food = occupied as Food
      animal.Eat(food.Energy)
      food.Eaten()
      // remove food immediately, not in next thick
      this._Places[occupied.WorldY][occupied.WorldX] = null
      //  add new food 
      const { x, y } = this.RandomUnoccupiedCoord(orgX, orgY)
      const newFood = new Food({ WorldX: x, WorldY: y, Id: this._Items.length })
      this.AddObject(newFood)
    }

    // collision with Water --> drink water, water stays
    if (occupied.Type === WorldObjectTypes.Water) {
      animal.Drink()
    }
  }

}