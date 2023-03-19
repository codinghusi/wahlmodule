<script>
	import Rating from '../../lib/Rating/Rating.svelte';
	import RatingList from '../../lib/Rating/RatingList.svelte';
	import { getModulesBySearch } from '../api/calls';
	import { errorMessage } from '../../lib/Message/MessageStore';
	import Spinner from '../../lib/Data/Spinner.svelte';
	import Pagination from '../../lib/Data/Pagination.svelte';
	import { MAX_PAGE_SIZE_MODULES, ROOT } from '../../lib/Data/definitions';
	import { onMount } from 'svelte';

	export let searchQuery;
	export let filters;

	let modules;

	let loading = true;
	let total = 0;
	let page = 0;
	let pageSize = MAX_PAGE_SIZE_MODULES;
	let showContent = false;

	let mounted = false;

	$: updateOnChange(filters, searchQuery, page);

	function updateOnChange() {
		if (mounted) {
			update();
		}
	}

	export async function update(pageIndex = 0) {
		loading = true;
		const response = await getModulesBySearch(searchQuery, filters, pageIndex, pageSize).catch(() => ({ success: false }));
		loading = false;
		if (response.success) {
			modules = response.modules;
			total = response.total;
			showContent = true;
			return true;
		} else {
			errorMessage('Fehler beim Aktualisieren der Module. Bitte versuche es noch einmal');
			return false;
		}
	}

	async function pageChange(e) {
		if (!await update(e.detail.page)) {
			page = e.detail.before;
		}
	}

	onMount(() => mounted = true);
</script>

<Spinner {loading} {showContent}>
	{#if total === 0}
		<p>Es wurden keine Module mit den angegebenen Filtern gefunden.</p>
	{:else}
		<ul class="flex flex-col gap-6">
			{#each modules as module}
				<li class="card w-full bg-base-100 shadow-xl gap-2 flex-col flex">
					<div class="card-body collapse collapse-arrow p-2 gap-0">
						<input type="checkbox">

						<div class="card-title flex justify-between collapse-title">
							<h2> {module.name} </h2>
							{#if (module.rated)}
								<Rating stars={module.overallStars} disabled={true} name="module-{module.short}" />
							{:else}
								<span class="text-base">
									Nicht bewertet
								</span>
							{/if}
						</div>

						<div class="collapse-content flex flex-col">
							<div class="divider mt-0"></div>

							{#if (module.rated)}
								<RatingList namePrefix={module.short} ratings={module.specificRatings} />
							{:else}
								<p>Dieses Modul hat noch zu wenig Bewertungen</p>
							{/if}
							<br />
							<div class="card-actions justify-end">
								<a class="btn btn-primary" href="{ROOT}/module/{module.short.toLowerCase()}">Ansehen</a>
							</div>
						</div>


					</div>
				</li>
			{/each}
		</ul>

		<div class="flex justify-center mt-8">
			<Pagination bind:page {total} {pageSize} on:change={pageChange} />
		</div>
	{/if}
</Spinner>
