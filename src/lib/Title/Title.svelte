<script>
	import { setTitle } from './titleStore';

	export let title;
	setTitle(title);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>