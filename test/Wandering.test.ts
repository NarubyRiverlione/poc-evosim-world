import Wandering from '../src/Models/Wandering'
import WorldObject from '../src/Models/WorldObject'

describe('Wandering', () => {
  it('new direction & steps', () => {
    const testWandering = new Wandering(10)

    expect(testWandering.DirectionX).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionX).toBeLessThanOrEqual(1)
    expect(testWandering.DirectionY).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionY).toBeLessThanOrEqual(1)

    expect(testWandering.StepsToMake).toBeLessThanOrEqual(10)
  })

  it('use wandering until step are done', () => {
    const testWorldObject = new WorldObject({ WorldX: 100, WorldY: 100, Id: 12345 }, 'TestType')

    const testWandering = new Wandering(3)
    const wanderingStep = testWandering.StepsToMake

    for (let thicks = 0; thicks < wanderingStep; thicks++) {
      const { StepsToMake, DirectionX, DirectionY } = testWandering
      testWandering.NewLocation(testWorldObject)
      expect(testWorldObject.WorldX).toBe(100 + DirectionX * (thicks + 1))
      expect(testWorldObject.WorldY).toBe(100 + DirectionY * (thicks + 1))
      expect(StepsToMake).toBe(wanderingStep - 1 * thicks)
    }
    expect(testWandering.StepsToMake).toBe(0)
    // new wandering direction (cannot be tested because it't random)
    testWandering.NewLocation(testWorldObject)
    expect(testWandering.StepsToMake).not.toBe(0)

  })
  it('Stop wandering', () => {
    const testWandering = new Wandering(3)
    testWandering.Stop()
    const { StepsToMake, DirectionX, DirectionY } = testWandering
    expect(StepsToMake).toBe(-1)
    expect(DirectionX).toBe(0)
    expect(DirectionY).toBe(0)
  })

})