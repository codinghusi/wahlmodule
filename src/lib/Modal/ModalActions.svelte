<script>
	import { getId } from './helper';
	import ModalCloser from './ModalCloser.svelte';
	export let name;
	export let closeText = null;
</script>


<div class="modal-action">
	<slot />
	<slot name='actions' />
	{#if closeText !== null}
		<ModalCloser name={name} class="btn">
			{closeText}
		</ModalCloser>
	{/if}
</div>
