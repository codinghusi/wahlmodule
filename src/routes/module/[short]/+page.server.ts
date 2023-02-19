import { moduleWithRating } from '../../../lib/db/module';
import { reviewWithOverallStars } from '../../../lib/db/review';
import { prisma } from '../../../lib/Data/client';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const possibleRating = await prisma.rating.findMany();
	
	let module = await prisma.module.findUniqueOrThrow({
		where: {
			short: params.short
		},
		include: {
			reviews: true,
			lecturers: true,
			dependencies: true,
			degreePrograms: true
		}
	})
	
	module = await moduleWithRating(module);
	module.reviews = await Promise.all(module.reviews.map(review => reviewWithOverallStars(review)));

	return { module, possibleRating };
	
	// throw error(404, 'Not found');
}