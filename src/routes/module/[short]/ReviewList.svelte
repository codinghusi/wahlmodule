<script lang="ts">
	import ModalOpener from '../../../lib/Modal/ModalOpener.svelte';
	import Rating from '../../../lib/Rating/Rating.svelte';
	import Modal from '../../../lib/Modal/Modal.svelte';
	import FlagIcon from '../../../lib/icons/FlagIcon.svelte';
	import Spinner from '../../../lib/Data/Spinner.svelte';
	import Pagination from '../../../lib/Data/Pagination.svelte';
	import { MAX_PAGE_SIZE_REVIEWS } from '../../../lib/Data/definitions';
	import { getReviews } from '../../api/calls';
	import { onMount } from 'svelte';
	import { errorMessage } from '../../../lib/Message/MessageStore';
	import Review from './Review.svelte';

	export let module;
	export let review = null;
	export let ownedReview = null;
	let currentReview = null;

	let loading = true;
	let showContent = false;
	let page = 0;
	let total = 0;
	let reviews = [];
	const pageSize = MAX_PAGE_SIZE_REVIEWS;

	async function loadReviews(page): Promise<boolean> {
		loading = true;
		const response = await getReviews(module.short, review, page, pageSize).catch(() => ({ success: false }));
		if (response.success) {
			loading = false;
			showContent = true;
			total = response.total;
			reviews = response.reviews;
			return true;
		}
		loading = false;
		errorMessage('Die Rezensionen konnten nicht geladen werden');
		return false;
	}

	async function pageChange(e) {
		if (!await loadReviews(e.detail.page)) {
			page = e.detail.before;
		}
	}

	onMount(() => {
		loadReviews(page);
	});

	export async function reload() {
		await loadReviews(page);
	}

</script>


<Spinner {loading} {showContent}>
	{#if total === 0}
		<p class="mt-0">
			Dieses Modul wurde noch nicht rezensiert.
		</p>
	{:else}

		{#if ownedReview}
			<p class="font-bold">Deine Rezension:</p>
			<Review review={ownedReview} modalName="create-review" />
			<p class="font-bold">Andere Rezensionen:</p>
		{/if}

		<div class="flex justify-center items-center">
			<Pagination bind:page {pageSize} {total} on:change={pageChange} />
		</div>

		<ul class="flex flex-wrap gap-x-8 gap-y-2 not-prose">
			{#each reviews as review}
				<Review {review} bind:currentReview />
			{/each}
		</ul>
	{/if}
</Spinner>


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