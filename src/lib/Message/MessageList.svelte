<script>
	import { messageStore } from './MessageStore';
	import Message from './Message.svelte';
	import { browser } from '$app/environment';

	let messages = [];

	messageStore.subscribe(data => {
		messages = data.messages;
	});
</script>

{#if browser}
	<ul class="fixed top-1 right-1 flex flex-col gap-2">
		{#each messages as message}
			<Message {message} />
		{/each}
	</ul>
{/if}