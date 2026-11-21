// Golden Hour Cover Studio — poster renderer.
// One draw function renders the live preview and every PNG export pixel
// for pixel, so what the editor shows is exactly what the file holds.
// Everything here is drawn with the 2D canvas API: the photos are the only
// raster input (real portraits, bundled under cast/), the rest — skyline,
// palms, chrome title, seal, barcode — is procedural.

export const CAST = [
  { file: 'cast/boss.jpg',     role: 'THE BOSS',    name: 'Boss' },
  { file: 'cast/driver.jpg',   role: 'THE DRIVER',  name: 'Driver' },
  { file: 'cast/mechanic.jpg', role: 'THE MECHANIC', name: 'Mechanic' },
  { file: 'cast/captain.jpg',  role: 'THE CAPTAIN', name: 'Captain' },
  { file: 'cast/rider.jpg',    role: 'THE RIDER',   name: 'Rider' },
  { file: 'cast/fixer.jpg',    role: 'THE FIXER',   name: 'Fixer' },
  { file: 'cast/lookout.jpg',  role: 'THE LOOKOUT', name: 'Lookout' },
];

// Six moods. Every grade re-grades the whole poster at once: the photos,
// the title stripes, the frame, the seal and the background behind the
// panels all move together, so a grade change reads as a new movie.
export const GRADES = [
  {
    id: 'sunset', name: 'Sunset Gold',
    sky: ['#2b0f3d', '#b3372f', '#ff7a2f', '#ffc46b'],
    sun: '#ffd98a', glow: 'rgba(255,150,60,0.55)',
    city: '#1c0a2e', palm: '#160722',
    tint: { color: '#ff9a3d', alpha: 0.16, mode: 'overlay' },
    wash: { color: '#ffb347', alpha: 0.10, mode: 'soft-light' },
    title: ['#fff3c4', '#ffd24d', '#ff9d00', '#fff3c4', '#e07b00'],
    titleEdge: '#4a1500', script: '#ffe9a8', frame: '#ffd24d',
    accent: '#ffcf4d', seal: '#f5b90d', sealInk: '#5a2e00',
    ribbon: '#ff5a3c', ribbonInk: '#fff6e0', paper: '#1a0b26',
  },
  {
    id: 'neon', name: 'Neon Night',
    sky: ['#05030f', '#1b0b3d', '#5b1a6e', '#c22a7a'],
    sun: '#ff5ad1', glow: 'rgba(255,60,180,0.45)',
    city: '#0a0618', palm: '#07040f',
    tint: { color: '#c44dff', alpha: 0.18, mode: 'overlay' },
    wash: { color: '#2ad4ff', alpha: 0.10, mode: 'soft-light' },
    title: ['#eafcff', '#7df3ff', '#2ad4ff', '#eafcff', '#ff5ad1'],
    titleEdge: '#12002e', script: '#ff8ae2', frame: '#2ad4ff',
    accent: '#ff5ad1', seal: '#ffd24d', sealInk: '#4a1500',
    ribbon: '#ff2e88', ribbonInk: '#fff0f8', paper: '#0a0618',
  },
  {
    id: 'tropic', name: 'Tropic Teal',
    sky: ['#02222b', '#07565e', '#0e8f7d', '#ffc46b'],
    sun: '#fff0b0', glow: 'rgba(80,220,190,0.4)',
    city: '#032028', palm: '#01161b',
    tint: { color: '#2ad4b8', alpha: 0.15, mode: 'overlay' },
    wash: { color: '#ffd24d', alpha: 0.10, mode: 'soft-light' },
    title: ['#f2fff9', '#a8f5d2', '#2ad4a0', '#f2fff9', '#0e8f7d'],
    titleEdge: '#01281f', script: '#ffe9a8', frame: '#2ad4a0',
    accent: '#2ad4a0', seal: '#f5b90d', sealInk: '#5a2e00',
    ribbon: '#ff7a2f', ribbonInk: '#fff6e0', paper: '#032028',
  },
  {
    id: 'ultra', name: 'Ultraviolet',
    sky: ['#0d0218', '#2a0a4d', '#6e1fb0', '#ff7ad9'],
    sun: '#e9b6ff', glow: 'rgba(160,80,255,0.5)',
    city: '#12042a', palm: '#0a0218',
    tint: { color: '#9d4dff', alpha: 0.20, mode: 'overlay' },
    wash: { color: '#ff7ad9', alpha: 0.10, mode: 'soft-light' },
    title: ['#f6e9ff', '#d9a5ff', '#9d4dff', '#f6e9ff', '#6e1fb0'],
    titleEdge: '#1c0036', script: '#ffb6ec', frame: '#b678ff',
    accent: '#b678ff', seal: '#ffd24d', sealInk: '#4a1500',
    ribbon: '#8b3dff', ribbonInk: '#f6e9ff', paper: '#12042a',
  },
  {
    id: 'retro', name: 'Retro Print',
    sky: ['#f4e3c2', '#f2b879', '#e2725b', '#8f3b4f'],
    sun: '#fff3c4', glow: 'rgba(255,190,90,0.5)',
    city: '#5a2a33', palm: '#4a2230',
    tint: { color: '#e2725b', alpha: 0.14, mode: 'multiply' },
    wash: { color: '#fff3c4', alpha: 0.12, mode: 'soft-light' },
    title: ['#fff8e6', '#ffd24d', '#e2725b', '#fff8e6', '#8f3b4f'],
    titleEdge: '#3d1420', script: '#8f3b4f', frame: '#8f3b4f',
    accent: '#e2725b', seal: '#c98a1b', sealInk: '#fff6e0',
    ribbon: '#8f3b4f', ribbonInk: '#fff3d6', paper: '#f4e3c2',
  },
  {
    id: 'heat', name: 'Heatwave',
    sky: ['#1a0505', '#5c0f0f', '#c22a12', '#ffb347'],
    sun: '#ffe9a8', glow: 'rgba(255,90,30,0.55)',
    city: '#200505', palm: '#160303',
    tint: { color: '#ff4d2e', alpha: 0.18, mode: 'overlay' },
    wash: { color: '#ffb347', alpha: 0.12, mode: 'soft-light' },
    title: ['#fff3c4', '#ffc46b', '#ff5a2f', '#fff3c4', '#c22a12'],
    titleEdge: '#330a00', script: '#ffe9a8', frame: '#ff8a3d',
    accent: '#ff5a2f', seal: '#f5b90d', sealInk: '#5a2e00',
    ribbon: '#ff2e1f', ribbonInk: '#fff6e0', paper: '#200505',
  },
];

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

// Seven layouts. Each returns panel slots in 0..1 space; slant shears the
// panel edges, hero is the slot with hero: true. `order` maps each slot to
// a cast member, so the hero slot always shows the Boss (cast 0) and the
// rest of the cast fills the other slots — the same cast, same roles, in
// every layout. The title band sits low on the poster, clear of every
// hero face.
export const LAYOUTS = [
  {
    id: 'mosaic', name: 'Hero Mosaic', panels: 7, order: [1, 5, 2, 6, 0, 4, 3],
    slots: () => [
      { x: 0.02, y: 0.10, w: 0.24, h: 0.34, slant: 0 },
      { x: 0.74, y: 0.10, w: 0.24, h: 0.34, slant: 0 },
      { x: 0.02, y: 0.46, w: 0.24, h: 0.30, slant: 0 },
      { x: 0.74, y: 0.46, w: 0.24, h: 0.30, slant: 0 },
      { x: 0.28, y: 0.08, w: 0.44, h: 0.50, slant: 0, hero: true },
      { x: 0.28, y: 0.60, w: 0.215, h: 0.16, slant: 0 },
      { x: 0.505, y: 0.60, w: 0.215, h: 0.16, slant: 0 },
    ],
  },
  {
    id: 'diagonal', name: 'Diagonal Strips', panels: 5, order: [1, 2, 0, 5, 4],
    slots: () => [
      { x: -0.02, y: 0.10, w: 0.24, h: 0.62, slant: 0.06 },
      { x: 0.20, y: 0.10, w: 0.24, h: 0.62, slant: 0.06 },
      { x: 0.42, y: 0.08, w: 0.26, h: 0.66, slant: 0.06, hero: true },
      { x: 0.64, y: 0.10, w: 0.24, h: 0.62, slant: 0.06 },
      { x: 0.82, y: 0.10, w: 0.24, h: 0.62, slant: 0.06 },
    ],
  },
  {
    id: 'grid', name: 'Six Grid', panels: 6, order: [1, 0, 5, 2, 4, 3],
    slots: () => [
      { x: 0.02, y: 0.09, w: 0.313, h: 0.30, slant: 0 },
      { x: 0.343, y: 0.09, w: 0.313, h: 0.30, slant: 0, hero: true },
      { x: 0.667, y: 0.09, w: 0.313, h: 0.30, slant: 0 },
      { x: 0.02, y: 0.41, w: 0.313, h: 0.30, slant: 0 },
      { x: 0.343, y: 0.41, w: 0.313, h: 0.30, slant: 0 },
      { x: 0.667, y: 0.41, w: 0.313, h: 0.30, slant: 0 },
    ],
  },
  {
    id: 'hero3', name: 'Hero + Three', panels: 4, order: [0, 1, 5, 2],
    slots: () => [
      { x: 0.02, y: 0.08, w: 0.56, h: 0.64, slant: 0, hero: true },
      { x: 0.60, y: 0.08, w: 0.38, h: 0.20, slant: 0 },
      { x: 0.60, y: 0.30, w: 0.38, h: 0.20, slant: 0 },
      { x: 0.60, y: 0.52, w: 0.38, h: 0.20, slant: 0 },
    ],
  },
  {
    id: 'seven', name: 'Seven Mosaic', panels: 7, order: [0, 1, 2, 5, 4, 6, 3],
    slots: () => [
      { x: 0.02, y: 0.08, w: 0.96, h: 0.34, slant: 0, hero: true },
      { x: 0.02, y: 0.44, w: 0.313, h: 0.15, slant: 0 },
      { x: 0.343, y: 0.44, w: 0.313, h: 0.15, slant: 0 },
      { x: 0.667, y: 0.44, w: 0.313, h: 0.15, slant: 0 },
      { x: 0.02, y: 0.605, w: 0.313, h: 0.15, slant: 0 },
      { x: 0.343, y: 0.605, w: 0.313, h: 0.15, slant: 0 },
      { x: 0.667, y: 0.605, w: 0.313, h: 0.15, slant: 0 },
    ],
  },
  {
    id: 'tilted', name: 'Tilted Snapshots', panels: 5, order: [1, 5, 0, 2, 4],
    slots: () => [
      { x: 0.03, y: 0.12, w: 0.26, h: 0.42, slant: 0, tilt: -3 },
      { x: 0.71, y: 0.12, w: 0.26, h: 0.42, slant: 0, tilt: 3 },
      { x: 0.30, y: 0.08, w: 0.40, h: 0.52, slant: 0, tilt: 0, hero: true },
      { x: 0.10, y: 0.52, w: 0.30, h: 0.24, slant: 0, tilt: 2 },
      { x: 0.60, y: 0.52, w: 0.30, h: 0.24, slant: 0, tilt: -2 },
    ],
  },
  {
    id: 'band', name: 'Sunset Band', panels: 5, order: [1, 2, 0, 5, 4],
    slots: () => [
      { x: 0.02, y: 0.09, w: 0.18, h: 0.60, slant: 0.05 },
      { x: 0.205, y: 0.09, w: 0.18, h: 0.60, slant: 0.05 },
      { x: 0.39, y: 0.09, w: 0.22, h: 0.60, slant: 0.05, hero: true },
      { x: 0.615, y: 0.09, w: 0.18, h: 0.60, slant: 0.05 },
      { x: 0.80, y: 0.09, w: 0.18, h: 0.60, slant: 0.05 },
    ],
  },
];

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

// Which entry of state.panels a slot shows: the layout's order maps the
// slot to a cast member, so the hero is always the Boss.
export function slotPanelIndex(layoutId, slot) {
  const layout = layoutById(layoutId);
  const order = layout.order || [];
  return order[slot] ?? slot;
}

// Default editor state. A fresh caption, the full demo cast, and the
// look sliders at their middle values.
export function defaultState() {
  return {
    title: 'SUNDOWN RACKET',
    script: 'Paid in Sunsets',
    tagline: 'EVERYONE WANTS A CUT OF THE SUNSET',
    quote: 'THE HOTTEST RIDE OF THE YEAR',
    outlet: 'GOLDEN MILE GAZETTE',
    billing1: 'A SUNSET PICTURES PRODUCTION  ·  STARRING YOU',
    billing2: 'SHOT ON YOUR OWN CAMERA  ·  GRADED BY HAND',
    seal: 'BEST CAST',
    vol: 'VOL. 1',
    release: 'COMING SOON',
    layout: 'mosaic',
    grade: 'sunset',
    look: { paint: 0.45, grade: 0.7, halftone: 0.22, grain: 0.3, glow: 0.4 },
    panels: CAST.map((c, i) => ({
      photo: i, zoom: 1.12, fx: 0.5, fy: 0.34, flip: false, role: c.role,
    })),
  };
}

// ------------------------------------------------------------------ helpers

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stripeGradient(ctx, x, y, w, h, colors) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  const n = colors.length;
  colors.forEach((c, i) => {
    g.addColorStop(i / n, c);
    g.addColorStop((i + 1) / n - 0.001, c);
  });
  return g;
}

function star(ctx, cx, cy, r, points, inner) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawPalm(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(6, -60, 22, -110);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 6 - (i * Math.PI) / 7.5;
    ctx.beginPath();
    ctx.moveTo(22, -110);
    ctx.quadraticCurveTo(
      22 + Math.cos(a) * 42, -110 + Math.sin(a) * 30 - 14,
      22 + Math.cos(a) * 62, -110 + Math.sin(a) * 44 + 16,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawSkyline(ctx, W, H, grade, seed) {
  const rnd = mulberry(seed);
  const base = H * 0.72;
  ctx.fillStyle = grade.city;
  let x = 0;
  while (x < W) {
    const bw = W * (0.05 + rnd() * 0.09);
    const bh = H * (0.10 + rnd() * 0.22);
    ctx.fillRect(x, base - bh, bw, bh + H * 0.3);
    // A few lit windows, warm against the dark towers.
    ctx.fillStyle = 'rgba(255,210,110,0.85)';
    const cols = Math.max(1, Math.floor(bw / (W * 0.02)));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 4; r++) {
        if (rnd() < 0.28) {
          ctx.fillRect(x + 4 + c * (W * 0.02), base - bh + 8 + r * (H * 0.045), W * 0.008, H * 0.018);
        }
      }
    }
    ctx.fillStyle = grade.city;
    x += bw + W * 0.008;
  }
  // Retro perspective grid floor on the lower band.
  ctx.save();
  ctx.strokeStyle = grade.accent;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = Math.max(1, W * 0.0012);
  const horizon = H * 0.74;
  for (let i = 0; i <= 10; i++) {
    const y = horizon + ((H - horizon) * i * i) / 100;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * (W * 0.04), horizon);
    ctx.lineTo(W / 2 + i * (W * 0.16), H);
    ctx.stroke();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ photos

// Cover-fit a photo into a rect, keeping the focal point (fx, fy) in
// frame — the face-aware crop. zoom > 1 pushes in, flip mirrors.
function drawPhoto(ctx, img, rect, panel, grade, look) {
  const { x, y, w, h } = rect;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w / iw, h / ih) * panel.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const fx = panel.fx ?? 0.5;
  // Wide panels show a thin horizontal slice of a portrait photo: aim
  // the focal point a little lower so the chin stays in frame.
  const wide = rect.w / rect.h > 1.3;
  const fy = wide ? Math.min(0.46, (panel.fy ?? 0.34) + 0.08) : (panel.fy ?? 0.34);
  let dx = x + w / 2 - dw * fx;
  let dy = y + h / 2 - dh * fy;
  dx = Math.min(x, Math.max(x + w - dw, dx));
  dy = Math.min(y, Math.max(y + h - dh, dy));
  ctx.save();
  if (panel.flip) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.translate(-x, -y);
  }
  const sat = 1 + look.paint * 0.35;
  const con = 1 + look.paint * 0.12;
  ctx.filter = `saturate(${sat.toFixed(2)}) contrast(${con.toFixed(2)})`;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.filter = 'none';
  // Grade wash over the photo, then a soft top light.
  ctx.globalCompositeOperation = grade.tint.mode;
  ctx.globalAlpha = grade.tint.alpha * look.grade;
  ctx.fillStyle = grade.tint.color;
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = grade.wash.mode;
  ctx.globalAlpha = grade.wash.alpha * look.grade;
  ctx.fillStyle = grade.wash.color;
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  const lg = ctx.createLinearGradient(x, y, x, y + h * 0.45);
  lg.addColorStop(0, 'rgba(255,220,150,0.14)');
  lg.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = lg;
  ctx.fillRect(x, y, w, h * 0.45);
  ctx.restore();
}

function halftone(ctx, rect, strength, seed) {
  if (strength <= 0.01) return;
  const rnd = mulberry(seed);
  const step = Math.max(6, rect.w * 0.022);
  ctx.save();
  ctx.fillStyle = '#000';
  for (let yy = rect.y; yy < rect.y + rect.h; yy += step) {
    for (let xx = rect.x; xx < rect.x + rect.w; xx += step) {
      const a = rnd() * strength * 0.5;
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(xx + step / 2, yy + step / 2, step * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

let grainTile = null;
function grain(ctx, W, H, strength, seed) {
  if (strength <= 0.01) return;
  if (!grainTile) {
    grainTile = document.createElement('canvas');
    grainTile.width = 128; grainTile.height = 128;
    const g = grainTile.getContext('2d');
    const rnd = mulberry(99);
    const id = g.createImageData(128, 128);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.floor(rnd() * 255);
      id.data[i] = v; id.data[i + 1] = v; id.data[i + 2] = v; id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0);
  }
  ctx.save();
  ctx.globalAlpha = strength * 0.16;
  ctx.globalCompositeOperation = 'overlay';
  const pat = ctx.createPattern(grainTile, 'repeat');
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ------------------------------------------------------------------ furniture

function drawRoleTag(ctx, rect, role, grade, W) {
  const fs = Math.max(10, W * 0.016);
  ctx.save();
  ctx.font = `700 ${fs}px Anton, sans-serif`;
  const tw = ctx.measureText(role).width;
  const pad = fs * 0.7;
  const bw = tw + pad * 2;
  const bh = fs * 1.9;
  // Keep the tag inside the canvas even when its panel bleeds off an edge.
  const bx = Math.min(Math.max(4, rect.x + rect.w * 0.04), W - bw - 4);
  const by = rect.y + rect.h - bh - rect.h * 0.05;
  ctx.translate(bx + bw / 2, by + bh / 2);
  ctx.rotate(-0.045);
  ctx.translate(-bw / 2, -bh / 2);
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(-2, 2, bw + 4, bh);
  ctx.fillStyle = grade.accent;
  ctx.fillRect(0, 0, bw, bh);
  ctx.fillStyle = '#111';
  ctx.textBaseline = 'middle';
  ctx.fillText(role, pad, bh / 2 + fs * 0.06);
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h, seed) {
  const rnd = mulberry(seed);
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 6, y - 6, w + 12, h + 26);
  ctx.fillStyle = '#111';
  let bx = x;
  while (bx < x + w - 3) {
    const bw = 1 + Math.floor(rnd() * 4);
    if (rnd() < 0.72) ctx.fillRect(bx, y, bw, h);
    bx += bw + 1 + Math.floor(rnd() * 3);
  }
  ctx.font = `${Math.max(9, h * 0.28)}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('8 90211 06021 7', x, y + h + 4);
  ctx.restore();
}

function drawSeal(ctx, cx, cy, r, text, grade) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.12);
  star(ctx, 0, 0, r, 12, 0.82);
  ctx.fillStyle = grade.seal;
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.07);
  ctx.strokeStyle = 'rgba(90,46,0,0.55)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
  ctx.strokeStyle = grade.sealInk;
  ctx.lineWidth = Math.max(1.5, r * 0.04);
  ctx.stroke();
  ctx.fillStyle = grade.sealInk;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fs = r * 0.30;
  ctx.font = `${fs}px Anton, sans-serif`;
  const words = text.split(' ');
  if (words.length > 1) {
    ctx.fillText(words[0], 0, -fs * 0.42);
    ctx.fillText(words.slice(1).join(' '), 0, fs * 0.42);
  } else {
    ctx.fillText(text, 0, 0);
  }
  star(ctx, 0, -r * 0.02, r * 0.10, 5, 0.5);
  ctx.fillStyle = grade.seal;
  ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ the cover

// Draw the whole poster. images: array of HTMLImageElement, indexed the
// same as CAST. state: defaultState() shape. Returns the panel rects in
// pixels (for the editor's hit-testing) as a side channel on ctx.
export function drawCover(ctx, W, H, state, images) {
  const grade = gradeById(state.grade);
  const layout = layoutById(state.layout);
  const look = state.look;
  const S = W / 1080; // scale unit: the design is laid out at 1080 wide

  // Background: sunset sky, low sun, skyline, palms, grid floor.
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  grade.sky.forEach((c, i) => sky.addColorStop(i / (grade.sky.length - 1), c));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const sunR = W * 0.16;
  const sunG = ctx.createRadialGradient(W * 0.5, H * 0.52, sunR * 0.1, W * 0.5, H * 0.52, sunR * 2.4);
  sunG.addColorStop(0, grade.glow);
  sunG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sunG;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = grade.sun;
  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.52, sunR, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.globalAlpha = 0.35 + look.glow * 0.4;
  ctx.fillStyle = grade.sun;
  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.52, sunR * 1.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawSkyline(ctx, W, H, grade, 7);
  drawPalm(ctx, W * 0.03, H * 0.74, S * 1.1, grade.palm);
  drawPalm(ctx, W * 0.95, H * 0.76, S * 0.9, grade.palm);

  // Panels.
  const slots = layout.slots();
  const rects = [];
  slots.forEach((slot, i) => {
    if (slot.h <= 0) return;
    const panel = state.panels[slotPanelIndex(state.layout, i) % state.panels.length];
    const img = images[panel.photo % images.length];
    const rect = {
      x: slot.x * W, y: slot.y * H,
      w: slot.w * W, h: slot.h * H,
    };
    rects.push({ ...rect, index: i, hero: !!slot.hero });
    ctx.save();
    if (slot.tilt) {
      ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
      ctx.rotate((slot.tilt * Math.PI) / 180);
      ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));
    }
    // Slanted clip: a parallelogram sheared by slot.slant.
    const sh = (slot.slant || 0) * rect.w;
    ctx.beginPath();
    ctx.moveTo(rect.x + sh, rect.y);
    ctx.lineTo(rect.x + rect.w + sh, rect.y);
    ctx.lineTo(rect.x + rect.w - sh, rect.y + rect.h);
    ctx.lineTo(rect.x - sh, rect.y + rect.h);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    if (img && img.complete && img.naturalWidth > 0) {
      drawPhoto(ctx, img, rect, panel, grade, look);
    } else {
      ctx.fillStyle = '#3a2a4a';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
    halftone(ctx, rect, look.halftone, 100 + i);
    // Bottom shade so the role tag always reads.
    const shade = ctx.createLinearGradient(rect.x, rect.y + rect.h * 0.55, rect.x, rect.y + rect.h);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = shade;
    ctx.fillRect(rect.x, rect.y + rect.h * 0.55, rect.w, rect.h * 0.45);
    ctx.restore();
    // Bright frame around the panel.
    ctx.beginPath();
    ctx.moveTo(rect.x + sh, rect.y);
    ctx.lineTo(rect.x + rect.w + sh, rect.y);
    ctx.lineTo(rect.x + rect.w - sh, rect.y + rect.h);
    ctx.lineTo(rect.x - sh, rect.y + rect.h);
    ctx.closePath();
    ctx.lineWidth = Math.max(2, W * 0.004);
    ctx.strokeStyle = grade.frame;
    ctx.stroke();
    ctx.lineWidth = Math.max(1, W * 0.0015);
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.stroke();
    drawRoleTag(ctx, rect, panel.role, grade, W);
    ctx.restore();
  });

  // Tagline ribbon across the middle, between panels and title.
  const ribY = H * 0.738;
  const ribH = H * 0.038;
  ctx.save();
  ctx.fillStyle = grade.ribbon;
  ctx.beginPath();
  ctx.moveTo(W * 0.06, ribY);
  ctx.lineTo(W * 0.94, ribY);
  ctx.lineTo(W * 0.92, ribY + ribH);
  ctx.lineTo(W * 0.08, ribY + ribH);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = grade.ribbonInk;
  ctx.font = `700 ${Math.max(11, W * 0.02)}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tag = state.tagline.toUpperCase();
  ctx.fillText(tag, W / 2, ribY + ribH / 2 + W * 0.001);
  ctx.restore();

  // Title: huge striped chrome, outlined, dropped shadow, overlapping art.
  // Sized to fit the width AND the height, so it never clips and never
  // climbs into the ribbon or the hero's face.
  const title = state.title.toUpperCase();
  let tSize = Math.min(W * 0.155, H * 0.125);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${tSize}px Anton, sans-serif`;
  const tW = ctx.measureText(title).width;
  if (tW > W * 0.94) tSize *= (W * 0.94) / tW;
  const tY = H * 0.888;
  ctx.font = `${tSize}px Anton, sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.75)';
  ctx.shadowBlur = W * 0.012;
  ctx.shadowOffsetY = W * 0.008;
  const tg = stripeGradient(ctx, 0, tY - tSize, W, tSize * 1.05, grade.title);
  ctx.fillStyle = tg;
  ctx.lineWidth = Math.max(3, W * 0.008);
  ctx.strokeStyle = grade.titleEdge;
  ctx.lineJoin = 'round';
  ctx.strokeText(title, W / 2, tY);
  ctx.fillText(title, W / 2, tY);
  ctx.shadowColor = 'transparent';
  ctx.restore();

  // Script subtitle overlapping the title's tail. Sized and placed from
  // the poster's height, so it never runs into the billing block on a
  // wide landscape export.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `${Math.max(20, H * 0.048)}px Yellowtail, cursive`;
  ctx.fillStyle = grade.script;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = W * 0.006;
  ctx.shadowOffsetY = W * 0.003;
  ctx.translate(W * 0.72, tY + H * 0.045);
  ctx.rotate(-0.06);
  ctx.fillText(state.script, 0, 0);
  ctx.restore();

  // Press quote with five stars across the top.
  const qY = H * 0.045;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${Math.max(11, W * 0.021)}px Anton, sans-serif`;
  const quote = `\u201C${state.quote}\u201D`;
  const qw = ctx.measureText(quote).width;
  ctx.fillText(quote, W / 2, qY);
  ctx.fillStyle = grade.accent;
  const starR = W * 0.011;
  for (let i = 0; i < 5; i++) {
    star(ctx, W / 2 - qw / 2 - W * 0.03 - i * starR * 2.4, qY - starR * 0.4, starR, 5, 0.45);
    ctx.fill();
    star(ctx, W / 2 + qw / 2 + W * 0.03 + i * starR * 2.4, qY - starR * 0.4, starR, 5, 0.45);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `${Math.max(9, W * 0.013)}px Anton, sans-serif`;
  ctx.fillText(`— ${state.outlet}`, W / 2, qY + H * 0.022);
  ctx.restore();

  // VOL badge, top right.
  ctx.save();
  ctx.font = `700 ${Math.max(11, W * 0.018)}px Anton, sans-serif`;
  const vw = ctx.measureText(state.vol).width + W * 0.03;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(W - vw - W * 0.015, H * 0.014, vw, H * 0.032);
  ctx.strokeStyle = grade.frame;
  ctx.lineWidth = Math.max(1, W * 0.0015);
  ctx.strokeRect(W - vw - W * 0.015, H * 0.014, vw, H * 0.032);
  ctx.fillStyle = grade.frame;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.vol, W - vw / 2 - W * 0.015, H * 0.030);
  ctx.restore();

  // COMING SOON, bottom left, glowing in the grade accent.
  ctx.save();
  ctx.font = `700 ${Math.max(12, W * 0.024)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = grade.accent;
  ctx.shadowBlur = W * 0.014;
  ctx.fillStyle = grade.accent;
  ctx.fillText(state.release, W * 0.02, H * 0.985);
  ctx.restore();

  // Billing block, two lines, bottom centre.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = `${Math.max(8, W * 0.0115)}px Anton, sans-serif`;
  ctx.fillText(state.billing1, W / 2, H * 0.968);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `${Math.max(8, W * 0.0105)}px Anton, sans-serif`;
  ctx.fillText(state.billing2, W / 2, H * 0.985);
  ctx.restore();

  // Barcode, bottom right.
  drawBarcode(ctx, W * 0.885, H * 0.955, W * 0.085, H * 0.02, 42);

  // Gold starburst seal on the top-right panel's corner, clear of the
  // VOL badge, every face, the title and the ribbon.
  drawSeal(ctx, W * 0.905, H * 0.125, Math.min(W, H) * 0.045, state.seal, grade);

  // Outer frame: thin bright line inside a dark border.
  ctx.save();
  ctx.strokeStyle = grade.frame;
  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.strokeRect(W * 0.006, H * 0.006, W * 0.988, H * 0.988);
  ctx.restore();

  grain(ctx, W, H, look.grain, 5);
  ctx._panelRects = rects;
  return rects;
}

// Load the demo cast as Image elements (same order as CAST).
export function loadCast() {
  return CAST.map((c) => {
    const img = new Image();
    img.src = c.file;
    return img;
  });
}

export async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load('100px Anton'),
      document.fonts.load('100px Yellowtail'),
    ]);
    await document.fonts.ready;
  } catch (e) {
    // Canvas falls back to sans-serif; the poster still renders.
  }
}
