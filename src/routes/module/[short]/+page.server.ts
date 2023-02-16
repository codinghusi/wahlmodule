import { error } from '@sveltejs/kit';
import { modules } from '../../search/data';
import { PrismaClient } from '@prisma/client';
import { moduleWithRating } from '../../../lib/db/module';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const prisma = new PrismaClient();
	
	const module = prisma.module.findUniqueOrThrow({
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
	
	prisma.$disconnect();

	return {
		module: await moduleWithRating(prisma, module)
	};
	
	// throw error(404, 'Not found');
}