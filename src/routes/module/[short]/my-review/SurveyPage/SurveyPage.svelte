<script>
	import Rating from './Rating/Rating.svelte';
	import { createEventDispatcher } from 'svelte';

	export let page;

	const dispatch = createEventDispatcher();

	function next() {
		dispatch('next');
	}

	function previous() {
		dispatch('previous');
	}
</script>

<div class="flex flex-col gap-16">
	{#each page.ratings as rating}
		<Rating rating={rating} />
	{/each}

	<div class="flex justify-between">
		<button class="btn btn-primary" on:click={previous}>
			Vorherige
		</button>
		<button class="btn btn-primary" on:click={next}>
			Nächste
		</button>
	</div>
</div>

