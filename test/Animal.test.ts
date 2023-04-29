import Animal from '../src/Models/Animal'
import { RandomCoord } from '../src/Models/World'


describe('Animal', () => {
  it('Closest target', () => {
    const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 }, 20)
    const { WorldX: x, WorldY: y } = testAnimal
    const target1 = new Animal({ WorldX: x + 5, WorldY: y + 5, Id: 2 })
    const target2 = new Animal({ WorldX: x + 10, WorldY: y + 10, Id: 3 })

    testAnimal.ClosestTarget([target1, target2])
    expect(testAnimal.Target).not.toBeNull()
    expect(testAnimal.Target?.Id).toEqual('A2')
  })
  it('no target in see range', () => {
    const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 }, 2)
    const { WorldX: x, WorldY: y } = testAnimal
    const target1 = new Animal({ WorldX: x + 7, WorldY: y + 7, Id: 3 })
    const target2 = new Animal({ WorldX: x + 10, WorldY: y + 10, Id: 4 })

    testAnimal.ClosestTarget([target1, target2])
    expect(testAnimal.Target).toBeNull()
  })

  it('move to target', () => {
    const start = 20
    const testAnimal = new Animal({ WorldX: start, WorldY: start, Id: 1 })
    const target1 = new Animal({ WorldX: start + 7, WorldY: start + 7, Id: 3 })
    testAnimal.Target = target1
    testAnimal.Movement.IsWandering = false
    testAnimal.DirectionToTarget()
    expect(testAnimal.Movement.IsWandering).toBeFalsy()
    testAnimal.Thick()
    expect(testAnimal.Movement.DirectionX).toBe(1)
    expect(testAnimal.Movement.DirectionY).toBe(1)
    expect(testAnimal.WorldX).toBe(start + 1)
    expect(testAnimal.WorldY).toBe(start + 1)
  })
  it('calc distance to target', () => {
    const { x, y } = RandomCoord(100, 100)
    const { x: offsetX, y: offsetY } = RandomCoord(50, 50)
    const testAnimal = new Animal({ WorldX: x, WorldY: y, Id: 1 }, 55)
    const target1 = new Animal({ WorldX: x + offsetX, WorldY: y + offsetY, Id: 3 })
    testAnimal.ClosestTarget([target1])
    expect(testAnimal.Target).toEqual(target1)
    const expectDistance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
    expect(testAnimal.Distance).toBe(expectDistance.toFixed(1))
  })
})