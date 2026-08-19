// Generates the site icon set from a single vector source.
//   node scripts/generate-icon.mjs   (or: npm run icons)
//
// The mark mirrors the hero artwork: an astronaut's porthole looking down on
// Earth, with a Didone C framed in the window. The C outline is generated
// rather than hand-drawn so its weight can be retuned per optical size.
// Requires sharp, which ships with Next.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const APP = path.resolve('src/app');

// ---------------------------------------------------------------------------
// Didone "C": outer edge rides an ellipse, inner edge is offset inward along
// the true ellipse normal by a thickness that peaks on the left shoulder.
// Optical sizes get their own weight — hairline terminals vanish under ~24px,
// so the small cuts run near-monoline.
// ---------------------------------------------------------------------------
const A0 = 58, A1 = 302;   // terminals in degrees CCW; the opening faces right
const PEAK = 195;          // heaviest point of the stroke
const N = 96;
const rad = (d) => (d * Math.PI) / 180;
const f = (n) => Math.round(n * 100) / 100;

function letterC({ cx, cy, rx, ry, tMin, tMax, taper }) {
  const sPeak = (PEAK - A0) / (A1 - A0);
  const outer = (t) => [cx + rx * Math.cos(rad(t)), cy - ry * Math.sin(rad(t))];
  const thickness = (s) => {
    const g = s < sPeak ? (s / sPeak) * 0.5 : 0.5 + ((s - sPeak) / (1 - sPeak)) * 0.5;
    return tMin + (tMax - tMin) * Math.pow(Math.sin(Math.PI * g), taper);
  };
  const inner = (t, w) => {
    let nx = Math.cos(rad(t)) / rx, ny = -Math.sin(rad(t)) / ry;
    const len = Math.hypot(nx, ny);
    const [ox, oy] = outer(t);
    return [ox - (nx / len) * w, oy - (ny / len) * w];
  };
  const out = [], inn = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, t = A0 + (A1 - A0) * s;
    out.push(outer(t));
    inn.push(inner(t, thickness(s)));
  }
  return 'M' + out.map(([x, y]) => `${f(x)},${f(y)}`).join(' L') +
         ' L' + inn.reverse().map(([x, y]) => `${f(x)},${f(y)}`).join(' L') + ' Z';
}

// ---------------------------------------------------------------------------
// Three optical cuts of the same mark.
//   full  — the whole scene: bezel, window, earth limb, light beam, star glint
//   plain — beam and glint dropped; they crowd the counter below ~40px
//   tiny  — bolder near-monoline C, single rim, nothing else
// ---------------------------------------------------------------------------
function icon(variant) {
  const tiny = variant === 'tiny';
  const glow = variant === 'full';

  const C = tiny
    ? letterC({ cx: 256, cy: 256, rx: 150, ry: 176, tMin: 44, tMax: 56, taper: 1 })
    : letterC({ cx: 256, cy: 253, rx: 136, ry: 163, tMin: 26, tMax: 44, taper: 0.85 });

  if (tiny) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <circle cx="256" cy="256" r="254" fill="#050505"/>
  <circle cx="256" cy="256" r="242" fill="none" stroke="#8e9aa5" stroke-width="16" stroke-opacity=".55"/>
  <path d="${C}" fill="#ffffff"/>
</svg>
`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="The Crossing">
  <defs>
    <radialGradient id="space" cx="50%" cy="46%" r="62%">
      <stop offset="0" stop-color="#0b1017"/>
      <stop offset="1" stop-color="#04060a"/>
    </radialGradient>
    <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3d4349" stop-opacity=".55"/>
      <stop offset=".5" stop-color="#14171a" stop-opacity=".5"/>
      <stop offset="1" stop-color="#2b3035" stop-opacity=".45"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dfefff" stop-opacity="0"/>
      <stop offset=".42" stop-color="#eaf4ff" stop-opacity=".85"/>
      <stop offset=".62" stop-color="#eaf4ff" stop-opacity=".85"/>
      <stop offset="1" stop-color="#dfefff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="earth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#16395a"/>
      <stop offset=".55" stop-color="#0a1c2d"/>
      <stop offset="1" stop-color="#050b12"/>
    </linearGradient>
    <clipPath id="aperture"><circle cx="256" cy="256" r="200"/></clipPath>
  </defs>

  <!-- hull -->
  <circle cx="256" cy="256" r="254" fill="#050505"/>
  <circle cx="256" cy="256" r="232" fill="none" stroke="url(#bezel)" stroke-width="36"/>
  <circle cx="256" cy="256" r="251" fill="none" stroke="#4a5157" stroke-width="2" stroke-opacity=".45"/>

  <!-- window -->
  <circle cx="256" cy="256" r="200" fill="url(#space)"/>
  <circle cx="256" cy="256" r="201" fill="none" stroke="#93a0ab" stroke-width="4" stroke-opacity=".75"/>

  <g clip-path="url(#aperture)">
    <!-- earth limb -->
    <circle cx="256" cy="918" r="482" fill="url(#earth)"/>
    <circle cx="256" cy="918" r="482" fill="none" stroke="#a8d6ff" stroke-width="10" stroke-opacity=".16"/>
    <circle cx="256" cy="918" r="482" fill="none" stroke="#dcefff" stroke-width="2.5" stroke-opacity=".8"/>
${glow ? `    <!-- light beam -->
    <rect x="253" y="52" width="6" height="408" fill="url(#beam)"/>
    <!-- star glint -->
    <path d="M256 176 L262 250 L256 262 L250 250 Z M256 344 L262 268 L256 256 L250 268 Z" fill="#f2f8ff" opacity=".9"/>
    <path d="M212 259 L256 252 L300 259 L256 266 Z" fill="#f2f8ff" opacity=".5"/>
` : ''}  </g>

  <!-- the C -->
  <path d="${C}" fill="#ffffff"/>
</svg>
`;
}

const FULL = icon('full'), PLAIN = icon('plain'), TINY = icon('tiny');
const cutFor = (size) => (size <= 20 ? TINY : size < 48 ? PLAIN : FULL);

const png = (size, flatten) => {
  let p = sharp(Buffer.from(cutFor(size)), { density: 512 }).resize(size, size);
  if (flatten) p = p.flatten({ background: '#050505' });
  return p.png({ compressionLevel: 9 }).toBuffer();
};

(async () => {
  fs.writeFileSync(path.join(APP, 'icon.svg'), FULL);

  // ---- favicon.ico: PNG-in-ICO, one entry per optical cut ----
  const sizes = [16, 32, 48];
  const bufs = await Promise.all(sizes.map((s) => png(s, false)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s, 0); e.writeUInt8(s, 1);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(bufs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += bufs[i].length;
    return e;
  });
  fs.writeFileSync(path.join(APP, 'favicon.ico'), Buffer.concat([header, ...entries, ...bufs]));

  // apple touch icons are composited on white if transparent, so flatten to the site black
  fs.writeFileSync(path.join(APP, 'apple-icon.png'), await png(180, true));
  // 512 lives in public/ for the manifest / social use — keeping a second icon.*
  // in app/ would make Next emit a redundant <link rel="icon">
  fs.writeFileSync(path.resolve('public/icon-512.png'), await png(512, false));

  console.log('wrote src/app/{favicon.ico,icon.svg,apple-icon.png} and public/icon-512.png');
})();
