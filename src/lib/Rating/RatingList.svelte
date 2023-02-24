<script>
	import LabeledRating from './LabeledRating.svelte';

	export let namePrefix = "";
	export let ratings;
	export let disabled = true;
	export let size = undefined;
	let clazz = "";
	export {clazz as class};
</script>


<!--<ul class={`${clazz} flex flex-wrap gap-x-8 gap-y-4 list-none`}>-->
<ul class="{clazz} grid grid-cols-2 gap-x-8 gap-y-4 list-none">
	{#each ratings as rating, i (i)}
		<LabeledRating
			{size}
			tooltipDir={i % 2 === 0 ? 'right' : 'left'}
			label={rating.label}
			stars={rating.stars}
			explanation={rating.explanation}
			{disabled}
			on:change={e => rating.stars = e.detail.stars}
			name="{namePrefix.length ? (namePrefix + '-') : ''}rating-{rating.id}" />
	{/each}
</ul>