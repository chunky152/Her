#!/usr/bin/env node
// Rewrites sw.js's VERSION to a hash of PRECACHE_URLS' current contents, so
// the cache version can't drift out of sync with a forgotten manual bump —
// any change to a precached file's bytes changes VERSION, which changes
// sw.js's own bytes, which is what makes the browser install it as an
// update and clean up the old cache on activate. Run via `npm run concat`
// (and therefore `npm run build`, which runs concat first).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const swPath = path.join(root, 'sw.js');
const swSource = fs.readFileSync(swPath, 'utf8');

const listMatch = swSource.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
if (!listMatch) {
  console.error('update-sw-version: could not find PRECACHE_URLS in sw.js');
  process.exit(1);
}

const files = listMatch[1]
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => entry.replace(/^['"]|['"]$/g, ''))
  .filter((file) => file !== '.'); // '.' resolves to index.html, already listed separately

const hash = crypto.createHash('sha256');
for (const file of files.slice().sort()) {
  hash.update(file);
  hash.update(fs.readFileSync(path.join(root, file)));
}
const version = 'v' + hash.digest('hex').slice(0, 10);

const versionMatch = swSource.match(/const VERSION = '([^']*)';/);
if (!versionMatch) {
  console.error('update-sw-version: could not find VERSION in sw.js');
  process.exit(1);
}

if (versionMatch[1] === version) {
  console.log(`sw.js VERSION unchanged (${version})`);
  process.exit(0);
}

fs.writeFileSync(swPath, swSource.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`));
console.log(`sw.js VERSION updated: ${versionMatch[1]} -> ${version}`);
