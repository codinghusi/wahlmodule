import { moduleWithRating } from '../../api/modules/module';
import { reviewWithOverallStars } from '../../api/reviews/review';
import { prisma } from '$lib/Data/client';
import { getGitLabLink } from '$lib/gitlab';

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
	
	const editUrl = getGitLabLink(`/modules/${module.dirname}`)

	return { module, possibleRating, editUrl };
	
	// throw error(404, 'Not found');
}