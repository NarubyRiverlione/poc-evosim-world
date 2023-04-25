import Animal from '../src/Models/Animal'
import World from '../src/Models/World'
import WorldObject from '../src/Models/WorldObject'

let testSizeX: number = 0
let testSizeY: number = 0
let testWorld: World

describe('World', () => {
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
      }
    }
  })

  it('Get RandomCoord', () => {
    const { x, y } = testWorld.RandomCoord()
    expect(x).toBeLessThan(testSizeX)
    expect(y).toBeLessThan(testSizeY)
  })
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
  it('Wandering should put Worldobject in new place', () => {
    const { x: orgX, y: orgY } = testWorld.RandomCoord()
    const testAnimal = new Animal({ WorldX: orgX, WorldY: orgY, Id: 1234, Energy: 100 })
    testWorld.AddObject(orgX, orgY, testAnimal)

    testAnimal.WanderingSteps.DirectionX = 1
    testAnimal.WanderingSteps.DirectionY = 1

    testWorld.Thick()
    const orgPlace = testWorld.GetPlace(orgX, orgY)
    expect(orgPlace).toBeNull()
  })
  it('Collision detection : don\'t move into occupied place, stay in previous place', () => {
    // place item at occupX & occuY
    const { x: occuX, y: occuY } = testWorld.RandomCoord()
    const occupiedWorldObject = new WorldObject({ WorldX: occuX, WorldY: occuY, Id: 1234, Energy: 100 }, 'occupy')
    testWorld.AddObject(occuX, occuY, occupiedWorldObject)
    // place test item right to occuX
    const testWorldObject = new Animal({ WorldX: occuX + 1, WorldY: occuY, Id: 456, Energy: 100 })
    testWorld.AddObject(occuX + 1, occuY, testWorldObject)
    testWorldObject.WanderingSteps.DirectionX = -1
    testWorldObject.WanderingSteps.DirectionY = 0
    testWorldObject.WanderingSteps.StepsToMake = 2
    // try move test item to left, into occupied place --> should stay in previous place
    testWorld.Thick()

    expect(testWorldObject.WorldX).toBe(occuX + 1)
  })
})