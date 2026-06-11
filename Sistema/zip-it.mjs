import { createWriteStream, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');

const src = '/home/joao/Freelas/Sistema';
const out = '/home/joao/Freelas/Sistema.zip';

const output = createWriteStream(out);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log(`Zip created: ${out} (${archive.pointer()} bytes)`));
archive.on('error', err => { throw err; });

archive.pipe(output);

const exclude = new Set([
  'node_modules',
  'dist',
  '.git',
  'zip-it.mjs',
  'package-lock.json',
]);

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const abs = join(dir, e.name);
    const rel = join(relative(src, abs));
    if (exclude.has(e.name) || e.name.endsWith('.zip') || e.name.endsWith(':Zone.Identifier')) continue;
    if (e.isDirectory()) {
      walk(abs);
    } else {
      archive.file(abs, { name: rel });
    }
  }
}

walk(src);
archive.finalize();
