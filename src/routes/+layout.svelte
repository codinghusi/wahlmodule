<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="flex flex-col justify-center">
	<Header />

	<br />

	<main class="mt-4 mx-auto p-1">
		<slot />
	</main>
</div>
