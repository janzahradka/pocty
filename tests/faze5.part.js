// Fáze 5: anglické texty, krátká zadání, jazyk ve stavu. Volá se z tests/gen.test.js.
module.exports = function (L, bad, chk) {
  const CZ = /[áčďéěíňóřšťúůýž]/i, BADTXT = /undefined|NaN|null|\[object|  |\(\)/;
  const all = [...L.SCHOOL_KINDS.map(k => [k, 'skolak']), ...L.PRE_KINDS.map(k => [k, 'predskolak']),
    ...L.BRAIN.map(k => [k, 'skolak']), ...L.BRAIN.map(k => [k, 'predskolak'])];
  const sample = {};
  for (const [op, prof] of all) for (const lv of [1, 2, 3]) for (let i = 0; i < 1500; i++) {
    const t = L.GEN[op](lv, prof);
    for (const lang of L.LANGS) {
      const x = L.texts(t, lang);
      if (!x.full) bad(`${op}${lv} ${lang} bez zadání`);
      if (x.short.length > x.full.length) bad(`${op}${lv} ${lang} krátké delší než celé: ${x.short} | ${x.full}`);
      for (const k of ['full', 'short', 'ok', 'okShort', 'reveal', 'intro', 'introShort']) {
        const v = x[k]; if (v === undefined) continue;
        if (typeof v !== 'string' || BADTXT.test(v)) bad(`${op}${lv} ${lang}.${k}: ${v}`);
        if (lang === 'en' && CZ.test(v)) bad(`${op}${lv} čeština v angličtině: ${v}`);
      }
      if (x.okShort && x.ok && x.okShort.length > x.ok.length) bad(`${op} okShort delší`);
    }
    if (op !== 'm_pairs' && !L.texts(t, 'en').ok && !L.OPS.includes(op)) bad(`${op} bez anglické pochvaly`);
    if ((op === 'm_gone') !== !!L.texts(t, 'en').intro) bad(`${op} intro`);
    sample[`${op}${lv}`] = t;
  }
  for (const k of ['clock1', 'clock3', 'money3', 'sym2', 'p_size3', 'p_pos3', 'pos3', 'p_color3', 'a_find2', 'cmp3', 'mul2', 'p_pair2']) {
    const t = sample[k], c = L.texts(t, 'cs'), e = L.texts(t, 'en');
    console.log(`${k.padEnd(8)} CS ${c.full} | ${c.short} | ${c.okShort}\n         EN ${e.full} | ${e.short} | ${e.ok}`);
  }

  // konkrétní anglické věty
  const clk = { op: 'clock', lv: 3, h: 7, m: 30, ans: '7:30' };
  chk(L.textEN(clk).full, 'Which clock shows half past seven?'.replace('seven', '7'), 'hodiny anglicky');
  chk(L.posEN('hned vlevo od psa'), 'directly to the left of the dog', 'poloha anglicky');
  chk(L.posEN('pod kočkou'), 'below the cat'); chk(L.posEN('pod stolem'), 'under the table');
  // krátké zadání: hodiny úrovně 1 bez vysvětlení ručiček
  const c1 = L.GEN.clock(1); chk(L.texts(c1, 'cs').short, 'Kolik je hodin?', 'hodiny krátce');
  // klíč varianty: stejný typ = stejný klíč, jiná varianta = jiný
  chk(L.variantKey(L.GEN.clock(1)), L.variantKey(L.GEN.clock(1)), 'klíč hodin');
  let pay, chg; for (let i = 0; i < 200 && !(pay && chg); i++) { const t = L.GEN.money(3); if (t.pay) pay = t; else chg = t; }
  if (L.variantKey(pay) === L.variantKey(chg)) bad('placení a vracení mají stejný klíč');

  // jazyk ve stavu
  chk(L.freshState().lang, 'cs', 'výchozí jazyk');
  const v4 = { ver: 4, profile: 'skolak', stars: 9, stickers: ['🐶'], rounds: 2 };
  const m = L.migrate(v4);
  chk([m.ver, m.lang, m.profile, m.stars], [L.STATE_VER, 'cs', 'skolak', 9], 'v4 → v5');
  chk(L.migrate({ ...m, lang: 'en' }).lang, 'en', 'angličtina zůstane');
  chk(L.migrate({ ...m, lang: 'de' }).lang, 'cs', 'neznámý jazyk');
  chk(L.decodeBackup(L.encodeBackup({ ...m, lang: 'en' })).lang, 'en', 'záloha s jazykem');
};
