import WorldObject from './WorldObject'


export const EmptyWorldObject: WorldObject =
  { Type: '', WorldX: -1, WorldY: -1, Exist: false, Id: -1 }


export default class World {
  Places: WorldObject[][]
  SizeX: number
  SizeY: number

  constructor(sizeX: number, sizeY: number) {
    this.SizeX = sizeX
    this.SizeY = sizeY

    this.Places = []
    this.initPlaces()

  }

  initPlaces() {
    for (let y = 0; y < this.SizeY; y++) {
      const emptyRow: WorldObject[] = []
      for (let x = 0; x < this.SizeX; x++) {
        emptyRow.push(EmptyWorldObject)
      }
      this.Places.push(emptyRow)
    }
  }
  AddObject(x: number, y: number, worldObject: WorldObject) {
    this.Places[x][y] = worldObject
  }
  RemoveObject(x: number, y: number) {
    this.Places[x][y] = EmptyWorldObject
  }
  RandomCoord() {
    const x = Math.floor(Math.random() * this.SizeX)
    const y = Math.floor(Math.random() * this.SizeY)
    return { x, y }
  }
  /* istanbul ignore next */
  ShowAll() {
    for (let y = 0; y < this.SizeY; y++) {
      let showRow = ''
      for (let x = 0; x < this.SizeX; x++) {
        showRow = `${showRow} ${this.Places[y][x].Type}`
      }
      console.log(`Row ${y} ${showRow}`)
    }
  }
}
