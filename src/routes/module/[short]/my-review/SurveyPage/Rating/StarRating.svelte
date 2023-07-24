<script>
	import { createEventDispatcher } from 'svelte';

	export let rating;
	export let stars = 0;

	let radioClasses = 'mask mask-star-2 bg-orange-400';
	let previous = stars;
	const dispatch = createEventDispatcher();

	function update() {
		if (previous !== stars) {
			previous = stars;
			dispatch('change', { stars });
		}
	}

	function remove() {
		stars = 0;
		update();
	}
</script>

<div>
	<form class="rating rating-lg flex justify-between">
		<input type="radio" bind:group={stars} on:change={update} value={0} class="rating-hidden hidden" />

		<input type="radio" bind:group={stars} on:change={update} value={1}
			   class={radioClasses} />
		<input type="radio" bind:group={stars} on:change={update} value={2}
			   class={radioClasses} />
		<input type="radio" bind:group={stars} on:change={update} value={3}
			   class={radioClasses} />
		<input type="radio" bind:group={stars} on:change={update} value={4}
			   class={radioClasses} />
		<input type="radio" bind:group={stars} on:change={update} value={5}
			   class={radioClasses} />
	</form>

	<div class="grid grid-cols-3">
		<span class="my-2.5 text-left">
			{rating.params.bad}
		</span>

		<span>
			<button class={`mt-3 btn btn-outline btn-error btn-sm ${stars > 0 ? '' : 'hidden'}`}
					on:click={remove}>
				Entfernen
			</button>
		</span>

		<span class="my-2.5 text-right">
			{rating.params.good}
		</span>
	</div>
</div>

