// Screenshot scenes for the dossier (?shot=cover).
// Draws one exported cover full-frame at the viewport size, using the same
// drawCover the editor and the PNG export use — so a dossier cover is the
// app's own drawing, not a composite made outside it.

import { defaultState, drawCover, loadCast, fontsReady } from './cover.js';

const params = new URLSearchParams(location.search);
const state = defaultState();
if (params.get('layout')) state.layout = params.get('layout');
if (params.get('grade')) state.grade = params.get('grade');
if (params.get('title')) state.title = params.get('title');
if (params.get('script')) state.script = params.get('script');
if (params.get('tagline')) state.tagline = params.get('tagline');
if (params.get('quote')) state.quote = params.get('quote');
if (params.get('outlet')) state.outlet = params.get('outlet');
if (params.get('vol')) state.vol = params.get('vol');
if (params.get('seal')) state.seal = params.get('seal');

const canvas = document.createElement('canvas');
canvas.id = 'shot';
// Shot mode is a bare cover, not the editor: drop all editor chrome.
document.body.innerHTML = '';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function fit() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  drawCover(ctx, canvas.width, canvas.height, state, images);
}

const images = loadCast();
let loaded = 0;
const done = () => {
  loaded++;
  if (loaded >= images.length) {
    fit();
    document.title = 'ready';
  }
};
images.forEach((img) => {
  if (img.complete && img.naturalWidth > 0) done();
  else {
    img.addEventListener('load', done);
    img.addEventListener('error', done);
  }
});

fontsReady().then(() => {
  fit();
  document.title = 'ready';
});
window.addEventListener('resize', fit);
fit();
