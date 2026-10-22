# Fáze 4 – předškolák (Rostík), paměť a pozornost

## Cíl fáze
Ve stejné aplikaci přidat profil pro čtyřletého Rostíka, který nečte, a hry na trénink paměti a pozornosti pro oba profily. Mariančin tablet se po aktualizaci nesmí změnit: stav, úrovně, hvězdičky ani samolepky. Minihra jako dlouhodobá odměna se nedělá (riziko, že oslabí motivaci k hlavní hře).

## Profil hráče
| Položka | Řešení |
|---|---|
| Uložení | `state.profile`: `skolak` / `predskolak` / `null`. Klíč `pocty-v1` beze změny, `STATE_VER` = 4. |
| Mariančin tablet | Stav bez profilu, ve kterém jsou hvězdičky, kola nebo samolepky, dostane `skolak`. Úvodní obrazovka je stejná jako dosud, přibyla jen dlaždice 🧠 paměť. |
| Nové zařízení | Stav bez postupu → obrazovka „Kdo bude hrát?“ (👧 Marianka / 👦 Rostík). Volba se uloží. Platí i pro tablet, kde se hra dosud jen otevřela. |
| Změna profilu | Jen v rodičovské obrazovce (dlouhý stisk nadpisu 2 s). Před změnou se stav odloží do `pocty-pred-zmenou-profilu-…`. Úrovně jsou pro každý typ úlohy zvlášť, nic se neztratí. |
| Záloha | Formát `POCTY1:` beze změny, profil je její součástí. Záloha z verzí 1–3 se obnoví jako `skolak`. |
| Samolepky | Společná sada 70 samolepek, sbírku má každý tablet vlastní. |

## Parametry profilu (`PROFILES` v logice)
| Parametr | Školák | Předškolák |
|---|---|---|
| Nadpis | Počítáme s Mariankou | Hrajeme si s Rostíkem |
| Úloh v kole | 10 | 6 |
| Možností v nabídce | 3–4 | 2 (úroveň 1), 3 (úrovně 2–3); „co nepatří“ 3 / 4 / 4 |
| Odpovědi | čísla, znaménka, obrázky | obrázky, tečky, barvy; číslice jen v typu Číslice |
| Velikost tlačítek | dosavadní | větší (třída `body.pre`) |
| Špatně napoprvé | zatřesení, červená, „Zkus to znovu“ | zakývání, šedá, „Zkus jiný“ |
| Špatně podruhé | fialově správná odpověď, „Příště to dáš“ | správná možnost pulzuje, „Klepni na to“, dítě ji klepne samo (bez hvězdičky) |
| Hlas | rychlost 0,92 | rychlost 0,8 |
| Adaptace | 4× napoprvé nahoru, 2× chyba dolů | 3× napoprvé nahoru, 2× chyba dolů |
| Konec kola | „Získala jsi …“ | „Získal jsi …“ |

## Úlohy předškoláka
| Typ | Úroveň 1 | Úroveň 2 | Úroveň 3 |
|---|---|---|---|
| Kolik? | 1–3 obrázky, odpověď kostka s tečkami | 1–5 | 1–6 rozházené; 30 % „Ukaž, kde jsou tři jablíčka“ (výběr skupinky) |
| Barvy | 4 základní barvy | 10 barev | „Najdi modré auto“ – jedna možnost se liší barvou, druhá věcí |
| Tvary | kruh, čtverec, trojúhelník | + obdélník, ovál, hvězda, srdce | najdi stejný tvar (jiná barva a velikost) |
| Velké a malé | větší / menší ze dvou | největší / nejmenší ze tří | nejdelší / nejkratší tužka, nejvyšší / nejnižší věž z kostek |
| Kde to je? | nahoře / dole | vlevo / vpravo | na stole / pod stolem / vedle stolu |
| Řady | AB | ABB, AAB | ABC, otazník i uprostřed |
| Co nepatří? | 2 zvířata + 1 dopravní prostředek (nebo naopak) | 3 + 1 z kategorií zvířata, doprava, jídlo, oblečení, hračky | ovoce × zelenina, létá × neletí |
| Dvojice | stejný obrázek | kdo dělá „bú“, co má rád zajíček | čí je to stín |
| Číslice | 1–3 | 1–5 | 1–9; „Kde je číslo pět?“ nebo číslice k obrázkům |

- Číslice se odemknou, když „Kolik?“ poprvé dosáhne úrovně 2 (`digitOpen`, zůstanou odemčené i po poklesu). Do té doby je dlaždice šedá a hlas vysvětlí proč.
- „Všechno“ míchá úlohy předškoláka rovnoměrně (bez zamčených číslic).
- Česká slova jsou skloňovaná podle rodu: jedno jablíčko / dvě jablíčka / pět jablíček, Najdi červený balónek / žlutou kostku / modré auto, Co má ráda opička?

## Paměť a pozornost (oba profily)
Dlaždice 🧠 paměť → podnabídka se šesti hrami. Obtížnost d 1–5: předškolák úroveň 1–3 = d 1–3, školák úroveň 1–3 = d 3–5.

| Hra | Co trénuje | d1 → d5 |
|---|---|---|
| Co zmizelo? | krátkodobá zraková paměť | 3 → 8 obrázků, prohlížení 5–7 s s ubývajícím proužkem, opona, výběr ze 2 → 4 možností; d5 se zbylé obrázky zamíchají |
| Pexeso | paměť na polohu | 3 → 10 dvojic; jedno kolo = jedna plocha, hvězdička za dvojici; úroveň nahoru po 2 plochách s nejvýš tolika chybami, kolik je dvojic |
| Zopakuj | sluchově-zraková paměť na pořadí | zvířátka se rozsvítí a zahrají tón; 3 zvířátka a 2 kroky → 6 zvířátek a 5 kroků |
| Najdi všechny | výběrová pozornost | 6 → 20 políček, 2 → 5 hledaných; od d3 podobné obrázky (🍎 mezi 🍅 🍒 🍑) |
| Najdi rozdíl | soustředění, porovnávání | dvě mřížky 2×2 → 4×4; od d3 podobný obrázek, od d4 i chybějící obrázek |
| Stejná řada | zrakové rozlišování | vzor 2 → 4 značek, nabídky s prohozenými sousedy nebo jednou jinou značkou |

- Kromě pexesa se hry objevují i v režimu „všechno“ (20 % úloh) u obou profilů.
- Z paměťové hry vede 🏠 zpět do podnabídky.

## Změny v kódu
| Oblast | Změna |
|---|---|
| Logika | `SCHOOL_KINDS`, `PRE_KINDS`, `BRAIN`; `KINDS` = všechny tři (nové jen na konec); `PROFILES`; generátory `genPCount … genPDigit`, `genGone`, `genPairs`, `genSimon`, `genFind`, `genDiff`, `genSame`; `GEN[k](úroveň, profil)`; `adapt(…, up, down)`; `nextOp(mode, prev, profil, stav)`; `w(n, 'n')` (jedno, dvě); `migrate()` doplní profil; `STATE_VER` 4 |
| UI | obrazovky `#who` a `#brain`; dlaždice předškoláka; vyhodnocení rozdělené na `scoreOk` / `scoreMiss` (sdílí výběr z nabídky i interaktivní hry); nápověda předškoláka; kresby `objSVG`, `dotsSVG`, `pencilSVG`, `towerSVG`, ovál / hvězda / srdce v `shapeSVG`; `fitGrid` pro mřížky; rodičovská obrazovka: přepnutí profilu |
| `sw.js` | cache `pocty-v4` |
| Testy | `tests/faze4.part.js` (volá ho `tests/gen.test.js`) |

Rozdělení `index.html` na více souborů se v této fázi nedělalo: změnilo by seznam souborů v cache a obnášelo riziko pro offline běh na Mariančině tabletu, přitom by nic nepřineslo.

## Ověření
- `node tests/gen.test.js`: původní testy fází 1–3 a nově:
  - 4 000 úloh na každý typ předškoláka a úroveň (počet a jednoznačnost možností, rozsahy, význam větší/menší, poloha ve scéně, perioda řad, právě jeden vetřelec z jiné kategorie, barva + věc, zvuky a jídlo zvířat, texty);
  - 2 000 úloh na každou hru paměti a pozornosti, úroveň a profil (velikost scény, jediný rozdíl v mřížkách, dvojice v pexesu, počet hledaných obrázků, podobné obrázky);
  - mix podle profilu, odemčení číslic, adaptace 3/2;
  - migrace v3 → v4 (Mariančin stav), v1/v2 → v4, stav bez postupu → výběr hráče, záloha s profilem. Vše OK.
- Headless Chromium (podstrčený hlas):
  - Mariančin stav v3 na tabletu na šířku: profil `skolak`, 412 hvězdiček, 6 samolepek, úrovně beze změny, stejný nadpis a dlaždice. Kolo „všechno“ s chybami, všech 6 her paměti na úrovni 1 a 3, reload.
  - Nové zařízení na výšku: výběr hráče → Rostík, všech 9 typů na všech úrovních včetně jedné a dvou chyb (nápověda „Klepni na to“), hry paměti, odemčení číslic, „všechno“ jen s úlohami předškoláka.
  - Telefon: vybrané typy na úrovni 3, přepnutí profilu v rodičovské obrazovce a zpět, záloha a obnova se zachováním profilu.
  - Tablet ve verzi 3 bez postupu → výběr hráče.
  - Bez chyb v konzoli.
- Neověřeno: skutečný hlas a dotyk na tabletech, srozumitelnost zadání pro čtyřleté dítě.

## K ručnímu ověření
1. Mariančin tablet: otevřít s internetem (aplikaci na ploše zavřít a otevřít). Vše jako dřív, navíc dlaždice 🧠 paměť.
2. Rostíkův tablet: otevřít https://janzahradka.github.io/pocty/, „Přidat na plochu“, vybrat 👦 Rostík. Pokud se místo výběru zobrazí Mariančina obrazovka (hra se na tabletu už hrála), přepnout profil v rodičovské obrazovce (dlouhý stisk nadpisu).
3. Sledovat u Rostíka: rozumí zadání bez pomoci, trefí tlačítka, nefrustrují ho chyby, je kolo (6 úloh) dost krátké, je hlas dost pomalý.
4. Zaznamenat poznatky pro úpravu `PROFILES` (délka kola, rychlost hlasu, adaptace) a úrovní.

## Návrhy na další fázi
- Marianka: úrovně 4–5 stávajících typů (počty do 100, násobilka, čtvrthodiny, peníze s bankovkami), sudá/lichá, slovní úlohy.
- Rodičovský přehled úspěšnosti podle typu úlohy.
