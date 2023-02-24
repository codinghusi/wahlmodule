<script>
	import { createEventDispatcher } from 'svelte';
	import XIcon from '../icons/XIcon.svelte';
	import { infoMessage } from '../Message/MessageStore';

	export let stars = 0;
	export let disabled = false;
	export let size = 'md';
	export let name;
	let clazz = '';
	export { clazz as class };

	$: if (stars % 1 !== 0) {
		stars = Math.floor(stars);
  	}

	let radioClasses = 'mask mask-star-2 bg-orange-400';
	if (disabled) {
		radioClasses += ' cursor-default';
	}

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

	let remover;
</script>

<div class="rating rating-{size} {clazz}">
	<input type="radio" bind:group={stars} bind:this={remover} on:change={update} disabled={disabled} value={0} name={name} class="rating-hidden" />

	<input type="radio" bind:group={stars} on:change={update} disabled={disabled} value={1} name={name}
				 class={radioClasses} />
	<input type="radio" bind:group={stars} on:change={update} disabled={disabled} value={2} name={name}
				 class={radioClasses} />
	<input type="radio" bind:group={stars} on:change={update} disabled={disabled} value={3} name={name}
				 class={radioClasses} />
	<input type="radio" bind:group={stars} on:change={update} disabled={disabled} value={4} name={name}
				 class={radioClasses} />
	<input type="radio" bind:group={stars} on:change={update} disabled={disabled} value={5} name={name}
				 class={radioClasses} />

	<label class={`cursor-pointer ml-2 ${stars > 0 && !disabled ? '' : 'hidden'}`} on:click={remove}>
		<XIcon />
	</label>

</div>