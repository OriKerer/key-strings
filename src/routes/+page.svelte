<script lang="ts">
	import { onMount } from 'svelte'

	type Point = {
		x: number
		y: number
	}

	const FRAME_DURATION = 1000 / 60 // 60fps frame duration ~16.66ms
	const getTime = Date.now
	const width = 1000
	const height = 1000

	// Global requestAnimationFrame ID so we can cancel it when user clicks on "Draw again"
	let rafID: number
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = '#fff'

		ctx.lineCap = 'round'
		ctx.lineWidth = 20
		draw()
	})

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
	function drawLine(
		startPoint: Point,
		endPoint: Point,
		drawingSpeed: number,
		onAnimationEnd: Function,
		startingLength = 0
	) {
		let lastUpdate = getTime()

		// Set initial state
		let currentPoint = startPoint
		const vector = getVectorFromTwoPoints(startPoint, endPoint)
		const startToEndDistance = getDistanceBetweenPoints(startPoint, endPoint)

		const lineStep = drawingSpeed / startToEndDistance

		let vectorStep = {
			x: vector.x * lineStep,
			y: vector.y * lineStep,
		}

		const animate = () => {
			const now = getTime()
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

			let newStartingLength = 0
			let isFinished = false

			const startToNextPointDistance = getDistanceBetweenPoints(startPoint, nextPoint)

			// The next point is past the end point
			if (startToNextPointDistance >= startToEndDistance) {
				newStartingLength = startToNextPointDistance - startToEndDistance
				isFinished = true
				nextPoint = endPoint
			}

			// Draw line segment
			ctx.beginPath()
			ctx.moveTo(currentPoint.x, currentPoint.y)
			ctx.lineTo(nextPoint.x, nextPoint.y)
			ctx.stroke()

			if (isFinished) {
				if (onAnimationEnd) {
					onAnimationEnd(newStartingLength)
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

	function drawPolygon(
		vertices: Point[],
		drawingSpeed: number,
		onAnimationEnd: Function,
		startingLength = 0,
		startingPointIndex = 0
	) {
		const start = vertices[startingPointIndex]
		const end = vertices[startingPointIndex + 1]

		if (startingPointIndex + 1 >= vertices.length) {
			if (onAnimationEnd) {
				onAnimationEnd()
			}
			return
		}

		drawLine(
			start,
			end,
			drawingSpeed,
			(startingLength: number) => {
				const newIndex = startingPointIndex + 1

				drawPolygon(vertices, drawingSpeed, onAnimationEnd, startingLength, newIndex)
			},
			startingLength
		)
	}

	// Demo

	const vertices = [
		{ x: 50, y: 50 },
		{ x: 450, y: 50 },
		{ x: 250, y: 450 },
		{ x: 50, y: 50 },
	]

	function draw() {
		// Cancel previous animation
		cancelAnimationFrame(rafID)
		// Clear canvas
		ctx.fillRect(0, 0, width, height)

		// Draw polygon
		drawPolygon(vertices, 50, () => console.log('done'))
	}
</script>

<h1 class="text-3xl font-bold text-center m-10 ">Key Strings</h1>
<canvas
	class="1/2 m-auto h-1/2
 border-red-500 border-2"
	bind:this={canvas}
	{width}
	{height}
/>
