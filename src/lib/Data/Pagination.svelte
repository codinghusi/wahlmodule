<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let total: number;
	export let pageSize: number;
	export let page = 0;

	const dispatch = createEventDispatcher();

	let pageCount;
	$: pageCount = Math.ceil(total / Math.max(pageSize, 1));

	function back() {
		page -= 1;
		dispatch('change', { page, action: 'back', before: page + 1 });
	}

	function next() {
		page += 1;
		dispatch('change', { page, action: 'next', before: page - 1 });
	}

</script>

<div class="btn-group" class:hidden={pageCount < 2}>
	<button class="btn" on:click={back} disabled={page <= 0}>«</button>
	<button class="btn">Seite {page + 1}/{pageCount}</button>
	<button class="btn" on:click={next} disabled={page >= pageCount - 1}>»</button>
</div>