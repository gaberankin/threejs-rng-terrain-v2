import * as THREE from 'three'

function pushTriangle(
  positions: number[],
  normals: number[],
  colors: number[],
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  normal: THREE.Vector3,
  minHeight: number,
  maxHeight: number,
): void {
  const span = maxHeight - minHeight
  for (const v of [a, b, c]) {
    positions.push(v.x, v.y, v.z)
    normals.push(normal.x, normal.y, normal.z)
    const g = span > 0 ? (v.y - minHeight) / span : 0
    colors.push(g, g, g)
  }
}

export default class HeightField {
  w: number
  l: number
  f: (number | undefined)[]

  constructor(width: number) {
    this.w = width
    this.l = this.w * this.w
    this.f = new Array<number | undefined>(width * width)
  }

  get(x: number, y?: number): number {
    const p = y === undefined ? x : x * this.w + y

    if (p >= this.l) {
      throw new Error(`Index out of bounds - calculated index ${p} is beyond size of height field ${this.l}`)
    }
    const v = this.f[p]
    if (typeof v !== 'number') {
      return 0
    }
    return v
  }

  indexToXY(ind: number): [number, number] {
    const x = ind % this.w
    const y = (ind - x) / this.w
    return [x, y]
  }

  set(x: number, y: number, v: number): void {
    const p = x * this.w + y
    if (p >= this.l) {
      throw new Error(`Index out of bounds - calculated index ${p} is beyond size of height field ${this.l}`)
    }
    this.f[p] = v
  }

  /**
   * Returns list of coordinates that haven't been set
   */
  getUnset(): number[] {
    const u: number[] = []
    for (let p = 0; p < this.l; p++) {
      if (typeof this.f[p] !== 'number') {
        u.push(p)
      }
    }
    return u
  }

  toString(): string {
    let s = ''
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.w; y++) {
        s += `${this.get(x, y)} `
      }
      s = `${s.trim()}\n`
    }
    return s.trim()
  }

  /**
   * Returns a Three.js geometry object representing the heightfield.
   */
  geometry(minHeight = 0, maxHeight = 1): THREE.BufferGeometry {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    const normals: number[] = []
    const colors: number[] = []
    const half = this.w / 2

    for (let i = 0; i < this.l; i++) {
      const xy = this.indexToXY(i)
      const x = xy[0]
      const y = xy[1]
      const zElev = this.get(i) * (maxHeight - minHeight) + minHeight

      const v0 = new THREE.Vector3(x - 0.5 - half, minHeight, y - 0.5 - half)
      const v1 = new THREE.Vector3(x + 0.5 - half, minHeight, y - 0.5 - half)
      const v2 = new THREE.Vector3(x - 0.5 - half, zElev, y - 0.5 - half)
      const v3 = new THREE.Vector3(x + 0.5 - half, zElev, y - 0.5 - half)
      const v4 = new THREE.Vector3(x - 0.5 - half, minHeight, y + 0.5 - half)
      const v5 = new THREE.Vector3(x + 0.5 - half, minHeight, y + 0.5 - half)
      const v6 = new THREE.Vector3(x - 0.5 - half, zElev, y + 0.5 - half)
      const v7 = new THREE.Vector3(x + 0.5 - half, zElev, y + 0.5 - half)

      let norm = new THREE.Vector3(0, -1, 0)
      pushTriangle(positions, normals, colors, v0, v2, v3, norm, minHeight, maxHeight)
      pushTriangle(positions, normals, colors, v0, v3, v1, norm, minHeight, maxHeight)
      norm = new THREE.Vector3(0, 1, 0)
      pushTriangle(positions, normals, colors, v4, v7, v6, norm, minHeight, maxHeight)
      pushTriangle(positions, normals, colors, v4, v5, v7, norm, minHeight, maxHeight)
      norm = new THREE.Vector3(1, 0, 0)
      pushTriangle(positions, normals, colors, v5, v1, v7, norm, minHeight, maxHeight)
      pushTriangle(positions, normals, colors, v1, v3, v7, norm, minHeight, maxHeight)
      norm = new THREE.Vector3(-1, 0, 0)
      pushTriangle(positions, normals, colors, v0, v4, v6, norm, minHeight, maxHeight)
      pushTriangle(positions, normals, colors, v0, v6, v2, norm, minHeight, maxHeight)
      norm = new THREE.Vector3(0, 0, 1)
      pushTriangle(positions, normals, colors, v7, v3, v2, norm, minHeight, maxHeight)
      pushTriangle(positions, normals, colors, v7, v2, v6, norm, minHeight, maxHeight)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    return geo
  }
}
