<script>
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../../lib/Modal/ModalCloser.svelte';
	import {
		AUTHOR_NAME_MIN_LENGTH,
		MIN_RATING_COUNT,
		REVIEW_TEXT_MIN_LENGTH
	} from '../../../lib/Data/definitions';
	import RatingList from '../../../lib/Rating/RatingList.svelte';
	import { createEventDispatcher } from 'svelte';
	import { createReview } from '../../api/calls';
	import { errorMessage, successMessage } from '../../../lib/Message/MessageStore';

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
	}

	async function submit() {
		let failed = false;
		const response = await createReview({
			moduleShort: module.short,
			authorName,
			text: reviewText,
			ratings: ratings
				.filter(rating => rating.stars > 0)
				.map(rating => ({ id: rating.id, stars: rating.stars }))
		}).catch(() => failed = true);

		if (!response?.success || failed) {
			errorMessage("Es ist ein Fehler aufgetreten. Versuche es später noch einmal.");
			return;
		}

		// Reset form
		reviewText = '';
		authorName = '';
		initRatings();
		dispatch('submit', { review: response.review });
		closer.close();
		successMessage("Bewertung erfolgreich abgesendet!");
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
			<span class="label-text">Wie heißt du? <em>(optional, min. 5 Zeichen)</em></span>
		</div>
		<input type="text" placeholder="<Anonym>" bind:value={authorName} minlength={AUTHOR_NAME_MIN_LENGTH}
			   class="input input-bordered w-full max-w-xs" />
	</label>


	<form class="form-controll w-full" bind:this={form}>
		<RatingList bind:ratings disabled={false} />

		<label class="label mt-2">
			<span class="label-text">Bewertung* <em>(min. 10 Zeichen)</em></span>
		</label>

		<textarea name="reason" class="textarea textarea-bordered w-full" minlength="10" bind:value={reviewText}
				  required></textarea>
	</form>

	<span slot="actions">
			<ModalCloser class="btn btn-ghost" name={name} bind:this={closer}>
				Abbrechen
			</ModalCloser>
			<button class="btn btn-primary" disabled={!submitEnabled} name={name} on:click={submit}>
					Absenden
			</button>
		</span>
</Modal>