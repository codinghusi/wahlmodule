<script>
	import CrossedStar from '../../lib/icons/CrossedStar.svelte';
	import Rating from '../../lib/Rating/Rating.svelte';
	import RatingList from '../../lib/Rating/RatingList.svelte';

	export let modules;
</script>

<ul class="flex flex-col gap-6">
	{#each modules as module}
		<li class="card w-full bg-base-100 shadow-xl gap-2 flex-col flex">
			<div class="card-body collapse collapse-arrow p-2 gap-0">
				<input type="checkbox">

				<div class="card-title flex justify-between collapse-title">
					<h2> {module.name} </h2>
					{#if (module.rated)}
						<Rating stars={module.overallStars} disabled={true} />
					{:else}
						<CrossedStar />
					{/if}
				</div>

				<div class="collapse-content flex flex-col">
					<div class="divider mt-0"></div>

					{#if (module.rated)}
						<RatingList ratings={module.specificRatings} />
					{:else}
						<p>Dieses Modul hat noch zu wenig Bewertungen</p>
					{/if}
					<br />
					<div class="card-actions justify-end">
						<a class="btn btn-primary" href="/module/{module.short.toLowerCase()}">Ansehen</a>
					</div>
				</div>


			</div>
		</li>
	{/each}
</ul>