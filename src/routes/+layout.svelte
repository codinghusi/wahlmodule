<script>
	import Header from './Header.svelte';
	import './styles.css';
	import MessageList from '../lib/Message/MessageList.svelte';
</script>

<div class="flex flex-col justify-center w-screen">
	<Header />

	<br />

	<main class="mt-4 p-1 flex justify-center">
		<slot />
	</main>

	<MessageList />
</div>