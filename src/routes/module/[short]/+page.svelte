<script>
	import Rating from '../../../lib/Rating.svelte';
	import FlagIcon from '../../../lib/icons/FlagIcon.svelte';
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import ModalCloser from '../../../lib/Modal/ModalCloser.svelte';
	import Title from '../../../lib/Title/Title.svelte';
	import FlagAReviewModal from './FlagAReviewModal.svelte';
	import SpecificRatings from './SpecificRatings.svelte';
	import ArrowRight from '../../../lib/icons/ArrowRight.svelte';

	export let module;
	export {module as data}

	let reviews;

	$: reviews = module.reviews.map((r, i) => ({
		...r,
		id: i
	}));
</script>

<Title title={`Modul: ${module.name}`} />

<section class="prose">

	<!-- Description -->
	<article>
		<h2 class="mt-0">Beschreibung</h2>
		<p class="mt-1">{module.description}</p>
		<p class="font-bold m-0">Dozent: {module.lecturers.join(', ')}</p>
	</article>


	<!-- Ratings -->
	<article>
		<h2 class="w-full flex justify-between">
			Bewertungen
			<Rating stars={module.overallStars} disabled={true} class="self-center"/>
		</h2>

		<SpecificRatings specificRatings={module.specificRatings} />
	</article>


	<!-- Reviews -->
	<article>
		<h2> Rezensionen </h2>

		<ul class='flex flex-wrap gap-x-8 gap-y-2 not-prose'>
			{#each reviews as review}
				<li class="card w-full bg-base-100 shadow-xl">

					<ModalOpener class='card-body cursor-pointer' name={`review-${review.id}`}>
						<div class="flex">
							<div>
								<div class="card-title font-bold text-base m-0 mb-2 flex justify-between">
									<span>Von {review.author ?? '<Anonym>'}</span>
									<Rating stars={review.overallStars} disabled={true} />
								</div>
								<!-- The Review (short) -->
								<p class="text-base text-justify m-0">
									{(review.text.length > 103) ? (review.text.slice(0, 100) + "...") : (review.text)}
								</p>
							</div>
							<div class="flex justify-center items-center ml-8">
								<ArrowRight />
							</div>
						</div>

					</ModalOpener>

					<Modal name={`review-${review.id}`} closeText="Nice!">
						<div class='flex justify-between'>
							<span class="font-bold">Von {review.author ?? '<Anonym>'}</span>
							<Rating stars={review.overallStars} disabled={true} />
						</div>

						<!-- The Review (full) -->
						<p class="my-2">
							{review.text}
						</p>

						<span slot="actions" class="flex-1">
							<ModalOpener class='btn btn-error' name={`flag-${review.id}`}>
								<FlagIcon />
								Melden
							</ModalOpener>
						</span>
					</Modal>

					<FlagAReviewModal name={`flag-${review.id}`} />
				</li>
			{/each}
		</ul>
	</article>

	<p></p>
</section>