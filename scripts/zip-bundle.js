// Zips bundle/ into gsr-presentation.zip for sending.
// Everything goes inside one top-level folder, so unzipping doesn't scatter files.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { zipSync } from 'fflate';

const SRC = 'bundle';
const ROOT = 'gsr-presentation';
const OUT = `${ROOT}.zip`;

// Already-compressed formats: store them as-is instead of compressing again.
const STORE = /\.(mp4|webm|mov|m4v|png|jpe?g|gif|webp|avif)$/i;

const files = {};
for (const entry of readdirSync(SRC, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const abs = join(entry.parentPath, entry.name);
  const rel = relative(SRC, abs).split(sep).join('/');
  files[`${ROOT}/${rel}`] = [readFileSync(abs), { level: STORE.test(rel) ? 0 : 6 }];
}

writeFileSync(OUT, zipSync(files));

const mb = (statSync(OUT).size / 1e6).toFixed(1);
console.log(`Wrote ${OUT} (${mb} MB, ${Object.keys(files).length} files)`);
