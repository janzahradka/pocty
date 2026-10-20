// Test logiky úloh a uloženého stavu: vytáhne <script id="logic"> z index.html.
// Spuštění: node tests/gen.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script id="logic">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} }; vm.runInNewContext(code, { module: mod, Math, Buffer, JSON, unescape, escape, encodeURIComponent, decodeURIComponent });
const L = mod.exports;
let fails = 0; const bad = m => { fails++; if (fails < 25) console.log('FAIL', m); };
const chk = (a, b, m = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m} "${JSON.stringify(a)}" != "${JSON.stringify(b)}"`); };

// ---- počty (beze změny proti verzi 1) ----
const LIM = { add: [10, 20, 18], sub: [10, 19, 18], mul: [12, 20, 30], div: [10, 20, 30] };
for (const op of L.OPS) for (const lv of [1, 2, 3]) for (let i = 0; i < 4000; i++) {
  const t = L.GEN[op](lv);
  if (![t.a, t.b, t.r, t.ans].every(v => Number.isInteger(v) && v >= 0)) bad(`${op}${lv} ${JSON.stringify(t)}`);
  if (Math.max(t.a, t.r) > LIM[op][lv - 1]) bad(`${op}${lv} mimo rozsah ${JSON.stringify(t)}`);
  if (op === 'sub' && t.r < 1) bad(`sub nula ${t.a}-${t.b}`);
  if (op === 'add' && lv === 3 && t.a + t.b <= 10) bad('add3 bez přechodu');
  if (op === 'add' && lv === 2 && t.r > 10 && (t.a % 10) + (t.b % 10) >= 10) bad(`add2 s přechodem ${t.a}+${t.b}`);
  if (op === 'sub' && lv === 3 && (t.a % 10) >= t.b) bad(`sub3 bez přechodu ${t.a}-${t.b}`);
}

// ---- společné vlastnosti všech typů ----
const ex = {};
for (const op of L.KINDS) for (const lv of [1, 2, 3]) {
  const seen = new Set();
  for (let i = 0; i < 4000; i++) {
    const t = L.GEN[op](lv);
    const n = t.opts.length;
    if (n < 3 || n > 4 || new Set(t.opts).size !== n) bad(`${op}${lv} nabídka ${JSON.stringify(t.opts)}`);
    if (!t.opts.includes(t.ans)) bad(`${op}${lv} nabídka bez odpovědi ${JSON.stringify(t)}`);
    if (t.optType === 'num' && t.opts.some(v => !Number.isInteger(v) || v < 0)) bad(`${op}${lv} záporná nabídka ${t.opts}`);
    for (const k of ['speech', 'okSay', 'revealSay']) if (t[k] !== undefined && /undefined|NaN|null|\[object/.test(t[k])) bad(`${op}${lv} ${k}: ${t[k]}`);
    if (!t.speech) bad(`${op}${lv} bez zadání`);
    seen.add(t.speech + '|' + JSON.stringify(t.opts));
    // typově specifické kontroly
    if (op === 'cmp') {
      const v = t.ex ? (t.ex.op === 'add' ? t.ex.x + t.ex.y : t.ex.x - t.ex.y) : t.a;
      if (v !== t.a) bad('cmp výraz');
      if (t.ans !== (t.a < t.b ? '<' : t.a > t.b ? '>' : '=')) bad(`cmp znaménko ${JSON.stringify(t)}`);
      if (Math.max(t.a, t.b) > 20 || Math.min(t.a, t.b) < 0) bad(`cmp rozsah ${t.a} ${t.b}`);
      if (lv === 1 && (t.a < 1 || t.a > 10 || t.b < 1 || t.b > 10)) bad('cmp1 rozsah');
    }
    if (op === 'shape' && t.count) {
      if (t.scene.filter(k => k === t.kind).length !== t.ans) bad('shape počet');
    }
    if (op === 'shape' && !t.count) {
      if (!Object.keys(L.SHAPES).includes(t.ans)) bad('shape cíl');
      if (lv === 1 && !['kruh','ctverec','obdelnik','trojuhelnik'].includes(t.ans)) bad('shape1 mimo 2D');
    }
    if (op === 'pos') {
      const items = t.scene.items.map(x => x.e);
      if (!items.includes(t.ans)) bad('pos odpověď není ve scéně');
      if (new Set(items).size !== items.length) bad('pos duplicita ve scéně');
      if (t.scene.type === 'grid' && items.length !== 9) bad('pos mřížka');
      // ověření pozice v mřížce podle textu otázky
      if (t.scene.type === 'grid') {
        const P = L.PITEMS, ia = items.indexOf(t.ans), ra = Math.floor(ia / 3), ca = ia % 3;
        const m = t.speech.match(/^Co je (hned )?(vlevo|vpravo|nad|pod) (od )?(.+)\?$/);
        if (m) {
          const word = m[4], ref = P.find(x => x.g === word || x.i === word), ir = items.indexOf(ref.e), rr = Math.floor(ir / 3), cr = ir % 3;
          const dd = { vlevo: [0, -1], vpravo: [0, 1], nad: [-1, 0], pod: [1, 0] }[m[2]];
          if (ra !== rr + dd[0] || ca !== cr + dd[1]) bad(`pos mřížka špatně: ${t.speech} ${items.join('')}`);
        } else {
          const m2 = t.speech.match(/^Co je (nahoře|dole) (vlevo|vpravo)\?$/);
          if (!m2) bad('pos text ' + t.speech);
          else if (ra !== (m2[1] === 'dole' ? 2 : 0) || ca !== (m2[2] === 'vpravo' ? 2 : 0)) bad('pos roh ' + t.speech);
        }
      }
      if (t.scene.type === 'row' && lv === 1) {
        const idx = { 'Co je vlevo?': 0, 'Co je uprostřed?': 1, 'Co je vpravo?': 2 }[t.speech];
        if (items[idx] !== t.ans) bad('pos řada ' + t.speech);
      }
      if (t.scene.type === 'col' && lv === 1) {
        const idx = { 'Co je nahoře?': 0, 'Co je uprostřed?': 1, 'Co je dole?': 2 }[t.speech];
        if (items[idx] !== t.ans) bad('pos sloupec ' + t.speech);
      }
    }
    if (op === 'clock') {
      if (t.lv === 1 && (t.ans < 1 || t.ans > 12 || t.opts.some(v => v < 1 || v > 12))) bad('clock rozsah');
      if (t.lv > 1 && t.ans !== L.tkey(t.h, t.m)) bad('clock klíč');
      if (t.m === 30 && !t.okSay.includes('půl')) bad('clock půl ' + t.okSay);
    }
    if (op === 'money') {
      const S = a => a.reduce((x, y) => x + y, 0);
      if (t.coins && S(t.coins) !== t.ans) bad('money součet');
      if (t.coins && lv === 1 && (t.ans > 10 || t.coins.some(c => c > 5))) bad('money1 rozsah');
      if (t.coins && lv === 2 && (t.ans > 20 || t.ans < 6)) bad('money2 rozsah');
      if (t.pay) {
        const sums = t.opts.map(k => S(k.split('+').map(Number)));
        if (sums.filter(x => x === t.price).length !== 1) bad('money platba nejednoznačná ' + t.opts);
        if (S(t.ans.split('+').map(Number)) !== t.price) bad('money platba');
        if (t.ans.split('+').length > 4) bad('money moc mincí');
      }
      if (t.change && t.ans !== t.have - t.price) bad('money vrácení');
    }
    if (op === 'sym') {
      const half = L.hparse(t.half), ans = L.hparse(t.ans);
      const want = JSON.stringify(t.axis === 'v' ? L.mirV(half) : L.mirH(half));
      if (JSON.stringify(ans) !== want) bad('sym zrcadlo');
      if (t.opts.filter(o => o === t.ans).length !== 1) bad('sym duplicita');
      if (t.opts.length !== (lv === 1 ? 3 : 4)) bad('sym počet nabídek');
    }
    if (op === 'seq') {
      if (t.items[t.qi] !== t.ans) bad('seq odpověď');
      if (!t.pattern) {
        const d = t.items[1] - t.items[0];
        if (!t.items.every((v, i) => i === 0 || v - t.items[i - 1] === d)) bad('seq krok');
        if (Math.min(...t.items) < 0 || Math.max(...t.items) > (Math.abs(d) === 10 ? 50 : 20)) bad('seq rozsah ' + t.items);
        if (lv === 2 && Math.abs(d) !== 1) bad('seq2 krok');
      } else {
        // vzor se musí opakovat: obrázek na pozici otazníku jednoznačně plyne z periody
        const per = [...Array(4).keys()].map(k => k + 1).find(p => t.items.every((v, i) => i < p || v === t.items[i - p]));
        if (!per || t.qi < per) bad('seq vzor ' + t.items.join(''));
      }
    }
  }
  const e = L.GEN[op](lv); ex[op + lv] = e.speech + (e.okSay ? '  →  ' + e.okSay : '');
  console.log(`${op} L${lv}: ${String(seen.size).padStart(4)} různých | ${ex[op + lv]}`);
}

// ---- čeština ----
chk(L.w(21), 'dvacet jedna'); chk(L.w(2, 'f'), 'dvě'); chk(L.w(1, 'fa'), 'jednu'); chk(L.w(1, 'm'), 'jeden');
chk(L.speech({ op: 'div', a: 15, b: 5, r: 3, pics: false, missing: 'r' }), 'Kolik je patnáct děleno pěti?');

// ---- adaptace ----
const st = L.freshState();
for (let i = 0; i < 4; i++) L.adapt(st, 'shape', true); chk(st.levels.shape, 2, 'adapt nahoru');
L.adapt(st, 'shape', false); L.adapt(st, 'shape', false); chk(st.levels.shape, 1, 'adapt dolů');

// ---- migrace stavu z verze 1 (skutečný tvar uložený fází 1) ----
const v1 = { stars: 57, stickers: ['🐨', '🦉', '🐝', '🦁'], rounds: 6, levels: { add: 3, sub: 2, mul: 3, div: 1 },
  adapt: { add: { up: 2, down: 0 }, sub: { up: 0, down: 1 }, mul: { up: 1, down: 0 }, div: { up: 0, down: 0 } } };
const m = L.migrate(JSON.parse(JSON.stringify(v1)));
chk(m.stars, 57, 'migrace hvězdy'); chk(m.stickers, v1.stickers, 'migrace samolepky'); chk(m.rounds, 6, 'migrace kola');
chk([m.levels.add, m.levels.sub, m.levels.mul, m.levels.div], [3, 2, 3, 1], 'migrace úrovně');
chk([m.levels.cmp, m.levels.shape, m.levels.pos, m.levels.seq, m.levels.clock, m.levels.money, m.levels.sym], [1, 1, 1, 1, 1, 1, 1], 'nové úrovně');
chk(m.adapt.sub, { up: 0, down: 1 }, 'migrace adapt'); chk(m.ver, 3, 'verze');
chk(L.migrate(m), m, 'migrace je idempotentní');
chk(L.migrate({ stars: 3, stickers: ['🐶'], budouci: { x: 1 } }).budouci, { x: 1 }, 'neznámé položky zůstanou');
chk(L.migrate(null).stars, 0, 'prázdný stav');
// samolepky z verze 1 jsou pořád v seznamu a ve stejném pořadí
const V1_STICKERS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦉','🦄','🐝','🦋','🐌','🐞','🐢','🐙','🦀','🐠','🐬','🐳','🦒','🦓','🦔','🐿️','🦜','🦩','🐘','🦕'];
chk(L.STICKERS.slice(0, 40), V1_STICKERS, 'samolepky v1');
if (new Set(L.STICKERS).size !== L.STICKERS.length) bad('duplicitní samolepky');
// záloha
const code1 = L.encodeBackup(m);
chk(L.decodeBackup(code1), m, 'záloha tam a zpět'); chk(L.decodeBackup('nesmysl'), null, 'neplatná záloha');
chk(L.STATE_KEY, 'pocty-v1', 'klíč úložiště');


// ---- migrace stavu z verze 2 (fáze 2) ----
const v2 = { ver: 2, stars: 187, stickers: ['🐨','🦉','🐝','🦁','🦖'], rounds: 19,
  levels: { add: 3, sub: 2, mul: 3, div: 1, cmp: 3, shape: 2, pos: 3, seq: 1 },
  adapt: { add: {up:1,down:0}, sub: {up:0,down:0}, mul: {up:0,down:0}, div: {up:0,down:0}, cmp: {up:2,down:0}, shape: {up:0,down:1}, pos: {up:0,down:0}, seq: {up:3,down:0} } };
const m2 = L.migrate(JSON.parse(JSON.stringify(v2)));
chk([m2.stars, m2.rounds, m2.stickers], [187, 19, v2.stickers], 'migrace v2 úspěchy');
chk(['add','sub','mul','div','cmp','shape','pos','seq'].map(k => m2.levels[k]), [3,2,3,1,3,2,3,1], 'migrace v2 úrovně');
chk([m2.levels.clock, m2.levels.money, m2.levels.sym], [1,1,1], 'nové úrovně v3');
chk(m2.adapt.seq, {up:3, down:0}, 'migrace v2 adapt'); chk(m2.ver, 3, 'verze 3');
chk(L.decodeBackup(L.encodeBackup(v2)).stars, 187, 'záloha z v2 jde obnovit');

console.log(fails ? `\n${fails} CHYB` : '\nVše OK');
process.exit(fails ? 1 : 0);
