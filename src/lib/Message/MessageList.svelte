<script>
	import { messageStore } from './MessageStore';
	import Message from './Message.svelte';

	export const prerender = false;

	let messages = [];

	messageStore.subscribe(data => {
		messages = data.messages;
	});
</script>

<ul class="fixed top-1 right-1 flex flex-col gap-2">
	{#each messages as message}
		<Message {message} />
	{/each}
</ul>