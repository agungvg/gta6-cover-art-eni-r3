// Golden Hour Cover Studio — editor.
// A 3-step wizard around the shared cover renderer: add photos, write the
// caption, export PNGs. The preview canvas and the exports all call the
// same drawCover, so the preview is the file.

import { CAST, GRADES, LAYOUTS, defaultState, drawCover, loadCast, fontsReady, gradeById, layoutById, slotPanelIndex } from './cover.js';

const $ = (sel) => document.querySelector(sel);
const state = defaultState();
let images = loadCast();          // demo cast, bundled photographic portraits
let userPhotos = [];              // photos the user adds (data URLs, local only)
let selected = 0;                 // selected panel slot
let undoStack = [];
let redoStack = [];
let step = 1;

// The selected slot's panel: the layout maps each slot to a cast member.
function selIndex() {
  return slotPanelIndex(state.layout, selected) % state.panels.length;
}
function selPanel() {
  return state.panels[selIndex()];
}

const SIZES = [
  { id: 'sq', label: '1080 × 1080 · square', w: 1080, h: 1080 },
  { id: 'pt', label: '1080 × 1350 · portrait', w: 1080, h: 1350 },
  { id: 'ls', label: '1920 × 1080 · landscape', w: 1920, h: 1080 },
];

function snapshot() {
  return JSON.stringify(state);
}
function pushUndo() {
  undoStack.push(snapshot());
  if (undoStack.length > 40) undoStack.shift();
  redoStack = [];
  refreshUndoButtons();
}
function restore(json) {
  const next = JSON.parse(json);
  Object.assign(state, next);
  syncControls();
  render();
}
function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  restore(undoStack.pop());
  refreshUndoButtons();
}
function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  restore(redoStack.pop());
  refreshUndoButtons();
}
function refreshUndoButtons() {
  $('#undoBtn').disabled = undoStack.length === 0;
  $('#redoBtn').disabled = redoStack.length === 0;
}

// All photos the renderer can use: user uploads first, then the demo cast.
function allImages() {
  return [...userPhotos, ...images];
}
function photoCount() {
  return userPhotos.length + images.length;
}

// ------------------------------------------------------------------ render

const preview = $('#preview');
const pctx = preview.getContext('2d');

function render() {
  const w = preview.width;
  const h = preview.height;
  pctx.clearRect(0, 0, w, h);
  const rects = drawCover(pctx, w, h, state, allImages());
  preview._rects = rects;
  $('#panelLabel').textContent = `Panel ${selected + 1} of ${rects.length}`;
  const panel = selPanel();
  $('#zoomSlider').value = panel.zoom;
  $('#zoomVal').textContent = `${Math.round(panel.zoom * 100)}%`;
  $('#roleInput').value = panel.role;
  $('#flipBtn').textContent = panel.flip ? 'Unflip photo' : 'Flip photo';
  document.querySelectorAll('.layout-thumb').forEach((el) => {
    el.classList.toggle('active', el.dataset.layout === state.layout);
  });
  document.querySelectorAll('.grade-chip').forEach((el) => {
    el.classList.toggle('active', el.dataset.grade === state.grade);
  });
  document.querySelectorAll('.step-dot').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
    el.classList.toggle('done', i + 1 < step);
  });
  document.querySelectorAll('.step-panel').forEach((el, i) => {
    el.classList.toggle('open', i + 1 === step);
  });
}

function exportCover(size) {
  const c = document.createElement('canvas');
  c.width = size.w;
  c.height = size.h;
  drawCover(c.getContext('2d'), size.w, size.h, state, allImages());
  return new Promise((resolve) => c.toBlob(resolve, 'image/png'));
}

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

async function exportOne(size) {
  const blob = await exportCover(size);
  download(blob, `golden-hour-cover-${size.id}.png`);
  flash(`Exported ${size.label} PNG`);
}

async function exportAll() {
  for (const size of SIZES) {
    const blob = await exportCover(size);
    download(blob, `golden-hour-cover-${size.id}.png`);
  }
  flash('Exported all 3 PNG sizes');
}

let flashTimer = null;
function flash(msg) {
  const el = $('#flash');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ------------------------------------------------------------------ photos

function addUserPhoto(dataUrl) {
  const img = new Image();
  img.onload = () => {
    userPhotos.push(img);
    const idx = userPhotos.length - 1;
    // Give the new photo a free panel slot and select it.
    const slot = state.panels.find((p) => p.photo < userPhotos.length) || state.panels[0];
    pushUndo();
    slot.photo = idx;
    slot.role = 'THE NEW FACE';
    slot.zoom = 1.1; slot.fx = 0.5; slot.fy = 0.34; slot.flip = false;
    renderThumbs();
    render();
    flash('Photo added — it never leaves this device');
  };
  img.src = dataUrl;
}

function handleFiles(files) {
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    const r = new FileReader();
    r.onload = () => addUserPhoto(r.result);
    r.readAsDataURL(f);
  }
}

function renderThumbs() {
  const strip = $('#photoStrip');
  strip.innerHTML = '';
  const mk = (img, label, i) => {
    const d = document.createElement('div');
    d.className = 'thumb';
    d.title = label;
    const im = document.createElement('img');
    im.src = img.src;
    d.appendChild(im);
    d.addEventListener('click', () => {
      pushUndo();
      selPanel().photo = i;
      render();
    });
    strip.appendChild(d);
  };
  userPhotos.forEach((img, i) => mk(img, `Your photo ${i + 1}`, i));
  images.forEach((img, i) => mk(img, CAST[i].name, userPhotos.length + i));
}

// ------------------------------------------------------------------ layout / grade pickers

function buildPickers() {
  const lg = $('#layoutGrid');
  LAYOUTS.forEach((l) => {
    const b = document.createElement('button');
    b.className = 'layout-thumb';
    b.dataset.layout = l.id;
    b.innerHTML = `<span class="lt-name">${l.name}</span><span class="lt-panels">${l.panels} panels</span>`;
    b.addEventListener('click', () => {
      if (state.layout === l.id) return;
      pushUndo();
      state.layout = l.id;
      selected = 0;
      render();
    });
    lg.appendChild(b);
  });
  const gg = $('#gradeGrid');
  GRADES.forEach((g) => {
    const b = document.createElement('button');
    b.className = 'grade-chip';
    b.dataset.grade = g.id;
    b.style.setProperty('--g1', g.sky[1]);
    b.style.setProperty('--g2', g.sky[3]);
    b.textContent = g.name;
    b.addEventListener('click', () => {
      if (state.grade === g.id) return;
      pushUndo();
      state.grade = g.id;
      render();
    });
    gg.appendChild(b);
  });
}

// ------------------------------------------------------------------ caption + look

function bindCaption() {
  const map = [
    ['titleInput', 'title'], ['scriptInput', 'script'], ['taglineInput', 'tagline'],
    ['quoteInput', 'quote'], ['outletInput', 'outlet'],
    ['billing1Input', 'billing1'], ['billing2Input', 'billing2'],
    ['sealInput', 'seal'], ['volInput', 'vol'], ['releaseInput', 'release'],
  ];
  for (const [id, key] of map) {
    const el = document.getElementById(id);
    el.value = state[key];
    el.addEventListener('input', () => {
      state[key] = el.value;
      render();
    });
    el.addEventListener('change', pushUndo);
  }
  const looks = ['paint', 'grade', 'halftone', 'grain', 'glow'];
  for (const key of looks) {
    const el = document.getElementById(`look-${key}`);
    el.addEventListener('input', () => {
      state.look[key] = el.value / 100;
      document.getElementById(`look-${key}-val`).textContent = `${el.value}%`;
      render();
    });
    el.addEventListener('change', pushUndo);
  }
}

function syncControls() {
  const map = [
    ['titleInput', 'title'], ['scriptInput', 'script'], ['taglineInput', 'tagline'],
    ['quoteInput', 'quote'], ['outletInput', 'outlet'],
    ['billing1Input', 'billing1'], ['billing2Input', 'billing2'],
    ['sealInput', 'seal'], ['volInput', 'vol'], ['releaseInput', 'release'],
  ];
  for (const [id, key] of map) document.getElementById(id).value = state[key];
  for (const key of ['paint', 'grade', 'halftone', 'grain', 'glow']) {
    const el = document.getElementById(`look-${key}`);
    el.value = Math.round(state.look[key] * 100);
    document.getElementById(`look-${key}-val`).textContent = `${el.value}%`;
  }
  renderThumbs();
}

// ------------------------------------------------------------------ surprise + auto

function surprise() {
  pushUndo();
  state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)].id;
  state.grade = GRADES[Math.floor(Math.random() * GRADES.length)].id;
  const titles = [
    ['SUNDOWN RACKET', 'Paid in Sunsets'],
    ['PALM LINE HEIST', 'one last summer'],
    ['NEON HARBOR', 'every light has a price'],
    ['GOLDEN MILE', 'run it like you own it'],
    ['VICE SUNSET', 'no way back but forward'],
  ];
  const [t, s] = titles[Math.floor(Math.random() * titles.length)];
  state.title = t;
  state.script = s;
  selected = 0;
  syncControls();
  render();
  flash('Surprise me — new layout, grade and caption');
}

function autoLayout() {
  pushUndo();
  // Pick the layout that fits the photo count best: wide hero for few
  // photos, mosaic for the full cast.
  const n = photoCount();
  state.layout = n >= 6 ? 'mosaic' : n >= 5 ? 'tilted' : n >= 4 ? 'hero3' : 'diagonal';
  selected = 0;
  render();
  flash(`Auto layout — ${layoutById(state.layout).name} for ${n} photos`);
}

// ------------------------------------------------------------------ panel interaction

function bindCanvas() {
  let drag = null;
  preview.addEventListener('pointerdown', (e) => {
    const r = preview.getBoundingClientRect();
    const x = (e.clientX - r.left) * (preview.width / r.width);
    const y = (e.clientY - r.top) * (preview.height / r.height);
    const hit = (preview._rects || []).find(
      (rc) => x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h,
    );
    if (hit) {
      selected = hit.index;
      const panel = selPanel();
      drag = { x, y, fx: panel.fx, fy: panel.fy, moved: false };
      render();
    }
  });
  preview.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = preview.getBoundingClientRect();
    const x = (e.clientX - r.left) * (preview.width / r.width);
    const y = (e.clientY - r.top) * (preview.height / r.height);
    const rect = (preview._rects || [])[selected];
    if (!rect) return;
    const panel = selPanel();
    panel.fx = Math.min(0.95, Math.max(0.05, drag.fx + (x - drag.x) / rect.w));
    panel.fy = Math.min(0.95, Math.max(0.05, drag.fy + (y - drag.y) / rect.h));
    drag.moved = true;
    render();
  });
  preview.addEventListener('pointerup', () => {
    if (drag && drag.moved) pushUndo();
    drag = null;
  });
  preview.addEventListener('dblclick', () => {
    pushUndo();
    const panel = selPanel();
    panel.zoom = 1.12; panel.fx = 0.5; panel.fy = 0.34; panel.flip = false;
    render();
  });
}

// ------------------------------------------------------------------ wiring

function setStep(n) {
  step = n;
  render();
}

function init() {
  buildPickers();
  bindCaption();
  bindCanvas();
  renderThumbs();

  document.querySelectorAll('.step-dot').forEach((el, i) => {
    el.addEventListener('click', () => setStep(i + 1));
  });
  $('#next1').addEventListener('click', () => setStep(2));
  $('#next2').addEventListener('click', () => setStep(3));
  $('#back2').addEventListener('click', () => setStep(1));
  $('#back3').addEventListener('click', () => setStep(2));

  $('#undoBtn').addEventListener('click', undo);
  $('#redoBtn').addEventListener('click', redo);
  $('#surpriseBtn').addEventListener('click', surprise);
  $('#autoBtn').addEventListener('click', autoLayout);

  const drop = $('#dropZone');
  drop.addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', (e) => handleFiles(e.target.files));
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => {
    e.preventDefault();
    drop.classList.add('over');
  }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
    e.preventDefault();
    drop.classList.remove('over');
  }));
  drop.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
  document.addEventListener('paste', (e) => {
    const files = [...(e.clipboardData?.files || [])].filter((f) => f.type.startsWith('image/'));
    if (files.length) handleFiles(files);
  });
  $('#sampleBtn').addEventListener('click', () => {
    renderThumbs();
    render();
    flash('Demo cast loaded — 7 photographic portraits');
  });

  $('#zoomSlider').addEventListener('input', (e) => {
    const panel = selPanel();
    panel.zoom = e.target.value / 100;
    $('#zoomVal').textContent = `${e.target.value}%`;
    render();
  });
  $('#zoomSlider').addEventListener('change', pushUndo);
  $('#flipBtn').addEventListener('click', () => {
    pushUndo();
    const panel = selPanel();
    panel.flip = !panel.flip;
    render();
  });
  $('#swapBtn').addEventListener('click', () => {
    pushUndo();
    const a = selIndex();
    const b = (a + 1) % state.panels.length;
    const tmp = state.panels[a].photo;
    state.panels[a].photo = state.panels[b].photo;
    state.panels[b].photo = tmp;
    render();
  });
  $('#faceBtn').addEventListener('click', () => {
    pushUndo();
    const panel = selPanel();
    panel.fx = 0.5; panel.fy = 0.34; panel.zoom = Math.max(panel.zoom, 1.05);
    render();
    flash('Face-aware crop — face centred in the panel');
  });
  $('#roleInput').addEventListener('input', (e) => {
    selPanel().role = e.target.value.toUpperCase();
    render();
  });
  $('#roleInput').addEventListener('change', pushUndo);
  $('#prevPhoto').addEventListener('click', () => {
    pushUndo();
    const panel = selPanel();
    panel.photo = (panel.photo - 1 + photoCount()) % photoCount();
    render();
  });
  $('#nextPhoto').addEventListener('click', () => {
    pushUndo();
    const panel = selPanel();
    panel.photo = (panel.photo + 1) % photoCount();
    render();
  });
  $('#resetPanel').addEventListener('click', () => {
    pushUndo();
    const panel = selPanel();
    const c = CAST[selIndex() % CAST.length];
    panel.photo = userPhotos.length + (selIndex() % CAST.length);
    panel.zoom = 1.12; panel.fx = 0.5; panel.fy = 0.34; panel.flip = false;
    panel.role = c.role;
    render();
  });

  const exp = $('#exportRows');
  SIZES.forEach((s) => {
    const row = document.createElement('div');
    row.className = 'export-row';
    row.innerHTML = `<span>${s.label}</span><button>Export PNG</button>`;
    row.querySelector('button').addEventListener('click', () => exportOne(s));
    exp.appendChild(row);
  });
  $('#exportAll').addEventListener('click', exportAll);

  refreshUndoButtons();
  fontsReady().then(render);
  // Re-render as each cast photo arrives, so faces pop in one by one.
  images.forEach((img) => img.addEventListener('load', render));
  render();
}

init();
