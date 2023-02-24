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
	import { Review } from '@prisma/client';

	export let name;
	export let possibleRating;
	export let module;
	export let ownedReview = null;

	let wipReview;
	let authorName = '';
	let text = '';
	let editToken = undefined;
	let id = undefined;
	let ratings = possibleRating.map(r => ({ stars: 0, ...r }));

	$: wipReview = {
		editToken,
		id,
		authorName,
		text,
		ratings
	};

	$: updateValues(ownedReview);

	function updateValues(review) {
		if (!review) {
			return;
		}
		authorName = review.authorName;
		text = review.text;
		ratings = possibleRating.map(r => ({
			stars: review.ratings.find(r2 => r2.ratingId === r.id)?.stars ?? 0,
			...r
		}));
		editToken = review.editToken;
		id = review.id;
	}


	let loading = false;
	let submitEnabled;
	$: {
		submitEnabled = text?.length >= REVIEW_TEXT_MIN_LENGTH
			&& ratings.filter(rating => rating.stars > 0).length >= MIN_RATING_COUNT
			&& (!authorName || authorName?.length === 0 || authorName?.length >= AUTHOR_NAME_MIN_LENGTH);
	}

	let closer;
	let dispatch = createEventDispatcher();
	async function submit() {
		loading = true;
		const response = await createReview({
			id: ownedReview?.id,
			editToken: ownedReview?.editToken,
			moduleShort: module.short,
			authorName,
			text: text,
			ratings: ratings
				.filter(rating => rating.stars > 0)
				.map(rating => ({ id: rating.id, stars: rating.stars }))
		}).catch(() => ({ success: false }));
		loading = false;

		if (!response?.success) {
			errorMessage("Es ist ein Fehler aufgetreten. Versuche es später noch einmal.");
			return;
		}

		successMessage("Bewertung erfolgreich abgesendet! Lade die Seite neu, um die Auswirkung auf die Sterne zu sehen.");

		dispatch('submit', { review: response.review });
		closer.close();
	}

</script>


<Modal name={name}>
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


	<form class="form-controll w-full">
		<RatingList bind:ratings disabled={false} namePrefix="modal" />

		<label class="label mt-2">
			<span class="label-text">Bewertung* <em>(min. 10 Zeichen)</em></span>
		</label>

		<textarea name="reason" class="textarea textarea-bordered w-full" minlength="10" bind:value={text}
				  required></textarea>
	</form>

	<span slot="actions">
			<ModalCloser class="btn btn-ghost" name={name} bind:this={closer}>
				Abbrechen
			</ModalCloser>
			<button class="btn btn-primary" class:loading disabled={!submitEnabled} name={name} on:click={submit}>
				{#if ownedReview?.editToken}
					Bearbeiten
				{:else}
					Absenden
				{/if}
			</button>
		</span>
</Modal>