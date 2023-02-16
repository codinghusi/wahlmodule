import { PrismaClient } from '@prisma/client';
import { average } from '../helper';

type Module = any;

export async function modulesWithRatings(prisma: PrismaClient, modules: Module[]) {
	return Promise.all(modules.map(module => moduleWithRating(prisma, module)));
}

const RATING_MAPPING = {
	'spannend': "Spannend",
	'uebungen': "Übungen",
	'klausur': "Klausur",
	'leichtigkeit': "Leichtigkeit",
} as const;

export async function moduleWithRating(prisma: PrismaClient, module: Module) {
	const avg = await prisma.review.aggregate({
		_avg: {
			spannend: true,
			uebungen: true,
			klausur: true,
			leichtigkeit: true
		},
		where: {
			moduleShort: module.short
		}
	});
	const filteredAvg = Object.fromEntries(Object.entries(avg._avg).filter(([, value]) => !!value));
	if (filteredAvg.length) {
		return {
			...module,
			rated: true,
			specificRatings: Object.entries(filteredAvg).map(([key, value]) => ({ name: RATING_MAPPING[key], stars: value })),
			overallStars: average(Object.values(filteredAvg))
		}
	}
	return {
		...module,
		rated: false
	}
	
}