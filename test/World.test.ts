import World from '../src/Models/World'
import WorldObject from '../src/Models/WorldObject'

let testSizeX: number
let testSizeY: number
let testWorld: World

describe('World', () => {
  beforeEach(() => {
    testSizeX = Math.floor(Math.random() * 100)
    testSizeY = Math.floor(Math.random() * 100)
    testWorld = new World(testSizeX, testSizeY)
  })
  it('Init empty world', () => {
    const { SizeX, SizeY, Places } = testWorld
    expect(SizeX).toBe(testSizeX)
    expect(SizeY).toBe(testSizeY)
    expect(Places.length).toBe(testSizeY)
    for (let y = 0; y < testSizeY; y++) {
      expect(Places[y].length).toBe(testSizeX)
      for (let x = 0; x < testSizeX; x++) {
        expect(Places[y][x]).toEqual(new WorldObject())
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
    const testWorldObject: WorldObject = { Type: 'TEST', WorldX: x, WorldY: y, Exist: true, Id: 1234 }
    testWorld.AddObject(x, y, testWorldObject)
    expect(testWorld.Places[x][y]).toEqual(testWorldObject)
  })
  it('Remove World object', () => {
    const { x, y } = testWorld.RandomCoord()
    const testWorldObject: WorldObject = { Type: 'TEST', WorldX: x, WorldY: y, Exist: true, Id: 1234 }
    testWorld.AddObject(x, y, testWorldObject)
    testWorld.RemoveObject(x, y)

    expect(testWorld.Places[x][y]).toEqual(new WorldObject())
  })

})