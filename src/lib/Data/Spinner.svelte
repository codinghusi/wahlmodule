<script>
	export let showContent = undefined;
	export let loading;

	let show;
	$: show = (showContent === undefined && !loading) || showContent;
</script>

<div class="relative" class:py-12={!show}>
	{#if show}
		<div class:blur-sm={loading}>
			<slot />
		</div>
	{/if}
	{#if loading}
		<div class="spinning-container">
			<div class="rounded p-4 bg-base-100 shadow-lg">
				<progress class="progress w-56"></progress>
			</div>
		</div>
	{/if}
</div>

<style>
	.spinning-container {
		@apply absolute w-full h-full flex justify-center items-center inset-0;
	}
</style>