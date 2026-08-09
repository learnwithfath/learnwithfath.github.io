import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const week = String(process.argv.at(-1) || '').padStart(2, '0');
if (!/^\d{2}$/.test(week)) process.exit(2);
const manifest = JSON.parse(await readFile(path.join('acceptance', `week-${week}`, 'manifest.json'), 'utf8'));
let checkpoint = { status: 'source' };
try { checkpoint = JSON.parse(await readFile('.lab-checkpoint.json', 'utf8')); } catch {}
if (checkpoint.status === 'start') {
    console.error(`EXPECTED RED [${manifest.expectedFailure.id}]: ${manifest.expectedFailure.message}`);
    process.exit(1);
}
try { await access(path.join('evidence', `week-${week}.txt`)); }
catch { console.error(`Missing evidence/week-${week}.txt`); process.exit(1); }
console.log(`PASS week ${week}: ${manifest.expectedSuccess}`);
