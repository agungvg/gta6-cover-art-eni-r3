# Golden Hour Cover Studio

[![gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/agungvg/gta6-cover-art-eni-r3/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/agungvg/gta6-cover-art-eni-r3/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

Your photos become framed crime-epic key art — hero close-up, face-aware
crops, 6 grades, 7 layouts, PNG in 3 sizes. An offline browser web app for
make.fun `gta6-cover-art-01`.

## What it is

A 3-step wizard that turns any photo into a GTA VI-style multi-panel
poster:

1. **Add photos** — drop, paste or pick files (they never leave the
   device), or load the bundled 7-person photographic demo cast.
2. **Caption** — title, script subtitle, tagline ribbon, press quote with
   a named outlet, billing block, seal, volume badge and release line.
3. **Export PNG** — 1080×1080, 1080×1350 and 1920×1080, one by one or all
   three at once.

## What a cover carries

Every exported cover has the full poster furniture: a 5-star press quote
with a named outlet, a VOL. 1 badge, a tagline ribbon, COMING SOON, a
two-line billing block, a procedural barcode, a gold starburst seal, and
a slanted role tag on every panel. The title is huge striped-chrome Anton
with a Yellowtail script subtitle overlapping the art, and its colours
follow the grade.

## Range

- **7 layouts** — Hero Mosaic, Diagonal Strips, Six Grid, Hero + Three,
  Seven Mosaic, Tilted Snapshots, Sunset Band. One hero panel is always
  larger; the title band sits below every hero face.
- **6 grades** — Sunset Gold, Neon Night, Tropic Teal, Ultraviolet,
  Retro Print, Heatwave. Each re-grades the photos, the title stripes,
  the frame, the seal and the procedural skyline behind the panels.
- **Face-aware crops** — every panel pans and zooms around its face
  (focal point + zoom + flip + swap per panel); drag inside a panel to
  pan, double-click to reset.
- **Look sliders** — Paint, Grade, Halftone, Grain, Glow.
- **Undo / Redo, Surprise me, Auto layout.**

## The cast

Seven photographic portraits generated in-session for this entry: the
Boss (hero), the Driver, the Mechanic, the Captain, the Rider, the Fixer
and the Lookout — golden-hour light, 35mm, shallow depth of field. No
face is ever drawn in code.

## Run it

Serve `app/` with any static server and open `app/index.html` in desktop
Chrome. It makes no network request: fonts (Anton + Yellowtail, SIL OFL)
and photos are vendored under `app/`.

```
node serve.ts        # or: python3 -m http.server -d app 8080
```

Screenshot scenes for the dossier: `app/index.html?shot=cover&layout=mosaic&grade=sunset`
draws one exported cover full-frame.

## Program

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` and
writes `/output/dossier.json` with the kit's `vendor/makefun-app.ts`
library, unchanged.

## License

MIT. Fonts under the SIL Open Font License 1.1 (texts in `app/fonts/`).
