import { json } from '@sveltejs/kit';
import { AUTHOR_NAME_MIN_LENGTH, MIN_RATING_COUNT, REVIEW_TEXT_MIN_LENGTH } from '../../../../lib/Data/definitions';
import type { ApiReview } from '../../calls';
import { prisma } from '../../../../lib/Data/client';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { review } = await request.json() as { review: ApiReview };
		if (!review.authorName || review.authorName.length < AUTHOR_NAME_MIN_LENGTH) {
			review.authorName = null;
		}
		if (review.text.length < REVIEW_TEXT_MIN_LENGTH) {
			return json({ success: false, error: 'review needs to have at least 10 characters' });
		}
		
		review.ratings = review.ratings
			.filter(rating => rating.stars > 0 && rating.stars <= 5);
		
		if (review.ratings.length < MIN_RATING_COUNT) {
			return json({ success: false, error: 'you need to vote for 3 categories at least' });
		}
		
		// Guard for not letting anyone edit a review
		if (review.id || review.editToken) {
			const existing = await prisma.review.findFirst({
				where: {
					id: review.id,
					editToken: review.editToken
				}
			});
			if (!existing) {
				return json({ success: false, error: 'Wrong editToken provided. Please don\'t try again..' });
			}
		}
		
		const data = {
			moduleShort: review.moduleShort,
			authorName: review.authorName,
			text: review.text,
			ratings: {
				create: review.ratings.map(rating => ({
					ratingId: rating.id,
					stars: rating.stars
				}))
			}
		};
		
		let result;
		
		if (review.editToken) {
			result = (await prisma.$transaction([
				prisma.ratingOfReview.deleteMany({
					where: {
						reviewId: review.id
					}
				}),
				prisma.review.update({
					data,
					where: {
						id: review.id
					}
				})
			]))[1];
		} else {
			result = await prisma.review.create({
				data
			})
		}
		
		return json({
			success: true,
			review: result
		});
	} catch (e) {
		console.error(e);
		return json({ success: false, error: 'invalid body' });
	}
	
	
}