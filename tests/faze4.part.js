// Fáze 4: profil předškoláka, úlohy předškoláka, paměť a pozornost, migrace na verzi 4.
// Volá se z tests/gen.test.js.
module.exports = function (L, bad, chk) {
  const N = 4000;
  const txt = (t, op) => { for (const k of ['speech', 'okSay', 'revealSay', 'intro']) if (t[k] !== undefined && /undefined|NaN|null|\[object|  /.test(t[k])) bad(`${op} ${k}: ${t[k]}`); };
  const choice = (t, op, n) => {
    if (t.opts.length !== n) bad(`${op} počet možností ${t.opts.length} != ${n}`);
    if (new Set(t.opts).size !== t.opts.length) bad(`${op} duplicitní možnosti ${t.opts}`);
    if (!t.opts.includes(t.ans)) bad(`${op} chybí správná odpověď ${JSON.stringify(t)}`);
  };

  // ---- seznamy typů ----
  if (new Set(L.KINDS).size !== L.KINDS.length) bad('KINDS duplicita');
  for (const k of L.KINDS) if (typeof L.GEN[k] !== 'function') bad('chybí generátor ' + k);
  chk(L.KINDS.slice(0, 11), ['add','sub','mul','div','cmp','shape','pos','seq','clock','money','sym'], 'pořadí typů v1–v3');

  // ---- předškolák ----
  const PRE_N = { p_odd: [3, 4, 4] };
  for (const op of L.PRE_KINDS) for (const lv of [1, 2, 3]) {
    const seen = new Set();
    for (let i = 0; i < N; i++) {
      const t = L.GEN[op](lv, 'predskolak');
      choice(t, `${op}${lv}`, (PRE_N[op] || [2, 3, 3])[lv - 1]);
      txt(t, op + lv); seen.add(t.speech + t.opts);
      if (op === 'p_count' || op === 'p_digit') {
        const max = [3, 5, op === 'p_count' ? 6 : 9][lv - 1];
        if (t.ans < 1 || t.ans > max || t.opts.some(v => v < 1 || v > max)) bad(`${op}${lv} rozsah ${t.opts}`);
        if (t.opts.join() !== t.opts.slice().sort((a, b) => a - b).join()) bad(`${op} neseřazeno`);
      }
      if (op === 'p_color' && lv < 3 && lv === 1 && t.opts.some(k => !['cervena','modra','zluta','zelena'].includes(k))) bad('p_color1 mimo základní barvy');
      if (op === 'p_color' && lv === 3) {
        const [o, c] = t.ans.split(':');
        if (t.opts.filter(v => v === `${o}:${c}`).length !== 1) bad('p_color3 nejednoznačné');
        if (t.opts.filter(v => v.split(':')[0] === o || v.split(':')[1] === c).length !== 3) bad('p_color3 rozptylující nemají společný znak ' + t.opts);
        if (!/^Najdi (\S+)(ý|ou|é) /.test(t.speech)) bad('p_color3 tvar ' + t.speech);
      }
      if (op === 'p_shape' && !Object.keys(L.PSHAPES).includes(t.ans)) bad('p_shape cíl');
      if (op === 'p_shape' && lv === 1 && t.opts.some(k => !['kruh','ctverec','trojuhelnik'].includes(k))) bad('p_shape1 rozsah');
      if (op === 'p_size') {
        if (!['S', 'L'].includes(t.ans)) bad('p_size odpověď');
        if (/(větší|největší|delší|vyšší|nejdelší|nejvyšší)/.test(t.speech) !== (t.ans === 'L')) bad('p_size význam ' + t.speech + ' ' + t.ans);
      }
      if (op === 'p_pos') {
        const items = t.scene.items.map(x => x.e);
        if (!items.includes(t.ans) || t.opts.some(o => !items.includes(o))) bad('p_pos nabídka mimo scénu');
        if (t.scene.type === 'col') chk(items[{ 'Co je nahoře?': 0, 'Co je dole?': 1 }[t.speech]], t.ans, 'p_pos sloupec');
        if (t.scene.type === 'row') chk(items[{ 'Co je vlevo?': 0, 'Co je vpravo?': 2 }[t.speech]], t.ans, 'p_pos řada');
        if (t.scene.type === 'table') chk(items[{ 'Co je na stole?': 0, 'Co je pod stolem?': 1, 'Co je vedle stolu?': 2 }[t.speech]], t.ans, 'p_pos stůl');
      }
      if (op === 'p_seq') {
        if (t.items[t.qi] !== t.ans) bad('p_seq odpověď');
        const per = [1, 2, 3].find(p => t.items.every((v, i) => i < p || v === t.items[i - p]));
        if (!per || t.qi < per) bad('p_seq vzor ' + t.items.join(''));
        if (lv < 3 && t.qi !== t.items.length - 1) bad('p_seq otazník není na konci');
      }
      if (op === 'p_odd') {
        const maj = L.ODD[t.maj].e, inMaj = t.opts.filter(e => maj.includes(e));
        if (inMaj.length !== t.opts.length - 1 || maj.includes(t.ans)) bad(`p_odd ${t.opts} (${t.maj})`);
        if (!L.ODD[t.odd].e.includes(t.ans)) bad('p_odd vetřelec z jiné kategorie');
        if (lv === 1 && !['zvirata', 'doprava'].includes(t.maj)) bad('p_odd1 kategorie');
      }
      if (op === 'p_pair') {
        if (t.kind === 'sound') { const a = L.SOUNDS.find(x => x.e === t.ans); if (!t.speech.includes(a.s)) bad('p_pair zvuk'); }
        if (t.kind === 'food') { const a = L.FOOD.find(x => x.e === t.sample); if (a.f !== t.ans) bad('p_pair jídlo'); }
        if ((t.kind === 'same' || t.kind === 'shadow') && t.sample !== t.ans) bad('p_pair stejný');
        const sounds = t.kind === 'sound' ? t.opts.map(e => L.SOUNDS.find(x => x.e === e).s) : [];
        if (new Set(sounds).size !== sounds.length) bad('p_pair stejné zvuky');
      }
    }
    if (seen.size < 6) bad(`${op}${lv} málo různých úloh: ${seen.size}`);
    const e = L.GEN[op](lv, 'predskolak');
    console.log(`${op} L${lv}: ${String(seen.size).padStart(4)} různých | ${e.speech}  →  ${e.okSay}`);
  }

  // ---- paměť a pozornost (oba profily) ----
  for (const prof of ['predskolak', 'skolak']) for (const op of L.BRAIN) for (const lv of [1, 2, 3]) {
    const d = L.dOf(lv, prof);
    if (d < 1 || d > 5) bad('d mimo rozsah');
    for (let i = 0; i < N / 2; i++) {
      const t = L.GEN[op](lv, prof); txt(t, op + lv);
      if (t.d !== d) bad(`${op} d`);
      if (op === 'm_gone') {
        choice(t, op, [2, 3, 3, 4, 4][d - 1]);
        if (t.items.length !== [3, 4, 5, 6, 8][d - 1] || new Set(t.items).size !== t.items.length) bad('m_gone scéna');
        if (t.items[t.gi] !== t.ans) bad('m_gone odpověď');
        const visible = t.opts.filter(o => o !== t.ans && t.items.includes(o));
        if (visible.length !== (d >= 3 ? 1 : 0)) bad('m_gone viditelné možnosti ' + visible);
        if (!/^(Ano, )?zmizel[ao]? /i.test(t.okSay.replace('Ano, ', ''))) bad('m_gone text ' + t.okSay);
      }
      if (op === 'm_pairs') {
        if (t.cards.length !== 2 * t.pairs || t.pairs !== [3, 4, 6, 8, 10][d - 1]) bad('m_pairs počet');
        const cnt = {}; for (const c of t.cards) cnt[c] = (cnt[c] || 0) + 1;
        if (Object.values(cnt).some(v => v !== 2)) bad('m_pairs dvojice');
      }
      if (op === 'm_simon') {
        if (t.seq.length !== [2, 3, 3, 4, 5][d - 1] || t.seq.some(x => x < 0 || x >= t.pads) || t.pads > L.SIMON.length) bad('m_simon ' + t.seq);
        if (t.seq.some((x, i) => i >= 2 && x === t.seq[i - 1] && x === t.seq[i - 2])) bad('m_simon 3× stejně');
      }
      if (op === 'a_find') {
        if (t.cells.length !== [6, 9, 12, 16, 20][d - 1]) bad('a_find velikost');
        if (t.cells.filter(c => c === t.ans).length !== t.count) bad('a_find počet cílů');
        if (d >= 3 && t.cells.some(c => c !== t.ans && !t.item.look.includes(c))) bad('a_find podobné');
      }
      if (op === 'a_diff') {
        const n = t.cols * t.rows;
        if (t.left.length !== n || t.right.length !== n) bad('a_diff velikost');
        const diffs = t.left.map((v, k) => v !== t.right[k] ? k : -1).filter(k => k >= 0);
        if (diffs.length !== 1 || diffs[0] !== t.di) bad('a_diff rozdíly ' + diffs);
        if (t.right[t.di] !== '' && t.left.includes(t.right[t.di])) bad('a_diff nový obrázek je i jinde');
        if (new Set(t.left).size !== n) bad('a_diff duplicita');
      }
      if (op === 'a_same') {
        choice(t, op, [2, 3, 3, 4, 4][d - 1]);
        if (t.opts.filter(o => o === t.sample).length !== 1) bad('a_same');
        if (t.sample.split(',').length !== [2, 2, 3, 3, 4][d - 1]) bad('a_same délka');
      }
    }
    const e = L.GEN[op](lv, prof);
    console.log(`${prof.padEnd(10)} ${op} L${lv} (d${d}): ${e.speech}${e.okSay ? '  →  ' + e.okSay : ''}`);
  }

  // ---- čeština ----
  chk(L.w(1, 'n'), 'jedno'); chk(L.w(2, 'n'), 'dvě'); chk(L.w(1), 'jedna'); chk(L.w(2), 'dva');
  const jab = L.KITEMS[0], bal = L.KITEMS[4];
  chk([1, 2, 5].map(n => L.kCount(n, jab)), ['jedno jablíčko', 'dvě jablíčka', 'pět jablíček']);
  chk([1, 3, 6].map(n => L.kCount(n, bal)), ['jeden balónek', 'tři balónky', 'šest balónků']);

  // ---- mix podle profilu ----
  const st0 = L.freshState();
  for (let i = 0; i < 5000; i++) {
    const a = L.nextOp('mix', null, 'skolak', st0), b = L.nextOp('mix', null, 'predskolak', st0);
    if (!(L.SCHOOL_KINDS.includes(a) || L.BRAIN_MIX.includes(a) || (L.LOGIC || []).includes(a))) bad('mix školák ' + a);
    if (!(L.PRE_KINDS.includes(b) || L.BRAIN_MIX.includes(b))) bad('mix předškolák ' + b);
    if (b === 'p_digit') bad('číslice v mixu před odemčením');
    if (a === 'm_pairs' || b === 'm_pairs') bad('pexeso v mixu');
  }
  const st1 = L.freshState(); st1.levels.p_count = 3; chk(L.digitOpen(st1), true, 'číslice odemčené');
  chk(L.nextOp('p_size', null, 'predskolak'), 'p_size', 'režim jednoho typu');
  // adaptace předškoláka: 3× napoprvé nahoru, odemčení číslic zůstane i po poklesu
  const st2 = L.freshState();
  for (let i = 0; i < 3; i++) L.adapt(st2, 'p_count', true, 3, 2);
  chk([st2.levels.p_count, st2.digitOpen], [2, true], 'adapt předškolák');
  L.adapt(st2, 'p_count', false, 3, 2); L.adapt(st2, 'p_count', false, 3, 2);
  chk([st2.levels.p_count, L.digitOpen(st2)], [1, true], 'číslice zůstanou odemčené');

  // ---- migrace na verzi 4 a profil ----
  const v3 = { ver: 3, stars: 412, stickers: ['🐨', '🦉', '🐝', '🦁', '🦖', '🌈'], rounds: 44,
    levels: { add: 3, sub: 3, mul: 3, div: 3, cmp: 3, shape: 3, pos: 3, seq: 3, clock: 2, money: 3, sym: 1 },
    adapt: { add: { up: 1, down: 0 }, clock: { up: 2, down: 0 } } };
  const m3 = L.migrate(JSON.parse(JSON.stringify(v3)));
  chk([m3.ver, m3.profile, m3.stars, m3.rounds, m3.stickers], [L.STATE_VER, 'skolak', 412, 44, v3.stickers], 'v3 → v4 úspěchy a profil');
  chk(L.SCHOOL_KINDS.map(k => m3.levels[k]), [3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 1], 'v3 → v4 úrovně');
  chk([...L.PRE_KINDS, ...L.BRAIN].every(k => m3.levels[k] === 1), true, 'nové typy na úrovni 1');
  chk(m3.adapt.clock, { up: 2, down: 0 }, 'v3 adapt');
  chk(L.migrate(m3), m3, 'migrace v4 idempotentní');
  chk(L.migrate({ ver: 3, stars: 0, stickers: [], rounds: 0, levels: {} }).profile, null, 'v3 bez postupu → výběr hráče');
  chk(L.migrate({ ver: 3, stars: 0, stickers: ['🐶'], rounds: 0 }).profile, 'skolak', 'samolepka = postup');
  chk(L.freshState().profile, null, 'nové zařízení');
  chk(L.migrate(L.freshState()).profile, null, 'uložený nový stav zůstane bez profilu');
  const pre = L.migrate({ ver: 4, profile: 'predskolak', stars: 0, stickers: [], rounds: 0 });
  chk(pre.profile, 'predskolak', 'předškolák zůstane i bez postupu');
  chk(L.migrate({ ver: 4, profile: 'nesmysl', stars: 5, stickers: [], rounds: 1 }).profile, 'skolak', 'neplatný profil');
  const pre2 = L.migrate({ ...pre, stars: 30, digitOpen: true });
  chk(L.decodeBackup(L.encodeBackup(pre2)), pre2, 'záloha předškoláka tam a zpět');
  chk(L.decodeBackup(L.encodeBackup(v3)).profile, 'skolak', 'záloha z v3 → školák');
};
