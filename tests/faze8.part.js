// Fáze 8: robot, bludiště v desítkách políček. Volá se z tests/gen.test.js.
module.exports = function (L, bad, chk) {
  const CZ = /[áčďéěíňóřšťúůýž]/i, BADTXT = /undefined|NaN|null|\[object|  /;
  const run = (t, prog) => { let st = { pos: t.from, dir: t.dir0, got: 0 };
    for (const c of prog) { const r = L.robotStep(t, st, c); if (!r.ok) return null; st = r.st; } return st; };
  const full = t => (1 << t.treats.length) - 1;
  for (const prof of ['skolak', 'predskolak']) for (const lv of [1, 2, 3, 4, 5, 6, 8, 10, 15, 30]) for (let i = 0; i < (lv > 10 ? 20 : 150); i++) {
    const t = L.GEN.robot(lv, prof), id = `robot ${prof} ${lv}`;
    for (const lang of L.LANGS) { const x = L.texts(t, lang);
      for (const k of ['full', 'short', 'ok']) { if (!x[k] || BADTXT.test(x[k])) bad(`${id} ${lang}.${k}: ${x[k]}`); if (lang === 'en' && CZ.test(x[k])) bad(`${id} čeština v en`); }
      if (x.short.length > x.full.length) bad(`${id} krátké zadání`); }
    if (t.board.length !== t.W * t.H || t.W > 12 || t.H > 9) bad(`${id} rozměr`);
    if (t.board[t.from] !== '.' || t.board[t.flag] !== '.' || t.from === t.flag) bad(`${id} start/cíl`);
    if (t.treats.some(k => t.board[k] !== '.' || k === t.from || k === t.flag) || new Set(t.treats).size !== t.treats.length) bad(`${id} bonbony`);
    // uložené nejkratší řešení opravdu dojde k vlajce se všemi bonbony a solver dá stejnou délku
    const st = run(t, t.solution);
    if (!st || st.pos !== t.flag || st.got !== full(t)) bad(`${id} řešení nefunguje ${t.solution.join('')}`);
    if (L.robotSolve(t).length !== t.opt || t.opt !== t.solution.length) bad(`${id} délka`);
    if (lv === 1 && !t.solution.every(c => c === 'F')) bad(`${id} úroveň 1 jen rovně: ${t.solution.join('')}`);
    if (lv === 2 && !t.solution.some(c => c === 'L' || c === 'R')) bad(`${id} úroveň 2 bez zatočení`);
    if (lv >= 3 && !t.board.includes('R')) bad(`${id} bez kamene`);
    if (t.prog !== (lv >= (prof === 'predskolak' ? 8 : 6))) bad(`${id} programování`);
    if (t.prog && t.opt > 24) bad(`${id} program moc dlouhý ${t.opt}`);
    for (const k of ['start', 'repeat', 'play', 'hidden', 'useShort', 'st', 'queue']) if (t[k] !== undefined) bad(`${id} vyhrazené pole ${k}`);
  }
  // pravidla pohybu
  const T = { W: 4, H: 1, board: ['.', 'R', '.', 'T'], treats: [2] };
  chk(L.robotStep(T, { pos: 0, dir: 1, got: 0 }, 'F').ok, false, 'do kamene nejde');
  chk(L.robotStep(T, { pos: 0, dir: 1, got: 0 }, 'J').st, { pos: 2, dir: 1, got: 1 }, 'skok přes kámen sebere bonbon');
  chk(L.robotStep(T, { pos: 2, dir: 1, got: 0 }, 'J').ok, false, 'přes strom neskočí');
  chk(L.robotStep({ W: 3, H: 1, board: ['.', '.', '.'], treats: [] }, { pos: 0, dir: 1, got: 0 }, 'J').ok, false, 'skok jen přes kámen');
  chk(L.robotStep(T, { pos: 0, dir: 1, got: 0 }, 'L').st.dir, 0, 'otočení doleva');
  chk(L.robotStep(T, { pos: 2, dir: 3, got: 0 }, 'B').ok, false, 'dozadu do stromu ne');
  chk(L.robotStep(T, { pos: 0, dir: 1, got: 0 }, 'B').ok, false, 'dozadu mimo plochu ne');
  // obtížnost roste
  const avg = (lv, f) => { let s = 0; for (let i = 0; i < 30; i++) s += f(L.GEN.robot(lv, 'skolak')); return s / 30; };
  const o3 = avg(3, t => t.opt), o10 = avg(10, t => t.opt);
  if (o10 <= o3) bad(`robot neroste ${o3} → ${o10}`);
  console.log(`robot: průměrná délka řešení úroveň 3 = ${o3.toFixed(1)}, 10 = ${o10.toFixed(1)}; bonbony na 10 = ${avg(10, t => t.treats.length)}`);
  chk([L.isDyn('robot', 'predskolak'), L.isDyn('robot', 'skolak')], [true, true], 'robot bez stropu');
  chk(L.PROFILES.predskolak.kinds.includes('robot') && L.LOGIC.includes('robot'), true, 'robot v obou profilech');
  for (let i = 0; i < 2000; i++) if (L.nextOp('mix', null, 'skolak', L.freshState()) === 'robot') { bad('robot v mixu'); break; }

  // bludiště v desítkách
  chk(L.MAZE_SIZES.XXL, [50, 36], 'gigantické 50 × 36');
  chk([L.MAZE_ROUND.S, L.MAZE_ROUND.L, L.MAZE_ROUND.XXL], [5, 3, 1], 'kolo podle velikosti');
  const big = L.GEN.maze(12, 'skolak', { size: 'XXL', portrait: true });
  chk([big.W, big.H, big.keys.length], [36, 50, 3], 'gigantické na výšku');
  if (L.mazeBFS(big.W, big.H, big.cells, big.entry).some(x => x < 0)) bad('gigantické nedosažitelné');

  // migrace v7 → v8
  const v7 = { ver: 7, profile: 'skolak', lang: 'cs', stars: 1500, stickers: ['🐨'], rounds: 150, mazeSize: 'XXL', levels: { maze: 9, sudoku: 8 } };
  const m8 = L.migrate(JSON.parse(JSON.stringify(v7)));
  chk([m8.ver, m8.stars, m8.mazeSize, m8.levels.maze, m8.levels.sudoku, m8.levels.robot], [L.STATE_VER, 1500, 'XXL', 9, 8, 1], 'v7 → v8');
  chk(L.migrate(m8), m8, 'v8 idempotentní');
  chk([L.VER[0], L.VER[1]], [9, '🚗'], 'verze 9 = autíčko');
};
