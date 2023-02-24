<script>
	import Rating from '../../../lib/Rating/Rating.svelte';
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import Title from '../../../lib/Title/Title.svelte';
	import Description from './Description.svelte';
	import RatingList from '../../../lib/Rating/RatingList.svelte';
	import { onMount } from 'svelte';
	import { getReview } from '../../api/calls';
	import ReviewList from './ReviewList.svelte';
	import ReviewFormModal from './ReviewFormModal.svelte';
	import { errorMessage } from '../../../lib/Message/MessageStore';
	import EditIcon from '../../../lib/icons/EditIcon.svelte';
	import { GITHUB_LINK } from '../../../lib/Data/definitions';

	export let data;
	let module, possibleRating, openReviewModal;
	$: ({ module, possibleRating, openReviewModal } = data);

	// load existing review
	let review = null;

	function storageKey(key) {
		return `module-review-${module.short}-${key}`;
	}

	function storageGet(key) {
		return localStorage.getItem(storageKey(key)) ?? null;
	}

	function storageSet(key, value) {
		localStorage.setItem(storageKey(key), value);
	}

	onMount(async () => {
		const id = storageGet('id');
		if (id) {
			const response = await getReview(id).catch(() => ({ success: false }));
			if (response.success) {
				review = response.review;
				review.editToken = storageGet('editToken');
			}
			// TODO: maybe add an error message
		}
	});


	let reviewModal;
	$: if (openReviewModal) {
		reviewModal.open();
	}

	let reviews;

	async function submit(e) {
		const r = e.detail.review;
		storageSet("id", r.id);
		storageSet("editToken", r.editToken);
		const freshReview = (await getReview(r.id)).review;
		if (!freshReview) {
			errorMessage("Das dargestellte Review von dir könnte fehlerhaft sein. Lade die Seite neu.")
		} else {
			review = { ...r, ...freshReview };
		}
	}
</script>

<Title title={`Modul: ${module.name}`} />

<section class="prose prose-h2:text-3xl">

	<!-- Description -->
	<article>
		<h2 class="mt-0 flex justify-between">
			Beschreibung
			<a class="btn btn-ghost" target="_blank" href="{GITHUB_LINK}/edit/main/data/modules/{module.fileName ?? module.fileName}">
				<EditIcon />
			</a>
		</h2>
		<Description {module} />
	</article>


	<!-- Ratings -->
	{#if module.rated}
		<article>
			<h2 class="w-full flex justify-between flex-wrap">
				Bewertung
				<Rating stars={module.overallStars} disabled={true} class="self-center" size="lg" name="overall-rating" />
			</h2>

			<RatingList class="flex justify-center items-center" ratings={module.specificRatings} />
		</article>
	{/if}

	<!-- Reviews -->
	<article>
		<h2 class="flex flex-wrap gap-4 justify-between">
			Rezensionen
			<ModalOpener class="btn" name="create-review">
				{#if review}
					Bearbeiten
				{:else}
					Bewerten
				{/if}
			</ModalOpener>
		</h2>



		<ReviewList {module} bind:this={reviews} ownedReview={review} />

	</article>
</section>

<ReviewFormModal name="create-review" {possibleRating} {module} bind:this={reviewModal} ownedReview={review} on:submit={submit} />