<script lang="ts">
	import BackIcon from '../lib/icons/BackIcon.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { titleStore } from '../lib/Title/titleStore';

	let showBackButton = false;
	$: {
		const path = $page.url.pathname as string;
		showBackButton = path.startsWith('/module') || path.startsWith('/lecturer');
	}

	let title = "Wahlmodule";
	onMount(() => title = document.title);
	titleStore.subscribe(t => title = t);

</script>

<header>
	<div class="navbar bg-base-100 shadow-xl">
		<div class="navbar-start">
			{#if showBackButton}
				<button title="Zurück gehen" on:click={() => history.back()} class="btn btn-ghost">
					<BackIcon />
				</button>
			{/if}
		</div>
		<div class="navbar-center">
			<a class="btn btn-ghost normal-case text-xl">
				{title}
			</a>
		</div>

		<div class="navbar-end"></div>
	</div>
</header>