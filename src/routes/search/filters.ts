import { json } from '@sveltejs/kit';
import { FilterType } from './definitions';
import { Season } from '@prisma/client';
import type { Focus, DegreeProgram } from '@prisma/client';
import { prisma } from '../../lib/Data/client';


function addType<T>(filters: T[], type: FilterType): (T & {type: FilterType})[] {
	return filters.map(filter => ({ ...filter, type }))
}

/** @type {import('./$types').RequestHandler} */
export async function getFilters() {
	const seasons = [
		{
			value: Season.Both,
			label: "An beiden Semestern angeboten",
			short: "Alle Semester",
			default: true
		},
		{
			value: Season.Winter,
			label: "Wintersemester",
			short: "WiSe"
		},
		{
			value: Season.Summer,
			label: "Sommersemester",
			short: "SoSe"
		},
		{
			value: Season.None,
			label: "Nicht angeboten",
			short: "Nicht angeboten"
		}
	];
	
	const focuses = (await prisma.focus.findMany()).map((focus: Focus) => ({
		value: focus.id,
		label: focus.name,
		short: focus.name
	}));
	
	const degreePrograms = (await prisma.degreeProgram.findMany()).map((program: DegreeProgram) => ({
		value: program.short,
		label: program.long,
		short: program.short
	}));
	
	return [
		{
			type: FilterType.Season,
			label: "Semester",
			selection: "radio",
			values: addType(seasons, FilterType.Season)
		},
		{
			type: FilterType.Focus,
			label: "Schwerpunkt",
			selection: "checkbox",
			values: addType(focuses, FilterType.Focus)
		},
		{
			type: FilterType.DegreeProgram,
			label: "Studiengang",
			selection: "checkbox",
			values: addType(degreePrograms, FilterType.DegreeProgram)
		}
	];

}