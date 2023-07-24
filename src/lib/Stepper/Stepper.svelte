<script>
	export let steps = [];
	export let current = 0;
</script>

<ul class="steps">
	{#each steps as step, i}
		<li class="step" class:step-primary={i <= current}>
			{step}
		</li>
	{/each}
</ul>