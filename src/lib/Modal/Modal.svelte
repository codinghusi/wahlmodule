<script>
	import { getId } from './helper';
	import ModalActions from './ModalActions.svelte';
	export let name;
	export let closeText = null;
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={getId(name)} class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<slot />
		{#if closeText !== null}
			<ModalActions name={name} closeText={closeText}>
				<slot name="actions" />
			</ModalActions>
		{/if}
	</div>
</div>