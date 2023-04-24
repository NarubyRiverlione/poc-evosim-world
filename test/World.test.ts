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
})