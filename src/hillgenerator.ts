import HeightField from './heightfield'

function rand(min: number | null = null, max: number | null = null): number {
  if (min === null && max === null) {
    return Math.random()
  }
  let lo = min
  if (lo === null) {
    lo = 0
  }

  let hi = max
  if (hi === null) {
    hi = 10
  }

  return Math.random() * hi + lo
}

export default function hillGenerator(
  width: number,
  min = 0,
  max = 10,
  numHills = 2,
  flattening = 1,
): HeightField {
  const field = new HeightField(width)
  let valMin: number | null = null
  let valMax: number | null = null

  const addHill = (): void => {
    const radius = Math.round(rand(min, max))
    const radiusSq = radius * radius

    const x = Math.round(rand(-radius, width + radius))
    const y = Math.round(rand(-radius, width + radius))

    let xMin = x - radius - 1
    let xMax = x + radius + 1
    if (xMin < 0) xMin = 0
    if (xMax >= width) xMax = width - 1

    let yMin = y - radius - 1
    let yMax = y + radius + 1
    if (yMin < 0) yMin = 0
    if (yMax >= width) yMax = width - 1

    for (let i = xMin; i <= xMax; i++) {
      for (let j = yMin; j <= yMax; j++) {
        const distSq = (x - i) * (x - i) + (y - j) * (y - j)
        const height = radiusSq - distSq
        if (height > 0) {
          const v = field.get(i, j) + height
          if (valMin === null || v < valMin) {
            valMin = v
          }
          if (valMax === null || v > valMax) {
            valMax = v
          }
          field.set(i, j, v)
        }
      }
    }
  }

  const normalizeHills = (): void => {
    if (valMin === null) {
      valMin = 0
    }
    if (valMax === null) {
      valMax = 0
    }
    const span = valMax - valMin
    const scale = span === 0 ? 1 : span
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        field.set(x, y, Math.round(10 * ((field.get(x, y) - valMin) / scale)))
      }
    }
  }

  const flatten = (): void => {
    if (flattening > 1) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
          let flat = 1.0
          const original = field.get(x, y)

          for (let i = 0; i < flattening; i++) {
            flat *= original
          }

          field.set(x, y, flat)
        }
      }
    }
  }

  for (let h = 0; h < numHills; h++) {
    addHill()
  }
  normalizeHills()
  flatten()

  return field
}
