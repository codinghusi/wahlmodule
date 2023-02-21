<script>
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import Rating from '../../../lib/Rating/Rating.svelte';
	import ArrowRightIcon from '../../../lib/icons/ArrowRightIcon.svelte';

	export let review;
	export let currentReview = null;
	export let modalName = "review"
</script>

<li class="card w-full bg-base-100 shadow-xl">

	<ModalOpener class="card-body cursor-pointer" name={modalName} on:click={() => currentReview = review}>
		<div class="flex">
			<div class="flex-1">
				<div class="card-title font-bold text-base m-0 mb-2 flex justify-between">
					<span>Von {review.authorName ?? '<Anonym>'}</span>
					<Rating stars={review.overallStars} disabled={true} name="review-{review.id}" />
				</div>

				<!-- The Review (shortened) -->
				<p class="text-base text-justify m-0">
					{(review.text.length > 103) ? (review.text.slice(0, 100) + "...") : (review.text)}
				</p>
			</div>
			<div class="flex justify-center items-center ml-8">
				<ArrowRightIcon />
			</div>
		</div>
	</ModalOpener>

</li>