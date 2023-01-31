<script lang="ts">
	import { onMount } from 'svelte'
	import { drawLine } from './draw'
	import type { Point } from './draw'
	import { getKeyPosition, init } from './keys'
	import { fade, fly } from 'svelte/transition'
	import * as svgCanvas from './canvas-svg'

	// Global requestAnimationFrame ID so we can cancel it when user clicks on "Draw again"
	let rafID: number
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D
	let input: HTMLInputElement
	let inputValue: string

	const onInput = (e: Event) => draw((e.target as HTMLInputElement).value)

	onMount(() => {
		;(window as any).C3S = new (window as any).C2S(1500, 1500)
		canvas.height = canvas.width
		// canvas.height = canvas.width
		init(canvas.width, canvas.height)
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = '#0c4a6e'
		;(window as any).C3S.fillStyle = '#0c4a6e'
		ctx.lineCap = 'round'
		;(window as any).C3S.lineCap = 'round'
		// ctx.lineWidth = 20
	})

	function draw(s: string) {
		cancelAnimationFrame(rafID)
		if (s.length < 2) {
			canvas.style.opacity = '0'
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			return
		}
		canvas.style.opacity = '100'
		// Cancel previous animation
		s = s.toLowerCase()
		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		;(window as any).C3S.clearRect(0, 0, canvas.width, canvas.height)

		// Draw polygon
		const chars = [...s]
		let prev = getKeyPosition(chars[0])
		const drawKeyLine = (i: number) => {
			const current = getKeyPosition(chars[i])
			if (current == prev) {
				if (i < chars.length) drawKeyLine(++i)
				return
			}
			drawLine(canvas, ctx, rafID, prev, current, 50, () => {
				i++
				if (i < chars.length) drawKeyLine(i)
			})
			prev = current
		}
		drawKeyLine(1)
	}

	function saveSvg() {
		const svg = (window as any).C3S.getSerializedSvg()
		download(`${input.value}.svg`, svg)
	}

	function download(filename: string, text: string) {
		var element = document.createElement('a')
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
		element.setAttribute('download', filename)

		element.style.display = 'none'
		document.body.appendChild(element)

		element.click()

		document.body.removeChild(element)
	}
</script>

<div class="justify-center border-2 border-blue-600  m-auto h-full w-full bg-sky-50 text-center">
	<div class="bg-sky-900/60 shadow-2xl backdrop-blur-sm rounded-full w-fit m-auto mt-3">
		<h1 class="text-3xl font-bold  m-10 pt-1 pb-3 text-indigo-50 text-start  pl-5">
			Key ⌨️<br /> &nbsp Strings 🧶
		</h1>
	</div>

	<div class="mt-5 flex justify-center">
		<input
			bind:this={input}
			bind:value={inputValue}
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
	{#if inputValue && inputValue.length > 1}
		<button
			class=" bg-sky-900/40 shadow-2xl rounded-full w-fit mx-auto mt-3"
			on:click={saveSvg}
			in:fly={{ duration: 500, y: 50, delay: 0 }}
			out:fade
		>
			<h2 class="text-2xl font-bold  text-indigo-50 text-start p-1 px-5">Download</h2>
		</button>
	{/if}
	<canvas class=" m-auto w-3/4 h-fit" bind:this={canvas} width="1500" height="1500" />
</div>
