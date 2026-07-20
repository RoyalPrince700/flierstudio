const DEFAULT_GAP = 140

/** Pack board items into a grid and attach x/y positions. */
export function layoutBoardItems(items, { gap = DEFAULT_GAP, columns = 3 } = {}) {
  if (!items.length) {
    return { items: [], bounds: { width: gap, height: gap } }
  }

  const colWidths = []
  const rowHeights = []

  items.forEach((item, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)
    colWidths[col] = Math.max(colWidths[col] || 0, item.width)
    rowHeights[row] = Math.max(rowHeights[row] || 0, item.height)
  })

  const colX = []
  let x = 0
  colWidths.forEach((width, col) => {
    colX[col] = x
    x += width + gap
  })

  const rowY = []
  let y = 0
  rowHeights.forEach((height, row) => {
    rowY[row] = y
    y += height + gap
  })

  const laidOut = items.map((item, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)
    return {
      ...item,
      x: colX[col],
      y: rowY[row],
    }
  })

  return {
    items: laidOut,
    bounds: {
      width: x,
      height: y,
    },
  }
}

export function createProject({ id, name, brand, description, color, fliers }) {
  const { items, bounds } = layoutBoardItems(fliers)
  return {
    id,
    name,
    brand,
    description,
    color,
    boardItems: items,
    bounds,
    defaultItemId: items[0]?.id ?? null,
    flierCount: items.length,
  }
}
