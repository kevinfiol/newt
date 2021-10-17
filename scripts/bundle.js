import esbuild from 'esbuild';
import { resolve } from 'path';

const ENTRY = 'src/index.jsx';
const OUTPUT = 'dist/app.js';

export async function bundle(config = {}) {
    return esbuild.build({
        format: 'iife',
        entryPoints: [resolve(ENTRY)],
        bundle: true,
        outfile: resolve(OUTPUT),
        jsxFactory: 'h',
        ...config
    });
}

export const logSuccess = () => console.log('\x1b[42m%s\x1b[0m', `Bundled: ${resolve(OUTPUT)}`);
export const logError = message => console.error('\x1b[41m%s\x1b[0m', message);