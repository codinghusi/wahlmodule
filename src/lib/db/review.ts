import { prisma } from '../Data/client';
import type { Review } from '@prisma/client';

export async function reviewWithOverallStars(review: Review) {
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

export async function reviewsWithOverallStars(reviews: Review[]) {
	return Promise.all(reviews.map(review => reviewWithOverallStars(review)));
}