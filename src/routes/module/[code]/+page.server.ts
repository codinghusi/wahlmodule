import { prisma } from '../../../lib/Data/client';

export async function load({ params }) {
	const possibleRating = await prisma.reviewQuestion.findMany();
	
	const module = await prisma.module.findUniqueOrThrow({
		where: {
			code: params.code
		},
		include: {
			reviews: true,
			lecturers: true,
			dependencies: true,
			degreePrograms: true
		}
	})
	
	// module.reviews = await Promise.all(module.reviews.map(review => reviewWithOverallStars(review)));

	return { module, possibleRating };
}