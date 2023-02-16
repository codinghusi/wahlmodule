<script>
	import { getId } from './helper';
	export let name;
</script>

<label on:click for={getId(name)} {...$$props}>
	<slot />
</label>