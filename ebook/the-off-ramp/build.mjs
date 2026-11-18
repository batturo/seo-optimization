// Builds The Off-Ramp: dist/the-off-ramp.html, dist/the-off-ramp.pdf, dist/manuscript.md
// Usage: node build.mjs   (needs Playwright + Chromium; fonts: Bitstream Charter, Inter)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import * as C from './content.mjs';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, 'dist');
mkdirSync(dist, { recursive: true });

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
const P = (arr, cls = '') => arr.map((p) => `<p${cls ? ` class="${cls}"` : ''}>${md(p)}</p>`).join('');
const lines = (n, cls = '') => Array.from({ length: n }, () => `<div class="line ${cls}"></div>`).join('');
const box = '<span class="box"></span>';
const head = (kicker, title) => `<div class="kicker">${esc(kicker)}</div><h1>${md(title)}</h1>`;

// pages: { html, toc?: [{label, level}], cls?, noFooter? }
const pages = [];
const add = (html, toc = [], opts = {}) => pages.push({ html, toc, ...opts });

const logTable = (cols, n) =>
  `<table class="grid log"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: n }, () => `<tr>${cols.map(() => '<td></td>').join('')}</tr>`).join('')}</tbody></table>`;

// ---------- cover ----------
const rampSvg = `
<svg class="ramp" viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0 30 C 170 30, 230 215, 420 215 L 600 215" fill="none" stroke="#c8593c" stroke-width="10" stroke-linecap="round"/>
  <path d="M0 60 C 160 60, 220 240, 420 240 L 600 240" fill="none" stroke="#1f4e5a" stroke-width="3" stroke-linecap="round" opacity=".55"/>
  <circle cx="420" cy="215" r="13" fill="#1f4e5a"/>
</svg>`;
add(
  `<div class="cover">
    <div class="cover-for">${esc(C.meta.forWho)}</div>
    <div class="cover-title">${esc(C.meta.title)}</div>
    <div class="cover-sub">${esc(C.meta.subtitle)}</div>
    ${rampSvg}
    <div class="cover-promise">${esc(C.meta.promise)}</div>
    <div class="cover-catch">${esc(C.meta.catchphrase)}</div>
    <div class="cover-by">${esc(C.meta.byline)}</div>
  </div>`,
  [],
  { cls: 'cover-page', noFooter: true },
);

// ---------- contents placeholder (filled after numbering) ----------
const contentsIndex = pages.length;
add('', []);

// ---------- front matter ----------
add(
  `${head(C.letter.kicker, C.letter.title)}<div class="letter">${P(C.letter.paras)}<p class="signoff">${esc(C.letter.signoff)}</p></div>`,
  [{ label: C.letter.title, level: 1 }],
);

add(
  `${head(C.why.kicker, C.why.title)}${C.why.sections.map((s) => `<h3>${esc(s.h)}</h3>${P(s.paras)}`).join('')}`,
  [{ label: C.why.title, level: 1 }],
);

add(
  `${head(C.notThis.kicker, C.notThis.title)}${P(C.notThis.paras)}<p class="callout">${md(C.notThis.close)}</p>`,
  [{ label: C.notThis.title, level: 1 }],
);

const scoreTable = (cols, rows, rowCells) =>
  `<table class="grid scores"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${rowCells(r)}</tr>`)
    .join('')}</tbody></table>`;

add(
  `${head(C.scores.kicker, C.scores.title)}<p>${md(C.scores.intro)}</p>
   <div class="facts">${C.scores.facts.map((f) => `<div class="fact"><span>${esc(f)}</span><div class="line inline"></div></div>`).join('')}</div>
   ${scoreTable(['Measure', 'How to score', 'Day 1'], C.scores.rows, (r) => `<td><strong>${esc(r[0])}</strong></td><td class="muted">${esc(r[1])}</td><td class="blank"></td>`)}
   <p class="small">${md(C.scores.note)}</p>
   <div class="label">${esc(C.scores.future)}</div>${lines(3)}`,
  [{ label: C.scores.title, level: 1 }],
);

add(
  `${head(C.expect.kicker, C.expect.title)}<p>${md(C.expect.intro)}</p>
   <div class="timeline">${C.expect.phases
     .map((p) => `<div class="phase"><div class="phase-w">${esc(p.weeks)}</div><div class="phase-n">${esc(p.name)}</div><p>${md(p.text)}</p></div>`)
     .join('')}</div>
   <p class="callout">${md(C.expect.close)}</p>`,
  [{ label: C.expect.title, level: 1 }],
);

add(
  `${head(C.badDays.kicker, C.badDays.title)}<h2 class="rule-name">${esc(C.badDays.rule)}</h2>${P(C.badDays.paras)}
   <ul class="rules">${C.badDays.list.map((l) => `<li>${md(l)}</li>`).join('')}</ul>
   <p>${md(C.badDays.after)}</p><div class="pull">${esc(C.badDays.pull)}</div>`,
  [{ label: C.badDays.title, level: 1 }],
);

add(
  `${head(C.fit.kicker, C.fit.title)}${C.fit.items.map((i) => `<h3>${esc(i.h)}</h3><p>${md(i.t)}</p>`).join('')}`,
  [{ label: C.fit.title, level: 1 }],
);

// ---------- part dividers ----------
const divider = (d) =>
  `<div class="divider"><div class="part-label">${esc(d.label)}</div><div class="part-title">${esc(d.title)}</div>
   <p class="part-copy">${md(d.copy)}</p>${d.list ? `<ul class="part-list">${d.list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div>`;

// ---------- part 1 ----------
add(divider(C.part1), [{ label: `${C.part1.label}: ${C.part1.title}`, level: 0 }], { cls: 'divider-page' });

add(
  `${head(C.prescriber.kicker, C.prescriber.title)}<p>${md(C.prescriber.intro)}</p>
   <ol class="qs">${C.prescriber.qs.map((q) => `<li><div class="q">${md(q)}</div>${lines(2, 'tight')}</li>`).join('')}</ol>`,
  [{ label: C.prescriber.title, level: 1 }],
);

const f = C.floors;
add(
  `${head(f.kicker, f.title)}<p>${md(f.intro)}</p>
   <h3>${esc(f.protein.h)}</h3><p>${md(f.protein.t)}</p>
   <div class="calc">${f.protein.calc.map((c) => `<div class="calc-row"><span>${esc(c)}</span><span class="calc-blank"></span></div>`).join('')}</div>
   <p class="small">${md(f.protein.tip)}</p>
   <h3>${esc(f.strength.h)}</h3><p>${md(f.strength.t)}</p>
   <div class="facts two"><div class="fact"><span>Day 1:</span><div class="line inline"></div></div><div class="fact"><span>Day 2:</span><div class="line inline"></div></div></div>
   <h3>${esc(f.steps.h)}</h3><p>${md(f.steps.t)}</p>
   <div class="facts two"><div class="fact"><span>Average now:</span><div class="line inline"></div></div><div class="fact"><span>My step floor:</span><div class="line inline"></div></div></div>`,
  [{ label: f.title, level: 1 }],
);

const t = C.tripwire;
add(
  `${head(t.kicker, t.title)}<p>${md(t.intro)}</p>
   <div class="facts"><div class="fact"><span>My stop weight (7-day average) or waist:</span><div class="line inline"></div></div></div>
   ${t.zones
     .map(
       (z) => `<div class="zone zone-${z.key}"><div class="zone-name">${esc(z.name)}</div><div class="zone-body"><div class="zone-cond">${esc(z.cond)}</div><div class="zone-act">${md(z.act)}</div></div></div>`,
     )
     .join('')}
   <p class="small">${md(t.hint)}</p>
   <div class="sign"><span>${esc(t.sign)}</span><div class="facts two"><div class="fact"><span>Signed:</span><div class="line inline"></div></div><div class="fact"><span>Date:</span><div class="line inline"></div></div></div></div>`,
  [{ label: t.title, level: 1 }],
);

// ---------- part 2: weeks ----------
add(divider(C.part2), [{ label: `${C.part2.label}: ${C.part2.title}`, level: 0 }], { cls: 'divider-page' });

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const progress = (n) =>
  `<div class="progress">${Array.from({ length: 12 }, (_, i) => `<span class="${i < n ? 'on' : ''}"></span>`).join('')}</div>`;

const weekPage = (w) => `
  <div class="week-top"><div class="kicker">Week ${w.n} of 12 · ${esc(w.phase)}</div>${progress(w.n)}</div>
  <h1>${esc(w.name)}</h1>
  <div class="rule-line">${md(w.rule)}</div>
  <div class="why">${P(w.why)}</div>
  <div class="move"><div class="label">This week's move</div><ul>${w.move.map((m) => `<li>${md(m)}</li>`).join('')}</ul></div>
  <table class="grid tick">
    <thead><tr><th class="rowlabel">Each day</th>${days.map((d) => `<th>${d}</th>`).join('')}</tr></thead>
    <tbody>
      <tr><td class="rowlabel">Protein floor, every meal</td>${days.map(() => `<td>${box}</td>`).join('')}</tr>
      <tr><td class="rowlabel">${esc(w.track)}</td>${days.map(() => `<td>${box}</td>`).join('')}</tr>
      <tr><td class="rowlabel">Food noise peak (0 to 10)</td>${days.map(() => '<td class="num"></td>').join('')}</tr>
    </tbody>
  </table>
  <div class="label">What I noticed:</div>${lines(3)}
  <div class="weekly-sum">
    <div class="fact"><span>Weekly average:</span><div class="line inline short"></div></div>
    <div class="fact"><span>Zone:</span><span class="zones-pick"><span class="zp">${box} Green</span><span class="zp">${box} Yellow</span><span class="zp">${box} Red</span></span></div>
  </div>
  <div class="hard-week"><span class="card-tab">Hard week?</span> Card ${w.card}: ${md(C.cards[w.card - 1].t)}</div>`;

for (const w of C.weeks) {
  add(weekPage(w), [{ label: `Week ${w.n}: ${w.name}`, level: 2 }], { cls: 'week-page' });
  if (w.n === 6) {
    add(
      `${head(C.midpoint.kicker, C.midpoint.title)}<div class="letter">${P(C.midpoint.paras)}</div><div class="pull">${esc(C.midpoint.pull)}</div>`,
      [{ label: 'Halfway: a letter', level: 2 }],
    );
  }
}

// ---------- part 3: cards ----------
add(divider({ ...C.part3, list: C.cards.map((c, i) => `Card ${i + 1}: ${c.t}`) }), [{ label: `${C.part3.label}: ${C.part3.title}`, level: 0 }], {
  cls: 'divider-page',
});
const card = (c, i) => `
  <div class="card">
    <div class="card-tab">Card ${i + 1}</div>
    <div class="card-title">${md(c.t)}</div>
    <div class="card-row"><span class="card-k">What is happening</span><span>${md(c.what)}</span></div>
    <div class="card-row"><span class="card-k">Say this</span><span class="card-say">${md(c.say)}</span></div>
    <div class="card-row"><span class="card-k">Do this now</span><ol>${c.do.map((d) => `<li>${md(d)}</li>`).join('')}</ol></div>
  </div>`;
for (let i = 0; i < C.cards.length; i += 2) {
  add(`<div class="cards">${card(C.cards[i], i)}${C.cards[i + 1] ? card(C.cards[i + 1], i + 1) : ''}</div>`, [], { cls: 'cards-page' });
}

// ---------- part 4 ----------
const r = C.restart;
add(
  `${head(r.kicker, r.title)}<div class="pull top">${esc(r.pull)}</div>${P(r.paras)}
   <h3>${esc(r.signs.h)}</h3><ul class="checks">${r.signs.items.map((s) => `<li>${box}<span>${md(s)}</span></li>`).join('')}</ul>
   <h3>${esc(r.ask.h)}</h3><ul class="plain">${r.ask.items.map((s) => `<li>${md(s)}</li>`).join('')}</ul>
   <p class="callout">${md(r.close)}</p>`,
  [{ label: `${r.kicker}: ${r.title}`, level: 0 }],
);

// ---------- finish ----------
add(
  `${head(C.finalScores.kicker, C.finalScores.title)}<p>${md(C.finalScores.intro)}</p>
   ${scoreTable(['Measure', 'Day 1', 'Day 90', 'Change'], C.scores.rows, (row) => `<td><strong>${esc(row[0])}</strong></td><td class="blank"></td><td class="blank"></td><td class="blank"></td>`)}
   <div class="label">Read your Day-1 note to yourself. Then write one back:</div>${lines(3)}
   <p class="callout">${md(C.finalScores.after)}</p>`,
  [{ label: C.finalScores.title, level: 1 }],
);

const k = C.keepFive;
add(
  `${head(k.kicker, k.title)}<p>${md(k.intro)}</p>
   <div class="keep">${[1, 2, 3, 4, 5].map((n) => `<div class="keep-row"><span class="keep-n">${n}</span><div class="line inline"></div></div>`).join('')}</div>
   <div class="facts">${k.extras.map((e) => `<div class="fact"><span>${esc(e)}</span><div class="line inline"></div></div>`).join('')}</div>
   <div class="end-catch">${esc(k.close)}<br><span>${esc(C.meta.catchphrase)}</span></div>`,
  [{ label: k.title, level: 1 }],
);

// ---------- working pages ----------
add(divider(C.workingPages), [{ label: C.workingPages.label, level: 0 }], { cls: 'divider-page' });

add(
  `<h1>${esc(C.method.title)}</h1>
   <div class="method">
     <div class="method-col"><div class="label">Setup, once</div><ol>${C.method.setup.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
       <div class="label">Every bad day</div><p class="small">No catching up, no compensating, no restarts. Just today.</p></div>
     <div class="method-col"><div class="label">The twelve rules</div><ol>${C.weeks.map((w) => `<li><strong>${esc(w.name)}.</strong> ${md(w.rule)}</li>`).join('')}</ol></div>
   </div>
   <p class="small cards-index">${esc(C.method.cardsIndex)}</p>`,
  [{ label: C.method.title, level: 1 }],
);

add(
  `<h1>The 12-Week Tracker</h1><p>Fill in one row every Sunday. It is the whole ninety days at a glance, and it fits on a fridge.</p>
   <table class="grid tracker"><thead><tr><th>Week</th><th>Protein floor days (of 7)</th><th>Strength sessions (of 2)</th><th>Food noise average</th><th>Weekly average</th><th>Zone (G, Y, R)</th></tr></thead>
   <tbody>${C.weeks.map((w) => `<tr><td><strong>${w.n}</strong> <span class="muted">${esc(w.name.replace('The ', '').replace(' Rule', ''))}</span></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}</tbody></table>`,
  [{ label: 'The 12-Week Tracker', level: 1 }],
);

add(
  `<h1>${esc(C.quickstart.title)}</h1><p>${md(C.quickstart.intro)}</p>
   <table class="grid qs-table"><tbody>${C.quickstart.days.map((d) => `<tr><td class="day">${esc(d[0])}</td><td>${md(d[1])}</td><td class="tickcell">${box}</td></tr>`).join('')}</tbody></table>`,
  [{ label: C.quickstart.title, level: 1 }],
);

add(
  `<h1>${esc(C.protein.title)}</h1><p class="small">${md(C.protein.intro)}</p>
   <table class="grid protein"><thead><tr><th>Food</th><th>Portion</th><th>Protein (g)</th></tr></thead>
   <tbody>${C.protein.rows.map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td class="numr">${esc(row[2])}</td></tr>`).join('')}</tbody></table>
   <div class="label">${esc(C.protein.mine)}</div>${lines(2, "tight")}`,
  [{ label: C.protein.title, level: 1 }],
);

add(
  `<h1>${esc(C.session.title)}</h1><p>${md(C.session.intro)}</p>
   <table class="grid moves"><thead><tr><th>Move</th><th>Reps</th><th>How</th></tr></thead>
   <tbody>${C.session.moves.map((m) => `<tr><td><strong>${esc(m[0])}</strong></td><td class="nowrap">${esc(m[1])}</td><td>${md(m[2])}</td></tr>`).join('')}</tbody></table>
   <p>${md(C.session.progress)}</p><p class="small">${md(C.session.safety)}</p>
   <div class="label">My session log</div>${logTable(['Date', 'Rounds', 'Hardest move', 'Make it harder next time?'], 4)}`,
  [{ label: C.session.title, level: 1 }],
);

add(
  `<h1>${esc(C.scripts.title)}</h1><p>${md(C.scripts.intro)}</p>
   ${C.scripts.items.map((s) => `<div class="script"><div class="script-when">${md(s[0])}</div><div class="script-say">${md(s[1])}</div></div>`).join('')}`,
  [{ label: C.scripts.title, level: 1 }],
);


add(`<h1>${esc(C.visitLog.title)}</h1><p>${md(C.visitLog.intro)}</p>${logTable(C.visitLog.cols, C.visitLog.rows)}`, [{ label: C.visitLog.title, level: 1 }], { cls: 'log-page visit' });
add(`<h1>${esc(C.cardLog.title)}</h1><p>${md(C.cardLog.intro)}</p>${logTable(C.cardLog.cols, C.cardLog.rows)}`, [{ label: C.cardLog.title, level: 1 }], { cls: 'log-page' });

const sp = C.smallPrint;
add(
  `<h1>${esc(sp.title)}</h1>${P(sp.paras)}
   <h3>Free help, any time</h3><table class="grid help"><tbody>${sp.help.map((h) => `<tr><td><strong>${esc(h[0])}</strong></td><td>${esc(h[1])}</td></tr>`).join('')}</tbody></table>
   <p class="callout">${md(sp.close)}</p>`,
  [{ label: sp.title, level: 0 }],
);
add(`<h1>${esc(C.sources.title)}</h1><p>${md(C.sources.intro)}</p><ol class="sources">${C.sources.items.map((s) => `<li>${md(s)}</li>`).join('')}</ol>`, [
  { label: C.sources.title, level: 1 },
]);

// ---------- contents ----------
const tocEntries = [];
pages.forEach((p, i) => p.toc.forEach((e) => tocEntries.push({ ...e, page: i + 1 })));
const weekEntries = tocEntries.filter((e) => e.level === 2);
const tocRow = (e) => `<div class="toc-row lvl${e.level}"><span class="toc-l">${esc(e.label)}</span><span class="toc-dots"></span><span class="toc-p">${e.page}</span></div>`;
let tocHtml = '';
let weeksDone = false;
for (const e of tocEntries) {
  if (e.level === 2) {
    if (!weeksDone) {
      const half = Math.ceil(weekEntries.length / 2);
      tocHtml += `<div class="toc-weeks"><div>${weekEntries.slice(0, half).map(tocRow).join('')}</div><div>${weekEntries.slice(half).map(tocRow).join('')}</div></div>`;
      weeksDone = true;
    }
    continue;
  }
  tocHtml += tocRow(e);
}
pages[contentsIndex].html = `<h1>Contents</h1><div class="toc">${tocHtml}</div>`;

// ---------- html ----------
const css = `
@page { size: 8.5in 11in; margin: 0; }
:root { --ink:#1d2a2e; --teal:#1f4e5a; --teal2:#2f6f7e; --sand:#f5efe6; --sand2:#e8dccb; --coral:#c8593c; --muted:#5b6b70; --green:#3f7d58; --yellow:#c99a2e; --red:#b5452f; }
* { box-sizing: border-box; }
html, body { margin:0; padding:0; background:#fff; color:var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Caladea', 'Liberation Serif', serif; font-size: 12pt; line-height: 1.5; }
.page { width:8.5in; height:11in; position:relative; overflow:hidden; page-break-after:always; break-after:page; }
.frame { position:absolute; inset:0.4in; border:0.75pt solid var(--teal); padding:0.42in 0.55in 0.3in; display:flex; flex-direction:column; }
.body { flex:1; overflow:hidden; min-height:0; }
.foot { font-family:Inter, sans-serif; font-size:7pt; letter-spacing:.14em; color:var(--muted); display:flex; justify-content:space-between; padding-top:8pt; border-top:0.5pt solid var(--sand2); margin-top:6pt; }
h1 { font-size: 29pt; line-height:1.1; margin: 0 0 10pt; color:var(--teal); font-weight:700; }
h2 { font-size: 15pt; color:var(--teal); margin: 6pt 0 6pt; }
h3 { font-size: 12.5pt; color:var(--teal); margin: 12pt 0 3pt; font-family:Inter, sans-serif; font-weight:600; letter-spacing:.01em; }
p { margin: 0 0 7pt; }
strong { color: var(--ink); }
.kicker, .label { font-family:Inter, sans-serif; text-transform:uppercase; letter-spacing:.16em; font-size:8.3pt; color:var(--coral); font-weight:600; margin-bottom:5pt; }
.label { margin-top:10pt; }
.muted { color: var(--muted); }
.small { font-size: 10pt; color: var(--muted); line-height:1.4; }
.line { border-bottom: 0.75pt solid #b9c3c5; height: 26pt; }
.line.tight { height: 19pt; }
.line.inline { flex:1; height: 15pt; margin-left:6pt; }
.line.short { max-width: 1.4in; }
.callout { background: var(--sand); border-left: 3pt solid var(--coral); padding: 8pt 11pt; margin-top: 12pt; }
.pull { font-size: 17pt; font-style: italic; color: var(--teal); margin: 16pt 0 0; padding-top: 10pt; border-top: 1pt solid var(--sand2); }
.pull.top { margin: 0 0 10pt; padding-top: 0; border-top: none; }
.letter p { font-size: 12.8pt; line-height: 1.58; margin-bottom: 10pt; }
.signoff { font-style: italic; color: var(--teal); font-size: 13pt !important; margin-top: 12pt; }
.box { display:inline-block; width:12pt; height:12pt; border:0.9pt solid var(--teal); border-radius:2pt; vertical-align:middle; background:#fff; }
/* cover */
.cover-page .frame { border-width: 1.5pt; background: var(--sand); }
.cover { height:100%; display:flex; flex-direction:column; padding-top: 0.4in; }
.cover-for { font-family:Inter, sans-serif; font-size:8.5pt; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); max-width:5.2in; line-height:1.5; }
.cover-title { font-size: 60pt; font-weight:700; color:var(--teal); line-height:1; margin-top: 0.45in; letter-spacing:-.01em; }
.cover-sub { font-size: 18pt; color:var(--ink); margin-top: 12pt; max-width: 5.6in; line-height:1.25; }
.ramp { width: 100%; height: auto; margin: 0.5in 0 0.35in; }
.cover-promise { font-size: 15pt; font-style: italic; color: var(--ink); max-width: 5.6in; line-height: 1.35; }
.cover-catch { font-family:Inter, sans-serif; font-weight:600; color: var(--coral); font-size: 11pt; letter-spacing:.08em; text-transform:uppercase; margin-top: 16pt; }
.cover-by { margin-top:auto; font-family:Inter, sans-serif; font-size:8.5pt; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; }
/* toc */
.toc-row { display:flex; align-items:baseline; gap:6pt; font-size: 9.8pt; padding: 1.1pt 0; }
.toc-row.lvl0 { font-family: Inter, sans-serif; font-weight:600; color: var(--teal); font-size: 9pt; letter-spacing:.06em; text-transform: uppercase; margin-top: 7pt; }
.toc-row.lvl1 { padding-left: 12pt; }
.toc-row.lvl2 { font-size: 9.5pt; padding-left: 12pt; }
.toc-dots { flex:1; border-bottom: 0.75pt dotted #b9c3c5; transform: translateY(-3pt); }
.toc-p { font-family: Inter, sans-serif; font-size: 8.5pt; color: var(--muted); min-width: 16pt; text-align:right; }
.toc-weeks { display:grid; grid-template-columns: 1fr 1fr; gap: 0 18pt; }
/* facts and tables */
.facts { margin: 8pt 0; }
.facts.two { display:grid; grid-template-columns: 1fr 1fr; gap: 0 18pt; }
.fact { display:flex; align-items:flex-end; margin: 7pt 0; font-size: 11.2pt; }
.fact > span:first-child { white-space: nowrap; }
table.grid { width:100%; border-collapse: collapse; margin: 10pt 0; font-size: 10.8pt; }
table.grid th { font-family: Inter, sans-serif; font-size: 8pt; letter-spacing:.08em; text-transform: uppercase; color: #fff; background: var(--teal); text-align:left; padding: 5pt 6pt; font-weight:600; }
table.grid td { border: 0.6pt solid #c9d1d3; padding: 5pt 6pt; vertical-align: top; }
table.scores td.blank { width: 1.1in; }
table.scores td { height: 32pt; vertical-align: middle; }
table.tick { margin-top: 10pt; }
table.tick th { text-align:center; width: 0.42in; }
table.tick th.rowlabel { text-align:left; width:auto; }
table.tick td { text-align:center; vertical-align: middle; height: 30pt; }
table.tick td.rowlabel { text-align:left; font-size: 10.4pt; }
table.tracker td { height: 40pt; vertical-align: middle; }
table.tracker th { font-size: 6.8pt; }
table.log td { height: 34pt; }
.log-page.visit table.log td { height: 66pt; }
table.protein td { padding: 2.4pt 6pt; font-size: 9.8pt; line-height: 1.35; }
table.protein tbody tr:nth-child(even) td { background: #faf7f2; }
td.numr { text-align: right; font-family: Inter, sans-serif; font-size: 8.8pt; }
td.nowrap { white-space: nowrap; }
table.moves td { font-size: 10.8pt; }
table.help td { font-size: 10.8pt; }
table.qs-table td { vertical-align: middle; height: 52pt; font-size: 11.6pt; }
table.qs-table td.day { width: 0.75in; font-family: Inter, sans-serif; font-weight: 600; color: var(--teal); font-size: 9pt; }
table.qs-table td.tickcell { width: 0.45in; text-align: center; }
/* timeline */
.timeline { margin: 10pt 0; border-left: 2pt solid var(--sand2); padding-left: 14pt; }
.phase { margin-bottom: 14pt; }
.phase-w { font-family: Inter, sans-serif; font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.phase-n { font-size: 16pt; color: var(--teal); font-weight: 700; margin: 1pt 0 2pt; }
/* rules */
.rule-name { margin-top: 2pt; }
ul.rules { padding-left: 16pt; } ul.rules li { margin-bottom: 9pt; }
/* dividers */
.divider-page .frame { background: var(--teal); border-color: var(--teal); color: #fff; }
.divider-page .foot { color: #cfe0e3; border-top-color: rgba(255,255,255,.25); }
.divider { padding-top: 1.6in; }
.part-label { font-family: Inter, sans-serif; letter-spacing: .2em; text-transform: uppercase; font-size: 9pt; color: #f2b8a6; }
.part-title { font-size: 40pt; font-weight: 700; margin: 6pt 0 16pt; line-height: 1.05; }
.part-copy { font-size: 14.5pt; line-height: 1.5; max-width: 5.6in; color: #eef5f6; }
.part-list { margin-top: 22pt; padding-left: 0; list-style: none; font-family: Inter, sans-serif; font-size: 10pt; letter-spacing: .03em; color: #d7e7ea; }
.part-list li { padding: 4pt 0; border-top: 0.5pt solid rgba(255,255,255,.2); }
/* prescriber */
ol.qs { padding-left: 16pt; margin: 8pt 0 0; } ol.qs li { margin-bottom: 4pt; } .q { font-weight: 600; font-size: 11.2pt; }
/* floors */
.calc { margin: 6pt 0 6pt; } .calc-row { display:flex; align-items:flex-end; justify-content:space-between; font-size: 11.2pt; padding: 5pt 0; }
.calc-blank { width: 1.1in; border-bottom: 0.75pt solid #b9c3c5; height: 14pt; margin-left: 10pt; }
/* tripwire */
.zone { display:flex; margin: 8pt 0; border: 0.75pt solid #c9d1d3; }
.zone-name { width: 0.95in; font-family: Inter, sans-serif; font-weight: 700; color:#fff; font-size: 10pt; letter-spacing: .1em; text-transform: uppercase; display:flex; align-items:center; justify-content:center; }
.zone-green .zone-name { background: var(--green); } .zone-yellow .zone-name { background: var(--yellow); } .zone-red .zone-name { background: var(--red); }
.zone-body { padding: 10pt 12pt; flex:1; } .zone-cond { font-weight: 700; margin-bottom: 3pt; } .zone-act { font-size: 11pt; }
.sign { margin-top: 10pt; font-style: italic; }
/* weeks */
.week-top { display:flex; justify-content: space-between; align-items: center; margin-bottom: 4pt; }
.week-top .kicker { margin: 0; }
.progress { display:flex; gap: 2.5pt; } .progress span { width: 13pt; height: 5pt; background: var(--sand2); border-radius: 1pt; } .progress span.on { background: var(--coral); }
.week-page h1 { margin-bottom: 5pt; }
.rule-line { font-size: 15.5pt; font-style: italic; color: var(--ink); background: var(--sand); padding: 8pt 11pt; border-left: 3pt solid var(--coral); margin-bottom: 9pt; line-height: 1.35; }
.why p { font-size: 12pt; }
.move ul { margin: 2pt 0 0; padding-left: 16pt; } .move li { margin-bottom: 4pt; font-size: 11.8pt; }
.weekly-sum { display:grid; grid-template-columns: 1fr 1.4fr; gap: 0 18pt; margin-top: 8pt; }
.zones-pick { display:flex; gap: 12pt; margin-left: 8pt; font-size: 9.6pt; } .zp { white-space: nowrap; } .zp .box { margin-right: 3pt; }
.hard-week { margin-top: 14pt; font-size: 11pt; color: var(--muted); font-style: italic; } .hard-week .card-tab { font-style: normal; margin-right: 6pt; }
/* cards */
.cards { display:flex; flex-direction:column; gap: 14pt; height: 100%; }
.card { flex:1; border: 1pt solid var(--teal); border-radius: 6pt; padding: 12pt 14pt; position: relative; background: #fff; }
.card-tab { font-family: Inter, sans-serif; font-size: 7.5pt; letter-spacing: .16em; text-transform: uppercase; color: #fff; background: var(--coral); display:inline-block; padding: 3pt 8pt; border-radius: 3pt; }
.card-title { font-size: 19pt; font-weight: 700; color: var(--teal); margin: 8pt 0 8pt; line-height: 1.2; }
.card-row { display:grid; grid-template-columns: 1.2in 1fr; gap: 10pt; padding: 7pt 0; border-top: 0.5pt solid var(--sand2); font-size: 11.4pt; }
.card-k { font-family: Inter, sans-serif; font-size: 7.3pt; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); padding-top: 2pt; }
.card-say { font-style: italic; font-size: 13pt; color: var(--teal); }
.card-row ol { margin: 0; padding-left: 15pt; } .card-row ol li { margin-bottom: 2pt; }
/* restart */
ul.checks { list-style:none; padding:0; } ul.checks li { display:flex; gap: 8pt; margin-bottom: 8pt; align-items:flex-start; } ul.checks .box { margin-top: 2pt; flex: none; }
ul.plain { padding-left: 16pt; } ul.plain li { margin-bottom: 4pt; }
/* keep five */
.keep { margin: 12pt 0; } .keep-row { display:flex; align-items:flex-end; margin: 14pt 0; }
.keep-n { width: 24pt; height: 24pt; border-radius: 50%; background: var(--teal); color:#fff; font-family: Inter, sans-serif; font-weight:700; display:flex; align-items:center; justify-content:center; font-size: 10pt; flex: none; }
.keep .line.inline { height: 22pt; }
.end-catch { margin-top: 18pt; font-size: 15pt; font-style: italic; color: var(--teal); }
.end-catch span { display:block; margin-top: 8pt; font-style: normal; font-family: Inter, sans-serif; font-weight: 600; font-size: 10pt; letter-spacing: .1em; text-transform: uppercase; color: var(--coral); }
/* method */
.method { display:grid; grid-template-columns: 0.8fr 1.4fr; gap: 20pt; }
.method ol { padding-left: 15pt; margin: 2pt 0 8pt; } .method li { font-size: 10.6pt; margin-bottom: 4pt; line-height: 1.35; }
.cards-index { border-top: 0.5pt solid var(--sand2); padding-top: 8pt; margin-top: 6pt; }
/* scripts */
.script { padding: 9pt 0; border-top: 0.5pt solid var(--sand2); }
.script-when { font-weight: 700; color: var(--teal); } .script-say { font-style: italic; margin-top: 2pt; }
ol.sources li { margin-bottom: 10pt; font-size: 11pt; }
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(C.meta.title)}: ${esc(C.meta.subtitle)}</title><style>${css}</style></head><body>
${pages
  .map(
    (p, i) => `<section class="page ${p.cls || ''}" data-page="${i + 1}"><div class="frame"><div class="body">${p.html}</div>${
      p.noFooter ? '' : `<div class="foot"><span>${esc(C.meta.footer)}</span><span>${i + 1}</span></div>`
    }</div></section>`,
  )
  .join('\n')}
</body></html>`;
writeFileSync(join(dist, 'the-off-ramp.html'), html);

// ---------- manuscript.md (for review) ----------
const mdLines = [];
const push = (...l) => mdLines.push(...l, '');
push(`# ${C.meta.title}: ${C.meta.subtitle}`, `> ${C.meta.promise}`, `*${C.meta.catchphrase}*`);
push(`## ${C.letter.title}`, ...C.letter.paras, `*${C.letter.signoff}*`);
push(`## ${C.why.title}`, ...C.why.sections.flatMap((s) => [`### ${s.h}`, ...s.paras]));
push(`## ${C.notThis.title}`, ...C.notThis.paras, C.notThis.close);
push(`## ${C.scores.title}`, C.scores.intro, ...C.scores.rows.map((r) => `- ${r[0]} (${r[1]})`), C.scores.note);
push(`## ${C.expect.title}`, C.expect.intro, ...C.expect.phases.map((p) => `**${p.weeks}, ${p.name}.** ${p.text}`), C.expect.close);
push(`## ${C.badDays.title}: ${C.badDays.rule}`, ...C.badDays.paras, ...C.badDays.list.map((l) => `- ${l}`), C.badDays.after, `*${C.badDays.pull}*`);
push(`## ${C.fit.title}`, ...C.fit.items.map((i) => `**${i.h}.** ${i.t}`));
push(`## ${C.part1.label}: ${C.part1.title}`, C.part1.copy);
push(`### ${C.prescriber.title}`, C.prescriber.intro, ...C.prescriber.qs.map((q, i) => `${i + 1}. ${q}`));
push(`### ${f.title}`, f.intro, `**${f.protein.h}.** ${f.protein.t}`, ...f.protein.calc.map((c) => `- ${c}`), f.protein.tip, `**${f.strength.h}.** ${f.strength.t}`, `**${f.steps.h}.** ${f.steps.t}`);
push(`### ${t.title}`, t.intro, ...t.zones.map((z) => `- **${z.name}:** ${z.cond}. ${z.act}`), t.hint);
push(`## ${C.part2.label}: ${C.part2.title}`, C.part2.copy);
for (const w of C.weeks) {
  push(`### Week ${w.n} (${w.phase}): ${w.name}`, `**${w.rule}**`, ...w.why, 'This week\'s move:', ...w.move.map((m) => `- ${m}`), `Tracked daily: protein floor, ${w.track}, food noise peak.`);
  if (w.n === 6) push(`### ${C.midpoint.title}`, ...C.midpoint.paras, `*${C.midpoint.pull}*`);
}
push(`## ${C.part3.label}: ${C.part3.title}`, C.part3.copy);
C.cards.forEach((c, i) => push(`### Card ${i + 1}: ${c.t}`, `What is happening: ${c.what}`, `Say this: ${c.say}`, ...c.do.map((d, j) => `${j + 1}. ${d}`)));
push(`## ${r.kicker}: ${r.title}`, `*${r.pull}*`, ...r.paras, `**${r.signs.h}**`, ...r.signs.items.map((s) => `- [ ] ${s}`), `**${r.ask.h}**`, ...r.ask.items.map((s) => `- ${s}`), r.close);
push(`## ${C.finalScores.title}`, C.finalScores.intro, C.finalScores.after);
push(`## ${k.title}`, k.intro, ...k.extras.map((e) => `- ${e}`), k.close);
push(`## ${C.quickstart.title}`, C.quickstart.intro, ...C.quickstart.days.map((d) => `- **${d[0]}:** ${d[1]}`));
push(`## ${C.protein.title}`, C.protein.intro, '| Food | Portion | Protein (g) |', '|---|---|---|', ...C.protein.rows.map((row) => `| ${row.join(' | ')} |`));
push(`## ${C.session.title}`, C.session.intro, ...C.session.moves.map((m) => `- **${m[0]}** (${m[1]}): ${m[2]}`), C.session.progress, C.session.safety);
push(`## ${C.scripts.title}`, C.scripts.intro, ...C.scripts.items.map((s) => `- **${s[0]}** ${s[1]}`));
push(`## ${sp.title}`, ...sp.paras, ...sp.help.map((h) => `- **${h[0]}:** ${h[1]}`), sp.close);
push(`## ${C.sources.title}`, ...C.sources.items.map((s, i) => `${i + 1}. ${s}`));
writeFileSync(join(dist, 'manuscript.md'), mdLines.join('\n'));

// ---------- render + checks ----------
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + join(dist, 'the-off-ramp.html'));
await page.evaluate(() => document.fonts.ready);
const report = await page.evaluate(() => {
  const out = { overflow: [], fonts: [] };
  document.querySelectorAll('section.page').forEach((s) => {
    const b = s.querySelector('.body');
    if (b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1) {
      out.overflow.push({ page: s.dataset.page, over: b.scrollHeight - b.clientHeight, h1: (s.querySelector('h1,.part-title,.card-title,.cover-title') || {}).textContent });
    }
    // wrapped table headers
    s.querySelectorAll('th').forEach((th) => {
      const lh = parseFloat(getComputedStyle(th).lineHeight) || 12;
      const inner = th.getBoundingClientRect().height - 10;
      if (inner > lh * 1.6 && !th.closest('.tracker')) out.overflow.push({ page: s.dataset.page, wrappedHeader: th.textContent });
    });
  });
  const fams = new Set();
  document.fonts.forEach((f) => f.status === 'loaded' && fams.add(f.family));
  out.fonts = [...fams];
  out.pages = document.querySelectorAll('section.page').length;
  return out;
});
await page.pdf({ path: join(dist, 'the-off-ramp.pdf'), preferCSSPageSize: true, printBackground: true });
await browser.close();

console.log(JSON.stringify(report, null, 2));
if (report.overflow.length) {
  console.error('LAYOUT PROBLEMS FOUND');
  process.exit(1);
}
console.log(`OK: ${report.pages} pages -> dist/the-off-ramp.pdf`);
