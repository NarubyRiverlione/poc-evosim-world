import World from '../src/Models/World'
import WorldObject from '../src/Models/WorldObject'

let testSizeX: number = 0
let testSizeY: number = 0
let testWorld: World

describe('World', () => {
  beforeEach(() => {
    testSizeX = Math.floor(Math.random() * 100)
    testSizeY = Math.floor(Math.random() * 100)
    testWorld = new World(testSizeX, testSizeY)
  })
  it('Init empty world', () => {
    const { SizeX, SizeY } = testWorld
    expect(SizeX).toBe(testSizeX)
    expect(SizeY).toBe(testSizeY)

    for (let y = 0; y < testSizeY; y++) {
      for (let x = 0; x < testSizeX; x++) {
        expect(testWorld.GetPlace(x, y)).toEqual(new WorldObject())
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
    const testWorldObject: WorldObject = { Type: 'TEST', WorldX: x, WorldY: y, Exist: true, Id: 1234, Energy: 100 }
    testWorld.AddObject(x, y, testWorldObject)
    expect(testWorld.GetPlace(x, y)).toEqual(testWorldObject)
  })
  it('Remove World object', () => {
    const { x, y } = testWorld.RandomCoord()
    const testWorldObject: WorldObject = { Type: 'TEST', WorldX: x, WorldY: y, Exist: true, Id: 1234, Energy: 100 }
    testWorld.AddObject(x, y, testWorldObject)
    testWorld.RemoveObject(x, y)

    expect(testWorld.GetPlace(x, y)).toBeNull()
  })

})