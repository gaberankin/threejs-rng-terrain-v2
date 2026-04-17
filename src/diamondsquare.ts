import HeightField from './heightfield'

function rand(min: number | null = null, max: number | null = null): number {
  if (min === null && max === null) {
    return Math.random()
  }
  if (min === null) {
    min = 0
  }

  if (max === null) {
    max = 10
  }

  return Math.floor(Math.random() * max) + min
}

export default function diamondSquare(width: number, roughness = 0.2): HeightField {
  const field = new HeightField(width)

  const diamond = (x1: number, y1: number, x2: number, y2: number): void => {
    const w = x2 - x1
    if (w <= 1) {
      return
    }
    field.set(x1, y1, rand())
    field.set(x1, y2, rand())
    field.set(x2, y1, rand())
    field.set(x2, y2, rand())

    const avg = (field.get(x1, y1) + field.get(x1, y2) + field.get(x2, y1) + field.get(x2, y2)) / 4

    const xC = Math.floor((x2 - x1) / 2) + x1
    const yC = Math.floor((y2 - y1) / 2) + y1
    field.set(xC, yC, rand() * roughness + avg)

    square(x1, y1, x2, y2)
  }

  const square = (x1: number, y1: number, x2: number, y2: number): void => {
    const w = x2 - x1
    if (w <= 1) {
      return
    }

    const xC = Math.floor((x2 - x1) / 2) + x1
    const yC = Math.floor((y2 - y1) / 2) + y1

    const avgT = (field.get(x1, y1) + field.get(x1, y2) + field.get(xC, yC)) / 3
    const avgL = (field.get(x2, y1) + field.get(x2, y2) + field.get(xC, yC)) / 3
    const avgB = (field.get(x1, y2) + field.get(x2, y2) + field.get(xC, yC)) / 3
    const avgR = (field.get(x1, y1) + field.get(x2, y1) + field.get(xC, yC)) / 3

    field.set(xC, y1, rand() * roughness + avgT)
    field.set(x2, yC, rand() * roughness + avgL)
    field.set(xC, y2, rand() * roughness + avgB)
    field.set(x1, yC, rand() * roughness + avgR)

    if (xC - x1 < w) {
      diamond(x1, y1, xC, yC)
      diamond(x1, yC, xC, y2)
    }
    if (x2 - xC < w) {
      diamond(xC, y1, x2, yC)
      diamond(xC, yC, x2, y2)
    }
  }

  diamond(0, 0, width - 1, width - 1)
  return field
}
