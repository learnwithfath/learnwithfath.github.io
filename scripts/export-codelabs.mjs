import { readdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const codelabsDir = path.join(process.cwd(), 'codelabs');
const markdownFiles = (await readdir(codelabsDir))
    .filter(file => file.endsWith('.md'))
    .sort();

const sources = [];
for (const file of markdownFiles) {
    const content = await readFile(path.join(codelabsDir, file), 'utf8');
    if (/^id:\s*\S+/m.test(content)) sources.push(file);
}

if (sources.length === 0) {
    console.error('No codelab Markdown sources with id metadata found.');
    process.exit(1);
}

const child = spawn(
    'go',
    ['run', 'github.com/googlecodelabs/tools/claat@latest', 'export', ...sources],
    { cwd: codelabsDir, stdio: 'inherit' }
);

child.on('error', error => {
    console.error(`Failed to start claat: ${error.message}`);
    process.exit(1);
});

child.on('exit', code => process.exit(code ?? 1));
