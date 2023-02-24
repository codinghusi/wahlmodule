<script>
	import FilterIcon from '../../lib/icons/FilterIcon.svelte';
	import SearchIcon from '../../lib/icons/SearchIcon.svelte';
	import Title from '../../lib/Title/Title.svelte';
	import ModalOpener from '../../lib/Modal/ModalOpener.svelte';
	import ModuleList from './ModuleList.svelte';
	import FilterModal from './FilterModal.svelte';
	import SubtleXIcon from '../../lib/icons/SubtleXIcon.svelte';

	let filters = [];
	export let data;

	let modules;
	let availableFilters;
	$: modules = data.modules;
	$: availableFilters = data.availableFilters;


	let filterModal;

	let searchQuery = '';

	let searchInput = '';

	let modulesComponent;

	function updateSearch() {
		searchQuery = searchInput;
	}

	function remove(filter) {
		filterModal.remove(filter);
	}

</script>

<Title title="Übersicht" />

<section>

	<div class="flex gap-2">
		<!-- Searchbar -->
		<div class="form-control flex-1 indicator">
			<span class="indicator-item badge badge-secondary"
				  class:hidden={searchInput === searchQuery}></span>
			<div class="input-group">
				<input type="text" placeholder="Suche..." class="input input-bordered w-full"
					   bind:value={searchInput} on:keypress={e => e.key === 'Enter' && updateSearch()} />
				<button class="btn btn-square" on:click={updateSearch}>
					<SearchIcon />
				</button>
			</div>
		</div>

		<!-- Filter Button -->
		<ModalOpener class="btn" name="filter-modal">
			<FilterIcon />
		</ModalOpener>

	</div>

	<!-- Filter Badges -->
	<ul class="flex gap-2 mt-2 flex-wrap">
		{#each filters as filter}
			{#if !filter.default}
				<li class="badge badge-secondary gap-2 flex">
					<button class="cursor-pointer items-center" on:click={() => remove(filter)}>
						<SubtleXIcon />
					</button>

					{filter.short}
				</li>
			{/if}
		{/each}
	</ul>

	<br />

	<!-- Modules -->
	<ModuleList bind:this={modulesComponent} {searchQuery} {filters} />

</section>

<FilterModal bind:this={filterModal} bind:filters {availableFilters} />