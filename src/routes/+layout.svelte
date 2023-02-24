<script>
	import Header from './Header.svelte';
	import './styles.css';
	import MessageList from '../lib/Message/MessageList.svelte';
	import Spinner from '../lib/Data/Spinner.svelte';
	import { navigating } from '$app/stores';
</script>

<div class="flex flex-col">
	<Header />

	<br />

	<div class="mt-4 p-1 flex justify-center">
		<main class="max-w-xl w-full">
			<Spinner loading={$navigating} showContent={true}>
				<slot />
			</Spinner>
		</main>
	</div>


	<MessageList />
</div>