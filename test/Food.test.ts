import { CstWorld } from '../src/Cst'
import Food from '../src/Models/Food'
import { RandomCoord } from '../src/Models/World'
import { WorldObjectTypes } from '../src/Models/WorldObject'

let testEnergy: number
let randomX: number
let randomY: number
describe('Food', () => {
  beforeEach(() => {
    testEnergy = Math.floor(Math.random() * 100)
    const { x, y } = RandomCoord(100, 100)
    randomX = x; randomY = y
  })

  it('Food with generic energy', () => {
    const testFood: Food = new Food({ WorldX: randomX, WorldY: randomY, Id: 1234 })
    const energy = CstWorld.StartEnergy[WorldObjectTypes.Food]
    expect(testFood.Energy).toBe(energy)
  })
  it('Food with specific energy', () => {
    const testFood: Food = new Food({ WorldX: randomX, WorldY: randomY, Id: 1234, Energy: testEnergy })
    expect(testFood.Energy).toBe(testEnergy)
  })


  it('Eaten --> energy = 0', () => {
    const testFood: Food = new Food({ WorldX: randomX, WorldY: randomY, Id: 1234 })

    testFood.Eaten()
    expect(testFood.Energy).toBe(0)
  })
})