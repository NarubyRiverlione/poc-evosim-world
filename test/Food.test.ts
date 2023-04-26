import Food from '../src/Models/Food'
import World from '../src/Models/World'

let testSizeX: number
let testSizeY: number
let testEnergy: number
let testWorld: World

describe('Food', () => {
  beforeEach(() => {
    testSizeX = Math.floor(Math.random() * 100)
    testSizeY = Math.floor(Math.random() * 100)
    testEnergy = Math.floor(Math.random() * 100)
    testWorld = new World(testSizeX, testSizeY)
  })

  it('Add food to Place in World', () => {
    const { x, y } = testWorld.RandomCoord()
    const testFood: Food = new Food({ WorldX: x, WorldY: y, Id: 1234, Energy: testEnergy })
    testWorld.AddObject(x, y, testFood)
    expect(testWorld.GetPlace(x, y)).toEqual(testFood)
  })
  it('Eaten = removed for Place', () => {
    const { x, y } = testWorld.RandomCoord()
    const testFood: Food = new Food({ WorldX: x, WorldY: y, Id: 1234, Energy: testEnergy })
    testWorld.AddObject(x, y, testFood)
    testFood.Eaten()
    expect(testFood.Energy).toBe(0)

    testWorld.Thick()
    expect(testFood.Exist).toBeFalsy()
    const testPlace = testWorld.GetPlace(x, y)
    expect(testPlace).toBeNull()

    testFood.Thick()
    expect(testFood.Exist).toBeFalsy()
  })
})