/** @type {import('./$types').PageLoad} */
import { PrismaClient } from '@prisma/client';
import { MODULE_REVIEW_AVERAGE, modulesWithRatings } from '../../lib/db/module';



export async function load({ params }) {
	const prisma = new PrismaClient();
	const modules = await prisma.module.findMany();
	prisma.$disconnect();
	return {
		modules: await modulesWithRatings(prisma, modules)
	};
}