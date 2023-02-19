
export interface ApiReview {
	id?: number
	moduleShort: string
	authorName?: string | null
	text: string
	ratings: { id: number, stars: 0|1|2|3|4|5 }[]
}

export async function createReview(review: ApiReview) {
	const response = await fetch(`/api/create-review`, {
		method: 'POST',
		body: JSON.stringify({ review })
	});
	return await response.json();
}

export async function getReviews(moduleShort: string, pageIndex: number, pageSize: number) {
	const response = await fetch(`/api/module/${moduleShort}/reviews?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
		method: 'GET',
	});
	return await response.json();
}