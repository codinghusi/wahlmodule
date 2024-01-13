<script>
	import AcceptPage from './RulesPage.svelte';
	import SurveyPage from './SurveyPage.svelte';

	export let page;
</script>

<div class="flex flex-col">
	{#if page.type === 'accept'}
		<AcceptPage page={page} on:next />
	{:else if page.type === 'survey'}
		<SurveyPage page={page} on:next />
	{:else}
		<p>Nicht unterstützte Umfrage</p>
	{/if}
</div>