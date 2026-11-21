// Golden Hour Cover Studio — entry program (Node 22, stdlib only).
// Hands the app in: copies app/ and screenshots/ from beside this file
// into /output (or $MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json with the kit's makefun-app library, so the scorer
// can rebuild the same dossier byte for byte and the judge can read it.
//
// The app itself is plain static files under app/: index.html plus its
// ES modules, styles, vendored fonts and the photographic demo cast.
// It makes no network request. The screenshots under screenshots/ are
// the app's own drawings: three exported covers in three layouts and
// three grades, plus the editor with a photo loaded.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's own caps (reference/gate.json): screenshots at most 4 files
// of 256 KiB, app/ at most 993 entries and 48 MiB, the dossier text at
// most 160 KiB. Refuse here what the scorer would refuse there, loudly,
// instead of handing in an entry that can only fail.
const SCREENSHOT_MAX = 4;
const SCREENSHOT_MAX_BYTES = 262144;

const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir)) throw new Error('screenshots/: no such directory');
const shots = readdirSync(shotsDir)
  .filter((n) => !n.startsWith('.'))
  .sort();
if (shots.length < 3 || shots.length > SCREENSHOT_MAX) {
  throw new Error(`screenshots/: holds ${shots.length} images, need 3 or 4`);
}
// The first screenshot by name is the cover the judge sees on top: it
// must be an exported cover, never the editor.
if (!/cover/i.test(shots[0])) {
  throw new Error(`screenshots/${shots[0]}: the first screenshot by name must be an exported cover`);
}
for (const name of shots) {
  const st = statSync(join(shotsDir, name));
  if (!st.isFile()) throw new Error(`screenshots/${name}: not a regular file`);
  if (st.size > SCREENSHOT_MAX_BYTES) {
    throw new Error(`screenshots/${name}: ${st.size} bytes, over the 256 KiB cap`);
  }
  if (!/\.(png|jpe?g)$/i.test(name)) {
    throw new Error(`screenshots/${name}: not a PNG or JPEG`);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: SCREENSHOT_MAX, max_bytes: SCREENSHOT_MAX_BYTES },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);

// The dossier must be non-trivial: a build that wrote no sources is a
// build that did not happen, and the gate would refuse it downstream.
const dossierBytes = statSync(join(out, 'dossier.json')).size;
if (dossierBytes < 10000) {
  throw new Error(`dossier.json: only ${dossierBytes} bytes, the app handed in is empty`);
}
console.log(`handed in ${shots.length} screenshots: ${shots.join(', ')}`);
console.log(`dossier.json: ${dossierBytes} bytes`);
