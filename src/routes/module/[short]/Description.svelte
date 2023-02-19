<script>
	import SvelteMarkdown from 'svelte-markdown';

  export let module;
</script>

<p class="mt-1">
	<SvelteMarkdown source={module.description} />
</p>
<p class="m-0">
	<span class="font-bold">Dozent{module.lecturers.length > 1 ? 'en' : ''}:</span>
	{module.lecturers.map(l => l.fullName).join(', ')}
</p>