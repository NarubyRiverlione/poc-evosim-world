import { CstWorld } from './Cst'
import Food from './Models/Food'
import World from './Models/World'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)

const FoodItems: Food[] = []

for (let i = 0; i < CstWorld.Food.StartAmount; i++) {
  const { x, y } = StartWorld.RandomCoord()
  FoodItems[i] = new Food(x, y, i)
  StartWorld.AddObject(x, y, FoodItems[i])
}

StartWorld.ShowAll()