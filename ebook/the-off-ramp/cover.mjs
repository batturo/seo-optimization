// Renders marketplace cover images to dist/covers/.
// Usage: node cover.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { coverArt } from './cover-art.mjs';
import { meta } from './content.mjs';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'dist', 'covers');
mkdirSync(out, { recursive: true });

const base = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #f5efe6; font-family: 'Caladea', serif; color: #1d2a2e; }
.c { position: relative; overflow: hidden; background: #f5efe6; }
.art { position: absolute; left: 0; right: 0; bottom: 0; }
.art svg { width: 100%; height: 100%; display: block; }
.kick { font-family: Inter, sans-serif; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #c8593c; }
.title { font-weight: 700; color: #1f4e5a; line-height: .95; letter-spacing: -.01em; }
.sub { color: #1d2a2e; line-height: 1.18; }
.badge { font-family: Inter, sans-serif; font-weight: 500; letter-spacing: .06em; color: #f5efe6; }
.catch { font-family: Inter, sans-serif; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #f5efe6; }
`;

const covers = [
  {
    // Amazon KDP / Apple Books / general ebook cover, 1.6:1
    name: 'cover-1600x2560',
    w: 1600,
    h: 2560,
    css: `
      .k { position:absolute; left:130px; top:150px; font-size:34px; }
      .t { position:absolute; left:122px; top:220px; font-size:250px; }
      .s { position:absolute; left:130px; top:735px; width:1240px; font-size:84px; }
      .art { height: 1340px; bottom: 300px; }
      .band { position:absolute; left:0; right:0; bottom:0; height:302px; background:#1f4e5a; }
      .b { position:absolute; left:130px; bottom:180px; font-size:38px; color:#cfe0e3; }
      .cp { position:absolute; left:130px; bottom:100px; font-size:46px; color:#f2b8a6; }`,
    html: `<div class="kick k">A 90-day workbook</div>
      <div class="title t">The<br>Off-Ramp</div>
      <div class="sub s">${meta.subtitle}</div>
      <div class="art">${coverArt({ id: 'p' })}</div>
      <div class="band"></div>
      <div class="badge b">12 weekly plans · 10 food-noise cards · 5 bonuses</div>
      <div class="catch cp">${meta.catchphrase}</div>`,
  },
  {
    // Square: Gumroad/Etsy/Payhip thumbnail, Instagram
    name: 'square-1080',
    w: 1080,
    h: 1080,
    css: `
      .k { position:absolute; left:80px; top:80px; font-size:24px; }
      .t { position:absolute; left:76px; top:124px; font-size:138px; }
      .s { position:absolute; left:80px; top:290px; width:820px; font-size:44px; }
      .art { height: 560px; }
      .artfade { position:absolute; left:0; right:0; bottom:440px; height:140px; background:linear-gradient(180deg,#f5efe6,rgba(245,239,230,0)); }
      .cp { position:absolute; left:80px; bottom:56px; font-size:28px; }`,
    html: `<div class="kick k">A 90-day workbook</div>
      <div class="title t">The Off-Ramp</div>
      <div class="sub s">The 90-Day Plan for Keeping Your<br>Results After GLP-1s</div>
      <div class="art">${coverArt({ id: 'q' })}</div><div class="artfade"></div>
      <div class="catch cp">${meta.catchphrase}</div>`,
  },
  {
    // Landscape: Gumroad cover, link previews, X/YouTube
    name: 'banner-1280x720',
    w: 1280,
    h: 720,
    css: `
      .art { left: 600px; right: 44px; top: 44px; bottom: 44px; height: auto; border-radius: 28px; overflow: hidden; }
      .k { position:absolute; left:70px; top:120px; font-size:20px; }
      .t { position:absolute; left:66px; top:160px; font-size:112px; }
      .s { position:absolute; left:70px; top:400px; width:490px; font-size:34px; }
      .cp2 { position:absolute; left:70px; bottom:70px; font-family: Inter, sans-serif; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#c8593c; font-size:18px; }`,
    html: `<div class="art">${coverArt({ id: 'r', preserve: 'xMidYMid slice' })}</div>
      <div class="kick k">A 90-day workbook</div>
      <div class="title t">The<br>Off-Ramp</div>
      <div class="sub s">${meta.subtitle}</div>
      <div class="cp2">${meta.catchphrase}</div>`,
  },
];

const { chromium } = require('playwright');
const browser = await chromium.launch();
for (const c of covers) {
  const page = await browser.newPage({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 1 });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${base}${c.css}</style></head><body><div class="c" style="width:${c.w}px;height:${c.h}px">${c.html}</div></body></html>`;
  writeFileSync(join(out, `${c.name}.html`), html);
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, `${c.name}.png`), clip: { x: 0, y: 0, width: c.w, height: c.h } });
  await page.close();
  console.log('wrote', c.name + '.png');
}
await browser.close();
