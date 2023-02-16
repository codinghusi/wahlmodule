import {writable} from 'svelte/store';

export const titleStore = writable("Wahlmodule");

export function setTitle(title: string) {
	if (title) {
		titleStore.update(() => title);
	}
}