import Wandering from '../src/Models/Wandering'
import WorldObject from '../src/Models/WorldObject'

describe('Wandering', () => {

  it('new direction & steps', () => {
    const testWandering = new Wandering(10)

    expect(testWandering.DirectionX).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionX).toBeLessThanOrEqual(1)
    expect(testWandering.DirectionY).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionY).toBeLessThanOrEqual(1)

    expect(testWandering.Steps).toBeLessThanOrEqual(10)
  })

  it('use wandering until step are done', () => {
    const testWorldObject = new WorldObject()
    testWorldObject.WorldX = 100
    testWorldObject.WorldY = 100

    const testWandering = new Wandering(3)
    const { Steps, DirectionX, DirectionY } = testWandering

    for (let steps = 1; steps < Steps; steps++) {
      testWandering.NewLocation(testWorldObject, 100)
      expect(testWorldObject.WorldX).toBe(100 + DirectionX * steps)
      expect(testWorldObject.WorldY).toBe(100 + DirectionY * steps)
      expect(Steps).toBeGreaterThanOrEqual(0)
    }
  })
})