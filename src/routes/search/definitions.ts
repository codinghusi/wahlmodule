
export enum FilterType {
	Season,
	Focus,
	DegreeProgram
}

export interface Filter {
	value: string | number,
	short: string,
	label: string,
	type: FilterType
}