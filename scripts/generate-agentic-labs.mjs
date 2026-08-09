import { mkdir, writeFile, readFile, rm, cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const roadmap = JSON.parse(await readFile(join(root, 'codelabs/data/agentic-roadmap.json'), 'utf8'));
const weeks = roadmap.phases.flatMap(phase => phase.weeks.map(week => ({ ...week, phase: phase.number })));
const loopRoot = join(root, 'labs/agentic-loop-lab');
const taskRoot = join(root, 'labs/taskforge-agentic');

async function put(target, value) {
    await mkdir(dirname(target), { recursive: true });
    const content = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    await writeFile(target, content.endsWith('\n') ? content : `${content}\n`);
}

for (const week of weeks) {
    const labRoot = week.week <= 3 ? loopRoot : taskRoot;
    const padded = String(week.week).padStart(2, '0');
    const packRoot = join(labRoot, `acceptance/week-${padded}`);
    const manifest = {
        week: week.week,
        phase: week.phase,
        title: week.title,
        tracks: week.tracks,
        startBranch: `week-${padded}-start`,
        solutionBranch: `week-${padded}-solution`,
        setup: week.week <= 3 ? ['npm test'] : ['npm run test:smoke'],
        verifier: `npm run lab -- verify ${padded}`,
        fixture: `acceptance/week-${padded}/fixture.json`,
        expectedFailure: {
            id: `W${padded}_NOT_IMPLEMENTED`,
            message: `Acceptance criteria minggu ${week.week} belum terpenuhi.`
        },
        expectedSuccess: week.rubric,
        artifacts: [week.deliverable],
        cleanup: ['git restore .', 'git clean -fd']
    };
    await put(join(packRoot, 'manifest.json'), manifest);
    await put(join(packRoot, 'fixture.json'), {
        week: week.week,
        deterministic: true,
        seed: `taskforge-week-${padded}`,
        scenario: week.lab
    });
    await put(join(packRoot, 'expected-output.txt'), `PASS week ${padded}: ${week.rubric}`);
    await put(join(packRoot, 'README.md'), [
        `# Minggu ${week.week} — ${week.title}`,
        '',
        '## Task',
        '',
        week.lab,
        '',
        '## Setup',
        '',
        '```bash',
        `git switch week-${padded}-start`,
        ...manifest.setup,
        manifest.verifier,
        '```',
        '',
        `Verifier pertama harus merah dengan ID \`${manifest.expectedFailure.id}\`.`,
        '',
        '## Evidence',
        '',
        week.deliverable,
        '',
        '## Expected output',
        '',
        week.rubric,
        '',
        `Setelah review mandiri, bandingkan dengan \`week-${padded}-solution\`.`
    ].join('\n'));
    await put(join(labRoot, `evidence/week-${padded}.txt`), [
        week.deliverable,
        '',
        `Expected: ${week.rubric}`
    ].join('\n'));
}

function git(args, cwd) {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
}

async function createBundle(source, name, selectedWeeks) {
    const temp = await mkdtemp(join(tmpdir(), `${name}-`));
    await cp(source, temp, {
        recursive: true,
        filter: candidate => !/(^|\/)(node_modules|build|\.build|\.dart_tool|\.gradle|\.next|\.nuxt|\.output|dist)(\/|$)/.test(candidate)
    });
    git(['init', '-b', 'main'], temp);
    git(['config', 'user.name', 'LearnWithFath Lab Builder'], temp);
    git(['config', 'user.email', 'labs@learnwithfath.github.io'], temp);
    git(['add', '.'], temp);
    git(['commit', '-m', 'feat: provide completed starter workspace'], temp);
    for (const week of selectedWeeks) {
        const padded = String(week.week).padStart(2, '0');
        git(['switch', '-C', `week-${padded}-start`, 'main'], temp);
        await rm(join(temp, `evidence/week-${padded}.txt`), { force: true });
        await put(join(temp, '.lab-checkpoint.json'), { week: week.week, status: 'start' });
        if (week.week === 1) {
            await put(join(temp, 'src/submission-service.mjs'), 'export async function submitOnce(_key, operation) { return operation(); }');
        }
        git(['add', '-A'], temp);
        git(['commit', '-m', `test(lab): start week ${padded} acceptance`], temp);
        git(['switch', '-C', `week-${padded}-solution`, `week-${padded}-start`], temp);
        await put(join(temp, '.lab-checkpoint.json'), { week: week.week, status: 'solution' });
        await put(join(temp, `evidence/week-${padded}.txt`), `${week.deliverable}\n\nExpected: ${week.rubric}`);
        if (week.week === 1) {
            await cp(join(source, 'src/submission-service.mjs'), join(temp, 'src/submission-service.mjs'));
        }
        git(['add', '-A'], temp);
        git(['commit', '-m', `feat(lab): complete week ${padded} acceptance`], temp);
    }
    git(['switch', 'main'], temp);
    const downloads = join(root, 'codelabs/downloads');
    await mkdir(downloads, { recursive: true });
    const target = join(downloads, `${name}.bundle`);
    await rm(target, { force: true });
    git(['bundle', 'create', target, '--all'], temp);
    await rm(temp, { recursive: true, force: true });
}

await createBundle(loopRoot, 'agentic-loop-lab', weeks.filter(week => week.week <= 3));
await createBundle(taskRoot, 'taskforge-agentic', weeks.filter(week => week.week >= 4));
console.log('Generated 24 acceptance packs and two Git bundles.');
