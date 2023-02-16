<script>
	import Rating from '../../../lib/Rating.svelte';

	export let specificRatings;
</script>

<ul class='flex flex-wrap gap-x-8 gap-y-4 not-prose'>
	{#each specificRatings as rating}
		<li class="flex flex-col">
			<p>{rating.name}</p>
			<Rating stars={rating.stars} disabled={true} />
		</li>
	{/each}
</ul>