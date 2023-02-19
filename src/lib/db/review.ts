import { PrismaClient } from '@prisma/client';

type Review = any;

export async function reviewWithOverallStars(prisma: PrismaClient, review: Review) {
	const avg = await prisma.ratingOfReview.aggregate({
		where: {
			reviewId: review.id
		},
		_avg: {
			stars: true
		}
	});
	
	return {
		...review,
		overallStars: avg._avg.stars
	}
}