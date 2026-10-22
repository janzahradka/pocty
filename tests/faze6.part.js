// Fáze 6: úrovně 4–5, logika (bludiště, sudoku, váhy), maximum úrovní, migrace v6. Volá se z tests/gen.test.js.
module.exports = function (L, bad, chk) {
  const N = 3000, CZ = /[áčďéěíňóřšťúůýž]/i, BADTXT = /undefined|NaN|null|\[object|  /;
  const nums = (t, op) => { if (t.opts.some(v => !Number.isInteger(v) || v < 0)) bad(`${op} nabídka ${t.opts}`); };
  const choice = (t, op) => {
    if (new Set(t.opts).size !== t.opts.length || !t.opts.includes(t.ans) || t.opts.length < 3 || t.opts.length > 4) bad(`${op} nabídka ${JSON.stringify(t.opts)} / ${t.ans}`);
  };
  const texts = (t, op) => {
    for (const lang of L.LANGS) {
      const x = L.texts(t, lang);
      for (const k of ['full', 'short', 'ok', 'okShort', 'reveal']) { const v = x[k]; if (v === undefined) continue;
        if (BADTXT.test(v)) bad(`${op} ${lang}.${k}: ${v}`); if (lang === 'en' && CZ.test(v)) bad(`${op} čeština v en: ${v}`); }
      if (!x.full || x.short.length > x.full.length) bad(`${op} ${lang} zadání`);
    }
  };
  const ex = {};
  // ---- počty a ostatní typy školáka, úrovně 4 a 5 ----
  for (const op of L.SCHOOL_KINDS) for (const lv of [4, 5]) for (let i = 0; i < N; i++) {
    const t = L.GEN[op](lv, 'skolak'); texts(t, op + lv);
    if (!t.interactive) choice(t, op + lv);
    if (t.optType === 'num') nums(t, op + lv);
    if (L.OPS.includes(op)) {
      if (![t.a, t.b, t.r].every(v => Number.isInteger(v) && v >= 0)) bad(`${op}${lv} ${JSON.stringify(t)}`);
      if (Math.max(t.a, t.b, t.r) > 100) bad(`${op}${lv} nad 100 ${t.a} ${t.b}`);
      if (op === 'sub' && t.r < 1) bad('sub nula');
      if (op === 'add' && lv === 4 && t.a % 10 && t.b % 10 && (t.a % 10) + (t.b % 10) < 10) bad(`add4 bez přechodu ${t.a}+${t.b}`);
      if (op === 'add' && lv === 5 && (t.a < 11 || t.b < 11)) bad('add5 jednociferné');
      if (op === 'sub' && lv === 4 && t.b % 10 && (t.a % 10) >= t.b) bad(`sub4 bez přechodu ${t.a}-${t.b}`);
      if (op === 'mul' && lv === 4 && (t.a > 5 || t.b > 10)) bad('mul4 rozsah');
      if (op === 'div' && (t.a % t.b || t.b > 10 || t.r > 10)) bad('div rozsah');
    }
    if (op === 'cmp') {
      const val = e => e.op === 'add' ? e.x + e.y : e.x - e.y;
      if (t.ex && val(t.ex) !== t.a) bad('cmp výraz vlevo'); if (t.exR && val(t.exR) !== t.b) bad('cmp výraz vpravo');
      if (t.ans !== (t.a < t.b ? '<' : t.a > t.b ? '>' : '=')) bad('cmp znaménko');
      if (Math.max(t.a, t.b, t.ex ? t.ex.x : 0, t.exR ? t.exR.x : 0) > 100 || Math.min(t.a, t.b) < 0) bad(`cmp rozsah ${JSON.stringify(t)}`);
      if ([t.ex, t.exR].some(e => e && (e.y < 1 || e.x < 1))) bad('cmp operand');
    }
    if (op === 'shape') {
      if (lv === 4 && t.scene.filter(k => k === t.kind).length !== t.ans) bad('shape4 počet');
      if (lv === 5) { const p = L.SHAPE_PROPS.find(([k, pk]) => k === t.kind && pk === t.prop); if (!p || p[2] !== t.ans) bad('shape5 vlastnost'); }
    }
    if (op === 'pos') {
      const items = t.scene.items.map(x => x.e), Nn = t.scene.n;
      if (Nn !== 4 || items.length !== 16 || new Set(items).size !== 16) bad('pos4 mřížka');
      const ia = items.indexOf(t.ans), ra = Math.floor(ia / 4), ca = ia % 4;
      const m = t.speech.match(/^Co je (hned |o dvě políčka )?(vlevo|vpravo|nad|pod) (od )?(.+)\?$/);
      if (m) {
        const ref = L.PITEMS.find(x => x.g === m[4] || x.i === m[4]), ir = items.indexOf(ref.e), k = m[1] === 'o dvě políčka ' ? 2 : 1;
        if (lv === 5 && k !== 2) bad('pos5 bez dvou políček');
        const dd = { vlevo: [0, -1], vpravo: [0, 1], nad: [-1, 0], pod: [1, 0] }[m[2]];
        if (ra !== Math.floor(ir / 4) + dd[0] * k || ca !== ir % 4 + dd[1] * k) bad('pos4 poloha ' + t.speech);
      } else { const m2 = t.speech.match(/^Co je (nahoře|dole) (vlevo|vpravo)\?$/); if (!m2 || ra !== (m2[1] === 'dole' ? 3 : 0) || ca !== (m2[2] === 'vpravo' ? 3 : 0)) bad('pos4 roh ' + t.speech); }
    }
    if (op === 'seq') {
      if (t.items[t.qi] !== t.ans) bad('seq odpověď');
      const d = t.items.slice(1).map((v, k) => v - t.items[k]);
      if (t.grow ? !d.every((x, k) => k === 0 || x === d[k - 1] + 1) : !d.every(x => x === t.step)) bad('seq krok ' + t.items);
      if (Math.min(...t.items) < 0 || Math.max(...t.items) > 100) bad('seq rozsah');
    }
    if (op === 'clock') {
      const want = lv === 5 ? L.tkey(...L.addMin(t.h, t.m, t.shift)) : L.tkey(t.h, t.m);
      if (t.ans !== want) bad(`clock klíč ${t.ans} != ${want}`);
      if (lv === 4 && t.m === 15 && !t.okSay.includes('čtvrt na')) bad('clock čtvrt ' + t.okSay);
      if (lv === 4 && t.m === 45 && !t.okSay.includes('tři čtvrtě na')) bad('clock tři čtvrtě');
      if (t.opts.some(o => !/^\d{1,2}:\d\d$/.test(o) || +o.split(':')[0] < 1 || +o.split(':')[0] > 12)) bad('clock formát ' + t.opts);
    }
    if (op === 'money') {
      const S = a => a.reduce((x, y) => x + y, 0);
      if (t.coins && (S(t.coins) !== t.ans || t.ans > 100)) bad('money součet');
      if (t.pay) { if (t.opts.map(k => S(k.split('+').map(Number))).filter(x => x === t.price).length !== 1) bad('money platba'); if (t.ans.split('+').length > 5) bad('money mincí'); }
      if (t.change && (t.ans !== t.have - t.price || t.ans < 1)) bad('money vrácení');
      if (t.goods && S(t.goods.map(g => g.price)) !== t.price) bad('money zboží');
    }
    if (op === 'sym') {
      const half = L.hparse(t.half);
      if (JSON.stringify(L.hparse(t.ans)) !== JSON.stringify(t.axis === 'v' ? L.mirV(half) : L.mirH(half))) bad('sym zrcadlo');
      if (t.opts.length !== 4) bad('sym nabídka');
    }
    if (i === 0) ex[op + lv] = L.texts(t, 'cs').full + '  →  ' + (L.texts(t, 'cs').ok || '');
  }
  for (const k of Object.keys(ex)) console.log(`${k.padEnd(8)} ${ex[k]}`);

  // ---- logika ----
  for (const lv of [1, 2, 3, 4, 5]) {
    for (let i = 0; i < 400; i++) {
      // bludiště: testuje se podrobně ve faze7.part.js (tvar se ve fázi 7 změnil)
      const m = L.GEN.maze(lv); texts(m, 'maze' + lv);
    }
    for (let i = 0; i < 1500; i++) {
      // sudoku: řešení platné, viditelné hodnoty odpovídají, cíl jednoznačně odvoditelný, obtížnost podle úrovně
      const t = L.GEN.sudoku(lv); texts(t, 'sudoku' + lv); choice(t, 'sudoku' + lv);
      const Nn = t.N; if (Nn !== (lv === 5 ? 6 : 4)) bad('sudoku velikost');   // fáze 7: 6 × 6 od úrovně 5
      const syms = new Set(t.grid.flat().filter(Boolean).concat([t.ans]));
      if (syms.size > Nn) bad('sudoku symboly');
      if (t.grid[t.tr][t.tc] !== null) bad('sudoku cíl viditelný');
      const unit = (r, c) => [...Array(Nn).keys()].flatMap(k => [[t.tr, k], [k, t.tc]]).concat([...Array(Nn * Nn).keys()].map(k => [Math.floor(k / Nn), k % Nn]).filter(([r, c]) => Math.floor(r / t.br) === Math.floor(t.tr / t.br) && Math.floor(c / t.bc) === Math.floor(t.tc / t.bc)));
      const seen = new Set(unit().map(([r, c]) => t.grid[r][c]).filter(Boolean));
      if (seen.has(t.ans)) bad('sudoku odpověď už v řádku/sloupci/čtverci');
      if (seen.size !== Nn - 1) bad('sudoku není jednoznačné');
      for (let r = 0; r < Nn; r++) { const row = t.grid[r].filter(Boolean), col = t.grid.map(x => x[r]).filter(Boolean);
        if (new Set(row).size !== row.length || new Set(col).size !== col.length) bad('sudoku duplicita'); }
      const rowOnly = new Set(t.grid[t.tr].filter(Boolean));
      if (lv === 1 && rowOnly.size !== Nn - 1) bad('sudoku1 nestačí řádek');
      if (lv >= 3 && rowOnly.size === Nn - 1) bad('sudoku3+ stačí řádek');
      // váhy: odpověď sedí s rovnicemi
      const s = L.GEN.scales(lv); texts(s, 'scales' + lv); choice(s, 'scales' + lv); nums(s, 'scales');
      const W = L.scaleWeights(s.eqs);
      const qv = s.q.reduce((a, [e, c]) => a + (W[e] === undefined ? NaN : W[e] * c), 0);
      if (qv !== s.ans || s.ans < 1 || s.ans > 20) bad(`scales ${JSON.stringify(s)} → ${qv}`);
      for (const [Lft, Rgt] of s.eqs) if (Lft.reduce((a, [e, c]) => a + W[e] * c, 0) !== Rgt.reduce((a, [e, c]) => a + W[e] * c, 0)) bad('scales rovnováha');
    }
    console.log(`logika L${lv}: ${L.texts(L.GEN.sudoku(lv), 'cs').full} | ${L.texts(L.GEN.scales(lv), 'en').full} | ${L.texts(L.GEN.maze(lv), 'cs').short}`);
  }

  // ---- paměť a pozornost školáka na úrovních 4–5 ----
  for (const op of L.BRAIN) for (const lv of [4, 5]) for (let i = 0; i < 500; i++) {
    const t = L.GEN[op](lv, 'skolak'); texts(t, op + lv);
    if (t.d !== lv + 2) bad(op + ' d');
    if (op === 'a_diff' && t.left.filter((v, k) => v !== t.right[k]).length !== 1) bad('a_diff');
    if (op === 'a_diff' && new Set(t.left).size !== t.left.length) bad('a_diff duplicita');
    if (op === 'm_pairs' && t.cards.length !== 2 * [12, 14][lv - 4]) bad('m_pairs');
    if (op === 'a_find' && t.cells.filter(c => c === t.ans).length !== t.count) bad('a_find');
    if (op === 'm_gone' && (t.items.length !== [9, 10][lv - 4] || !t.opts.includes(t.ans))) bad('m_gone');
  }

  // ---- maximum úrovní a postup ----
  chk([L.maxLv('add', 'skolak'), L.maxLv('maze', 'skolak'), L.maxLv('m_gone', 'skolak'), L.maxLv('m_gone', 'predskolak'), L.maxLv('p_count', 'predskolak')], [5, L.DYN_MAX, L.DYN_MAX, 3, 3], 'maxLv (fáze 7: bludiště a paměť školáka bez stropu)');
  const st = L.freshState(); st.profile = 'skolak';
  for (let i = 0; i < 40; i++) L.adapt(st, 'clock', true, 4, 2);
  chk(st.levels.clock, 5, 'školák až na úroveň 5');
  const pr = L.freshState(); pr.profile = 'predskolak';
  for (let i = 0; i < 40; i++) { L.adapt(pr, 'p_color', true, 3, 2); L.adapt(pr, 'm_simon', true, 3, 2); }
  chk([pr.levels.p_color, pr.levels.m_simon], [3, 3], 'předškolák nejvýš 3');
  chk(L.nextOp('mix', null, 'skolak', st) !== 'maze', true, 'bludiště není v mixu');
  for (let i = 0; i < 3000; i++) if (L.nextOp('mix', null, 'skolak', st) === 'maze') { bad('bludiště v mixu'); break; }
  chk(L.KIND_ROUND.maze, 5, 'kolo bludiště');

  // ---- migrace v5 → v6 ----
  const v5 = { ver: 5, profile: 'skolak', lang: 'en', stars: 700, stickers: ['🐨', '🦉'], rounds: 80,
    levels: { add: 3, sub: 3, mul: 3, div: 2, clock: 3, m_gone: 3, p_color: 2 }, adapt: { add: { up: 3, down: 0 } } };
  const m6 = L.migrate(JSON.parse(JSON.stringify(v5)));
  chk([m6.ver, m6.profile, m6.lang, m6.stars, m6.rounds, m6.stickers], [L.STATE_VER, 'skolak', 'en', 700, 80, v5.stickers], 'v5 → v6');
  chk([m6.levels.add, m6.levels.div, m6.levels.clock, m6.levels.maze, m6.levels.sudoku, m6.levels.scales], [3, 2, 3, 1, 1, 1], 'v6 úrovně');
  chk(m6.adapt.add, { up: 3, down: 0 }, 'v6 adapt');
  chk(L.migrate(m6), m6, 'v6 idempotentní');
  chk(L.migrate({ ...m6, levels: { ...m6.levels, add: 5, maze: 4 } }).levels.add, 5, 'úroveň 5 zůstane');
  chk(L.migrate({ ...m6, levels: { ...m6.levels, add: 9 } }).levels.add, 5, 'úroveň nad maximem se omezí');
  chk(L.migrate({ ...m6, levels: { ...m6.levels, add: 150 } }).levels.add, 1, 'neplatná úroveň');
  chk(L.migrate({ ver: 6, profile: 'predskolak', stars: 1, stickers: [], rounds: 1, levels: { p_color: 5, m_gone: 5 } }).levels.p_color, 3, 'předškolák omezen na 3');
  chk(L.decodeBackup(L.encodeBackup({ ...m6, levels: { ...m6.levels, sudoku: 4 } })).levels.sudoku, 4, 'záloha s úrovní 4');

  // ---- verze (loďka) ----
  const vnum = L.VERSIONS.map(v => v[0]);
  if (vnum.some((v, i) => i && v <= vnum[i - 1])) bad('čísla verzí nerostou');
  if (L.VERSIONS.some(v => v.length !== 7 || !v[1] || /[áčďéěíňóřšťúůýž]/i.test(v[4]))) bad('záznam verze');
  chk(L.VER, L.VERSIONS[L.VERSIONS.length - 1], 'aktuální verze');
};
