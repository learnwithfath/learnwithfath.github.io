import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('declares all seven implementation surfaces', async () => {
    const surfaces = JSON.parse(await readFile('tooling/surfaces.json', 'utf8'));
    assert.equal(surfaces.length, 7);
    assert.deepEqual(surfaces.map(item => item.id).sort(), [
        'android-compose', 'api-go', 'api-nest', 'flutter',
        'ios-swiftui', 'web-next', 'web-nuxt'
    ]);
});
