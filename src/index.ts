import { CstWorld, CstWorldObjects } from './Cst'
import Animal from './Models/Animal'
import Food from './Models/Food'
import World from './Models/World'
import * as readline from 'readline'

const StartWorld = new World(CstWorld.Size.X, CstWorld.Size.Y)

/* istanbul ignore next */
function ShowAll(simThick: number, world: World) {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  process.stdout.write(`+++ SIM STEP ${simThick} +++++\n`)
  for (let y = 0; y < world.SizeY; y++) {
    let showRow = ''
    for (let x = 0; x < world.SizeX; x++) {
      const place = world.GetPlace(x, y)
      if (!place) {
        showRow = `${showRow} ----------`
        continue
      }

      const { Type, Id } = place
      showRow = `${showRow} ${Type.substring(0, 1)}${Id}`

      if (Type === CstWorldObjects.Animal) {
        const { WanderingSteps: { DirectionX, DirectionY, StepsToMake } } = place as Animal
        const movement = ` ${DirectionX}/${DirectionY}/${StepsToMake}`
        showRow = `${showRow}${movement}`
      }
    }

    process.stdout.write(`${showRow} \n`)
  }
}

// ADD FOOD
const foods: Food[] = []
for (let id = 0; id < CstWorld.Food.StartAmount; id++) {
  const { x, y } = StartWorld.RandomCoord()
  foods[id] = new Food({ WorldX: x, WorldY: y, Id: id, Energy: CstWorld.Food.Energy })
  StartWorld.AddObject(x, y, foods[id])
}

// ADD ANIMALS
const animals: Animal[] = []
for (let id = 0; id < CstWorld.Food.StartAmount; id++) {
  const { x, y } = StartWorld.RandomCoord()
  animals[id] = new Animal({ WorldX: x, WorldY: y, Energy: 100, Id: id })
  StartWorld.AddObject(x, y, animals[id])
}


// RUN SIMULATION
let simTicks = 0
setInterval(() => {
  simTicks += 1
  StartWorld.Thick()
  ShowAll(simTicks, StartWorld)
}, 2000)


