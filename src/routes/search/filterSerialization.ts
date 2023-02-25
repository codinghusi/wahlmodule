import type { Filter, Section } from './filters';

function escapeValue(value: string|number) {
	return value.toString()
		.replaceAll('-', '--')
		.replaceAll('_', '__');
}

export function serializeFilters(filters: { type: number, value: string }[]) {
	const sections = filters.reduce((acc, curr) => {
		acc[curr.type] ??= [];
		acc[curr.type].push(curr.value);
		return acc;
	}, {} as Record<number, (number | string)[]>);
	
	return Object.entries(sections)
		.map(([section, values]) => `${section}-${values.map(escapeValue).join('-')}`)
		.join('_');
}

export function splitNotDouble(str: string, separatorChar: string) {
	const result = [""];
	let preceding = false;
	for (const char of str.split('')) {
		if (char === separatorChar) {
			if (preceding) {
				result[result.length - 1] += char;
				preceding = false;
 			} else {
				preceding = true;
			}
		}
		else if (preceding) {
			result.push(char);
			preceding = false;
		}
		else {
			result[result.length - 1] += char;
		}
	}
	return result;
}

export function deserializeFilters(filters: string, availableFilters: Section[]): Filter[] {
	return splitNotDouble(filters, '_')
		.map(pair => splitNotDouble(pair, '-'))
		.filter(pair => pair.length >= 2 && !isNaN(pair[0] as unknown as number))
		.flatMap(([type, ...values]) => values.map(value => availableFilters
			.find(section => section.type.toString() === type)?.values
			.find(filter => filter.value.toString() === value.toString())))
		.filter(filter => !!filter) as Filter[];
}