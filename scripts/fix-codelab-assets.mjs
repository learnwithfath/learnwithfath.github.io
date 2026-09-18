// claat's default template links codelab-elements.css/js (and polyfills)
// from storage.googleapis.com/claat-public, which now 403s (the GCS
// project backing that bucket lost its billing account). This rewrites
// every generated codelabs/*/index.html to use the vendored copies in
// codelabs/vendor/codelab-elements/ instead.
//
// codelab-elements.js already bundles prettify and defines its own
// custom elements, so custom-elements.min.js and prettify.js are dropped.
// native-shim.js IS still required — codelab-elements.js is ES5-transpiled
// and extends HTMLElement the ES5 way, which throws
// "Failed to construct 'HTMLElement'" without the Reflect.construct shim
// that native-shim.js provides (vendored from
// @webcomponents/webcomponentsjs's custom-elements-es5-adapter.js).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const codelabsDir = path.join(process.cwd(), 'codelabs');

const REMOVE_LINES = [
    '  <script src="https://storage.googleapis.com/claat-public/custom-elements.min.js"></script>\n',
    '  <script src="https://storage.googleapis.com/claat-public/prettify.js"></script>\n',
];

let changedCount = 0;

const entries = await readdir(codelabsDir, { withFileTypes: true });
for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'vendor') continue;
    const htmlPath = path.join(codelabsDir, entry.name, 'index.html');
    let html;
    try {
        html = await readFile(htmlPath, 'utf8');
    } catch {
        continue;
    }
    if (
        !html.includes('storage.googleapis.com/claat-public') &&
        html.includes('vendor/codelab-elements/native-shim.js')
    ) {
        continue;
    }

    let updated = html
        .replace(
            'https://storage.googleapis.com/claat-public/codelab-elements.css',
            '../vendor/codelab-elements/codelab-elements.css'
        )
        .replace(
            'https://storage.googleapis.com/claat-public/native-shim.js',
            '../vendor/codelab-elements/native-shim.js'
        )
        .replace(
            'https://storage.googleapis.com/claat-public/codelab-elements.js',
            '../vendor/codelab-elements/codelab-elements.js'
        );
    for (const line of REMOVE_LINES) {
        updated = updated.replace(line, '');
    }
    if (!updated.includes('vendor/codelab-elements/native-shim.js')) {
        updated = updated.replace(
            '  <script src="../vendor/codelab-elements/codelab-elements.js"></script>\n',
            '  <script src="../vendor/codelab-elements/native-shim.js"></script>\n' +
                '  <script src="../vendor/codelab-elements/codelab-elements.js"></script>\n'
        );
    }

    if (updated !== html) {
        await writeFile(htmlPath, updated);
        changedCount += 1;
    }
}

console.log(`fix-codelab-assets: updated ${changedCount} codelab page(s).`);
