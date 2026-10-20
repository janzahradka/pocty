# Fáze 3 – hodiny, peníze, souměrnost

## Cíl fáze
Přidat tři úlohy navržené ve fázi 2: hodiny, peníze a souměrnost. Úspěchy z verzí 1 a 2 se zachovají.

## Zachování úspěchů
- Analýza před změnou: tvar uloženého stavu se nemění, jen přibyly tři typy úloh. `migrate()` prochází `KINDS`, takže `clock`, `money` a `sym` dostanou úroveň 1 a ostatní hodnoty zůstanou.
- `STATE_VER` = 3 (jen evidence verze). Klíč `pocty-v1`, pořadí samolepek a formát zálohy `POCTY1:` jsou beze změny. Zálohu z verze 2 jde obnovit.
- Ověřeno testem v Node i v prohlížeči: stav verze 2 (187 hvězdiček, 5 samolepek, úrovně 3/2/3/1/3/2/3/1) po aktualizaci zůstane, nové úlohy začínají na úrovni 1. Stejný test přechodu z verze 1 (fáze 2) prochází i nadále.

## Nové úlohy
| Typ | Úroveň 1 | Úroveň 2 | Úroveň 3 |
|---|---|---|---|
| Hodiny | ručičkové hodiny, celé hodiny, odpověď číslo 1–12 | celé a půl hodiny, odpověď jako `6:30` | jen poslech: „Na kterých hodinách je půl osmé?“ → výběr ze čtyř ciferníků |
| Peníze | sečti 2–3 mince 1, 2, 5 Kč (do 10) | 2–4 mince 1–20 Kč (6–20 Kč) | zaplať přesně: věc s cenovkou, výběr ze čtyř skupin mincí; nebo kolik zbyde z 10 / 20 Kč |
| Souměrnost | mřížka 3 × 2, svislá osa, 3 možnosti | mřížka 4 × 3, 4 možnosti | 5 × 3 se svislou osou nebo 3 × 5 s vodorovnou osou (polovina patří dolů) |

- Česká slova: „je jedna hodina / jsou tři hodiny / je pět hodin“, „půl čtvrté“ = 3:30 (půl následující hodiny), „jedna koruna / dvě koruny / pět korun“.
- Rozptylující možnosti míří na typické chyby:
  - hodiny: sousední hodina, záměna s velkou ručičkou (12), u půl hodin `4:30` místo `3:30`;
  - peníze: počet mincí místo jejich hodnoty, součet bez nejmenší mince; při placení vždy právě jedna skupina mincí dává přesnou cenu;
  - souměrnost: polovina jen posunutá, ne zrcadlená (nejčastější chyba), převrácená podle druhé osy, zrcadlo s jedním změněným políčkem.
- Mince: velikost podle skutečných průměrů (1 Kč 20 mm až 50 Kč 27,5 mm), 1/2/5 Kč stříbrné, 10/20 Kč zlaté. Kreslené zjednodušeně, s hodnotou a „Kč“.
- Po správné odpovědi hlas vysvětlí: „Ano, je půl osmé. To je sedm hodin třicet minut.“ / „Deset plus pět plus jedna je šestnáct korun.“ / „Dvacet minus třináct je sedm. Zbyde ti sedm korun.“ / „Obě poloviny jsou jako v zrcadle.“ U souměrnosti se doplní druhá polovina obrázku.

## Úvodní obrazovka
13 dlaždic. Na šířku 7 + 6, na výšku tabletu 4 sloupce, na telefonu 3. Nové dlaždice: hodiny 🕒, peníze 🪙 Kč, souměrnost 🦋. „Všechno“ zahrnuje i nové úlohy.

## Změny v kódu
| Soubor | Změna |
|---|---|
| `index.html` logika | `genClock`, `genMoney`, `genSym`, `payWith`, `hparse`, `mirV`, `mirH`, `KINDS` + 3, `STATE_VER` 3 |
| `index.html` UI | `clockSVG`, `coinSVG`, `halfGrid`, `renderClock`, `renderMoney`, `renderSym`, nové typy nabídky `text`, `clock`, `coins`, `half`, mřížka dlaždic |
| `sw.js` | cache `pocty-v3` |
| `tests/gen.test.js` | kontroly hodin, peněz, souměrnosti, migrace z verze 2 |

## Ověření
- `node tests/gen.test.js`: 4 000 úloh na typ a úroveň (11 × 3). Kontroluje se:
  - hodiny: klíč času a rozsah 1–12;
  - peníze: součty mincí, jednoznačnost přesné platby, nejvýš 4 mince, výpočet vrácení;
  - souměrnost: správná polovina je skutečně zrcadlo, nabídky bez duplicit;
  - migrace v1 → v3 a v2 → v3, záloha.
  - Vše OK.
- Headless Chromium na tabletu na šířku, na výšku a na telefonu: stav verze 2 → nová verze, celá kola hodin, peněz a souměrnosti na všech úrovních včetně chybné odpovědi, kolo „všechno“, záloha a obnova. Bez chyb v konzoli. Regresní test fáze 2 (nové úlohy fáze 2 a přechod z verze 1) prochází.
- Neověřeno: skutečný hlas a dotyk na tabletu.

## K ručnímu ověření
1. Otevřít hru s internetem (aplikaci na ploše zavřít a otevřít). Hvězdičky a samolepky musí zůstat.
2. Projít hodiny, peníze a souměrnost a poslechnout zadání a vysvětlení, hlavně „půl …“.
