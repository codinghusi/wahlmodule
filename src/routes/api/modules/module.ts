import { average } from '../../../lib/helper';
import { prisma } from '../../../lib/Data/client';
import type { Module } from '@prisma/client';

export async function modulesWithRatings(modules: Module[]) {
	return Promise.all(modules.map(module => moduleWithRating(module)));
}

export async function moduleWithRating(module: Module) {
	const stars = await prisma.$queryRaw`
        SELECT rating.*, AVG(ratingofreview.stars) as stars
        FROM module
                 JOIN review ON module.short = review.moduleShort
                 JOIN ratingofreview ON review.id = ratingofreview.reviewId
                 JOIN rating ON ratingofreview.ratingId = rating.id
        WHERE module.short = ${module.short}
        GROUP BY rating.id` as { id: number, label: string, explanation: string, stars: number }[];
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