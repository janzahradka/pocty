# Fáze 8 – robot, bludiště v desítkách políček

## Robot 🤖
Nová úloha pro oba profily: Marianka ji má v 🧩 logice, Rostík na úvodní obrazovce.

| Prvek | Pravidlo |
|---|---|
| Ovládání (od verze 10) | Tlačítka rozložená jako šipky na klávesnici: nahoře skok přes kámen, dole dopředu, vlevo otočení doleva o 90°, vpravo otočení doprava o 90°. Dozadu robot nechodí, nahradí to otočení. Na klávesnici stejně (šipka nahoru = skok, dolů = dopředu), mezerník = skok, Enter = spustit program, Backspace = smazat příkaz. |
| Do strany | Robot nikdy nejde do strany sám: musí se nejdřív otočit, pak jít dopředu. |
| Překážky | 🪨 kámen se dá přeskočit (skok přes jedno políčko, jen přes kámen), 🌳 strom ne. Mimo plochu robot nejde. |
| Náraz | „Bum! Tudy robot neprojde.“, robot zůstane stát, plocha se zatřese. |
| Cíl | Dojít k 🏁 a cestou posbírat všechny 🍬. Když robot dojde k vlajce bez bonbonů: „Nejdřív posbírej všechny bonbony.“ |
| Napoprvé (hvězdička se počítá do postupu) | Bez nárazu a nejvýš o polovinu víc kroků (aspoň +2) než nejkratší řešení. U programování = program prošel hned napoprvé. |

### Úrovně (bez stropu)
| Úroveň | Plocha | Obsah |
|---|---|---|
| 1 | 5 × 4 | vlajka rovně před robotem |
| 2 | 6 × 4 | je potřeba zatočit |
| 3 | 6 × 5 | kameny (řešení vyžaduje skok), 1 bonbon |
| 4–6 | 7 × 5 až 8 × 6 | víc stromů a kamenů, 2 bonbony |
| 7+ | až 12 × 9 | 3–5 bonbonů, hustší překážky |

- **Programování:** od úrovně 6 (Rostík od 8) se příkazy nejdřív naskládají do řádku a spustí ▶️.
  - Robot je provádí jeden po druhém a aktuální příkaz se zvýrazní.
  - Když narazí, chybný příkaz se zčervená, robot se vrátí na start a program zůstane k opravě (⌫ maže poslední příkaz).
  - Když program skončí před vlajkou: „Robot nedošel k vlajce. Přidej další příkazy.“
  - Nejkratší program má nejvýš 24 příkazů.
- Generátor každou plochu vyřeší prohledáním do šířky (poloha × směr × sebrané bonbony) a uloží nejkratší řešení.
  - Na úrovni 1 je řešení jen „dopředu“, na úrovni 2 obsahuje otočení, od úrovně 3 skok.
  - Průměrná délka řešení: úroveň 3 ≈ 11 příkazů, úroveň 10 ≈ 18.

## Úprava robota (verze 10 = ☀️ sluníčko)
Podle vyzkoušení na tabletu:
- Robot je nakreslený **shora jako postava**: hlava s hledím, ramena a ruce míří dopředu.
  - Při otočení se celý plynule otočí, při kroku plynule přejede.
  - Šipka u robota zmizela.
  - Úhel se sčítá, takže se robot vždy točí kratší cestou.
- Ikony tlačítek:
  - dopředu: robot z profilu se zelenou šipkou vpřed,
  - skok: robot z profilu a přerušovaný oblouk přes kámen,
  - otočení: robot shora s obloukovou šipkou.
- Zrušená chůze dozadu: solver ji nepoužívá a test hlídá, že žádné řešení neobsahuje krok dozadu.
- Zadání: „Spodní tlačítko pošle robota dopředu. Do strany musí robot nejdřív zatočit. Horní tlačítko přeskočí kámen.“
- Ověřeno v headless Chromiu:
  - otočení celé postavy, rozložení tlačítek (nahoře skok, dole dopředu, po stranách otočení), žádné tlačítko dozadu, ovládání klávesnicí,
  - celá kola robota včetně programování,
  - tablet i telefon.

## Bludiště v desítkách políček
| Velikost | Rozměr (na šířku) | Bludišť v kole |
|---|---|---|
| malé | 8 × 6 | 5 |
| střední | 16 × 12 | 5 |
| velké | 24 × 18 | 3 |
| obří | 36 × 26 | 2 |
| gigantické | 50 × 36 | 1 |

- Políčko je nejméně 38 px (telefon 30 px), aby šlo trefit prstem.
- Velká bludiště se na obrazovku nevejdou: plocha se posouvá tahem prstu a po každém pohybu sama dojede za myškou.
- Myška se rozjede klepnutím (ne dotykem), takže posunutí plochy prstem ji nerozjede.
- Úroveň, klíče a mlha fungují stejně jako ve fázi 7.

## Stav a verze
- `STATE_VER` 8. Přibyl typ `robot` (úroveň 1) a velikost `XXL`. Ostatní beze změny.
- Verze na loďce: 9 = 🚗 autíčko, 10 = ☀️ sluníčko (úprava robota). Cache `pocty-v10`.

## Ověření
- `node tests/gen.test.js` (+ `tests/faze8.part.js`):
  - Robot: obě profily, úrovně 1–30. Uložené řešení opravdu dojde k vlajce se všemi bonbony a solver dává stejnou délku. Úroveň 1 jen dopředu, úroveň 2 se zatočením, od úrovně 3 kameny. Programování od správné úrovně, délka programu ≤ 24.
  - Pravidla pohybu (kámen, strom, okraj, skok jen přes kámen, sebrání bonbonu skokem), růst obtížnosti, oba jazyky, vyhrazená pole.
  - Bludiště ve všech pěti velikostech na šířku i na výšku.
  - Migrace v7 → v8. Testy fází 1–7 (fáze 7 upravená na nové rozměry a nezávislá na čísle verze). Vše OK.
- Headless Chromium:
  - Mariančin stav v7 → v8. Robot na úrovních 1, 2, 3, 5, 6, 9: přímé ovládání i programování, s nárazem, nedokončeným programem a opravou. Postup úrovní, ovládání klávesnicí.
  - Obří bludiště se posouvá (políčko 38 px) a kolo má 2 bludiště. Gigantické 50 × 36. Výběr z 5 velikostí.
  - Rostík na tabletu na výšku a na telefonu: robot, postup, programování na úrovni 8 v angličtině.
  - Bez chyb v konzoli.
- Neověřeno: posouvání bludiště prstem na skutečném tabletu.
