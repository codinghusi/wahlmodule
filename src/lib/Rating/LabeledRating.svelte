<script>
	import Rating from './Rating.svelte';
	import { createEventDispatcher } from 'svelte';

	export let label;
	export let stars;
	export let explanation;
	export let disabled = true;
	export let tooltipDir = 'bottom';
	export let size = undefined;
	let clazz = '';
	export { clazz as class };

	const dispatch = createEventDispatcher();

	function update(e) {
		dispatch('change', e.detail);
	}
</script>

<li class={clazz}>
	<div class="label flex justify-between">
		<span class="label-text">{label}</span>
		<span class="tooltip tooltip-{tooltipDir} underline cursor-help" data-tip={explanation}>?</span>
	</div>
	<Rating bind:stars {disabled} {size} on:change={update} />
</li>

<style>
	.tooltip::before {
		@apply w-48;
	}
</style>