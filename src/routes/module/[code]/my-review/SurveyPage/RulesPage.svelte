<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function accept() {
		dispatch('next', {});
	}


	// TODO: needs to be a configured in data-repository
	const body = `
Bewerte bitte das Modul wahrheitsgemäß.
In den folgenden Abschnitten gibt es mehrere Freitext Angaben. Wichtig ist, dass beim Beantworten der Fragen folgende Regeln eingehalten werden:
* Sei respektvoll
* Bewerte niemals die Dozenten selbst
* Bleibe sachlich
* ...
	`;
</script>

<div class="prose text-justify">
	<SvelteMarkdown source={body} />
</div>

<br />

<div class="flex justify-end">
	<button class="btn btn-primary" on:click={accept}>
		Akzeptieren
	</button>
</div>
