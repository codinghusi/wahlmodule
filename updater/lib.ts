import fs from 'fs';
import path from 'path';
import { Season } from '@prisma/client';
import { prisma } from '../src/lib/Data/client';
import 'dotenv/config';

// TODO: test edge cases for: deletion, renaming files and directories (gitlabConfig.new_path vs gitlabConfig.old_path?)
// FIXME: modules/other/... is not a valid directory for a module

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lastCommitHashFile = 'updater/lastCommit.txt';

interface GitlabConfig {
	accessToken: string,
	url: string,
	projectId: string,
	currentCommit: string,
	branchName: string
}

let gitlabConfig: GitlabConfig | null = null;

function getGitlabConfig(): GitlabConfig {
	if (!gitlabConfig) {
		const config: Partial<GitlabConfig>  = {
			accessToken: process.env.GITLAB_ACCESS_TOKEN,
			url: process.env.GITLAB_URL,
			projectId: process.env.GITLAB_PROJECT_ID ,
			branchName: process.env.GITLAB_BRANCH_NAME,
			currentCommit: getLastCommitHash()
		};
		if (!Object.values(config).every(value => !!value)) {
			console.error(config);
			throw "Please make sure to set the environment variables GITLAB_URL, GITLAB_ACCESS_TOKEN, GITLAB_PROJECT_ID and GITLAB_BRANCH_NAME";
		}
		gitlabConfig = config as GitlabConfig;
	}
	return gitlabConfig;
}

interface DiffSummary {
	latestCommit: string,
	diffs: Diff[]
}

interface Diff {
	new_path: string,
	old_path: string,
	new_file: boolean,
	renamed_file: boolean,
	deleted_file: boolean
}

export async function getDiffSummary(): Promise<DiffSummary> {
	const config = getGitlabConfig();
	const response = await fetch(`${config.url}/api/v4/projects/${config.projectId}/repository/compare?from=${config.currentCommit}&to=HEAD`, {
		headers: { 'PRIVATE-TOKEN': config.accessToken }
	});
	const json = await response.json();
	const result = {
		latestCommit: json.commits?.[0]?.id,
		diffs: (json.diffs as Diff[])?.map(({new_path, old_path, new_file, renamed_file, deleted_file}) => ({
			new_path,
			old_path,
			new_file,
			renamed_file,
			deleted_file
		}))
	};
	if (!result.latestCommit) {
		if (json.commit === null) {
			return {
				latestCommit: config.currentCommit,
				diffs: []
			};
		}
		console.error(json);
		throw "couldn't get diff summary";
	}
	return result;
}

export async function downloadFile(fileName: string) {
	const config = getGitlabConfig();
	const json = await fetch(`${config.url}/api/v4/projects/${config.projectId}/repository/files/${encodeURIComponent(fileName.replaceAll('\\', '/'))}?ref=${config.branchName}`, {
		headers: { 'PRIVATE-TOKEN': config.accessToken }
	}).then(response => response.json());

	if (!json.content) {
		console.error(json);
		throw `Couldn't download file ${fileName}`;
	}
	
	return Buffer.from(json.content, 'base64').toString('utf-8');
}

export async function updateByFile<T>(diffSummary: DiffSummary, fileName: string, idKey: keyof T, model: keyof typeof prisma, deleteAll = false) {
	if (fileHasChanged(diffSummary, fileName)) {
		const content = await downloadFile(fileName);
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
		console.log('updated file: ' + fileName);
		prisma.$transaction(commands);
	} else {
		console.log(`${model} is up-to-date`)
	}
}

export async function updateModules(diffSummary: DiffSummary) {
	const updates = [] as Record<string, any>[];
	const walkedDirectories = new Set<string>();
	const deletes = [];
	for (const file of diffSummary.diffs) {
		const dirname = path.dirname(file.new_path);
		if (dirname.endsWith('other')) {
			continue;
		}
		
		// both files in same directory could be modified
		if (walkedDirectories.has(dirname)) {
			continue;
		}
		walkedDirectories.add(dirname);
		
		const metadataFile = path.join(dirname, './metadata.json');
		const descriptionFile = path.join(dirname, './description.md');
		if (file.deleted_file) {
			try {
				// FIXME: maybe that's not the best way to reference the record
				deletes.push(path.basename(dirname));
				console.log(`deleting ${dirname}`);
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				const description = await downloadFile(descriptionFile);
				const metadata = await readMetadataFile(metadataFile);
				metadata.description = description;
				const update = await metadataToPrismaUpsert(metadata);
				updates.push({ dirname, ...update });
				console.log('updated module: ' + dirname);
			} catch (e) {
				console.error(e, `in directory ${dirname}`);
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

async function readMetadataFile(filename: string) {
	// Conditions / Definitions
	const stringProps = ['short', 'name'];
	const listProps = ['dependencies', 'focuses', 'degreePrograms', 'seasons', 'lecturers'];
	const requiredProps = [...stringProps, ...listProps];
	// Check
	const contents = await downloadFile(filename);
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

export function updateHash(hashValue: string) {
	fs.writeFileSync(lastCommitHashFile, hashValue, { encoding: 'utf-8' });
}


function testCommitHash(hash: string) {
	return /[0-9a-fA-F]{40}/.test(hash);
}

function getLastCommitHash(): string {
	try {
		const hash = fs.readFileSync(path.join(__dirname, '..', lastCommitHashFile), { encoding: 'utf-8', flag: 'r' }).trim();
		if (testCommitHash(hash)) {
			return hash;
		}
	} catch (e) {
		// do nothing
	}
	
	const root_commit = process.env.GITLAB_ROOT_COMMIT;
	if (!root_commit) {
		throw `You need to specify the env GITLAB_ROOT_COMMIT with its hash (in a valid format). Be aware that it must be a commit before data/* is written.`;
	}
	
	return root_commit;
	
	// return '4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // Initial Commit (always for every project... but only for local git)
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

function fileHasChanged(diffSummary: DiffSummary, filename: string): boolean {
	return !!diffSummary.diffs.find(diff => diff.new_path == filename);
}