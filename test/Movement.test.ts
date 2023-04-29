import Movement from '../src/Models/Movement'
import WorldObject, { WorldObjectTypes } from '../src/Models/WorldObject'

describe('Wandering', () => {
  it('new direction & steps', () => {
    const testWandering = new Movement(10)
    testWandering.StartWandering()
    expect(testWandering.IsWandering).toBeTruthy()
    expect(testWandering.DirectionX).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionX).toBeLessThanOrEqual(1)
    expect(testWandering.DirectionY).toBeGreaterThanOrEqual(-1)
    expect(testWandering.DirectionY).toBeLessThanOrEqual(1)

    expect(testWandering.WanderingStepsToMake).toBeLessThanOrEqual(10)
  })

  it('Stop wandering', () => {
    const testWandering = new Movement(3)
    testWandering.StartWandering()
    testWandering.Stop()
    const { IsWandering, WanderingStepsToMake, DirectionX, DirectionY } = testWandering
    expect(WanderingStepsToMake).toBe(0)
    expect(DirectionX).toBe(0)
    expect(DirectionY).toBe(0)
    expect(IsWandering).toBeFalsy()
  })
  it('done wandering step -> start new wandering', () => {
    const testWandering = new Movement(1)
    testWandering.StartWandering()
    testWandering.NewLocation(new WorldObject({ WorldX: 10, WorldY: 10, Id: 1 }, WorldObjectTypes.Test, true))
    expect(testWandering.IsWandering).toBeTruthy()
    expect(testWandering.WanderingStepsToMake).toBe(0)

    testWandering.NewLocation(new WorldObject({ WorldX: 10, WorldY: 10, Id: 1 }, WorldObjectTypes.Test, true))
    expect(testWandering.IsWandering).toBeTruthy()
    expect(testWandering.WanderingStepsToMake).toBe(0)

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

    testMovement.DirectionToGoal(10, 10, 10, 11)
    expect(testMovement.DirectionX).toBe(0)

    testMovement.DirectionToGoal(10, 10, 11, 10)
    expect(testMovement.DirectionY).toBe(0)
  })
  it('reached goal, no movement', () => {
    const testMovement = new Movement()

    testMovement.DirectionToGoal(10, 10, 10, 10)

    expect(testMovement.IsWandering).toBeFalsy()
    expect(testMovement.DirectionX).toBe(0)
    expect(testMovement.DirectionY).toBe(0)
  })

})