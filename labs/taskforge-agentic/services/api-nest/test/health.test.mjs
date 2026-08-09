import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('declares the TaskForge health route', async () => {
    const source = await readFile('src/main.ts', 'utf8');
    assert.match(source, /@Get\('health'\)/);
    assert.match(source, /status: 'ok'/);
});
