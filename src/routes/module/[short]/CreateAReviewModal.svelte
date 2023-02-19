<script>
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../../lib/Modal/ModalCloser.svelte';
	import {
		AUTHOR_NAME_MIN_LENGTH,
		MIN_RATING_COUNT,
		REVIEW_TEXT_MIN_LENGTH
	} from '../../api/create-review/definitions';
	import RatingList from '../../../lib/Rating/RatingList.svelte';
	import { createEventDispatcher } from 'svelte';

	export let name;
	export let possibleRating;
	export let module;

	let dispatch = createEventDispatcher();

	let modal;

	export function open() {
		modal.open();
	}

	let ratings;
	initRatings();

	function initRatings() {
		ratings = possibleRating.map(r => ({ stars: 0, ...r }));
	}

	let reviewText = '';
	let submitEnabled;

	let form;
	let closer;
	let authorName;

	$: {
		submitEnabled = reviewText?.length >= REVIEW_TEXT_MIN_LENGTH
			&& ratings.filter(rating => rating.stars > 0).length >= MIN_RATING_COUNT
			&& (!authorName || authorName?.length === 0 || authorName?.length >= AUTHOR_NAME_MIN_LENGTH);
		submitEnabled = true;
	}

	async function submit() {
		const response = await fetch(`/api/create-review`, {
			method: 'POST',
			body: JSON.stringify({
				review: {
					moduleShort: module.short,
					authorName,
					text: reviewText,
					ratings: ratings
						.filter(rating => rating.stars > 0)
						.map(rating => ({ id: rating.id, stars: rating.stars }))
				}
			})
		});
		const json = await response.json();
		if (!json?.success) {
			alert('Fehler beim Absenden. Versuche es später noch einmal.');
			return;
		}
		reviewText = '';
		authorName = '';
		initRatings();
		dispatch('submit', { review: json.review });
		closer.close();
	}

</script>


<Modal name={name} bind:this={modal}>
	<div class="">
		<h1 class="font-bold">Bewertung schreiben</h1>
		<p class="italic">Bewerte bitte mindestens 3 Kategorien und gebe einen kleinen Text dazu.</p>
	</div>

	<br />

	<label>
		<div class="label">
			<span class="label-text">Wie heißt du? (optional, min. 5 Zeichen)</span>
		</div>
		<input type="text" placeholder="<Anonym>" bind:value={authorName} minlength={AUTHOR_NAME_MIN_LENGTH}
			   class="input input-bordered w-full max-w-xs" />
	</label>


	<form class="form-controll w-full" bind:this={form}>
		<RatingList bind:ratings disabled={false} />

		<label class="label mt-2">
			<span class="label-text">Bewertung*</span>
		</label>

		<textarea name="reason" class="textarea textarea-bordered w-full" minlength="10" bind:value={reviewText}
				  required></textarea>
	</form>

	<span slot="actions">
			<ModalCloser class="btn btn-secondary" name={name} bind:this={closer}>
				Abbrechen
			</ModalCloser>
			<button class="btn btn-primary" disabled={!submitEnabled} name={name} on:click={submit}>
					Absenden
			</button>
		</span>
</Modal>