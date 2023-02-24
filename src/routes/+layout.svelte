<script>
	import Header from './Header.svelte';
	import './styles.css';
	import MessageList from '../lib/Message/MessageList.svelte';
</script>

<div class="flex flex-col">
	<Header />

	<br />

	<div class="mt-4 p-1 flex justify-center">
		<main class="max-w-xl w-full">
			<slot />
		</main>
	</div>


	<MessageList />
</div>