<script>
	import Title from '../../../../lib/Title/Title.svelte';
	import Stepper from '../../../../lib/Stepper/Stepper.svelte';
	import survey from './temp.json';
	import RulesPage from './SurveyPage/RulesPage.svelte';
	import SurveyPage from './SurveyPage/SurveyPage.svelte';
	import FinalPage from './SurveyPage/FinalPage.svelte';

	export let data;

	$: console.log(data);

	const steps = [
		'Regeln',
		...survey.map(step => step.title),
		'Abschluss'
	];
	let current = 0;

	function next() {
		current += 1;
	}

	function previous() {
		current -= 1;
	}
</script>

<Title title="Bewertung schreiben" />

<section class="flex flex-col gap-12 justify-center">
	<article class="flex flex-col gap-12 justify-center">
		<Stepper steps={steps} current={current} />

	</article>

	<article class="flex flex-col justify-center">
		{#if current === 0}
			<RulesPage on:next={next} />
		{:else if current < steps.length - 1}
			<SurveyPage
				page={survey[current - 1]}
				on:next={next}
				on:previous={previous} />
		{:else}
			<FinalPage />
		{/if}

	</article>
</section>
