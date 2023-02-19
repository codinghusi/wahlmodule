import { json } from '@sveltejs/kit';
import { MAX_PAGE_SIZE_REVIEWS } from '../../../../../lib/Data/definitions';
import { reviewsWithOverallStars } from '../../../../../lib/db/review';
import { prisma } from '../../../../../lib/Data/client';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	try {
		// const { moduleShort, pageSize, pageIndex } = request.searchParams;
		const moduleShort = params.short;
		const pageSize = parseInt(url.searchParams.get('pageSize'));
		const pageIndex = parseInt(url.searchParams.get('pageIndex'));
		
		if (pageSize > MAX_PAGE_SIZE_REVIEWS) {
			return json({ success: false, error: 'pageSize to big, max: ' + MAX_PAGE_SIZE_REVIEWS });
		}
		
		if (pageSize < 0 || pageIndex < 0) {
			throw '';
		}
		
		const reviews = await prisma.review.findMany({
			where: { moduleShort },
			orderBy: {
				createdAt: 'desc'
			},
			skip: pageSize * pageIndex,
			take: pageSize
		});
		
		const count = await prisma.review.aggregate({
			_count: true
		});
		
		return json({
			success: true,
			reviews: await reviewsWithOverallStars(reviews),
			total: count._count
		});
	} catch (e) {
		console.error(e);
		return json({ error: 'invalid body' });
	}
}