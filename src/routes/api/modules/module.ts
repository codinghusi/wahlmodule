import { average } from '../../../lib/helper';
import { prisma } from '../../../lib/Data/client';
import type { Module } from '@prisma/client';

export async function modulesWithRatings(modules: Module[]) {
	return Promise.all(modules.map(module => moduleWithRating(module)));
}

export async function moduleWithRating(module: Module) {
	const stars = await prisma.$queryRaw`
        SELECT Rating.*, AVG(RatingOfReview.stars) as stars
        FROM Module
                 JOIN Review ON Module.short = Review.moduleShort
                 JOIN RatingOfReview ON Review.id = RatingOfReview.reviewId
                 JOIN Rating ON RatingOfReview.ratingId = Rating.id
        WHERE Module.short = ${module.short}
        GROUP BY Rating.id` as { id: number, label: string, explanation: string, stars: number }[];
	if (stars.length) {
		return {
			...module,
			rated: true,
			specificRatings: stars.map(star => Object.assign(star, { stars: ~~star.stars})),
			overallStars: average(stars.map(star => star.stars))
		}
	}
	return {
		...module,
		rated: false
	}
	
}