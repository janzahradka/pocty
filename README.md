# Počítáme s Mariankou

Hra na tablet se dvěma profily: **školák** (Marianka, 1. třída) a **předškolák** (Rostík, 4 roky). Profil se vybere při prvním spuštění na zařízení, změnit ho jde v rodičovské obrazovce. Oba profily mají hry na paměť a pozornost (co zmizelo, pexeso, zopakuj pořadí, najdi všechny, najdi rozdíl, stejná řada).

Školák: sčítání a odčítání do 20, jednoduché násobení a dělení, porovnávání (< = >), geometrické tvary, umístění předmětů (vlevo, vpravo, nad, pod), řady, hodiny, peníze a souměrnost. Pokyny čte hlas (čeština, Web Speech API), odpověď se volí ze čtyř velkých tlačítek, zpětná vazba je okamžitá. Za správné odpovědi hvězdičky, za každé dokončené kolo samolepka do alba.

Předškolák: kolik jich je, barvy, tvary, velké a malé, kde to je, řady, co sem nepatří, dvojice, číslice. Odpovědi obrázkem, 2–3 možnosti, kratší kolo, pomalejší hlas. Parametry profilů jsou v `PROFILES`.

Úrovně: školák 1–5, předškolák 1–3; bez stropu: bludiště (oba), sudoku a paměť a pozornost (školák). Logika (školák): bludiště, sudoku s obrázky, váhy.

Verze: loďka vlevo dole na úvodní obrazovce veze obrázek verze (🐍 had = verze 8). Seznam je v `VERSIONS`, podrobnosti v rodičovské obrazovce.

Jazyk: vlajky 🇨🇿 / 🇬🇧 kdykoli přepnou hru a přečtou celé zadání v daném jazyce. Další úloha stejného typu má krátké zadání.

Hra: https://janzahradka.github.io/pocty/ (po zapnutí GitHub Pages)

- `index.html` – celá aplikace v jednom souboru. Blok `<script id="logic">` (generátory úloh, čeština, adaptace obtížnosti) je bez DOM a testuje se v Node.
- Postup (hvězdičky, samolepky, úrovně) ukládá zařízení do localStorage (`pocty-v1`). Klíč se mezi verzemi nemění, nové verze stav jen doplní (`migrate()`).
- Záloha pro rodiče: dlouhý stisk (2 s) na nadpis na úvodní obrazovce → zkopírovat / obnovit zálohu.
- PWA: `manifest.webmanifest`, `sw.js`. Na tabletu „Přidat na plochu“ → běží na celou obrazovku a po prvním načtení i offline.
- Test logiky: `node tests/gen.test.js` (včetně `tests/faze4.part.js` až `tests/faze7.part.js`).

## Hlas
Pokyny používají systémový český hlas zařízení. Když chybí, úvodní obrazovka zobrazí upozornění.
- Android: Nastavení → Usnadnění / Systém → Převod textu na řeč → Google → nainstalovat hlasová data „čeština“.
- iPad: Nastavení → Zpřístupnění → Mluvený obsah → Hlasy → Čeština (Zuzana / Iveta).

## Nasazení
Repozitář veřejný, GitHub Pages ze složky root větve `main`. Při každé změně souborů zvýšit `CACHE` v `sw.js` a přidat řádek do `VERSIONS` v `index.html` (nový obrázek na loďce). Generátory úloh nesmí nastavovat pole `start`, `repeat`, `play`, `hidden`, `useShort` (UI je používá jako funkce a stav). Při změně tvaru uloženého stavu zvýšit `STATE_VER` a rozšířit `migrate()` (nikdy neměnit `STATE_KEY` ani pořadí `STICKERS`, nové samolepky jen na konec).

## Fáze
- [Fáze 1](docs/faze-1.md) – první hratelná verze
- [Fáze 2](docs/faze-2.md) – porovnávání, tvary, kde to je, řady; zachování úspěchů a záloha
- [Fáze 3](docs/faze-3.md) – hodiny, peníze, souměrnost
- [Fáze 4](docs/faze-4.md) – předškolák (Rostík), paměť a pozornost
- [Fáze 5](docs/faze-5.md) – čeština / angličtina, kratší zadání
- [Fáze 6](docs/faze-6.md) – úrovně 4–5, logika (bludiště, sudoku, váhy), verze na loďce
- [Fáze 7](docs/faze-7.md) – úrovně bez stropu, těžší bludiště s výběrem velikosti, opravené váhy
