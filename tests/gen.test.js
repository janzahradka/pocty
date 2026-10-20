// Test logiky úloh: vytáhne <script id="logic"> z index.html a ověří rozsahy, odpovědi a texty.
// Spuštění: node tests/gen.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script id="logic">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} }; vm.runInNewContext(code, { module: mod, Math });
const L = mod.exports;
let fails = 0; const bad = m => { fails++; if (fails < 20) console.log('FAIL', m); };
const LIM = { add: [10, 20, 18], sub: [10, 19, 18], mul: [12, 20, 30], div: [10, 20, 30] };
for (const op of L.OPS) for (const lv of [1, 2, 3]) {
  const seen = new Set();
  for (let i = 0; i < 5000; i++) {
    const t = L.GEN[op](lv);
    const vals = [t.a, t.b, t.r, t.ans];
    if (!vals.every(v => Number.isInteger(v) && v >= 0)) bad(`${op}${lv} neceločíselné/záporné ${JSON.stringify(t)}`);
    if (Math.max(t.a, t.r) > LIM[op][lv - 1]) bad(`${op}${lv} mimo rozsah ${JSON.stringify(t)}`);
    if (op === 'sub' && t.r < 1) bad(`sub nulový výsledek ${t.a}-${t.b}`);
    if (op === 'add' && lv === 3 && t.a + t.b <= 10) bad('add3 bez přechodu');
    if (op === 'add' && lv === 2 && t.r > 10 && (t.a % 10) + (t.b % 10) >= 10) bad(`add2 s přechodem ${t.a}+${t.b}`);
    if (op === 'sub' && lv === 3 && (t.a % 10) >= t.b) bad(`sub3 bez přechodu ${t.a}-${t.b}`);
    const ch = L.choices(t);
    if (ch.length !== 4 || new Set(ch).size !== 4 || !ch.includes(t.ans) || ch.some(c => c < 0)) bad(`choices ${JSON.stringify(ch)} pro ${JSON.stringify(t)}`);
    if (/undefined|NaN/.test(t.speech)) bad('speech ' + t.speech);
    seen.add(t.speech);
  }
  const ex = L.GEN[op](lv);
  console.log(`${op} L${lv}: ${seen.size} různých zadání; např. "${ex.speech}" (${ex.a} ${op} ${ex.b} = ${ex.r}, ? = ${ex.ans}, obrázky: ${ex.pics})`);
}
// čeština
const chk = (a, b) => { if (a !== b) bad(`"${a}" != "${b}"`); };
chk(L.w(21), 'dvacet jedna'); chk(L.w(2, 'f'), 'dvě'); chk(L.w(1, 'fa'), 'jednu'); chk(L.w(1, 'm'), 'jeden'); chk(L.w(30), 'třicet');
chk(L.speech({ op: 'mul', a: 2, b: 1, r: 2, pics: true, missing: 'r' }), 'Jsou tu dvě skupinky. V každé je jeden obrázek. Kolik je to dohromady?');
chk(L.speech({ op: 'mul', a: 5, b: 3, r: 15, pics: true, missing: 'r' }), 'Je tu pět skupinek. V každé jsou tři obrázky. Kolik je to dohromady?');
chk(L.speech({ op: 'div', a: 8, b: 2, r: 4, pics: true, missing: 'r' }), 'Rozděl osm bonbónů mezi dva kamarády. Kolik dostane každý?');
chk(L.speech({ op: 'div', a: 4, b: 4, r: 1, pics: true, missing: 'r' }), 'Rozděl čtyři bonbóny mezi čtyři kamarády. Kolik dostane každý?');
chk(L.speech({ op: 'div', a: 15, b: 5, r: 3, pics: false, missing: 'r' }), 'Kolik je patnáct děleno pěti?');
chk(L.speech({ op: 'add', a: 5, b: 7, r: 12, pics: false, missing: 'b' }), 'Pět plus kolik je dvanáct?');
// adaptace
const st = { levels: { add: 1 }, adapt: { add: { up: 0, down: 0 } } };
for (let i = 0; i < 4; i++) L.adapt(st, 'add', true); chk(st.levels.add, 2);
L.adapt(st, 'add', false); L.adapt(st, 'add', false); chk(st.levels.add, 1);
console.log(fails ? `\n${fails} CHYB` : '\nVše OK');
process.exit(fails ? 1 : 0);
