import WorldObject from './WorldObject'


export default class World {
  private _Places: (WorldObject | null)[][]
  SizeX: number
  SizeY: number

  constructor(sizeX: number, sizeY: number) {
    if (sizeX <= 0) throw new Error('Invalid size for X when creating world')
    if (sizeY <= 0) throw new Error('Invalid size for Y when creating world')
    this.SizeX = sizeX
    this.SizeY = sizeY

    this._Places = []
    this.initPlaces()
  }

  initPlaces() {
    for (let y = 0; y < this.SizeY; y++) {
      const emptyRow: null[] = []
      for (let x = 0; x < this.SizeX; x++) {
        emptyRow.push(null)
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
    if (!this._Places[y][x]) return // nothing to be removed
    this._Places[y][x] = null
  }
  RandomCoord() {
    const x = Math.floor(Math.random() * this.SizeX)
    const y = Math.floor(Math.random() * this.SizeY)
    return { x, y }
  }

  Thick() {
    // Thick all existing WorldObjects
    for (let y = 0; y < this.SizeY; y++) {
      for (let x = 0; x < this.SizeX; x++) {
        const worldObject = this._Places[y][x]
        if (!worldObject) continue

        worldObject.Thick()
        // don't wander of the world
        const { checkedX, checkedY } = this.Guard(worldObject.WorldX, worldObject.WorldY)
        worldObject.WorldX = checkedX; worldObject.WorldY = checkedY

        // is wander around = remove previous location, add new location
        if (worldObject.IsWandering) {
          this.RemoveObject(x, y)
          this.AddObject(worldObject.WorldX, worldObject.WorldY, worldObject)
        }

        // remove World object without energy
        if (worldObject.Energy <= 0) { this.RemoveObject(x, y) }
      }

    }
  }

  Guard(x: number, y: number) {
    let checkedX = x
    let checkedY = y
    if (x < 0) checkedX = 0
    if (y < 0) checkedY = 0
    if (x > this.SizeX) checkedX = this.SizeX
    if (y > this.SizeY) checkedY = this.SizeY

    return { checkedX, checkedY }
  }

  // TODO is visualisatie --> apart bestand of project
  /* istanbul ignore next */
  ShowAll(simThick: number) {
    console.log(`+++ SIM STEP ${simThick} +++++`)
    for (let y = 0; y < this.SizeY; y++) {
      let showRow = ''
      for (let x = 0; x < this.SizeX; x++) {
        showRow = `${showRow} ${this._Places[x][y]?.Type ?? ' '}${this._Places[x][y]?.Id ?? ''}`
      }
      console.log(`Row ${y} ${showRow}`)
    }
    console.log('')
  }
}
