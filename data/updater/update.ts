import * as fs from 'fs';
import { exec } from 'node:child_process';
import Path, * as path from 'path';
import { PrismaClient, Season } from '@prisma/client';
import { parse } from './parser';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

const dir = path.join(__dirname, '../modules');
const lecturersFile = path.join(__dirname, '../other/lecturers.json');
const degreeProgramsFile = path.join(__dirname, '../other/degree-programs.json');
const focusesFile = path.join(__dirname, '../other/focuses.json');
const ratingsFile = path.join(__dirname, '../other/ratings.json');

const hashFile = path.join(__dirname, './lastCommit.txt');


// exec("git pull", async (error, stdout) => {
exec("echo 'schabernack'", async (error, stdout) => {
	if (error) {
		console.error(error);
		return;
	}
	
	const commit = getLastHash();
	
	await updateByFile(commit, ratingsFile, 'id', 'rating', true);
	await updateByFile(commit, focusesFile, 'name', 'focus', true);
	await updateByFile(commit, lecturersFile, 'short', 'lecturer');
	await updateByFile(commit, degreeProgramsFile, 'short', 'degreeProgram');
	await updateModules(commit);
	
	updateHash();
	
	prisma.$disconnect();
	
});


async function updateByFile<T>(commit: string, dirname: string, idKey: keyof T, model: keyof typeof prisma, deleteAll = false) {
	if (fileHasChanged(commit, dirname)) {
		const content = fs.readFileSync(dirname, { encoding: 'utf-8' });
		const entries = JSON.parse(content) as T[];
		const upserts = entries.map(entry => ({
			where: { [idKey]: entry[idKey] },
			update: entry,
			create: entry
		}));
		const commands = [];
		if (deleteAll) {
			commands.push((prisma[model] as any).deleteMany({
				where: {
					NOT: {
						[idKey]: { in: entries.map(entry => entry[idKey])}
					}
				}
			}));
		}
		commands.push(...upserts.map(upsert => (prisma[model] as any).upsert(upsert)));
		prisma.$transaction(commands);
	}
}

async function updateModules(commit: string) {
	const files = getUpdatedFiles(commit, dir);
	const updates = [];
	const walkedDirectories = [] as string[];
	const deletes = [];
	for (const file of files) {
		const dirname = path.dirname(file.filename);
		const metadataFile = path.join(dirname, './metadata.json');
		const descriptionFile = path.join(dirname, './description.md')
		if (file.type === DiffType.Added || file.type === DiffType.Modified) {
			if (walkedDirectories.includes(dirname)) {
				continue;
			}
			walkedDirectories.push(dirname);
			try {
				const description = fs.readFileSync(descriptionFile, { encoding: 'utf-8' });
				const metadata = readMetadataFile(metadataFile);
				metadata.description = description;
				const update = await metadataToPrismaUpsert(metadata);
				updates.push(update);
			} catch (e) {
				console.error(e, `in directory ${path.dirname(file.filename)}`);
			}
		} else if (file.type === DiffType.Deleted) {
			try {
				deletes.push(path.basename(dirname));
			} catch (e) {
				console.error(e);
			}
		}
	}
	
	const creates = updates.map(update => Object.fromEntries(
			Object.entries(update)
				.map(([key, value]) => {
					if (typeof value === 'object') {
						value = Object.fromEntries(Object.entries(value)
							.filter(([key,]) => key !== 'disconnect')
						);
					}
					return [key, value];
				})
		)
	);
	
	await prisma.$transaction(
		[
			...updates.map((update, i) => prisma.module.upsert({
				where: {
					short: update.short
				},
				update: update,
				create: creates[i] as any
			})),
			
			prisma.module.deleteMany({ where: { dirname: { in: deletes } } })
		]
	);
}

function readMetadataFile(filename: string) {
	// Conditions / Definitions
	const stringProps = ['short', 'name'];
	const listProps = ['dependencies', 'focuses', 'degreePrograms', 'seasons', 'lecturers'];
	const requiredProps = [...stringProps, ...listProps];
	// Check
	const contents = fs.readFileSync(filename, { encoding: 'utf-8' });
	const givenProps = JSON.parse(contents);
	const missing = requiredProps.filter(p => !(p in givenProps));
	if (missing.length) {
		throw `missing properties [${missing.join(', ')}]`;
	}
	const unknowns = Object.keys(givenProps).filter(p => !requiredProps.includes(p));
	if (unknowns.length) {
		throw `unknown properties [${unknowns.join(', ')}]`;
	}
	const notStringTypes = Object.entries(givenProps)
		.filter(([key, value]) => stringProps.includes(key) && typeof value !== 'string')
		.map((([key,]) => key));
	if (notStringTypes.length) {
		throw `properties [${notStringTypes.join(', ')}] must be of type string`;
	}
	const notListTypes = Object.entries(givenProps)
		.filter(([key, value]) => listProps.includes(key) && !Array.isArray(value))
		.map((([key,]) => key));
	if (notListTypes.length) {
		throw `properties [${notListTypes.join(', ')}] must be of type array`;
	}
	// Ok
	givenProps.dirname = path.basename(path.dirname(filename));
	return givenProps;
}

interface Metadata {
	short: string
	name: string
	seasons: ("WS" | "SS")[]
	dirname: string
	degreePrograms: string[]
	focuses: string[]
	lecturers: string[]
}

async function metadataToPrismaUpsert(metadata: Metadata) {
	const season = getSeason(metadata.seasons);
	const rawUpdate = {
		...metadata,
		season,
		short: metadata.short.toLowerCase()
	};
	return Object.fromEntries((
		await Promise.all(Object
			.entries(rawUpdate)
			.map(async ([key, value]) => {
				switch (key) {
					case 'seasons':
						return null;
					case 'dependencies':
						return ['dependencies', {
							disconnect: (await prisma.module.findMany({ where: { NOT: { short: { in: value } } } }))
								.map(module => ({ short: module.short })),
							connect: (value as string[]).map(d => ({
								short: d
							}))
						}];
					case 'focuses':
						return ['focuses', {
							disconnect: (await prisma.focus.findMany({ where: { NOT: { name: { in: value } } } }))
								.map(focus => ({ name: focus.name })),
							connect: (value as string[]).map(n => ({
								name: n
							}))
						}];
					
					case 'degreePrograms':
						return ['degreePrograms', {
							disconnect: (await prisma.degreeProgram.findMany({ where: { NOT: { short: { in: value } } } }))
								.map(program => ({ short: program.short })),
							connect: (value as string[]).map(p => ({
								short: p
							}))
						}];
					
					case 'lecturers':
						return ['lecturers', {
							disconnect: (await prisma.lecturer.findMany({ where: { NOT: { short: { in: value } } } }))
								.map(lecturer => ({ short: lecturer.short })),
							connect: (value as string[]).map(l => ({
								short: l
							}))
						}];
					
					default:
						return [key, value];
				}
			})
		))
		.filter(kv => !!kv) as [string, any][]
	);
}

function updateHash() {
	const hash = execSync('git rev-parse HEAD').toString().trim();
	fs.writeFileSync(hashFile, hash, { encoding: 'utf-8' });
}

function getLastHash(): string {
	try {
		const hash = fs.readFileSync(hashFile, { encoding: 'utf-8', flag: 'r' }).trim();
		if (/[\w]{40}/.test(hash)) {
			return hash;
		}
	} catch (e) {
		// do nothing
	}
	return '4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // Initial Commit (always)
}

function getSeason(seasons: string[]): Season {
	const ws = seasons.includes('WS');
	const ss = seasons.includes('SS');
	if (ws && ss) {
		return Season.Both;
	}
	if (ws) {
		return Season.Winter;
	}
	if (ss) {
		return Season.Summer;
	}
	return Season.None;
}

enum DiffType {
	Modified,
	Added,
	Deleted
}

function fileHasChanged(commit: string, filename: string): boolean {
	return getUpdatedFiles(commit, filename).length > 0;
}

function getUpdatedFiles(commit: string, dir: string) {
	const diffs = execSync(`git diff --name-status --color=never ${commit} HEAD -- ${dir}`).toString();
	const regex = /([MAD])\s+(.+)/g;
	let diff;
	const files = [];
	while ((diff = regex.exec(diffs)) !== null) {
		const [, type, filename] = diff;
		const diffType = {
			'M': DiffType.Modified,
			'A': DiffType.Added,
			'D': DiffType.Deleted
		}[type];
		files.push({ type: diffType, filename: path.join(__dirname, '../../', filename) });
		console.log('updated file: ', { type: diffType, filename });
	}
	return files;
}