import test from 'node:test';
import assert from 'node:assert/strict';
import { appShell } from '../src/view-model.mjs';

test('declares required UI states', () => assert.equal(appShell.states.length, 6));
