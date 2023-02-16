import * as fs from 'fs';
import { exec } from 'node:child_process';
import * as path from 'path';
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

const hashFile = path.join(__dirname, './lastCommit.txt');


// exec("git pull", async (error, stdout) => {
exec('echo \'schabernack\'', async (error, stdout) => {
	if (error) {
		console.error(error);
		return;
	}
	
	const commit = getLastHash();
	
	await updateFocuses(commit);
	await updateLecturers(commit);
	await updateDegreePrograms(commit);
	await updateModules(commit);
	
	updateHash();
	
	prisma.$disconnect();
	
});

interface Focus {
	name: string;
}

async function updateFocuses(commit: string) {
	if (fileHasChanged(commit, focusesFile)) {
		const content = fs.readFileSync(focusesFile, { encoding: 'utf-8' });
		const focuses = JSON.parse(content) as Focus[];
		const upserts = focuses.map(focus => ({
			where: { name: focus.name },
			update: focus,
			create: focus
		}));
		prisma.$transaction(
			upserts.map(upsert => prisma.focus.upsert(upsert))
		);
	}
}

interface Lecturer {
	short: string,
	fullName: string,
	homepage: string
}

async function updateLecturers(commit: string) {
	if (fileHasChanged(commit, lecturersFile)) {
		const content = fs.readFileSync(lecturersFile, { encoding: 'utf-8' });
		const lecturers = JSON.parse(content) as Lecturer[];
		const upserts = lecturers.map(lecturer => ({
			where: { short: lecturer.short },
			update: lecturer,
			create: lecturer
		}));
		prisma.$transaction(
			upserts.map(upsert => prisma.lecturer.upsert(upsert))
		);
	}
}


interface DegreeProgram {
	short: string,
	long: string
}

async function updateDegreePrograms(commit: string) {
	if (fileHasChanged(commit, degreeProgramsFile)) {
		const content = fs.readFileSync(degreeProgramsFile, { encoding: 'utf-8' });
		const degreePrograms = JSON.parse(content) as DegreeProgram[];
		const upserts = degreePrograms.map(degreeProgram => ({
			where: { short: degreeProgram.short },
			update: degreeProgram,
			create: degreeProgram
		}));
		prisma.$transaction(
			upserts.map(upsert => prisma.degreeProgram.upsert(upsert))
		);
	}
}

async function updateModules(commit: string) {
	const files = getUpdatedFiles(commit, '../modules/');
	const updates = [];
	const deletes = [];
	for (const file of files) {
		if (file.type === DiffType.Added || file.type === DiffType.Modified) {
			try {
				const contents = fs.readFileSync(file.filename, { encoding: 'utf-8', flag: 'r' });
				const parsed = parse(contents);
				const season = getSeason(parsed.seasons);
				const rawUpdate = {
					...parsed,
					season,
					fileName: file.filename
				};
				const update = Object.fromEntries((
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
				updates.push(update);
			} catch (e) {
				console.error(e);
			}
		} else if (file.type === DiffType.Deleted) {
			try {
				deletes.push(file.filename);
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
							.filter(([key, value]) => key !== 'disconnect')
						);
					}
					return [key, value];
				})
		)
	);
	
	await prisma.$transaction(
		updates.map((update, i) => prisma.module.upsert({
				where: {
					short: update.short
				},
				update: update,
				create: creates[i] as any
			})
		)
	);
	await prisma.module.deleteMany({ where: { fileName: { in: deletes } } });
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