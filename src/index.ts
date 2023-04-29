import { CstWorld } from './Cst'

import World from './Models/World'
import { ShowAll, ShownAnimals } from './ShowAll'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)
StartWorld.Seed()

// RUN SIMULATION
let simTicks = 0
setInterval(() => {
  simTicks += 1
  StartWorld.Thick()
  ShowAll(simTicks, StartWorld)
  ShownAnimals(StartWorld)
}, 3000)

// StartWorld.Thick()
// ShowAll(0, StartWorld)

