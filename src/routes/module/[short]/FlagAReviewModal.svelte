<script>
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../../lib/Modal/ModalCloser.svelte';

	export let name;
</script>


<Modal name={name} closeText="Melden (funktioniert nicht)">
	<div class='flex justify-between'>
		<span class="font-bold">Rezension melden</span>
	</div>

	<form class="form-controll w-full">
		<label class="label">
			<span class="label-text">Begründung</span>
		</label>
		<textarea name="reason" class="textarea textarea-bordered w-full" disabled></textarea>
	</form>

	<span slot="actions">
			<ModalCloser class='btn btn-secondary' name={name}>
				Abbrechen
			</ModalCloser>
		</span>
</Modal>