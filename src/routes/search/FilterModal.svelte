<script>
	import Modal from '../../lib/Modal/Modal.svelte';
	import ModalCloser from '../../lib/Modal/ModalCloser.svelte';

	export let availableFilters;
	export let filters;
</script>

<Modal name="filter-modal">
	<h3 class="font-bold text-lg">Filter</h3>
	<ul class="flex flex-col gap-2">
		{#each availableFilters as filter}
			<li class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
				<input type="checkbox" />
				<!-- Filter Header -->
				<div class="collapse-title text-xl font-medium">
					{filter.name}
				</div>

				<!-- Filter Values -->
				<ul class="collapse-content">
					{#each filter.values as value}
						<li class="form-control text-left">
							<label class="label cursor-pointer">
								<span class="label-text">{value.fullName}</span>
								<input type="checkbox" class="toggle" bind:group={filters} value={value} />
							</label>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div slot="actions">
		<ModalCloser class="btn" name="filter-modal">
			Let's go
		</ModalCloser>
	</div>
</Modal>