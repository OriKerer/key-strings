<script lang="ts">
	import { onMount } from 'svelte'
	import { drawLine } from './draw'
	import type { Point } from './draw'
	import { getKeyPosition, init } from './keys'

	// Global requestAnimationFrame ID so we can cancel it when user clicks on "Draw again"
	let rafID: number
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D

	const onInput = (e: Event) => draw((e.target as HTMLInputElement).value)

	onMount(() => {
		canvas.height = canvas.width
		// canvas.height = canvas.width
		init(canvas.width, canvas.height)
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = '#0c4a6e'
		ctx.lineCap = 'round'
		// ctx.lineWidth = 20
	})

	function draw(s: string) {
		// Cancel previous animation
		cancelAnimationFrame(rafID)
		s = s.toLowerCase()
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw polygon
		const chars = [...s]
		let prev = getKeyPosition(chars[0])
		const drawKeyLine = (i: number) => {
			const current = getKeyPosition(chars[i])
			drawLine(canvas, ctx, rafID, prev, current, 50, () => {
				i++
				if (i < chars.length) drawKeyLine(i)
			})
			prev = current
		}
		drawKeyLine(1)
	}
</script>

<div class="justify-center border-2 border-blue-600  m-auto h-full w-full bg-sky-50">
	<div class="bg-sky-900/60 shadow-2xl backdrop-blur-sm rounded-full w-fit m-auto mt-3">
		<h1 class="text-3xl font-bold  m-10 p-1 pb-3 text-indigo-50 text-start px-3">
			Key ⌨️<br /> &nbsp &nbsp Strings 🧶
		</h1>
	</div>
	<div class="mt-5 flex justify-center">
		<input
			placeholder="Start Typing..."
			maxlength="256"
			on:input={onInput}
			class="
			w-4/5 rounded-full p-1 pl-3 pr-3 text-slate-900 shadow 
			outline-none ring-0
			placeholder:italic md:w-3/5
		  "
		/>
	</div>
	<canvas class=" m-auto w-3/4 h-fit" bind:this={canvas} width="1500" height="1500" />
</div>
