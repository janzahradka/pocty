# Fáze 7 – úrovně bez stropu, těžší bludiště, opravené váhy

## Podnět
- Bludiště bylo moc lehké (i pro Rostíka). Marianka prošla 5 úrovní a narazila na strop (🏆), další bludiště už nebyla.
- Úlohy, kde to jde, mají mít obtížnost bez stropu. Bludiště má mít výběr velikosti.
- Váhy byly matoucí:
  - prázdná miska ukazovala „? 🍎“, takže to vypadalo, že tam jedno jablko už leží;
  - otázka často jen opakovala zadanou váhu.

## Úrovně bez stropu
| Úloha | Profil | Co roste po úrovni 5 |
|---|---|---|
| Bludiště | oba | tvar chodeb, klíče, náhodný start a cíl, mlha (viz níže) |
| Sudoku | školák | 6 × 6: 20 a 26 prázdných; od úrovně 8 9 × 9 s 30 prázdnými a +5 za úroveň (nejvýš 55) |
| Zopakuj | školák | sekvence 8, 9, … až 14 kroků |
| Pexeso | školák | 16, 18, … až 24 dvojic |
| Co zmizelo? | školák | víc obrázků (až 14) a kratší prohlížení (až 3,5 s) |
| Najdi všechny | školák | větší plocha (až 48 políček, 12 hledaných) |
| Najdi rozdíl | školák | 6 × 5, téměř vždy podobný obrázek |
| Stejná řada | školák | řady až 8 značek |

- Dlaždice úlohy bez stropu ukazuje „★ 7“ místo ●●●○○.
- Postup se dál ohlašuje („Postupuješ na úroveň osm!“).
- Počty, hodiny, peníze a ostatní úlohy školáka zůstávají na 5 úrovních, předškolák na 3 (kromě bludiště).

## Bludiště
- **Výběr velikosti** před kolem: malé 8 × 6, střední 12 × 8, velké 16 × 11, obří 22 × 15 (na výšku otočené). Volba se pamatuje (`state.mazeSize`). Výchozí je u Rostíka malé, u Marianky střední.

| Úroveň | Chodby | Klíče | Start a cíl | Mlha |
|---|---|---|---|---|
| 1 | dlouhé chodby, málo odboček | – | levý horní → pravý dolní roh | – |
| 2 | méně dlouhé | – | stejně | – |
| 3 | půl na půl | 1 | stejně | – |
| 4 | víc odboček | 1 | náhodné protilehlé rohy | – |
| 5–6 | samé odbočky a slepé uličky | 2 | náhodné | – |
| 7–8 | stejně | 3 | náhodné | – |
| 9–11 | stejně | 3 | náhodné | vidí 4 políčka kolem prošlé cesty |
| 12–14 / 15+ | stejně | 3 | náhodné | 3 / 2 / 1 políčko |

- Algoritmus „rostoucí strom“: podíl prohledávání do hloubky klesá s úrovní o 20 %, takže na úrovni 1 jsou dlouhé chodby a od úrovně 6 Primovo bludiště s mnoha odbočkami. Velké bludiště má na úrovni 6 v průměru 2,5× víc slepých uliček než na úrovni 1 (ověřeno testem).
- Klíče jsou ve slepých uličkách co nejdál od cesty a od sebe. Sýr je zamčený, dokud myška nemá všechny. Nahoře se ukazuje, kolik klíčů už má.
- „Napoprvé“: cesta nejvýš 1,5× delší (+2) než nejkratší cesta přes všechny klíče (počítá se přes všechna pořadí klíčů).
- Rostík má bludiště na úvodní obrazovce (13. dlaždice) a úroveň také bez stropu.

## Váhy
- Otázka se nikdy neshoduje s levou miskou zadané váhy:
  - úroveň 1: 2–3 banány;
  - úroveň 2: víc banánů nebo banány s jablkem;
  - úroveň 3: dva melouny nebo meloun s banánem;
  - úroveň 4: 2–3 banány při „🍌 + 2 🍎 = 6 🍎“;
  - úroveň 5: součty dvou druhů nebo dva kusy.
- Prázdná miska ukazuje „? × 🍎“ (jablko poloprůhledné), aby nevypadala, že jablko už leží na misce.
- Zadání: „Kolik jablek musí být na prázdné misce, aby to vážilo stejně?“
- Mezi nabídkami je typická chyba: výsledek pro jeden kus.

## Opravené chyby nalezené testy
- **Pád hry v bludišti od úrovně 4:** pole `start` (startovní políčko) kolidovalo s `task.start`, kterou UI volá jako funkci pro spuštění úlohy. Dokud byl start vždy v rohu 0, chyba se neprojevila. Pole je přejmenované na `entry` a nový test hlídá, že žádný generátor nepoužívá vyhrazená pole (`start`, `repeat`, `play`, `hidden`, `useShort`).
- **Stejná řada s dlouhými řadami:** 4 odpovědi po 8 značkách se nevešly na šířku tabletu. Teď jsou ve 2 sloupcích s písmem podle šířky.

## Stav
- `STATE_VER` 7, nově `mazeSize`. Uložené úrovně zůstávají; úroveň nad maximem se omezí, nesmyslná se vrátí na 1.
- Verze na loďce: 8 = 🐍 had.
- Cache `pocty-v8`.

## Ověření
- `node tests/gen.test.js` (+ `tests/faze7.part.js`):
  - Bludiště ve 4 velikostech, na šířku i na výšku, úrovně 1–20: strom, obousměrné stěny, vše dosažitelné, počet klíčů, nejkratší cesta nezávisle přepočítaná, mlha.
  - Sudoku úrovně 6–15: jednoznačnost, nestačí řádek.
  - Paměť a pozornost do úrovně 99: limity a správnost.
  - Váhy: otázka ≠ zadání (3 000 úloh na úroveň), výsledek odpovídá rovnicím.
  - Úrovně bez stropu v `adapt`, migrace v6 → v7, vyhrazená pole.
  - Testy fází 1–6 (upravené pro nový tvar bludiště a maxima). Vše OK.
- Headless Chromium:
  - Mariančin stav v6 s bludištěm na 5 → postup na 6 s ohlášením.
  - Výběr velikosti, celá kola velkého (2 klíče), obřího (3 klíče) a s mlhou; robot jede nejkratší cestou přes všechny klíče.
  - Sudoku 6 × 6 a 9 × 9, paměť na úrovni 9, váhy na všech úrovních, anglické zadání bludiště.
  - Rostík na tabletu na výšku a na telefonu: výchozí malé bludiště otočené 6 × 8, postup.
  - Regrese fází 4–6. Bez chyb v konzoli.
- Neověřeno: ovládání obřího bludiště prstem na telefonu (políčka kolem 15 px), u telefonu je vhodnější malé nebo střední.
