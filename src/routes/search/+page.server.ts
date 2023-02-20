import { modulesWithRatings } from '../../lib/db/module';
import { prisma } from '../../lib/Data/client';
import { getFilters } from './filters';
import { MAX_PAGE_SIZE_MODULES } from '../../lib/Data/definitions';


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

	return {
		availableFilters: await getFilters()
	};
}