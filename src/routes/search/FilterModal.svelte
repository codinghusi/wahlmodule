<script>
	import Modal from '../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../lib/Modal/ModalCloser.svelte';
	import { createEventDispatcher } from 'svelte';

	export let filters;
	export let availableFilters;

	let dispatch = createEventDispatcher();

	filters = availableFilters.flatMap(section => section.values).filter(value => !!value.default);

	function behaviour(section, filter) {
		if (section.selection !== 'radio') {
			return;
		}
		return () => {
			filters = filters.filter(f => filter.type !== f.type || f.value === filter.value);
		}
	}

	export function remove(filter) {
		const section = availableFilters.find(section => section.type === filter.type);
		if (section.selection === 'radio') {
			filters = filters.map(f => {
				if (f === filter) {
					return section.values.find(f2 => f2.default);
				} else {
					return f;
				}
			})
		} else {
			filters = filters.filter(f => f !== filter);
		}
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
								<input type="checkbox" class="toggle" bind:group={filters} value={filter} on:change={behaviour(section, filter)} />
							</label>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div slot="actions">
		<button on:click={() => dispatch('submit', { filters })}>
			<ModalCloser class="btn" name="filter-modal">
				Let's go
			</ModalCloser>
		</button>
	</div>
</Modal>