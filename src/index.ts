import { CstWorld } from './Cst'
import Animal from './Models/Animal'
import Food from './Models/Food'
import World from './Models/World'
import { ShowAll } from './ShowAll'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)
StartWorld.SeedTerrain()

// ADD FOOD
const foods: Food[] = []
for (let id = 0; id < CstWorld.Food.StartAmount; id++) {
  const { x, y } = StartWorld.RandomCoord()
  foods[id] = new Food({ WorldX: x, WorldY: y, Id: id, Energy: CstWorld.Food.Energy })
  StartWorld.AddObject(x, y, foods[id])
}

// ADD ANIMALS
const animals: Animal[] = []
for (let id = 0; id < CstWorld.Animal.StartAmount; id++) {
  const { x, y } = StartWorld.RandomCoord()
  animals[id] = new Animal({ WorldX: x, WorldY: y, Energy: CstWorld.Animal.StartEnergy, Id: id })
  StartWorld.AddObject(x, y, animals[id])

  // animals[id].MoveToGoal(CstWorld.Size.X, CstWorld.Size.Y)
  //  animals[id].MoveToGoal(0, 0)
}


// RUN SIMULATION
let simTicks = 0
setInterval(() => {
  simTicks += 1
  StartWorld.Thick()
  ShowAll(simTicks, StartWorld)
}, 2000)


