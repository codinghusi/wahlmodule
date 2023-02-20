import { json } from '@sveltejs/kit';
import { MAX_PAGE_SIZE_REVIEWS } from '../../../../lib/Data/definitions';
import { excludeTokenFromReview, excludeTokenFromReviews, reviewsWithOverallStars } from '../review';
import { prisma } from '../../../../lib/Data/client';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const moduleShort = url.searchParams.get('moduleShort');
		const pageSize = parseInt(url.searchParams.get('pageSize'));
		const pageIndex = parseInt(url.searchParams.get('pageIndex'));
		const withoutReviewId = parseInt(url.searchParams.get('without'));
		
		if (pageSize > MAX_PAGE_SIZE_REVIEWS) {
			return json({ success: false, error: 'pageSize to big, max: ' + MAX_PAGE_SIZE_REVIEWS });
		}
		
		if (pageSize < 0 || pageIndex < 0) {
			throw '';
		}
		
		const reviews = await prisma.review.findMany({
			where: {
				moduleShort,
				NOT: {
					id: withoutReviewId
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			skip: pageSize * pageIndex,
			take: pageSize
		});
		
		const count = await prisma.review.aggregate({
			where: {
				moduleShort
			},
			_count: true
		});
		
		return json({
			success: true,
			reviews: excludeTokenFromReviews(await reviewsWithOverallStars(reviews)),
			total: count._count
		});
	} catch (e) {
		console.error(e);
		return json({ success: false, error: 'invalid body' });
	}
}