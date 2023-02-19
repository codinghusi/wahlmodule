import { error } from '@sveltejs/kit';
import { modules } from '../../search/data';
import { PrismaClient } from '@prisma/client';
import { moduleWithRating } from '../../../lib/db/module';
import { reviewWithOverallStars } from '../../../lib/db/review';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const prisma = new PrismaClient();
	
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
	
	module = await moduleWithRating(prisma, module);
	module.reviews = await Promise.all(module.reviews.map(review => reviewWithOverallStars(prisma, review)));
	
	prisma.$disconnect();

	return { module, possibleRating };
	
	// throw error(404, 'Not found');
}