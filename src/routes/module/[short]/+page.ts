import { error } from '@sveltejs/kit';
import { modules } from '../../search/data';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const module = modules.find(m => m.short.toLowerCase() === params.short.toLowerCase());
	if (module) {
		return { ...module };
	}

	throw error(404, 'Not found');
}