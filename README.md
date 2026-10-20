# Počítáme s Mariankou

Matematická hra na tablet pro prvňáčka: sčítání a odčítání do 20, jednoduché násobení a dělení, porovnávání (< = >), geometrické tvary, umístění předmětů (vlevo, vpravo, nad, pod), řady, hodiny, peníze a souměrnost. Pokyny čte hlas (čeština, Web Speech API), odpověď se volí ze čtyř velkých tlačítek, zpětná vazba je okamžitá. Za správné odpovědi hvězdičky, za každé dokončené kolo samolepka do alba.

Hra: https://janzahradka.github.io/pocty/ (po zapnutí GitHub Pages)

- `index.html` – celá aplikace v jednom souboru. Blok `<script id="logic">` (generátory úloh, čeština, adaptace obtížnosti) je bez DOM a testuje se v Node.
- Postup (hvězdičky, samolepky, úrovně) ukládá zařízení do localStorage (`pocty-v1`). Klíč se mezi verzemi nemění, nové verze stav jen doplní (`migrate()`).
- Záloha pro rodiče: dlouhý stisk (2 s) na nadpis na úvodní obrazovce → zkopírovat / obnovit zálohu.
- PWA: `manifest.webmanifest`, `sw.js`. Na tabletu „Přidat na plochu“ → běží na celou obrazovku a po prvním načtení i offline.
- Test logiky: `node tests/gen.test.js`.

## Hlas
Pokyny používají systémový český hlas zařízení. Když chybí, úvodní obrazovka zobrazí upozornění.
- Android: Nastavení → Usnadnění / Systém → Převod textu na řeč → Google → nainstalovat hlasová data „čeština“.
- iPad: Nastavení → Zpřístupnění → Mluvený obsah → Hlasy → Čeština (Zuzana / Iveta).

## Nasazení
Repozitář veřejný, GitHub Pages ze složky root větve `main`. Při každé změně souborů zvýšit `CACHE` v `sw.js`. Při změně tvaru uloženého stavu zvýšit `STATE_VER` a rozšířit `migrate()` (nikdy neměnit `STATE_KEY` ani pořadí `STICKERS`, nové samolepky jen na konec).

## Fáze
- [Fáze 1](docs/faze-1.md) – první hratelná verze
- [Fáze 2](docs/faze-2.md) – porovnávání, tvary, kde to je, řady; zachování úspěchů a záloha
- [Fáze 3](docs/faze-3.md) – hodiny, peníze, souměrnost
