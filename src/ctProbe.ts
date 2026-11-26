// Loaded on the first pointer move over the CT image, so the HU grids and this
// code stay out of the main bundle.
type Point = [number, number]
export type CtProbeFrame = { hu: string; contours: { d: string }[] }
export type CtProbeGrid = { width: number; height: number; scale: number }
export type CtProbeReading = { hu: number; inLabel: boolean }

const grids = new Map<string, Promise<Int16Array>>()
const polygons = new Map<string, Point[][]>()

function loadGrid(src: string, expected: number) {
  let grid = grids.get(src)
  if (!grid) {
    grid = fetch(src).then(async response => {
      if (!response.ok) throw new Error(`HU grid request failed: ${response.status}`)
      const values = new Int16Array(await response.arrayBuffer())
      if (values.length !== expected) throw new Error('HU grid has an unexpected size')
      return values
    })
    grid.catch(() => grids.delete(src))
    grids.set(src, grid)
  }
  return grid
}

function polygonsFor(frame: CtProbeFrame) {
  let parsed = polygons.get(frame.hu)
  if (!parsed) {
    parsed = frame.contours.map(contour => {
      const numbers = contour.d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
      const points: Point[] = []
      for (let index = 0; index + 1 < numbers.length; index += 2) points.push([numbers[index], numbers[index + 1]])
      return points
    })
    polygons.set(frame.hu, parsed)
  }
  return parsed
}

function insideLabel(rings: Point[][], x: number, y: number) {
  let inside = false
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]
      const [xj, yj] = ring[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/** x and y are source-image pixels inside the display crop; cropY0 maps them to contour space. */
export async function readHu(frame: CtProbeFrame, grid: CtProbeGrid, cropY0: number, x: number, y: number): Promise<CtProbeReading> {
  const values = await loadGrid(frame.hu, grid.width * grid.height)
  const column = Math.min(grid.width - 1, Math.max(0, Math.floor(x / grid.scale)))
  const row = Math.min(grid.height - 1, Math.max(0, Math.floor(y / grid.scale)))
  // Voxel centres sit at integer mask-boundary coordinates, so test the sampled voxel itself.
  return { hu: values[row * grid.width + column], inLabel: insideLabel(polygonsFor(frame), column * grid.scale, row * grid.scale + cropY0) }
}
