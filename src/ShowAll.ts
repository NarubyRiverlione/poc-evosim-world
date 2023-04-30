/* istanbul file */
import Animal from './Models/Animal'
import World from './Models/World'
import * as readline from 'readline'
import { WorldObjectTypes } from './Models/WorldObject'

function showAnimal(animal: Animal) {
  const { Id, Energy, Target, Movement, Distance, WorldX, WorldY, Thirst } = animal

  let showRow = `${Id} X${WorldX}Y${WorldY} E${Energy} th${Thirst}`
  // showRow += `--> ${Movement?.DirectionX}/${Movement?.DirectionY} ${Distance} `

  if (Movement.IsWandering) showRow += ` Wandering steps ${Movement.WanderingStepsToMake}`
  if (Target) showRow += ` ${Target.Id}  X${Target.WorldX}Y${Target.WorldY}  D${Distance}`
  process.stdout.write(`${showRow} \n \n`)
}

export function ShowAll(simThick: number, world: World) {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  process.stdout.write(`+++ SIM STEP ${simThick} +++++\n`)
  for (let y = 0; y < world.SizeY; y++) {
    let showRow = ''
    for (let x = 0; x < world.SizeX; x++) {
      const place = world.GetPlace(x, y)

      if (!place || !place.Exist) { showRow = `${showRow}    `; continue }

      const { Type, Id } = place
      switch (Type) {
        case WorldObjectTypes.Water:
          showRow = `${showRow}WW${Id}WW`; continue
        case WorldObjectTypes.Mountain:
          showRow = `${showRow}MMMMM`; continue
        case WorldObjectTypes.Food:
          showRow = `${showRow}*${Id}*`; continue
        default:
          showRow = `${showRow} ${Id} `
      }
    }

    process.stdout.write(`${showRow} \n`)
  }

  process.stdout.write('\n\n')
}

export function ShownAnimals(world: World) {
  const animals = world.GetAllAnimals()
  animals.forEach(animal => {
    showAnimal(animal)
  })

}


