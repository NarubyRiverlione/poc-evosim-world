/* istanbul file */
import { CstWorldObjects, CstWorldTerrain } from './Cst'
import World from './Models/World'
import * as readline from 'readline'

export function ShowAll(simThick: number, world: World) {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  process.stdout.write(`+++ SIM STEP ${simThick} +++++\n`)
  for (let y = 0; y < world.SizeY; y++) {
    let showRow = ''
    for (let x = 0; x < world.SizeX; x++) {
      const place = world.GetPlace(x, y)

      if (!place || !place.Exist) { showRow = `${showRow} ------`; continue }

      const { Type, Id } = place
      switch (Type) {
        case CstWorldTerrain.Water:
          showRow = `${showRow} WWWWWW`; continue
        case CstWorldTerrain.Mountain:
          showRow = `${showRow} MMMMMM`; continue
        case CstWorldObjects.Food:
          showRow = `${showRow} --${Id}--`; continue
        default:
          showRow = `${showRow} ${Id}`
      }

      if (Type === CstWorldObjects.Animal) {
        // const { WanderingSteps: { DirectionX, DirectionY, StepsToMake } } = place as Animal
        // const movement = ` ${DirectionX}/${DirectionY}/${StepsToMake}
        showRow = `${showRow}/${place.Energy}`
      }
    }

    process.stdout.write(`${showRow} \n`)
  }

  process.stdout.write('')
  for (let y = 0; y < world.SizeY; y++) {
    process.stdout.write(`${world._Grid[y]} \n`)
  }
}
