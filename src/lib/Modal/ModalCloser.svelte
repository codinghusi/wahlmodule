<script>
	import { getId } from './helper';
	export let name;

	$: if (!$$props.disabled) {
		delete $$props.disabled;
	}

	export function close() {
		document.getElementById(getId(name)).checked = false;
	}
</script>

<label for={getId(name)} {...$$props}>
	<slot />
</label>