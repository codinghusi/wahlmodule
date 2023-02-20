<script>
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

<div class="container" bind:this={container} class:max-h-48={!shown} class:h-full={shown}>

	<div bind:this={child}>
		<slot />
	</div>

	<button class="button" class:backdrop-blur-md={!shown} class:hidden={smallEnough} on:click={toggle}>
		{#if !shown}
			Mehr anzeigen
		{:else}
			Weniger anzeigen
		{/if}
	</button>
</div>


<style>
    .container {
        @apply relative overflow-hidden pb-12;
    }

    .button {
		@apply absolute btn btn-ghost bottom-0;
		@apply w-full h-12;
	}

</style>