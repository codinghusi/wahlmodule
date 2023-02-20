<script>
	import Rating from '../../lib/Rating/Rating.svelte';
	import { availableFilters } from './data';
	import FilterIcon from '../../lib/icons/FilterIcon.svelte';
	import SearchIcon from '../../lib/icons/SearchIcon.svelte';
	import Title from '../../lib/Title/Title.svelte';
	import RatingList from '../../lib/Rating/RatingList.svelte';
	import CrossedStar from '../../lib/icons/CrossedStar.svelte';
	import Modal from '../../lib/Modal/Modal.svelte';
	import ModalOpener from '../../lib/Modal/ModalOpener.svelte';
	import ModalCloser from '../../lib/Modal/ModalCloser.svelte';
	import ModuleList from './ModuleList.svelte';
	import FilterModal from './FilterModal.svelte';
	import SubtleXIcon from '../../lib/icons/SubtleXIcon.svelte';

	let filters = [];
	export let data;

	let modules;
	$: modules = data.modules;

	$: console.log(modules);

	filters.push(availableFilters[0].values[0], availableFilters[1].values[0], availableFilters[2].values[0]);
	// Aufzeichnungen, Vorlesung, Praktika, Übungen, Aufwand, Klausur
</script>

<Title title="Übersicht" />

<section class="w-full max-w-lg">

	<div class="flex gap-2">
		<!-- Searchbar -->
		<div class="form-control flex-1">
			<div class="input-group">
				<input type="text" placeholder="Suche..." class="input input-bordered w-full" />
				<button class="btn btn-square">
					<SearchIcon />
				</button>
			</div>
		</div>

		<!-- Filter Button -->
		<ModalOpener class="btn" name="filter-modal"> <FilterIcon /> </ModalOpener>

	</div>

	<!-- Filters enabled -->
	<ul class="flex gap-2 mt-2">
		{#each filters as filter}
			<li class="badge badge-secondary gap-2">
				<button class="cursor-pointer flex items-center">
					<SubtleXIcon />
				</button>

				{filter.badge}
			</li>
		{/each}
	</ul>

	<br />

	<!-- Modules -->
	<ModuleList {modules} />

</section>

<FilterModal {availableFilters} bind:filters />
