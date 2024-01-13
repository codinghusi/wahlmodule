<script>
	export let rating;

	let group = -2;
</script>

<div class="flex justify-center">

		<div class="tabs tabs-boxed w-full">
			<input type="radio" bind:group value={-2} class="hidden" />

			<label class="dunno" class:tab-active={group === -1}>
				<span>
					Weiß nicht
				</span>
				<input type="radio" bind:group value={-1} class="hidden" />
			</label>


			<label class="no" class:tab-active={group === false}>
				<span>
					Nein
				</span>
				<input type="radio" bind:group value={false} class="hidden" />
			</label>

			<label class="yes" class:tab-active={group === true}>
				<span>
					Ja
				</span>
				<input type="radio" bind:group value={true} class="hidden" />
			</label>
		</div>

</div>

<style>
	label {
		@apply tab tab-md flex-1;
	}

    .no.tab-active {
		@apply bg-error;
	}

    .yes.tab-active {
        @apply bg-success;
    }

    .dunno.tab-active {
        @apply bg-info;
    }

	span {
		/*@apply m-4;*/
	}
</style>