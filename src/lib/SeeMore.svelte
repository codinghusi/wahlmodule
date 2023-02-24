<script>
	import DoubleArrowDownIcon from './icons/DoubleArrowDownIcon.svelte';
	import DoubleArrowUpIcon from './icons/DoubleArrowUpIcon.svelte';

	export let shown = false;
	let smallEnough = false;
	let child, container;
	$: smallEnough = child && container && child.clientHeight < container.clientHeight && !shown;

	export function open() {
		shown = true;
	}

	export function close() {
		shown = false;
	}

	export function toggle() {
		shown = !shown;
	}


</script>

<div class="container" bind:this={container}>

	<div bind:this={child} class:max-h-48={!shown} class:h-full={shown} class="overflow-hidden">
		<slot />
	</div>

	<button class="button" class:hidden={smallEnough} on:click={toggle}>
		{#if !shown}
			<DoubleArrowDownIcon /> Mehr anzeigen <DoubleArrowDownIcon />
		{:else}
			<DoubleArrowUpIcon /> Weniger anzeigen <DoubleArrowUpIcon />
		{/if}
	</button>
</div>


<style>
    .container {
        @apply relative;
    }

    .button {
		@apply flex gap-3;
		@apply btn btn-ghost;
		@apply w-full h-12;
	}

</style>