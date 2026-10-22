// Fáze 7: úrovně bez stropu, bludiště (velikosti, klíče, mlha), sudoku 9 × 9, opravené váhy. Volá se z tests/gen.test.js.
module.exports = function (L, bad, chk) {
  const CZ = /[áčďéěíňóřšťúůýž]/i, BADTXT = /undefined|NaN|null|\[object|  /;
  const texts = (t, op) => { for (const lang of L.LANGS) { const x = L.texts(t, lang);
    for (const k of ['full', 'short', 'ok', 'okShort', 'reveal']) { const v = x[k]; if (v === undefined) continue;
      if (BADTXT.test(v)) bad(`${op} ${lang}.${k}: ${v}`); if (lang === 'en' && CZ.test(v)) bad(`${op} čeština v en: ${v}`); }
    if (!x.full || x.short.length > x.full.length) bad(`${op} ${lang} zadání`); } };

  // ---- bludiště ----
  const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
  for (const size of ['S', 'M', 'L', 'XL']) for (const portrait of [false, true]) for (const lv of [1, 2, 3, 4, 5, 7, 9, 12, 20]) for (let i = 0; i < 25; i++) {
    const m = L.GEN.maze(lv, 'skolak', { size, portrait }); texts(m, `maze${size}${lv}`);
    let [W, H] = L.MAZE_SIZES[size]; if (portrait) [W, H] = [H, W];
    if (m.W !== W || m.H !== H || m.cells.length !== W * H) bad(`maze rozměr ${size} ${m.W}×${m.H}`);
    let edges = 0;
    for (let k = 0; k < W * H; k++) { const r = Math.floor(k / W), c = k % W, b = m.cells[k];
      if ((b & 1) && (r === 0 || !(m.cells[k - W] & 4))) bad('maze stěna nahoře');
      if ((b & 8) && (c === 0 || !(m.cells[k - 1] & 2))) bad('maze stěna vlevo');
      if (b & 2) { edges++; if (c === W - 1 || !(m.cells[k + 1] & 8)) bad('maze stěna vpravo'); }
      if (b & 4) { edges++; if (r === H - 1 || !(m.cells[k + W] & 1)) bad('maze stěna dole'); } }
    if (edges !== W * H - 1) bad('maze není strom');
    const ds = L.mazeBFS(W, H, m.cells, m.entry);
    if (ds.some(x => x < 0)) bad('maze nedosažitelné');
    const nk = lv >= 7 ? 3 : lv >= 5 ? 2 : lv >= 3 ? 1 : 0;
    if (m.keys.length !== nk || new Set(m.keys).size !== nk || m.keys.some(k => k === m.entry || k === m.goal)) bad(`maze klíče ${lv}: ${m.keys}`);
    // nejkratší cesta přes všechny klíče, nezávisle spočítaná
    let best = Infinity;
    for (const pr of perms(m.keys)) { let at = m.entry, len = 0; for (const k of [...pr, m.goal]) { len += L.mazeBFS(W, H, m.cells, at)[k]; at = k; } best = Math.min(best, len); }
    if (best !== m.shortest) bad(`maze nejkratší ${best} != ${m.shortest}`);
    if (lv < 4 && (m.entry !== 0 || m.goal !== W * H - 1)) bad('maze start/cíl');
    if (m.entry === m.goal) bad('maze start = cíl');
    if ((lv >= 9) !== (m.fog > 0)) bad('maze mlha');
    if (lv >= 9 && m.fog < 1) bad('maze mlha poloměr');
  }
  // obtížnost: od úrovně 5 výrazně víc slepých uliček než na úrovni 1
  const deadEnds = m => m.cells.filter(b => [1, 2, 4, 8].filter(x => b & x).length === 1).length;
  let d1 = 0, d6 = 0;
  for (let i = 0; i < 60; i++) { d1 += deadEnds(L.GEN.maze(1, 'skolak', { size: 'L' })); d6 += deadEnds(L.GEN.maze(6, 'skolak', { size: 'L' })); }
  if (d6 < d1 * 1.8) bad(`maze odbočky ${d1 / 60} → ${d6 / 60}`);
  console.log(`bludiště L: slepých uliček průměrně úroveň 1 = ${(d1 / 60).toFixed(1)}, úroveň 6 = ${(d6 / 60).toFixed(1)}`);
  chk(L.GEN.maze(1, 'predskolak').W, 8, 'Rostík: malé bludiště');
  chk(L.GEN.maze(1, 'skolak').W, 12, 'Marianka: střední bludiště');

  // ---- sudoku: úrovně 6–15 ----
  for (const lv of [6, 7, 8, 9, 10, 12, 15]) for (let i = 0; i < 150; i++) {
    const t = L.GEN.sudoku(lv); texts(t, 'sudoku' + lv);
    const N = t.N; if (N !== (lv <= 7 ? 6 : 9)) bad('sudoku velikost ' + lv);
    if (t.opts.length !== 4 || !t.opts.includes(t.ans)) bad('sudoku nabídka');
    const inU = (r, c) => r === t.tr || c === t.tc || (Math.floor(r / t.br) === Math.floor(t.tr / t.br) && Math.floor(c / t.bc) === Math.floor(t.tc / t.bc));
    const seen = new Set(); for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (inU(r, c) && t.grid[r][c]) seen.add(t.grid[r][c]);
    if (seen.has(t.ans) || seen.size !== N - 1) bad('sudoku jednoznačnost');
    if (new Set(t.grid[t.tr].filter(Boolean)).size === N - 1) bad('sudoku stačí řádek');
    for (let r = 0; r < N; r++) { const row = t.grid[r].filter(Boolean), col = t.grid.map(x => x[r]).filter(Boolean);
      if (new Set(row).size !== row.length || new Set(col).size !== col.length) bad('sudoku duplicita'); }
    const blanks = t.grid.flat().filter(x => x === null).length;
    if (lv >= 8 && blanks < 20) bad('sudoku 9×9 málo prázdných ' + blanks);
  }

  // ---- paměť a pozornost školáka bez stropu ----
  for (const op of ['m_gone', 'm_pairs', 'm_simon', 'a_find', 'a_diff', 'a_same']) for (const lv of [6, 10, 20, 60, 99]) for (let i = 0; i < 100; i++) {
    const t = L.GEN[op](lv, 'skolak'); texts(t, op + lv);
    if (op === 'm_gone' && (t.items.length > 14 || new Set(t.items).size !== t.items.length || !t.opts.includes(t.ans) || t.opts.length !== 4 || t.showMs < 3500)) bad('m_gone ' + lv);
    if (op === 'm_pairs') { const cnt = {}; t.cards.forEach(c => cnt[c] = (cnt[c] || 0) + 1); if (Object.values(cnt).some(v => v !== 2) || t.pairs > 24) bad('m_pairs ' + lv); }
    if (op === 'm_simon' && (t.seq.length > 14 || t.seq.some(x => x >= t.pads))) bad('m_simon ' + lv);
    if (op === 'a_find' && (t.cells.length > 48 || t.cells.filter(c => c === t.ans).length !== t.count)) bad('a_find ' + lv);
    if (op === 'a_diff' && (t.left.filter((v, k) => v !== t.right[k]).length !== 1 || new Set(t.left).size !== t.left.length)) bad('a_diff ' + lv);
    if (op === 'a_same' && (t.opts.filter(o => o === t.sample).length !== 1 || new Set(t.opts).size !== t.opts.length || t.opts.length !== 4)) bad('a_same ' + lv);
  }
  const g = lv => L.GEN.m_simon(lv, 'skolak').seq.length;
  if (!(g(6) > g(5) && g(10) > g(6))) bad('zopakuj neroste');

  // ---- váhy: otázka se nikdy neshoduje se zadanou váhou ----
  const key = side => side.map(([e, c]) => e + c).sort().join();
  for (const lv of [1, 2, 3, 4, 5]) for (let i = 0; i < 3000; i++) {
    const s = L.GEN.scales(lv);
    if (s.eqs.some(([Lft]) => key(Lft) === key(s.q))) bad(`váhy opakují zadání ${lv}: ${JSON.stringify(s.q)}`);
    const W = L.scaleWeights(s.eqs), qv = s.q.reduce((a, [e, c]) => a + W[e] * c, 0);
    if (qv !== s.ans || s.ans < 2 || s.ans > 30) bad(`váhy ${lv} ${JSON.stringify(s)}`);
    if (!s.opts.includes(s.ans) || new Set(s.opts).size !== s.opts.length) bad('váhy nabídka');
  }

  // ---- úrovně bez stropu ----
  chk([L.isDyn('maze', 'predskolak'), L.isDyn('sudoku', 'skolak'), L.isDyn('sudoku', 'predskolak'), L.isDyn('m_simon', 'predskolak'), L.isDyn('add', 'skolak')], [true, true, false, false, false], 'isDyn');
  const st = L.freshState(); st.profile = 'skolak';
  for (let i = 0; i < 60; i++) L.adapt(st, 'maze', true, 4, 2);
  chk(st.levels.maze, 16, 'bludiště roste dál (60 / 4 + 1)');
  const pr = L.freshState(); pr.profile = 'predskolak';
  for (let i = 0; i < 30; i++) L.adapt(pr, 'maze', true, 3, 2);
  chk(pr.levels.maze, 11, 'Rostíkovo bludiště také bez stropu');
  chk(L.PROFILES.predskolak.kinds.includes('maze'), true, 'Rostík má bludiště');

  // ---- migrace v6 → v7 ----
  const v6 = { ver: 6, profile: 'skolak', lang: 'cs', stars: 1200, stickers: ['🐨'], rounds: 120, levels: { maze: 5, sudoku: 5, add: 5, m_simon: 5 } };
  const m7 = L.migrate(JSON.parse(JSON.stringify(v6)));
  chk([m7.ver, m7.stars, m7.levels.maze, m7.levels.sudoku, m7.levels.add, m7.mazeSize], [L.STATE_VER, 1200, 5, 5, 5, 'M'], 'v6 → v7');
  chk(L.migrate({ ...m7, levels: { ...m7.levels, maze: 23 } }).levels.maze, 23, 'úroveň 23 zůstane');
  chk(L.migrate({ ...m7, mazeSize: 'XL' }).mazeSize, 'XL', 'velikost bludiště');
  chk(L.migrate({ ...m7, mazeSize: 'ZZ' }).mazeSize, 'M', 'neplatná velikost');
  chk(L.migrate({ ver: 6, profile: 'predskolak', stars: 1, stickers: [], rounds: 1 }).mazeSize, 'S', 'Rostík malé');
  chk(L.migrate(m7), m7, 'v7 idempotentní');
  chk(L.VER[0], 8, 'verze 8'); chk(L.VER[1], '🐍', 'had');

  // ---- vyhrazená pole: UI používá task.start / repeat / play jako funkce ----
  for (const op of L.KINDS) for (const prof of ['skolak', 'predskolak']) for (const lv of [1, 4, 9]) {
    const t = L.GEN[op](Math.min(lv, L.maxLv(op, prof)), prof, { size: 'M' });
    for (const k of ['start', 'repeat', 'play', 'hidden', 'useShort']) if (t[k] !== undefined) bad(`${op}: generátor nastavuje vyhrazené pole ${k}`);
  }
};
