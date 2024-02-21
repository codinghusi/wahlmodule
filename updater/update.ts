import { PrismaClient } from '@prisma/client';
import { getDiffSummary, updateByFile, updateHash, updateModules } from './lib';

// FIXME: It's a must that you have the very first commit without any data/* which hash needs to be put into lastCommit.txt

const prisma = new PrismaClient();

// const dir = 'data/modules'
const lecturersFile = 'data/other/lecturers.json';
const degreeProgramsFile = 'data/other/degree-programs.json';
const focusesFile = 'data/other/focuses.json';
const ratingsFile = 'data/other/ratings.json';

getDiffSummary().then(async summary => {
	await prisma.$transaction([
			...await updateByFile(summary, ratingsFile, 'id', 'rating', true),
			...await updateByFile(summary, focusesFile, 'name', 'focus', true),
			...await updateByFile(summary, lecturersFile, 'short', 'lecturer'),
			...await updateByFile(summary, degreeProgramsFile, 'short', 'degreeProgram'),
			...await updateModules(summary)
	])
	
	updateHash(summary.latestCommit);
	
	await prisma.$disconnect();
	
}).catch(err => console.error("Error:", err));

