import { CstWorld } from '../src/Cst'
import Animal from '../src/Models/Animal'
import Food from '../src/Models/Food'
import World, { RandomCoord } from '../src/Models/World'
import WorldObject, { WorldObjectTypes } from '../src/Models/WorldObject'

let testSizeX: number = 0
let testSizeY: number = 0
let testWorld: World
describe('World', () => {
  beforeEach(() => {
    // random world with minimal size 20 so enough test objects can be placed
    const { x, y } = RandomCoord(100, 100)
    testSizeX = x + 20; testSizeY = y + 20
    testWorld = new World(testSizeX, testSizeY)
  })

  it('Get RandomCoord', () => {
    const { x, y } = RandomCoord(10, 10)
    expect(x).toBeLessThan(testSizeX)
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x).toBeLessThan(testSizeX)
    expect(y).toBeGreaterThanOrEqual(0)
  })

  describe('World init', () => {
    it('Init empty world', () => {
      const { SizeX, SizeY } = testWorld
      expect(SizeX).toBe(testSizeX)
      expect(SizeY).toBe(testSizeY)

      for (let y = 0; y < testSizeY; y++) {
        for (let x = 0; x < testSizeX; x++) {
          expect(testWorld.GetPlace(x, y)).toBeNull()
          // expect(testWorld.GetTerrain(x, y)).toBe(CstWorldTerrain.Empty)
        }
      }
    })
    it('test error get outbound places', () => {
      const x = testSizeX + 1
      const y = testSizeY
      try {
        testWorld.GetPlace(x, y)
      } catch (ex) {
        const fout = ex as Error
        const expectError = (`Error GetPlace (${x}/${y}), World size:${testSizeX / testSizeY}.`)
        expect(fout.message).toContain(expectError)
      }
    })
    it('Invalid world creating when size <= 0', () => {
      try {
        new World(0, 100)
      } catch (ex) {
        const fout = ex as Error
        expect(fout.message).toBe('Invalid size for X when creating world')
      }
      try {
        new World(-10, 100)
      } catch (ex) {
        const fout = ex as Error
        expect(fout.message).toBe('Invalid size for X when creating world')
      }

      try {
        new World(1000, 0)
      } catch (ex) {
        const fout = ex as Error
        expect(fout.message).toBe('Invalid size for Y when creating world')
      }
      try {
        new World(100, -10)
      } catch (ex) {
        const fout = ex as Error
        expect(fout.message).toBe('Invalid size for Y when creating world')
      }
    })
    it('Guard size below 0', () => {
      const { checkedX, checkedY } = testWorld.Guard(- 1, -1)
      expect(checkedX).toBe(0)
      expect(checkedY).toBe(0)
    })
    it('Guard size above world size', () => {
      const { checkedX, checkedY } = testWorld.Guard(testSizeX + 1, testSizeY + 1)
      expect(checkedX).toBe(testSizeX - 1)
      expect(checkedY).toBe(testSizeY - 1)
    })
  })

  // describe('World seed terrain', () => {
  // })

  describe('World add/remove objects', () => {
    it('Place World object', () => {
      const { x, y } = RandomCoord(testSizeX, testSizeY)
      const testWorldObject = new WorldObject({ WorldX: x, WorldY: y, Id: 1234, Energy: 100 }, WorldObjectTypes.Test)
      testWorld.AddObject(testWorldObject)
      expect(testWorld.GetPlace(x, y)).toEqual(testWorldObject)
    })
    it('Remove World object', () => {
      const { x, y } = RandomCoord(testSizeX, testSizeY)
      const testWorldObject = new WorldObject({ WorldX: x, WorldY: y, Id: 1234, Energy: 100 }, WorldObjectTypes.Test)
      testWorld.AddObject(testWorldObject)
      testWorld.RemoveObject(x, y)

      expect(testWorld.GetPlace(x, y)).toBeNull()
    })
    it('Remove not existing World object', () => {
      const { x, y } = RandomCoord(testSizeX, testSizeY)
      testWorld.RemoveObject(x, y)
      expect(testWorld.GetPlace(x, y)).toBeNull()
    })
    it('Get all existing animals', () => {
      const x = Math.floor(testSizeX / 2)
      const y = Math.floor(testSizeY / 2)

      const testAnimal1 = new Animal({ WorldX: x, WorldY: y, Id: 1 })
      testWorld.AddObject(testAnimal1)
      const testAnimal2 = new Animal({ WorldX: x, WorldY: y, Id: 2 })
      testWorld.AddObject(testAnimal2)
      const testAnimal3 = new Animal({ WorldX: x, WorldY: y, Id: 3 })
      testWorld.AddObject(testAnimal3)
      testAnimal3.Exist = false

      const allExistingAnimals = testWorld.GetAllAnimals()
      expect(allExistingAnimals).toEqual([testAnimal1, testAnimal2])
    })

  })

  describe('World movements', () => {
    it('Wandering should put World object in new place', () => {
      const { x: orgX, y: orgY } = RandomCoord(testSizeX, testSizeY)
      const testAnimal = new Animal({ WorldX: orgX, WorldY: orgY, Id: 1234, Energy: 100 })
      testWorld.AddObject(testAnimal)

      testAnimal.Movement.DirectionX = 1
      testAnimal.Movement.DirectionY = 1

      testWorld.Thick()
      const orgPlace = testWorld.GetPlace(orgX, orgY)
      expect(orgPlace).toBeNull()
    })
    it('Collision detection : don\'t move into occupied place, stay in previous place', () => {
      // place item at foodX & occupyY
      const { x: occupyX, y: occupyY } = RandomCoord(testSizeX, testSizeY)
      const occupiedWorldObject = new WorldObject({ WorldX: occupyX, WorldY: occupyY, Id: 1234 },
        WorldObjectTypes.Mountain)
      testWorld.AddObject(occupiedWorldObject)
      // place test item right to occupyX
      const testWorldObject = new Animal({ WorldX: occupyX + 1, WorldY: occupyY, Id: 456, Energy: 100 })
      testWorld.AddObject(testWorldObject)
      testWorldObject.Movement.DirectionX = -1
      testWorldObject.Movement.DirectionY = 0
      testWorldObject.Movement.WanderingStepsToMake = 2
      // try move test item to left, into occupied place --> should stay in previous place
      testWorld.Thick()

      expect(testWorldObject.WorldX).toBe(occupyX + 1)
    })
    it('Collision with food = eat food --> add energy, remove food', () => {
      // food  at foodX & occupyY
      const { x: foodX, y: foodY } = RandomCoord(testSizeX, testSizeY)
      const testFood = new Food({ WorldX: foodX, WorldY: foodY, Id: 1234 })
      testWorld.AddObject(testFood)
      // place test item right to food
      const testWorldObject = new Animal({ WorldX: foodX + 1, WorldY: foodY, Id: 456 })
      testWorld.AddObject(testWorldObject)
      testWorldObject.Movement.DirectionX = -1
      testWorldObject.Movement.DirectionY = 0
      testWorldObject.Movement.WanderingStepsToMake = 2
      // try move test item to left, into occupied place --> should stay in previous place
      testWorld.Thick()
      const expectEnergy = CstWorld.StartEnergy[WorldObjectTypes.Animal]
        - CstWorld.Animal.MoveEnergy + CstWorld.StartEnergy[WorldObjectTypes.Food]
      expect(testWorld.GetPlace(foodX, foodY)).toBeNull()
      expect(testWorldObject.Energy).toBe(expectEnergy)

      testWorld.Thick()
      expect(testFood.Exist).toBeFalsy()
    })
  })

  describe('Animale find food', () => {
    it('find closest food & move too it', () => {
      const x = Math.floor(testSizeX / 2)
      const y = Math.floor(testSizeY / 2)

      const testAnimal = new Animal({ WorldX: x, WorldY: y, Id: 1 }, 5)
      testWorld.AddObject(testAnimal)
      const food1 = new Food({ WorldX: x + 2, WorldY: y, Id: 1 })
      testWorld.AddObject(food1)
      const food2 = new Food({ WorldX: x, WorldY: y + 3, Id: 2 })
      testWorld.AddObject(food2)
      const food3 = new Food({ WorldX: x + 10, WorldY: y + 10, Id: 3 })
      testWorld.AddObject(food3)

      testWorld.Thick()  // first Thick set only the direction too the food, no steps
      expect(testAnimal.Target?.Id).toBe(food1.Id)

      testWorld.Thick()  // first step too the food
      expect(testAnimal.Movement.DirectionX).toBe(+ 1)
      expect(testAnimal.Movement.DirectionY).toBe(0)
      expect(testAnimal.WorldX).toBe(x + 1)
      expect(testAnimal.WorldY).toBe(y)

      testWorld.Thick()  // 2th step too the food = collision,stay in prev
      expect(testAnimal.Movement.DirectionX).toBe(1)
      expect(testAnimal.Movement.DirectionY).toBe(0)
      expect(testAnimal.WorldX).toBe(x + 1)
      expect(testAnimal.WorldY).toBe(y)

    })

  })
})