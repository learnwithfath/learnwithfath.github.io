import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const roadmap = JSON.parse(await readFile(join(root, 'codelabs/data/agentic-roadmap.json'), 'utf8'));
const weeks = roadmap.phases.flatMap(phase => phase.weeks);
const errors = [];

function run(command, args, cwd = root) {
    return spawnSync(command, args, { cwd, encoding: 'utf8' });
}

for (const week of weeks) {
    const padded = String(week.week).padStart(2, '0');
    const lab = week.week <= 3 ? 'agentic-loop-lab' : 'taskforge-agentic';
    const pack = join(root, 'labs', lab, 'acceptance', `week-${padded}`);
    for (const file of ['manifest.json', 'fixture.json', 'expected-output.txt', 'README.md']) {
        try { await access(join(pack, file)); }
        catch { errors.push(`Missing ${lab}/acceptance/week-${padded}/${file}`); }
    }
    try {
        const manifest = JSON.parse(await readFile(join(pack, 'manifest.json'), 'utf8'));
        for (const field of ['startBranch', 'solutionBranch', 'verifier', 'fixture', 'expectedFailure', 'expectedSuccess', 'artifacts']) {
            if (!manifest[field]) errors.push(`Week ${padded} manifest missing ${field}`);
        }
    } catch (error) {
        errors.push(`Week ${padded} manifest is invalid: ${error.message}`);
    }
}

for (const spec of [
    { name: 'agentic-loop-lab', weeks: weeks.filter(week => week.week <= 3) },
    { name: 'taskforge-agentic', weeks: weeks.filter(week => week.week >= 4) }
]) {
    const bundle = join(root, 'codelabs/downloads', `${spec.name}.bundle`);
    try { await access(bundle); }
    catch { errors.push(`Missing bundle ${spec.name}.bundle`); continue; }
    const heads = run('git', ['bundle', 'list-heads', bundle]);
    if (heads.status !== 0) {
        errors.push(`Invalid bundle ${spec.name}: ${heads.stderr}`);
        continue;
    }
    for (const week of spec.weeks) {
        const padded = String(week.week).padStart(2, '0');
        for (const suffix of ['start', 'solution']) {
            if (!heads.stdout.includes(`refs/heads/week-${padded}-${suffix}`)) {
                errors.push(`${spec.name} missing week-${padded}-${suffix}`);
            }
        }
    }

    const temp = await mkdtemp(join(tmpdir(), `validate-${spec.name}-`));
    const clone = run('git', ['clone', '--quiet', bundle, temp]);
    if (clone.status !== 0) {
        errors.push(`Cannot clone ${spec.name}: ${clone.stderr}`);
        await rm(temp, { recursive: true, force: true });
        continue;
    }
    for (const week of spec.weeks) {
        const padded = String(week.week).padStart(2, '0');
        const startCheckout = run('git', ['switch', '--quiet', `week-${padded}-start`], temp);
        const start = run('node', ['tooling/lab.mjs', 'verify', padded], temp);
        if (startCheckout.status !== 0 || start.status === 0 || !start.stderr.includes(`W${padded}_NOT_IMPLEMENTED`)) {
            errors.push(`${spec.name} week-${padded}-start does not fail with the expected ID`);
        }
        const solutionCheckout = run('git', ['switch', '--quiet', `week-${padded}-solution`], temp);
        const solution = run('node', ['tooling/lab.mjs', 'verify', padded], temp);
        if (solutionCheckout.status !== 0 || solution.status !== 0) {
            errors.push(`${spec.name} week-${padded}-solution does not pass`);
        }
    }
    await rm(temp, { recursive: true, force: true });
}

if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'));
    process.exit(1);
}

console.log('Agentic labs valid: 24 acceptance packs and 48 start/solution branches verified.');
