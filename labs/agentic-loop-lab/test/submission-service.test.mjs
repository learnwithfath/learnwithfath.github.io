import test from 'node:test';
import assert from 'node:assert/strict';
import { submitOnce } from '../src/submission-service.mjs';

test('coalesces concurrent submissions with the same key', async () => {
    let calls = 0;
    const operation = async () => {
        calls += 1;
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'ok';
    };
    const results = await Promise.all([
        submitOnce('same', operation),
        submitOnce('same', operation)
    ]);
    assert.deepEqual(results, ['ok', 'ok']);
    assert.equal(calls, 1);
});
