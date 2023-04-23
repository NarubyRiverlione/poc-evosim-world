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
    const id = 12345
    const testFood: Food = new Food(x, y, id, testEnergy)
    testWorld.AddObject(x, y, testFood)
    expect(testWorld.Places[x][y]).toEqual(testFood)
  })
  it('Eaten = removed for Place', () => {
    const { x, y } = testWorld.RandomCoord()
    const id = 12345
    const testFood: Food = new Food(x, y, id, testEnergy)
    testWorld.AddObject(x, y, testFood)
    testFood.Eat()

    const testPlace = testWorld.Places[x][y]
    expect(testPlace.Exist).toBeFalsy()
  })
})