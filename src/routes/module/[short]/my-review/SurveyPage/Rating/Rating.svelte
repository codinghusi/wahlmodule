<script>

	import YesNoRating from './YesNoRating.svelte';
	import StarRating from './StarRating.svelte';

	export let rating;
</script>

<div class="flex flex-col justify-center text-center">
	<h3 class="text-lg font-bold mb-2">{rating.label}</h3>
	{#if rating.type === 'yes_no'}
		<YesNoRating rating={rating} />
	{:else if rating.type === 'stars'}
		<StarRating rating={rating} />
	{/if}
</div>
