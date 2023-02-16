
const propertyMapping: Record<string, string> = {
	'kurz': 'short',
	'name': 'name',
	'voraussetzungen': 'dependencies',
	'voraussetzung': 'dependencies',
	'dependency': 'dependencies',

	'schwerpunkte': 'focuses',
	'schwerpunkt': 'focuses',
	'focus': 'focuses',

	'studiengaenge': 'degree_programs',
	'studiengang': 'degree_programs',
	'degree_programs': 'degree_programs',

	'semester': 'semesters',

	'dozenten': 'lecturers',
	'dozent': 'lecturers',
	'lecturer': 'lecturers',
};
const allowedProperties = Object.values(propertyMapping);
const listProperties = [ 'degree_programs', 'dependencies', 'focuses', 'semesters', 'lecturers' ];

export function parse(content: string) {
	const lines = content.split('\n')[Symbol.iterator]();
	if (lines.next().value?.trim() !== '--') {
		throw "invalid file format: needs to start with two dashes --";
	}
	const config: Record<string, string|string[]> = {};
	for (const line of lines) {
		if (line.trim() === '--') {
			break;
		}
		const data = line.split('=');
		if (data.length !== 2) {
			throw "invalid file format: properties must be like <propertyName> = <value>";
		}

		let property = data[0]
			.trim()
			.replace(/ä/, 'ae');
		property = propertyMapping[property] ?? property;
		if (!allowedProperties.includes(property)) {
			throw `invalid property '${property}'`;
		}

		let value: string|string[] = data[1].trim();
		if (listProperties.includes(property)) {
			if (value.length) {
				value = value.split(',').map(v => v.trim());
			} else {
				value = [];
			}
		}

		config[property] = value;
	}

	config.description = Array.from(lines).join('\n').trim();

	return config;
}