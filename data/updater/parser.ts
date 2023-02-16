
const propertyMapping = {
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

	'semester': 'seasons',

	'dozenten': 'lecturers',
	'dozent': 'lecturers',
	'lecturer': 'lecturers',
} as const;
const allowedProperties = Object.values(propertyMapping);
const listProperties = [ 'degree_programs', 'dependencies', 'focuses', 'seasons', 'lecturers' ] as const;
const mustHave = [ 'short', 'name', 'description', 'seasons' ] as const;

type Property = typeof propertyMapping[keyof typeof propertyMapping];
type RequiredProperty = typeof mustHave[number];
type OptionalProperty = Exclude<Property, RequiredProperty>;
type ListProperty = typeof listProperties[number];
export type Parsed =
	         Record<Exclude<OptionalProperty, ListProperty>, string> &
			 Record<Exclude<ListProperty, RequiredProperty>, string[]> &
	Required<Record<Exclude<RequiredProperty, ListProperty>, string>> &
	Required<Record<Extract<RequiredProperty, ListProperty>, string[]>>;

export function parse(content: string): Parsed {
	const lines = content.split('\n')[Symbol.iterator]();
	if (lines.next().value?.trim() !== '--') {
		throw "invalid file format: needs to start with two dashes --";
	}
	const config: Partial<Parsed> = { seasons: [] };
	for (const line of lines) {
		if (line.trim() === '--') {
			break;
		}
		const data = line.split('=');
		if (data.length !== 2) {
			throw "invalid file format: properties must be like <propertyName> = <value>";
		}

		const propertyUnmapped = data[0]
			.trim()
			.replace(/ä/, 'ae') as keyof typeof propertyMapping;
		const property = (propertyMapping[propertyUnmapped] as Property) ?? propertyUnmapped;
		if (!allowedProperties.includes(property)) {
			throw `invalid property '${property}'`;
		}

		let value: string|string[] = data[1].trim();
		if (listProperties.includes(property as any)) {
			if (value.length) {
				value = value.split(',').map(v => v.trim());
			} else {
				value = [];
			}
		}

		config[property] = value as any;
	}

	config.description = Array.from(lines).join('\n').trim();

	if (mustHave.every(mh => mh in config)) {
		return config as Parsed;
	}

	const violating = mustHave.filter(mh => !(mh in config));
	throw `The properties ${violating.join(', ')} are a must have!`;
}