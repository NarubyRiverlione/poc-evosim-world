import { CstWorld } from './Cst'

import World from './Models/World'
import { ClearScreen, ShowAll, ShownAnimals } from './ShowAll'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)
StartWorld.Seed()

// RUN SIMULATION
let simTicks = 0
let run = setInterval(() => {
  simTicks += 1
  StartWorld.Thick()

  // stop sim if there are no animals left
  if (StartWorld.AllExistingAnimals().length === 0) {
    clearInterval(run)
  }
  ClearScreen(simTicks, StartWorld.AnimalCount, StartWorld.FoodCount)
  ShowAll(StartWorld)
  // ShownAnimals(StartWorld)
}, 100)

