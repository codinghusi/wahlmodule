import { json } from '@sveltejs/kit';
import { prisma } from '../../../../lib/Data/client';
import { excludeTokenFromReview, reviewWithOverallStars } from '../review';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	try {
		const id = parseInt(url.searchParams.get('id'));
		
		const review = await prisma.review.findUnique({
			where: { id },
			include: {
				ratings: {
					include: {
						rating: true
					}
				}
			}
		});
		
		if (!review) {
			return json({
				success: false,
				error: `couldn't find review`
			});
		}
		
		return json({
			success: true,
			review: excludeTokenFromReview(await reviewWithOverallStars(review))
		});
	} catch (e) {
		console.error(e);
		return json({ success: false, error: 'invalid body' });
	}
}