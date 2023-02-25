import { getFilters } from './filters';
import { deserializeFilters } from './filterSerialization';


/** @type {import('./$types').PageLoad} */
export async function load({ url, params }) {

	const availableFilters = await getFilters();
	
	const filtersRaw = url.searchParams.get('filters') ?? '';
	const filters = deserializeFilters(filtersRaw, availableFilters);
	const searchQuery = url.searchParams.get('q') ?? '';
	
	console.log(filters);
	
	return {
		availableFilters,
		filters,
		searchQuery
	};
}