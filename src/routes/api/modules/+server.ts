/** @type {import('./$types').RequestHandler} */
import { json } from '@sveltejs/kit';
import { prisma } from '../../../lib/Data/client';
import { Season } from '@prisma/client';
import { FilterType } from '../../search/definitions';
import type { Filter } from '../../search/definitions';
import { modulesWithRatings } from './module';

export async function GET({ url, params }) {
	try {
		const filters = JSON.parse(url.searchParams.get('filters')) as Filter[];
		const searchQuery = url.searchParams.get('q');
		const pageSize = parseInt(url.searchParams.get('pageSize'));
		const pageIndex = parseInt(url.searchParams.get('pageIndex'));
		
		let season: Season | undefined = undefined;
		const focuses = [];
		const degreePrograms = [];
		
		for (const filter of filters) {
			switch (filter.type) {
				case FilterType.Season:
					if (filter.value === Season.Both) {
						season = undefined;
					} else {
						season = filter.value as Season;
					}
					break;
				case FilterType.Focus:
					focuses.push(filter.value as number);
					break;
				case FilterType.DegreeProgram:
					degreePrograms.push(filter.value as string);
					break;
			}
		}
		
		const where = {
			season,
			focuses: focuses.length ? {
				some: {
					id: { in: focuses }
				}
			} : {},
			degreePrograms: degreePrograms.length ? {
				some: {
					short: { in: degreePrograms }
				}
			} : {},
			
			OR: [
				{
					name: { contains: searchQuery } // FIXME: cant use 'search' because apparently the fulltext index is not applied
				},
				{
					description: { contains: searchQuery } // FIXME: Contains seems to be the better option against fulltext apparently
				}
			]
		};
		
		const modules = await prisma.module.findMany({
			where,
			skip: pageSize * pageIndex,
			take: pageSize
		})
		
		const total = await prisma.module.aggregate({
			where,
			_count: true
		});
		
		return json({
			success: true,
			modules: await modulesWithRatings(modules),
			total: total._count
		});
	} catch (e) {
		console.error(e);
		return json({ success: false, error: 'invalid body' });
	}
}