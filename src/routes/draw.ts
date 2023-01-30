const FRAME_DURATION = 1000 / 60 // 60fps frame duration ~16.66ms

export type Point = {
  x: number
  y: number
}

// Math
function getVectorFromTwoPoints(point1: Point, point2: Point): Point {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  }
}

function getDistanceBetweenPoints(point1: Point, point2: Point): number {
  const x = point1.x - point2.x
  const y = point1.y - point2.y

  return Math.sqrt(x * x + y * y)
}

// Function to animate line drawing
export function drawLine(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  rafID: number,
  startPoint: Point,
  endPoint: Point,
  drawingSpeed: number,
  onAnimationEnd: () => void,
  startingLength = 0
) {
  let lastUpdate = Date.now()

  // Set initial state
  let currentPoint = startPoint
  const vector = getVectorFromTwoPoints(startPoint, endPoint)
  const startToEndDistance = getDistanceBetweenPoints(startPoint, endPoint)

  const lineStep = drawingSpeed / startToEndDistance

  const vectorStep = {
    x: vector.x * lineStep,
    y: vector.y * lineStep,
  }

  const animate = () => {
    const now = Date.now()
    const delta = (now - lastUpdate) / FRAME_DURATION

    const deltaVector = {
      x: vectorStep.x * delta,
      y: vectorStep.y * delta,
    }

    // Add starting length if any
    if (startingLength) {
      const startingLengthFactor = startingLength / startToEndDistance

      deltaVector.x += vector.x * startingLengthFactor
      deltaVector.y += vector.y * startingLengthFactor

      // We've drawn it once, we don't want to draw it again
      startingLength = 0
    }

    // Set next point
    let nextPoint = {
      x: currentPoint.x + deltaVector.x,
      y: currentPoint.y + deltaVector.y,
    }

    let isFinished = false

    const startToNextPointDistance = getDistanceBetweenPoints(startPoint, nextPoint)

    // The next point is past the end point
    if (startToNextPointDistance >= startToEndDistance) {
      isFinished = true
      nextPoint = endPoint
    }

    const NATIVE_RES = 512 // the minimum resolution we reasonably expect
    const LINE_WIDTH = 1   // pixel width of the line at that resolution
    const actualLineWidth = LINE_WIDTH * (Math.max(canvas.width, canvas.height) / NATIVE_RES)
    ctx.lineWidth = actualLineWidth

    // Draw line segment
    ctx.beginPath()
    ctx.moveTo(currentPoint.x, currentPoint.y)
    ctx.lineTo(nextPoint.x, nextPoint.y)
    ctx.stroke()

    if (isFinished) {
      if (onAnimationEnd) {
        onAnimationEnd()
      }
      return
    }

    // Move current point to the end of the drawn segment
    currentPoint = nextPoint

    // Update last updated time
    lastUpdate = now

    // Store requestAnimationFrame ID so we can cancel it
    rafID = requestAnimationFrame(animate)
  }

  // Start animation
  animate()
}
