import type { Filter } from '../search/definitions';
import { MAX_PAGE_SIZE_MODULES, MAX_PAGE_SIZE_REVIEWS } from '../../lib/Data/definitions';
import type { Review } from '@prisma/client';

// export interface ApiReview {
// 	id?: number
// 	moduleShort: string
// 	authorName?: string | null
// 	text: string
// 	ratings: { id: number, stars: 0|1|2|3|4|5 }[]
// }

export async function createReview(review: Review) {
	const response = await fetch(`/api/reviews/upsert`, {
		method: 'POST',
		body: JSON.stringify({ review })
	});
	return await response.json();
}

export async function getReviews(moduleShort: string, skipReview: number | null, pageIndex: number, pageSize = MAX_PAGE_SIZE_REVIEWS) {
	const response = await fetch(`/api/reviews/byModule?moduleShort=${encodeURIComponent(moduleShort)}&without=${skipReview ?? -1}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
		method: 'GET',
	});
	return await response.json();
}

export async function getReview(reviewId: number) {
	const response = await fetch(`/api/reviews/get?id=${reviewId}`, {
		method: 'GET',
	});
	return await response.json();
}

export async function getModulesBySearch(searchQuery: string, filters: Filter[], pageIndex: number, pageSize = MAX_PAGE_SIZE_MODULES) {
	const filterParam = encodeURIComponent(
		JSON.stringify(filters.map(filter => ({ value: filter.value, type: filter.type })))
	);
	searchQuery = encodeURIComponent(searchQuery);
	const response = await fetch(`/api/modules?filters=${filterParam}&q=${searchQuery}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
		method: 'GET',
	});
	return await response.json();
}