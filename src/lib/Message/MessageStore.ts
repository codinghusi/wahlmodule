import { writable } from 'svelte/store';

export interface Message {
	id: number;
	message: string;
	type: MessageType;
}

export const messageStore = writable({
	lastId: 0,
	messages: [] as Message[]
});

export type MessageType = 'info' | 'error' | 'success';

export function addMessage(message: string, type: MessageType, duration = -1) {
	messageStore.update(data => {
		const id = data.lastId + 1;
		if (duration > 0) {
			setTimeout(() => removeMessage(id), duration);
		}
		return {
			lastId: id,
			messages: [
				{
					id,
					message,
					type
				},
				...data.messages
			]
		};
	});
}

export function successMessage(message: string, duration = 5000) {
	addMessage(message, 'success', duration);
}

export function infoMessage(message: string, duration = 5000) {
	addMessage(message, 'info', duration);
}

export function errorMessage(message: string, duration?: number) {
	addMessage(message, 'error', duration);
}

export function removeMessage(id: number) {
	messageStore.update(data => ({
		lastId: data.lastId,
		messages: data.messages.filter(message => message.id !== id)
	}));
}