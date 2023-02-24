<script>
	import SvelteMarkdown from 'svelte-markdown';
	import SeeMore from '../../../lib/SeeMore.svelte';

  export let module;
</script>

<SeeMore>
	<div class="prose">
		<SvelteMarkdown source={module.description} />
	</div>
	<p class="m-0">
		<span class="font-bold">
			Dozent
			{module.lecturers.length > 1 ? 'en' : ''}
			:
		</span>
		{module.lecturers.map(l => l.fullName).join(', ')}
	</p>
</SeeMore>
