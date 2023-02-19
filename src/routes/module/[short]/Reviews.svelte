<script>
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
  import ArrowRight from '../../../lib/icons/ArrowRight.svelte';
  import Rating from '../../../lib/Rating/Rating.svelte';
	import Modal from '../../../lib/Modal/Modal.svelte';
	import FlagIcon from '../../../lib/icons/FlagIcon.svelte';

  export let module;
  let currentReview = null;
</script>

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
						<div class="flex-1">
							<div class="card-title font-bold text-base m-0 mb-2 flex justify-between">
								<span>Von {review.authorName ?? '<Anonym>'}</span>
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

<Modal name="review" closeText="Nice!">
	{#if currentReview !== null}
		<div class="flex justify-between">
			<span class="font-bold">Von {currentReview.authorName ?? '<Anonym>'}</span>
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