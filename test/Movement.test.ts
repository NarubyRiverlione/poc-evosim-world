import Movement from '../src/Models/Movement'
import WorldObject from '../src/Models/WorldObject'

describe('Wandering', () => {
  it('new direction & steps', () => {
    const testWandering = new Movement(10)
    expect(testWandering.IsWandering).toBeTruthy()
    expect(testWandering.DirectionX).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionX).toBeLessThanOrEqual(1)
    expect(testWandering.DirectionY).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionY).toBeLessThanOrEqual(1)

    expect(testWandering.WanderingStepsToMake).toBeLessThanOrEqual(10)
  })

  it('use wandering until step are done', () => {
    const testWorldObject = new WorldObject({ WorldX: 100, WorldY: 100, Id: 12345 }, 'TestType')

    const testWandering = new Movement(3)
    const wanderingStep = testWandering.WanderingStepsToMake

    for (let thicks = 0; thicks < wanderingStep; thicks++) {
      const { WanderingStepsToMake: StepsToMake, DirectionX, DirectionY } = testWandering
      testWandering.NewLocation(testWorldObject)
      expect(testWorldObject.WorldX).toBe(100 + DirectionX * (thicks + 1))
      expect(testWorldObject.WorldY).toBe(100 + DirectionY * (thicks + 1))
      expect(StepsToMake).toBe(wanderingStep - 1 * thicks)
    }
    expect(testWandering.WanderingStepsToMake).toBe(0)
    // new wandering direction (cannot be tested because it't random)
    testWandering.NewLocation(testWorldObject)
    expect(testWandering.WanderingStepsToMake).not.toBe(0)


  })
  it('Stop wandering', () => {
    const testWandering = new Movement(3)
    testWandering.Stop()
    const { IsWandering, WanderingStepsToMake, DirectionX, DirectionY } = testWandering
    expect(WanderingStepsToMake).toBe(-1)
    expect(DirectionX).toBe(0)
    expect(DirectionY).toBe(0)
    expect(IsWandering).toBeFalsy()
  })

})

describe('Move to goal', () => {
  it('Go to goal', () => {
    const testMovement = new Movement()

    testMovement.DirectionToGoal(10, 10, 11, 11)

    expect(testMovement.IsWandering).toBeFalsy()
    expect(testMovement.DirectionX).toBe(1)
    expect(testMovement.DirectionY).toBe(1)

    testMovement.DirectionToGoal(10, 10, 9, 9)
    expect(testMovement.DirectionX).toBe(-1)
    expect(testMovement.DirectionY).toBe(-1)
  })
  it('reached goal, no movement', () => {
    const testMovement = new Movement()

    testMovement.DirectionToGoal(10, 10, 10, 10)

    expect(testMovement.IsWandering).toBeFalsy()
    expect(testMovement.DirectionX).toBe(0)
    expect(testMovement.DirectionY).toBe(0)
  })

})