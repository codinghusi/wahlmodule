<script>
	import Rating from '../../lib/Rating.svelte';
	import { availableFilters } from './data';
	import FilterIcon from '../../lib/icons/FilterIcon.svelte';
	import SearchIcon from '../../lib/icons/SearchIcon.svelte';
	import Title from '../../lib/Title/Title.svelte';

	let filters = [];
	export let data;

	let modules;
	$: modules = data.modules;

	filters.push(availableFilters[0].values[0], availableFilters[1].values[0], availableFilters[2].values[0]);
	// Aufzeichnungen, Vorlesung, Praktika, Übungen, Aufwand, Klausur
</script>

<!--<svelte:head>-->
<!--	<title>Suche</title>-->
<!--</svelte:head>-->
<Title title="Übersicht" />

<section>
	<!--	<div class='prose text-center'>-->
	<!--		<h1> Übersicht </h1>-->
	<!--	</div>-->

	<!--	<br />-->

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

		<!-- Filter Selection -->
		<label for="filter-modal" class="btn">
			<FilterIcon />
		</label>

		<!-- Filter Modal -->
		<input type="checkbox" id="filter-modal" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box">
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

				<div class="modal-action">
					<label for="filter-modal" class="btn">Let's go</label>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters enabled -->
	<ul class="flex gap-2 mt-2">
		{#each filters as filter}
			<li class="badge badge-secondary gap-2">
				<!-- X Icon -->
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
						 class="inline-block w-4 h-4 stroke-current">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M6 18L18 6M6 6l12 12"></path>
				</svg>

				{filter.badge}
			</li>
		{/each}
	</ul>

	<br />

	<!-- Modules -->
	<ul class="flex flex-col gap-6">
		{#each modules as module}
			<li class="card w-96 bg-base-100 shadow-xl gap-2 flex-col flex">
				<div class="card-body collapse collapse-arrow p-2 gap-0">
					<input type="checkbox">

					<div class="card-title flex justify-between collapse-title">
						<h2> {module.name} </h2>
						{#if (module.rated)}
							<Rating stars={module.overallStars} disabled={true} />
						{:else}
							<a class="btn btn-secondary">Bewerten!</a>
						{/if}
					</div>

					<div class="collapse-content flex flex-col">
						<div class="divider mt-0"></div>

						{#if (module.rated)}
							<ul class="grid grid-cols-2 gap-4">

								{#each module.specificRatings as rating}
									<li>
										<p>{rating.name}</p>
										<Rating stars={rating.stars} disabled={true} />
									</li>
								{/each}
							</ul>
						{:else}
							<p>Dieses Modul hat noch zu wenig Bewertungen</p>
						{/if}
						<br />
						<div class="card-actions justify-end">
							<a class="btn btn-primary" href={`/module/${module.short.toLowerCase()}`}>Ansehen</a>
						</div>
					</div>


				</div>
			</li>
		{/each}
	</ul>

</section>