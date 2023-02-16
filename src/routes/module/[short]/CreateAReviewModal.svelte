<script>
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../../lib/Modal/ModalCloser.svelte';
  import Rating from '../../../lib/Rating.svelte';

	export let name;
	const rateable = ['Spannend', 'Lustig'];

	const ratings = Object.fromEntries(rateable.map(r => [r, 0]));
</script>


<Modal name={name}>
	<div class="flex justify-between">
		<span class="font-bold">Bewertung schreiben</span>
	</div>

	<form class="form-controll w-full">
		<ul>
			{#each Object.keys(ratings) as name}
				<li>
					<p>{name}</p>
					<Rating stars={ratings[name]} />
				</li>
			{/each}
		</ul>

		<label class="label">
			<span class="label-text">Bewertung*</span>
		</label>
		<textarea name="reason" class="textarea textarea-bordered w-full" required></textarea>
	</form>

	<span slot="actions">
			<ModalCloser class="btn btn-secondary" name={name}>
				Abbrechen
			</ModalCloser>
			<ModalCloser class="btn btn-primary" name={name}>
					Absenden
			</ModalCloser>
		</span>
</Modal>