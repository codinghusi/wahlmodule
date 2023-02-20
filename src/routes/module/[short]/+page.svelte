<script>
	import Rating from '../../../lib/Rating/Rating.svelte';
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import Title from '../../../lib/Title/Title.svelte';
	import FlagAReviewModal from './FlagAReviewModal.svelte';
	import ArrowRight from '../../../lib/icons/ArrowRight.svelte';
	import CreateAReviewModal from './CreateAReviewModal.svelte';
	import Description from './Description.svelte';
	import Reviews from './Reviews.svelte';
	import RatingList from '../../../lib/Rating/RatingList.svelte';

	export let data;
	let module, possibleRating, openReviewModal;
	$: ({ module, possibleRating, openReviewModal } = data);

	let reviewModal;
	$: if (openReviewModal) {
		reviewModal.open();
	}

	let reviews;
	function submit() {
		reviews.reload();
	}
</script>

<Title title={`Modul: ${module.name}`} />

<section class="prose prose-h2:text-3xl">

	<!-- Description -->
	<article>
		<h2 class="mt-0">Beschreibung</h2>
		<Description {module} />
	</article>


	<!-- Ratings -->
	{#if module.rated}
		<article>
			<h2 class="w-full flex justify-between">
				Bewertung
				<Rating stars={module.overallStars} disabled={true} class="self-center" size="lg" />
			</h2>

			<RatingList class="flex justify-center items-center" ratings={module.specificRatings} />
		</article>
	{/if}

	<!-- Reviews -->
	<article>
		<h2 class="flex flex-wrap gap-4 justify-between">
			Rezensionen
			<ModalOpener class="btn btn-secondary" name="create-review">
				Bewerten <ArrowRight />
			</ModalOpener>
		</h2>

		<Reviews {module} bind:this={reviews} />

	</article>
</section>

<FlagAReviewModal name="flag" {module} />
<CreateAReviewModal name="create-review" {possibleRating} {module} bind:this={reviewModal} on:submit={submit} />