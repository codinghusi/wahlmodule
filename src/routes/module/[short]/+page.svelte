<script>
	import Rating from '../../../lib/Rating.svelte';
	import FlagIcon from '../../../lib/icons/FlagIcon.svelte';
	import Modal from '../../../lib/Modal/Modal.svelte';
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import Title from '../../../lib/Title/Title.svelte';
	import FlagAReviewModal from './FlagAReviewModal.svelte';
	import SpecificRatings from './SpecificRatings.svelte';
	import ArrowRight from '../../../lib/icons/ArrowRight.svelte';
  import CreateAReviewModal from './CreateAReviewModal.svelte';
  import SvelteMarkdown from 'svelte-markdown'

	export let data;
	let module;
	$: ({ module } = data);

	let reviews;

	$: reviews = module.reviews.map((r, i) => ({
		...r,
		id: i
	}));

	let reviewOpened = false;
	let currentReview = null;
</script>

<Title title={`Modul: ${module.name}`} />

<section class="prose">

	<!-- Description -->
	<article>
		<h2 class="mt-0">Beschreibung</h2>
		<p class="mt-1">
			<SvelteMarkdown source={module.description} />
		</p>
		<p class="m-0">
			<span class="font-bold">Dozent{module.lecturers.length > 1 ? 'en' : ''}:</span>
			{module.lecturers.map(l => l.fullName).join(', ')}
		</p>
	</article>


	<!-- Ratings -->
	{#if module.rated}
		<article>
			<h2 class="w-full flex justify-between">
				Bewertungen
				<Rating stars={module.overallStars} disabled={true} class="self-center" />
			</h2>

			<SpecificRatings specificRatings={module.specificRatings} />
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

		{#if module.reviews.length === 0}
			<p class="mt-0">
				Dieses Modul wurde noch nicht rezensiert.
			</p>
		{:else}
			<ul class="flex flex-wrap gap-x-8 gap-y-2 not-prose">

				{#each module.reviews as review}
					<li class="card w-full bg-base-100 shadow-xl">

						<ModalOpener class="card-body cursor-pointer" name="review" on:click={() => currentReview = review}>
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

					</li>
				{/each}
			</ul>
		{/if}
	</article>
</section>

<FlagAReviewModal name="flag" />
<CreateAReviewModal name="create-review" />

<Modal name="review" closeText="Nice!">
	{#if currentReview !== null}
		<div class="flex justify-between">
			<span class="font-bold">Von {currentReview.author ?? '<Anonym>'}</span>
			<Rating stars={currentReview.overallStars} disabled={true} />
		</div>

		<!-- The Review (full) -->
		<p class="my-2">
			{currentReview.text}
		</p>
	{/if}

	<span slot="actions" class="flex-1">
			<ModalOpener class="btn btn-error" name="flag" disabled>
				<FlagIcon />
				Melden
			</ModalOpener>
		</span>
</Modal>