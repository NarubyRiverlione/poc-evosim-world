import { CstWorld, CstWorldTerrain } from '../src/Cst'
import Animal from '../src/Models/Animal'
import Food from '../src/Models/Food'
import World from '../src/Models/World'
import WorldObject from '../src/Models/WorldObject'

let testSizeX: number = 0
let testSizeY: number = 0
let testWorld: World

describe('World init', () => {
  beforeEach(() => {
    testSizeX = Math.floor(Math.random() * 100) + 1
    testSizeY = Math.floor(Math.random() * 100) + 1
    testWorld = new World(testSizeX, testSizeY)
  })
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

  it('Get RandomCoord', () => {
    const { x, y } = testWorld.RandomCoord()
    expect(x).toBeLessThan(testSizeX)
    expect(y).toBeLessThan(testSizeY)
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
    const { x, y } = testWorld.RandomCoord()
    const testWorldObject = new WorldObject({ WorldX: x, WorldY: y, Id: 1234, Energy: 100 }, 'TestTYpe')
    testWorld.AddObject(x, y, testWorldObject)
    expect(testWorld.GetPlace(x, y)).toEqual(testWorldObject)
  })
  it('Remove World object', () => {
    const { x, y } = testWorld.RandomCoord()
    const testWorldObject = new WorldObject({ WorldX: x, WorldY: y, Id: 1234, Energy: 100 }, 'TestTYpe')
    testWorld.AddObject(x, y, testWorldObject)
    testWorld.RemoveObject(x, y)

    expect(testWorld.GetPlace(x, y)).toBeNull()
  })
  it('Remove not existing World object', () => {
    const { x, y } = testWorld.RandomCoord()
    testWorld.RemoveObject(x, y)

    expect(testWorld.GetPlace(x, y)).toBeNull()
  })

})
describe('World movements', () => {
  it('Wandering should put World object in new place', () => {
    const { x: orgX, y: orgY } = testWorld.RandomCoord()
    const testAnimal = new Animal({ WorldX: orgX, WorldY: orgY, Id: 1234, Energy: 100 })
    testWorld.AddObject(orgX, orgY, testAnimal)

    testAnimal.Movement.DirectionX = 1
    testAnimal.Movement.DirectionY = 1

    testWorld.Thick()
    const orgPlace = testWorld.GetPlace(orgX, orgY)
    expect(orgPlace).toBeNull()
  })
  it('Collision detection : don\'t move into occupied place, stay in previous place', () => {
    // place item at foodX & occupyY
    const { x: occupyX, y: occupyY } = testWorld.RandomCoord()
    const occupiedWorldObject = new WorldObject({ WorldX: occupyX, WorldY: occupyY, Id: 1234 },
      CstWorldTerrain.Mountain)
    testWorld.AddObject(occupyX, occupyY, occupiedWorldObject)
    // place test item right to occupyX
    const testWorldObject = new Animal({ WorldX: occupyX + 1, WorldY: occupyY, Id: 456, Energy: 100 })
    testWorld.AddObject(occupyX + 1, occupyY, testWorldObject)
    testWorldObject.Movement.DirectionX = -1
    testWorldObject.Movement.DirectionY = 0
    testWorldObject.Movement.StepsToMake = 2
    // try move test item to left, into occupied place --> should stay in previous place
    testWorld.Thick()

    expect(testWorldObject.WorldX).toBe(occupyX + 1)
  })
  it('Collision with food = eat food --> add energy, remove food', () => {
    // food  at foodX & occupyY
    const { x: foodX, y: foodY } = testWorld.RandomCoord()
    const testFood = new Food({ WorldX: foodX, WorldY: foodY, Id: 1234, Energy: CstWorld.Food.Energy })
    testWorld.AddObject(foodX, foodY, testFood)
    // place test item right to food
    const testWorldObject = new Animal({
      WorldX: foodX + 1, WorldY: foodY, Id: 456,
      Energy: CstWorld.Animal.StartEnergy,
    })
    testWorld.AddObject(foodX + 1, foodY, testWorldObject)
    testWorldObject.Movement.DirectionX = -1
    testWorldObject.Movement.DirectionY = 0
    testWorldObject.Movement.StepsToMake = 2
    // try move test item to left, into occupied place --> should stay in previous place
    testWorld.Thick()
    const expectEnergy = CstWorld.Animal.StartEnergy - CstWorld.Animal.MoveEnergy + CstWorld.Food.Energy
    expect(testWorld.GetPlace(foodX, foodY)).toBeNull()
    expect(testWorldObject.Energy).toBe(expectEnergy)
  })
})