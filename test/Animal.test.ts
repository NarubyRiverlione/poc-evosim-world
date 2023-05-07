import { CstAnimal, CstWorld } from '../src/Cst'
import Animal, { ThirstEnergyFactor } from '../src/Models/Animal'
import { RandomCoord } from '../src/Models/World'
import WorldObject, { WorldObjectTypes } from '../src/Models/WorldObject'


describe('Animal', () => {
  it('init + first thick', () => {
    const seeRange = Math.floor(Math.random() * 20)
    const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 }, seeRange)
    expect(testAnimal.Thirst).toBe(0)
    expect(testAnimal.Target).toBeNull()
    expect(testAnimal.SeeRange).toBe(seeRange)
    expect(testAnimal.Distance).toBe(0.0)
    expect(testAnimal.Age).toBe(0)

    testAnimal.Thick()
    expect(testAnimal.Thirst).toBe(1)
    expect(testAnimal.Age).toBe(1)
  })
  it('If wandering stay on course', () => {
    const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 })
    testAnimal.Movement.IsWandering = true
    testAnimal.Thick()
    const { DirectionX, DirectionY } = testAnimal.Movement
    testAnimal.DirectionToTarget()
    expect(testAnimal.Movement.DirectionX).toBe(DirectionX)
    expect(testAnimal.Movement.DirectionY).toBe(DirectionY)
  })

  describe('Thirst', () => {
    it('calc thirst energy factor', () => {
      const threshold = 50
      expect(ThirstEnergyFactor(0, threshold)).toBe(1)
      expect(ThirstEnergyFactor(threshold / 2, threshold)).toBe(1)
      expect(ThirstEnergyFactor(threshold, threshold)).toBe(2)
      expect(ThirstEnergyFactor(threshold * 2, threshold)).toBe(2)
    })
    it('add thirst / thick', () => {
      const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 }, 10)
      testAnimal.Thick()
      expect(testAnimal.Thirst).toBe(CstAnimal.ThirstThick)
      testAnimal.Thick()
      expect(testAnimal.Thirst).toBe(CstAnimal.ThirstThick * 2)
      testAnimal.Thick()
      expect(testAnimal.Thirst).toBe(CstAnimal.ThirstThick * 3)
    })
    it('effect of thirst above threshold = move cost more energy', () => {
      const startEnergy = 100
      const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1, Energy: startEnergy }, 10)
      for (let steps = 0; steps < CstAnimal.ThirstThreshold; steps++) { testAnimal.Thick() }
      // normal energy drain
      const energyAtThreshold = startEnergy - CstAnimal.ThirstThreshold
      expect(testAnimal.Energy).toBe(energyAtThreshold)

      testAnimal.Thick()
      const factor = ThirstEnergyFactor(testAnimal.Thirst, CstAnimal.ThirstThreshold)
      expect(factor).toBe(2)
      expect(testAnimal.Energy).toBe(energyAtThreshold - CstAnimal.MoveEnergy * factor)

      testAnimal.Thick()
      expect(ThirstEnergyFactor(testAnimal.Thirst, CstAnimal.ThirstThreshold)).toBe(2)
      const expectThresholdStep2 = energyAtThreshold - CstAnimal.MoveEnergy * factor * 2
      expect(testAnimal.Energy).toBe(expectThresholdStep2)

      testAnimal.Thick()
      expect(ThirstEnergyFactor(testAnimal.Thirst, CstAnimal.ThirstThreshold)).toBe(2)
      const expectThresholdStep3 = energyAtThreshold - CstAnimal.MoveEnergy * factor * 3
      expect(testAnimal.Energy).toBe(expectThresholdStep3)
    })
  })
  describe('Target', () => {
    it('Closest target', () => {
      const testAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: 1 }, 20)
      const { WorldX: x, WorldY: y } = testAnimal
      const target1 = new Animal({ WorldX: x + 5, WorldY: y + 5, Id: 2 })
      const target2 = new Animal({ WorldX: x + 10, WorldY: y + 10, Id: 3 })

      testAnimal.ClosestTarget([target1, target2])
      expect(testAnimal.Target).not.toBeNull()
      expect(testAnimal.Target?.Id).toEqual('A2')
      testAnimal.ClosestTarget([target1, target2])
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
      const target1 = new Animal({ WorldX: start + 2, WorldY: start + 2, Id: 3 })
      testAnimal.ClosestTarget([target1])
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
      const { x: offsetX, y: offsetY } = RandomCoord(2, 2)
      const testAnimal = new Animal({ WorldX: x, WorldY: y, Id: 1 }, 55)
      const target1 = new WorldObject({ WorldX: x + offsetX, WorldY: y + offsetY, Id: 3 }, WorldObjectTypes.Test)
      testAnimal.ClosestTarget([target1])
      expect(testAnimal.Target).toEqual(target1)
      const expectDistance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
      expect(testAnimal.Distance).toBe(parseFloat(expectDistance.toFixed(1)))
    })
    it('2 target, same distance -> keep first target', () => {
      const start = 20
      const testAnimal = new Animal({ WorldX: start, WorldY: start, Id: 1 })

      const target1 = new Animal({ WorldX: start + 2, WorldY: start + 1, Id: 2 })
      const target2 = new Animal({ WorldX: start - 2, WorldY: start + 1, Id: 3 })


      testAnimal.ClosestTarget([target1, target2])
      expect(testAnimal.Target).toEqual(target1)

    })

  })
})
describe('Offspring', () => {
  it('create offspring', () => {
    const parentId = 153
    const seeRange = Math.floor(Math.random() * 20)
    const parentEatEnergy = Math.floor(Math.random() * 20) + CstAnimal.OffspringThresholdEnergy
    const parentAnimal = new Animal({ WorldX: 20, WorldY: 20, Id: parentId }, seeRange)
    parentAnimal.Eat(parentEatEnergy)
    expect(parentAnimal.Energy).toBe(parentEatEnergy + CstWorld.StartEnergy[WorldObjectTypes.Animal])


    const offspring = parentAnimal.CreateOffspring(21, 21, parentId + 1)
    expect(offspring.Age).toBe(0)
    expect(offspring.Parent).toBe(`${WorldObjectTypes.Animal}${parentId}`)


    const expectParentEnergy = parentEatEnergy - CstWorld.StartEnergy[WorldObjectTypes.Animal]
    expect(parentAnimal.Energy).toBe(expectParentEnergy)
  })
})
