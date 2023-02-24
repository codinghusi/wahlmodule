<script>
	import Modal from '../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../lib/Modal/ModalCloser.svelte';
	import { createEventDispatcher } from 'svelte';

	export let filters = [];
	let filtersUnsaved = filters;
	export let availableFilters;

	$: updateFiltersUnsaved(filters);
	$: updateAvailableFilters(availableFilters);

	function updateFiltersUnsaved(filters) {
		if (filters.length) {
			filtersUnsaved = filters;
		}
	}

	function updateAvailableFilters(availableFilters) {
		filtersUnsaved = availableFilters.flatMap(section => section.values).filter(value => !!value.default);
	}

	let dispatch = createEventDispatcher();

	function behaviour(section, filter) {
		if (section.selection !== 'radio') {
			return;
		}
		return (event) => {
			const index = filtersUnsaved.findIndex(f => filter.type === f.type && f.value !== filter.value);
			if (index === -1) {
				event.preventDefault();
				event.target.checked = true;
			} else {
				filtersUnsaved.splice(index, 1);
				filtersUnsaved = filtersUnsaved; // trigger rerender
			}
		}
	}

	export function remove(filter) {
		const section = availableFilters.find(section => section.type === filter.type);
		if (section.selection === 'radio') {
			filtersUnsaved = filtersUnsaved.map(f => {
				if (f === filter) {
					return section.values.find(f2 => f2.default);
				} else {
					return f;
				}
			})
		} else {
			filtersUnsaved = filtersUnsaved.filter(f => f !== filter);
		}
		filters = filtersUnsaved;
	}
</script>

<Modal name="filter-modal">
	<h3 class="font-bold text-lg mb-2">Filter</h3>
	<ul class="flex flex-col gap-2">
		{#each availableFilters as section}
			<li class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
				<input type="checkbox" />
				<!-- Filter Header -->
				<div class="collapse-title text-xl font-medium">
					{section.label}
				</div>

				<!-- Filter Values -->
				<ul class="collapse-content">
					{#each section.values as filter}
						<li class="form-control text-left">
							<label class="label cursor-pointer">
								<span class="label-text">{filter.label}</span>
								<input type="checkbox" class="toggle" bind:group={filtersUnsaved} value={filter} on:change={behaviour(section, filter)} />
							</label>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div slot="actions">
		<button on:click={() => {dispatch('submit', { filters: filtersUnsaved }); filters = filtersUnsaved;}}>
			<ModalCloser class="btn" name="filter-modal">
				Let's go
			</ModalCloser>
		</button>
	</div>
</Modal>