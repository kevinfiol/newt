import esbuild from 'esbuild';
import { readFileSync, openSync, writeSync, close } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const ENTRY = '../src/index.jsx';
const OUTPUT = '../dist/app.js';

build(ENTRY, OUTPUT, { format: 'iife', minify: false });

function build(entry, outfile, config = {}) {
    const opts = {
        entryPoints: [join(__dirname, entry)],
        bundle: true,
        outfile: join(__dirname, outfile),
        jsxFactory: 'h',
        jsxFragment: 'h.Fragment',
        ...config
    };

    esbuild.build(opts).then(() => {
        console.log('\x1b[42m%s\x1b[0m', `Bundled: ${outfile}`);
    }).catch((e) => {
        console.error('\x1b[41m%s\x1b[0m', e.message);
    });
}