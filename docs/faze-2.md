# Fáze 2 – porovnávání, tvary, kde to je, řady

## Cíl fáze
Rozšířit hru podle Mariančina přání (větší, menší, rovná se) a návrhů rodičů (geometrické tvary, umístění předmětů). Jako vlastní návrh přibyly řady (vzory a chybějící číslo). Hvězdičky, samolepky a úrovně z verze 1 se po aktualizaci zachovají.

## Zachování úspěchů po aktualizaci
| Opatření | Popis |
|---|---|
| Stejný klíč úložiště | Stav zůstává v `localStorage['pocty-v1']`, stejná adresa = stejné úložiště (i u aplikace přidané na plochu). |
| Migrace `migrate()` | Načtený stav se jen doplní: nové typy úloh dostanou úroveň 1, hvězdičky, samolepky, kola a úrovně počtů zůstávají. Neznámé položky se nemažou. Stav nese `ver: 2`. Migrace je idempotentní. |
| Kopie před první migrací | Původní záznam verze 1 se jednou uloží do `pocty-zaloha-v1`. |
| Poškozená data | Když uložený záznam nejde přečíst, uloží se stranou (`pocty-poskozeno-…`) a nepřepíše se naslepo. |
| Trvalé úložiště | `navigator.storage.persist()` žádá prohlížeč, aby data nemazal při nedostatku místa. |
| Samolepky | 40 samolepek z verze 1 má stejné pořadí, 30 nových je přidaných na konec (celkem 70). |
| Záloha pro rodiče | Dlouhý stisk (2 s) na nadpis → obrazovka „Pro rodiče: záloha“: zkopírovat zálohu (text `POCTY1:…`) a obnovit ze zálohy. Před obnovou se současný stav odloží (`pocty-pred-obnovou-…`). |
| Service worker | Cache `pocty-v2`. Stránka se načítá ze sítě napřed, takže se nová verze projeví při dalším otevření s internetem. |

## Nové úlohy
| Typ | Úroveň 1 | Úroveň 2 | Úroveň 3 |
|---|---|---|---|
| Porovnávání `< = >` | dvě skupinky obrázků a čísla 1–10 | čísla 0–20, často blízká | příklad proti číslu (`9 + 8 ? 15`), vše ≤ 20 |
| Tvary | najdi kruh / čtverec / obdélník / trojúhelník | všech 9 tvarů (+ přímka, krychle, kvádr, koule, válec), bez záměnných dvojic | záměnné dvojice v nabídce (kruh–koule–válec, čtverec–krychle–obdélník, obdélník–kvádr…); 30 % „Kolik je tu trojúhelníků?“ |
| Kde to je? | vlevo / uprostřed / vpravo (polička), nahoře / uprostřed / dole (skříňka) | vlevo od / vpravo od, nad / pod, na stole / pod stolem / vedle stolu | mřížka 3 × 3: hned vlevo od, hned vpravo od, nad, pod; rohy (nahoře vlevo…) |
| Řady | opakující se obrázky AB, ABB, AAB, otazník na konci | vzory ABC, AABB i otazník uprostřed; čísla po jedné nahoru i dolů | čísla po 2, 3, 5 (do 20), po 10 (do 50), po 2 dolů |

- Tvary jsou kreslené SVG: plošné vybarvené, tělesa prostorově (krychle a kvádr ve volném rovnoběžném promítání, koule se stínováním, válec s podstavami). Barvy jsou náhodné, aby barva nenapovídala.
- U tvarů se zadání jen poslouchá, místo obrázku je velké 👂 (klepnutím se zopakuje).
- Po správné odpovědi hlas vysvětlí: „Pět je menší než sedm.“ / „Devět plus osm je sedmnáct. Sedmnáct je větší než patnáct.“ / „Ano, pod kočkou je pes.“ / „Osm, deset, dvanáct, čtrnáct, šestnáct.“ U „kde to je“ se správný předmět ve scéně rozzáří.
- Česká slova jsou skloňovaná (vlevo od psa, pod kočkou, najdi krychli, skáčou po pěti).

## Úvodní obrazovka
Dvě řady po pěti dlaždicích: `+ − · : < =` a `tvary, kde to je?, řady, všechno, samolepky`. Každá úloha má vlastní úroveň ●○○ a vlastní adaptaci (4× napoprvé nahoru, 2× chyba dolů). „Všechno“ míchá všechny typy, sčítání a odčítání dvakrát častěji.

## Změny v kódu (`index.html`)
| Oblast | Změna |
|---|---|
| `<script id="logic">` | `genCmp`, `genShape`, `genPos`, `genSeq`, `numOpts`, `KINDS`, `SHAPES`, `PITEMS`; úloha má jednotný tvar `ans`, `opts`, `optType`, `speech`, `okSay`, `revealSay`; `freshState`, `migrate`, `encodeBackup`, `decodeBackup` |
| Vykreslení | `renderCmp`, `renderShape` + `shapeSVG`, `renderPos`, `renderSeq`, obecné `renderAnswers` (čísla, znaménka, tvary, obrázky) |
| Odpověď | porovnání přes `data-v`, vysvětlení `okSay`/`revealSay`, zvýraznění předmětu ve scéně |
| Rodiče | obrazovka `#parent` (záloha, obnova) |
| `sw.js` | cache `pocty-v2` |
| `tests/gen.test.js` | testy nových úloh, migrace a zálohy |

## Ověření
- `node tests/gen.test.js`: 4 000 úloh na každý typ a úroveň (8 × 3). Kontroluje se nabídka (3–4 různé možnosti včetně správné), rozsahy, znaménko u porovnání, počet tvarů ve scéně, poloha odpovědi v mřížce podle znění otázky, krok číselné řady a perioda vzoru, texty bez chyb. Dále migrace skutečného stavu verze 1, idempotence, zachování neznámých položek, pořadí 40 samolepek verze 1, záloha tam a zpět. Vše OK.
- Headless Chromium na tabletu na šířku (1180 × 820), na výšku (820 × 1180) a na telefonu (390 × 844):
  - Do úložiště se vloží stav verze 1 (57 hvězdiček, 4 samolepky, úrovně počtů 3/2/3/1), pak se stránka načte znovu. Hvězdičky, samolepky i úrovně zůstaly, nové typy začínají na úrovni 1 a vznikla kopie `pocty-zaloha-v1`.
  - Celá kola všech nových typů na všech třech úrovních, včetně chybné odpovědi, a kolo „všechno“.
  - Prvních 4 samolepek zůstalo, nové přibyly.
  - Záloha přes dlouhý stisk, smazání dat, obnova ze zálohy: stav se vrátil.
  - Bez chyb v konzoli.
- Neověřeno: skutečný hlas a dotyk na tabletu, přechod nainstalované aplikace na novou verzi na Mariančině tabletu.

## K ručnímu ověření na tabletu
1. Otevřít hru s internetem (u aplikace na ploše ji jednou zavřít a znovu otevřít). Na úvodní obrazovce musí zůstat dosavadní hvězdičky a samolepky.
2. Dlouze podržet nadpis → zkopírovat zálohu a uložit ji (poznámky, e-mail).
3. Projít každou novou dlaždici a poslechnout zadání a vysvětlení.

## Návrhy na další fázi
- Hodiny (celé a půl hodiny), peníze (mince 1–20 Kč), sudá/lichá, souměrnost (dokresli druhou polovinu), slovní úlohy s obrázky.
- Postavička nebo mapa s cestou jako dlouhodobá odměna, rodičovský přehled úspěšnosti.
