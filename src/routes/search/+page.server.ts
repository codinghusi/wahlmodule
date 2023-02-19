import { modulesWithRatings } from '../../lib/db/module';
import { prisma } from '../../lib/Data/client';


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const modules = await prisma.module.findMany();
	return {
		modules: await modulesWithRatings(modules)
	};
}