# Fáze 6 – úrovně 4–5, logika, verze na loďce

## Cíl fáze
Marianka dohrála úrovně 1–3. Fáze dává náročnější úlohy, které motivují k dalšímu postupu:
- úrovně 4 a 5 u všech jejích úloh,
- nové logické úlohy s obtížností, která se dá zvyšovat téměř bez omezení,
- ohlášení postupu na vyšší úroveň.

K tomu přibyla verze aplikace jako obrázek na loďce. Nasazeno bez dalšího schvalování (dle zadání).

## Úrovně 4 a 5 (školák)
| Typ | Úroveň 4 | Úroveň 5 |
|---|---|---|
| Sčítání | do 100: dvojciferné + jednociferné s přechodem přes desítku (27 + 6), desítky (40 + 30) | dvojciferné + dvojciferné do 100 (38 + 47) |
| Odčítání | dvojciferné − jednociferné s přechodem (43 − 7), desítky (90 − 30) | dvojciferné − dvojciferné (72 − 38) |
| Násobení | malá násobilka 2–5 × 1–10 | násobilka do 100, 25 % „Tři krát kolik je dvacet jedna?“ |
| Dělení | v oboru malé násobilky | v oboru celé násobilky |
| Porovnávání | čísla do 100, často s prohozenými číslicemi (47 ? 74) | příklad proti číslu i proti příkladu (38 + 25 ? 70 − 9) |
| Tvary | počítání ve scéně s 10–14 tvary včetně záměnných (krychle mezi čtverci) | vlastnosti: rohy, strany, stěny, vrcholy, hrany, podstavy („Kolik hran má krychle?“) |
| Kde to je? | mřížka 4 × 4, sousední políčka a rohy | „Co je o dvě políčka vlevo od psa?“ |
| Řady | kroky 3, 4, 5, 10 nahoru i dolů, do 100 | kroky 6–9, nebo skoky, které se pokaždé o jedna zvětší (1, 2, 4, 7, 11…) |
| Hodiny | čtvrt a tři čtvrtě („čtvrt na tři“ = 2:15), odpověď jako 2:15 | „Kolik hodin bude za půl hodiny / hodinu a půl?“ |
| Peníze | součet 3–5 mincí do 100 Kč včetně 50 Kč, placení přesně do 60 Kč | kolik zbyde z 50 Kč po nákupu jedné nebo dvou věcí |
| Souměrnost | mřížka 6 × 3 / 3 × 6 | mřížka 6 × 4 / 4 × 6 |
| Paměť a pozornost | co zmizelo 9 obrázků, pexeso 12 dvojic, zopakuj 6 kroků, najdi všechny 25 políček, rozdíl 5 × 4 | 10 obrázků, 14 dvojic, 7 kroků, 30 políček, rozdíl 5 × 5 |

Předškolák má dál úrovně 1–3.

Rozptylující možnosti míří na typické chyby:
- násobení: sousední výsledky z násobilky,
- sčítání a odčítání do 100: o desítku vedle,
- hodiny: 8:45 místo 7:45 u „tři čtvrtě na osm“, záměna čtvrt / tři čtvrtě,
- řady se zvětšujícím se krokem: číslo, které vznikne, když dítě pokračuje stále stejným krokem.

## Logika (nová dlaždice 🧩 → podnabídka)
| Úloha | Úroveň 1 → 5 | Princip |
|---|---|---|
| Bludiště | 5 × 5, 6 × 6, 8 × 8, 10 × 10, 12 × 12; na úrovních 4–5 musí myška nejdřív najít 🔑 (je ve slepé uličce co nejdál od cesty), jinak je sýr zamčený | Klepnutí na políčko ve stejném řádku nebo sloupci: myška běží, dokud nenarazí na zeď. „Napoprvé“ (hvězdička se počítá do postupu) = cesta nejvýš 1,5× delší než nejkratší. Kolo má 5 bludišť. |
| Sudoku s obrázky | 4 × 4: 1 stačí řádek, 2 stačí řádek, sloupec nebo čtverec, 3–4 je nutné kombinovat; 5 = 6 × 6 | Jedno žluté políčko, výběr obrázku. Generátor ověřuje, že políčko jde jednoznačně odvodit a že obtížnost odpovídá úrovni. Na úrovních 1–2 je zvýrazněný řádek, sloupec a čtverec. |
| Váhy | 1 🍌 = 3 🍎 → 🍌 = ?; 2 → 2 🍌 = ?; 3 řetězení (🍉 = 2 🍌); 4 🍌 + 2 🍎 = 6 🍎; 5 řetězení se sčítáním (🥥 = 🍉 + 🍎, 🍉 + 🥥 = ?) | Jablko je jednotka. Výsledek nejvýš 20. |

Sudoku a váhy jsou i v režimu „všechno“, bludiště ne (je delší).

## Motivace
- Při postupu hra řekne „Postupuješ na úroveň čtyři!“ (anglicky „Level 4!“), zazní fanfára a zobrazí se ⬆️ ★★★★. Při dosažení nejvyšší úrovně řekne „Postupuješ na nejvyšší úroveň! Jsi mistr!“ a zobrazí 🏆.
- Dlaždice ukazují ●●●○○, na nejvyšší úrovni 🏆.

## Verze na loďce
- Vlevo dole na úvodní obrazovce je loďka a na ní obrázek verze. Klepnutím hlas řekne „Loďka veze zebru.“ (anglicky „The boat is carrying a zebra.“).
- Rodičovská obrazovka (dlouhý stisk nadpisu) ukazuje číslo verze, obrázek, datum a předchozí verze.
- Seznam `VERSIONS` v kódu: při každém nasazení se přidá řádek. Obrázky se po čase mohou opakovat.

| Verze | Obrázek | Datum | Obsah |
|---|---|---|---|
| 7 | 🦓 zebra | 22. 10. 2026 | fáze 6 |
| 1–6 | bez loďky | do 22. 10. 2026 | fáze 1–5 a oprava vlajky |

Další verze: 🐍 had, 🚗 autíčko, ☀️ sluníčko…

## Stav a zpětná kompatibilita
- `STATE_VER` 6. Klíč `pocty-v1`, samolepky, hvězdičky a záloha `POCTY1:` jsou beze změny.
- Uložené úrovně zůstávají. Mariančiny úrovně 3 se mohou zvyšovat až na 5.
- Úrovně předškoláka migrace omezí na 3.
- Nové typy (`maze`, `sudoku`, `scales`) začínají na úrovni 1 a jsou na konci `KINDS`.
- `adapt()` bere maximum úrovně podle typu a profilu (`maxLv`).
- `PITEMS` má 16 předmětů (přibyla žába a jahoda), prvních 14 je beze změny.

## Změny v kódu
| Oblast | Změna |
|---|---|
| Logika | `GEN.*` úrovně 4–5; `genCmpHard`, `cmpMake` (výraz i vpravo), `genPosBig`, `genSeqHard`, `genClockHard` (čtvrthodiny, posun času), `genMoneyHard`, `payTask`, `changeTask`; `SHAPE_PROPS`; `genMaze`, `mazeBFS`, `genSudoku`, `sudokuSolution`, `genScales`, `scaleWeights`; `maxLv`, `KIND_ROUND`; `korun()` nad 20 („dvacet dva korun“); tabulky paměťových her do d = 7; `VERSIONS` |
| Texty | angličtina a krátká zadání pro všechny nové úrovně a úlohy (`textEN`, `textCS`) |
| UI | obrazovka `#logic`, `renderMaze`, `renderSudoku`, `renderScales`, výraz vpravo u porovnávání, mřížka 4 × 4, dvě věci v obchodě, vlastnosti tvarů; ohlášení postupu v `scoreOk`; trofej na dlaždici; loďka s verzí; úvodní obrazovka školáka v 8 sloupcích; na telefonu tečky postupu na vlastním řádku |
| `sw.js` | cache `pocty-v7` |
| Testy | `tests/faze6.part.js` |

## Ověření
- `node tests/gen.test.js`:
  - 3 000 úloh na každý typ školáka na úrovních 4 a 5: rozsahy do 100, přechod přes desítku, správné znaménko včetně výrazu vpravo, vlastnosti tvarů, poloha v mřížce 4 × 4 podle znění otázky, kroky řad, klíč času po posunu, čtvrt / tři čtvrtě v textu, platby a vracení, zrcadlení.
  - Bludiště: dokonalé, obousměrné stěny, vše dosažitelné, nejkratší cesta včetně klíče.
  - Sudoku: platné řešení, jednoznačnost, obtížnost podle úrovně.
  - Váhy: odpověď odpovídá rovnicím.
  - Oba jazyky bez chyb, maximum úrovní, migrace v5 → v6, záloha, verze.
  - Testy fází 1–5 beze změny. Vše OK.
- Headless Chromium:
  - Mariančin stav v5 → v6: úrovně a hvězdičky zůstaly. Postup ze 3 na 4 s ohlášením.
  - Všech 11 typů na úrovních 4 a 5 s chybami; logika na všech pěti úrovních (bludiště řeší robot nejkratší cestou včetně klíče); paměť na úrovni 5.
  - Angličtina na úrovni 5 bez českých vět. Trofej. Reload.
  - Telefon a tablet na výšku. Předškolák stále 3 úrovně.
  - Loďka na třech velikostech obrazovky včetně hlasu a rodičovské obrazovky.
  - Regresní testy fází 4 a 5 a opravy vlajky. Bez chyb v konzoli.
- Neověřeno: ovládání bludiště prstem na tabletu (klepnutí podél řádku nebo sloupce), čitelnost bludiště 12 × 12 na telefonu.

## K ručnímu ověření
1. Loďka vlevo dole veze 🦓. Pokud ne, aplikaci zavřít a otevřít s internetem.
2. Bludiště: zkusit klepání podél chodby a úroveň s klíčem.
3. Sledovat, zda úroveň 5 počtů a sudoku 6 × 6 není příliš těžká (úroveň se po dvou chybách sama sníží).
