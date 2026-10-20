# Fáze 1 – první hratelná verze

## Cíl fáze
Hra, kterou si Marianka vyzkouší na tabletu: čtyři početní operace, mluvené pokyny, okamžitá zpětná vazba, odměny. Na základě jejího hraní se upraví obtížnost a herní prvky ve fázi 2.

## Architektura
- Jeden soubor `index.html` (HTML + CSS + JS), bez knihoven. Písmo Baloo 2 z Google Fonts, bez sítě záložní systémové písmo.
- `<script id="logic">`: generátory úloh `GEN.add/sub/mul/div(level)`, nabídka odpovědí `choices()`, adaptace `adapt()`, čísla slovy `w()` a skloňování `pl()`. Bez DOM, testováno v Node.
- Druhý skript: obrazovky, hlas (`speechSynthesis`, český hlas `cs-*`), zvukové efekty (Web Audio, generované tóny, bez souborů), uložený stav v localStorage.
- PWA převzaté z karavan-holdem: `manifest.webmanifest`, `sw.js` (síť napřed, bez sítě cache; písma cache napřed), ikony, `.nojekyll`.

## Obrazovky
| Obrazovka | Obsah |
|---|---|
| Domů | 5 dlaždic: + − · : 🎲 (všechno). Pod každou operací úroveň ●○○. Počet hvězdiček a samolepek. Tlačítko Samolepky. Upozornění, když zařízení nemá český hlas. |
| Hra | 10 úloh v kole. Nahoře: domů, 10 teček postupu, počet hvězdiček, 🔊 zopakovat zadání. Uprostřed obrázky (nižší úrovně) a příklad s „?“. Dole 4 tlačítka s čísly vzestupně. |
| Konec kola | Hvězdičky za kolo, nová samolepka (animace), Znovu / Domů. |
| Album | 40 míst na samolepky (zvířátka). |

## Úlohy a úrovně
| Operace | Úroveň 1 (obrázky) | Úroveň 2 | Úroveň 3 (jen čísla) |
|---|---|---|---|
| Sčítání | a, b 1–5 (součet ≤ 10), dvě skupinky obrázků | do 20 bez přechodu přes desítku | přechod přes desítku (7 + 5); 30 % „5 + ? = 12“ |
| Odčítání | do 10, odečtené obrázky přeškrtnuté | do 20 bez přechodu, 1x − 10 | přechod přes desítku (13 − 6); 30 % „13 − ? = 7“ |
| Násobení | 2–3 skupinky po 2–4 obrázcích | skupinky, součin ≤ 20 | čísla, a 2–5 × b 2–6, ≤ 30 |
| Dělení | bonbóny mezi 2 kamarády | mezi 2–4 kamarády, ≤ 20 | čísla, ≤ 30 |

Značky jako ve škole: `·` a `:`. Mix: sčítání a odčítání 2× častěji než násobení a dělení.

## Zpětná vazba a odměny
- Správně: tlačítko zezelená, „?“ se vyplní, stoupavý tón, hlas „Správně! / Výborně! / Paráda!…“, 3 hvězdičky odletí k počítadlu. U dělení s obrázky se bonbóny rozdělí na talířky.
- Špatně napoprvé: tlačítko se zatřese, zčervená a zablokuje, hlas „Zkus to znovu.“
- Špatně podruhé: zvýrazní se správné číslo (fialově), hlas „Správně je X. Příště to dáš!“, pokračuje se.
- Hvězdička za každou správnou odpověď (i napodruhé). Série 3, 5, 10, … napoprvé: nápis a pochvala navíc.
- Samolepka za každé dokončené kolo bez ohledu na výsledek (odměna za snahu). Kolo celé napoprvé: zvláštní pochvala.

## Adaptivní obtížnost (pro každou operaci zvlášť)
- 4 úlohy za sebou napoprvé → úroveň +1 (max 3).
- 2 úlohy za sebou ne napoprvé → úroveň −1 (min 1).
- Start na úrovni 1. Úroveň se ukládá a je vidět na dlaždici.

## Ověření
- `node tests/gen.test.js`: 5 000 úloh na každou operaci a úroveň – celá nezáporná čísla, rozsahy podle tabulky, přechod / bez přechodu přes desítku, 4 různé nabídky se správnou odpovědí, české věty (skupinky, bonbóny, kamarádi, „děleno pěti“, „jednu hvězdičku“), adaptace. Vše OK.
- Headless Chromium s podstrčeným hlasem: celá kola v režimech Mix (tablet na šířku 1180 × 820), Dělení (tablet na výšku 820 × 1180), Násobení (telefon 390 × 844), včetně dvou chybných odpovědí, konce kola, alba a obnovení po reloadu. Bez chyb v konzoli, hvězdičky a samolepky přežijí reload.
- Neověřeno: skutečný hlas na tabletu (výslovnost, rychlost), dotykové ovládání na reálném zařízení, instalace PWA.

## K ručnímu ověření na tabletu
1. Při prvním otevření zaznít „Sčítání!“ po klepnutí na dlaždici a pak zadání. Když se zobrazí červené upozornění na hlas, doinstalovat češtinu (README).
2. 🔊 zopakuje zadání.
3. Špatná odpověď → zatřesení a „Zkus to znovu“; druhá špatná → ukázání správné odpovědi.
4. Po 10 úlohách samolepka; v albu je vidět.
5. Zavřít a znovu otevřít → hvězdičky, samolepky a úrovně zůstanou.

## Otázky pro fázi 2 (podle Mariančina hraní)
- Je úroveň 1 příliš snadná / úroveň 3 příliš těžká? Mají se úrovně posouvat rychleji?
- Je hlas srozumitelný a dost pomalý?
- Baví ji samolepky, nebo chce jinou odměnu (postavička, která roste, mapa s cestou, odemykání světů)?
- Mají přibýt další typy úloh: porovnávání (<, >, =), číselná řada, počítání po desítkách, slovní úlohy?
- Rodičovský přehled (kolik úloh, úspěšnost podle operace)?
