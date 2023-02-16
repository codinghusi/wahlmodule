import * as fs from 'fs';
import {exec} from "node:child_process";
import * as path from 'path';
import { PrismaClient, Season } from '@prisma/client';
import { parse } from './parser';
import type { Parsed } from './parser';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

const dir = path.join(__dirname, '../modules');

const hashFile = path.join(__dirname, './lastCommit.txt');

exec("git pull", async (error, stdout) => {
	if (error) {
		console.error(error);
		return;
	}

	const files = getUpdatedFiles("../modules/");
	const creates = [];
	const updates = [];
	const deletes = [];
	for (const file of files) {
		if (file.type === DiffType.Added) {
			try {
				const contents = fs.readFileSync(file.filename, { encoding: 'utf-8', flag: 'r' });
				const parsed = parse(contents);
				const season = getSeason(parsed.seasons);
				creates.push({
					...parsed,
					season,
					fileName: file.filename
				});
			} catch (e) {
				console.error(e);
			}
		}
		else if (file.type === DiffType.Modified) {
			try {
				const contents = fs.readFileSync(file.filename, { encoding: 'utf-8', flag: 'r' });
				const parsed = parse(contents);
				const season = getSeason(parsed.seasons);
				updates.push({
					...parsed,
					season,
					fileName: file.filename
				});
			} catch (e) {
				console.error(e);
			}
		}
		else if (file.type === DiffType.Deleted) {
			try {
				deletes.push(file.filename);
			} catch (e) {
				console.error(e);
			}
		}
	}

	await prisma.module.createMany({ data: creates });
	await prisma.module.updateMany({ data: updates });
	await prisma.module.deleteMany({ where: { fileName: { in: deletes } } });

	updateHash();

	console.log({
		creates,
		updates,
		deletes
	});

});

function updateHash() {
	const hash = execSync("git rev-parse HEAD").toString().trim();
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
	return "4b825dc642cb6eb9a060e54bf8d69288fbee4904"; // Initial Commit (always)
}

function getSeason(seasons: string[]): Season {
	const ws = seasons.includes('WS');
	const ss = seasons.includes('SS');
	if (ws && ss) {
		return Season.Both
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

function getUpdatedFiles(path: string) {
	const hash = getLastHash();
	const diffs = execSync(`git diff --name-status --color=never ${hash} HEAD ${path}`).toString();
	const regex = /([MAD])\s+(.+)/;
	let diff;
	const files = [];
	while ((diff = regex.exec(diffs)) !== null) {
		const [, type, filename] = diff;
		const diffType = {
			'M': DiffType.Modified,
			'A': DiffType.Added,
			'D': DiffType.Deleted
		}[type];
		files.push({ type: diffType, filename });
	}
	return files;
}


