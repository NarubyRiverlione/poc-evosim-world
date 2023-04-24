import { CstWorld } from './Cst'
import Food from './Models/Food'
import World from './Models/World'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)

const FoodItems: Food[] = []

for (let id = 0; id < CstWorld.Food.StartAmount; id++) {
  const { x, y } = StartWorld.RandomCoord()
  FoodItems[id] = new Food({ WorldX: x, WorldY: y, Id: id, Energy: CstWorld.Food.Energy })
  StartWorld.AddObject(x, y, FoodItems[id])
}

StartWorld.ShowAll()