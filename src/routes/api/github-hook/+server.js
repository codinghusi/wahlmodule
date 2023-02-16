
import { json } from '@sveltejs/kit';
import { parse } from './parser';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const body = await event.request.formData();

	try {
		const parsed = parse(body.get('file'));
		return json({
			parsed
		});
	} catch (e) {
		return json({
			error: e
		})
	}
}