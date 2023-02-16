<script>
	import { getId } from './helper';
	export let name;
</script>

<label for={getId(name)} {...$$props}>
	<slot />
</label>