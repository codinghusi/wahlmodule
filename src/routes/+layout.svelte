<div class="flex flex-col h-full">
	<Header />

	<br />

	<div class="mt-4 p-1 flex flex-col justify-center items-center">
		<div class="max-w-xl w-full">
			<main>
				<Spinner loading={$navigating} showContent={true}>
					<slot />
				</Spinner>
			</main>

			<footer class="mt-8 flex justify-end w-full">
				<a class="btn btn-link normal-case" target="_blank" rel="noreferrer" href="{GITHUB_LINK}">Code ansehen</a>
				<a class="btn btn-link normal-case" target="_blank" rel="noreferrer" href="{ROOT}/legal">Impressum</a>
				<a class="btn btn-link normal-case" target="_blank" rel="noreferrer" href="{ROOT}/privacy">Datenschutz</a>
			</footer>
		</div>



	</div>


	<MessageList />

</div>

<script>
	import Header from './Header.svelte';
	import './styles.css';
	import MessageList from '../lib/Message/MessageList.svelte';
	import Spinner from '../lib/Data/Spinner.svelte';
	import { navigating } from '$app/stores';
	import { GITHUB_LINK, ROOT } from '../lib/Data/definitions';
</script>
