import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'codelabs/data/agentic-roadmap.json');
const data = JSON.parse(await readFile(dataPath, 'utf8'));
const errors = [];
const requiredTracks = ['backend', 'web', 'mobile', 'workflow', 'orchestration', 'security'];
const requiredAssets = [
    'product-brief.md',
    'agent-instructions.md',
    'task-state.md',
    'model-scorecard.tsv',
    'permission-matrix.md',
    'review-and-dod.md',
    'openapi-taskforge.yaml',
    'run-log.md',
    'threat-model.md'
];

if (data.meta.phases !== 8 || data.phases.length !== 8) errors.push('Roadmap must contain exactly 8 phases.');
if (data.meta.weeks !== 24) errors.push('Roadmap meta.weeks must be 24.');

const weeks = data.phases.flatMap(phase => phase.weeks.map(week => ({ ...week, phase })));
const weekNumbers = weeks.map(item => item.week);
if (weeks.length !== 24) errors.push(`Expected 24 week entries, found ${weeks.length}.`);
if (new Set(weekNumbers).size !== 24 || !weekNumbers.every((week, index) => week === index + 1)) {
    errors.push('Week numbers must be unique and continuous from 1 to 24.');
}

for (const { phase, ...week } of weeks) {
    for (const field of ['title', 'hours', 'lab', 'deliverable', 'rubric']) {
        if (!week[field] || String(week[field]).trim().length < 3) errors.push(`Week ${week.week} is missing ${field}.`);
    }
    if (!Array.isArray(week.tracks) || week.tracks.length === 0) errors.push(`Week ${week.week} has no tracks.`);
}

for (const track of requiredTracks) {
    if (!weeks.some(item => item.tracks.includes(track))) errors.push(`Required track '${track}' is not represented.`);
}

for (const phase of data.phases) {
    const source = path.join(root, 'codelabs', `${phase.moduleUrl.replace(/\/$/, '')}.md`);
    const generated = path.join(root, 'codelabs', phase.moduleUrl, 'index.html');
    try { await access(source); } catch { errors.push(`Missing module source: ${path.relative(root, source)}`); }
    try { await access(generated); } catch { errors.push(`Missing generated module: ${path.relative(root, generated)}`); }
}

for (const asset of requiredAssets) {
    const assetPath = path.join(root, 'codelabs/agentic-engineering-assets', asset);
    try { await access(assetPath); } catch { errors.push(`Missing practice asset: ${path.relative(root, assetPath)}`); }
}

for (const surface of ['agentic-engineering-roadmap.html', 'agentic-engineering-roadmap.css', 'agentic-engineering-roadmap.js']) {
    const surfacePath = path.join(root, 'codelabs', surface);
    try { await access(surfacePath); } catch { errors.push(`Missing roadmap surface: ${path.relative(root, surfacePath)}`); }
}

const catalog = JSON.parse(await readFile(path.join(root, 'codelabs/data/codelabs.json'), 'utf8'));
if (!catalog.codelabs.some(item => item.id === 'agentic-engineering-roadmap')) errors.push('Roadmap is missing from the codelab catalog.');

if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'));
    process.exit(1);
}

console.log('Agentic roadmap valid: 8 phases, 24 weeks, required tracks, modules, and catalog entry found.');
