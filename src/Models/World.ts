import WorldObject from './WorldObject'


export default class World {
  private _Places: WorldObject[][]
  SizeX: number
  SizeY: number

  constructor(sizeX: number, sizeY: number) {
    this.SizeX = sizeX
    this.SizeY = sizeY

    this._Places = []
    this.initPlaces()
  }

  initPlaces() {
    for (let y = 0; y < this.SizeY; y++) {
      const emptyRow: WorldObject[] = []
      for (let x = 0; x < this.SizeX; x++) {
        emptyRow.push(new WorldObject())
      }
      this._Places.push(emptyRow)
    }
  }
  GetPlace(x: number, y: number) {
    return this._Places[y][x]
  }
  AddObject(x: number, y: number, worldObject: WorldObject) {
    this._Places[y][x] = worldObject
  }
  RemoveObject(x: number, y: number) {
    this._Places[y][x] = new WorldObject()
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
        showRow = `${showRow} ${this._Places[x][y].Type}`
      }
      console.log(`Row ${y} ${showRow}`)
    }
  }
}
