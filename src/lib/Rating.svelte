<script>
	export let stars = 0;
	export let disabled = false;
	let name = "rating";
	let clazz = '';
	export {clazz as class};

	let radioClasses = "mask mask-star-2 bg-orange-400";
	if (disabled) {
		radioClasses += " cursor-default";
	}
</script>

<form class={`rating ${clazz}`}>
	<input type="radio" bind:group={stars} disabled={disabled} value={0} name={name} class={`${radioClasses} hidden`} />
	<input type="radio" bind:group={stars} disabled={disabled} value={1} name={name} class={radioClasses} />
	<input type="radio" bind:group={stars} disabled={disabled} value={2} name={name} class={radioClasses} />
	<input type="radio" bind:group={stars} disabled={disabled} value={3} name={name} class={radioClasses} />
	<input type="radio" bind:group={stars} disabled={disabled} value={4} name={name} class={radioClasses} />
	<input type="radio" bind:group={stars} disabled={disabled} value={5} name={name} class={radioClasses} />
</form>