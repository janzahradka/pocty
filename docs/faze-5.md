# Fáze 5 – čeština / angličtina, kratší zadání

## Cíl fáze
- Přepínač 🇨🇿 / 🇬🇧, kterým dítě kdykoli přepne hru do češtiny nebo angličtiny a zároveň si nechá přečíst celé zadání úlohy v tom jazyce.
- Méně opakovaného textu: celé zadání jen v první úloze bloku, u dalších úloh stejného typu krátké.

## Přepínač jazyka
| Položka | Řešení |
|---|---|
| Umístění | Lišta úlohy (vedle 🔊), úvodní obrazovka, výběr hráče a podnabídka paměti (vpravo nahoře). Vlajky jsou kreslené v SVG, fungují i na zařízeních bez emoji vlajek. Aktivní jazyk má oranžový rámeček. |
| Klepnutí během úlohy | Přepne jazyk celé hry a hned přečte **celé** zadání v tom jazyce. U „Co zmizelo?“ během prohlížení přečte úvod. |
| Klepnutí mimo úlohu | Přepne jazyk a řekne „Čeština!“ / „English!“. |
| Co se přepne | Všechno mluvené (zadání, pochvaly, „zkus to znovu“, vysvětlení, konec kola, album, názvy her) a viditelné popisky (nadpis, dlaždice, tlačítka, upozornění na chybějící hlas). Rodičovská obrazovka zůstává česky. |
| Uložení | `state.lang` (`cs` / `en`), `STATE_VER` 5. Starší stav dostane `cs`. Jazyk se pamatuje i po zavření hry. |
| Hlas | Čeština: hlas `cs-*`. Angličtina: přednostně britský `en-GB` (vlajka), jinak jakýkoli anglický. Když zvolený hlas chybí, úvodní obrazovka to oznámí v daném jazyce. |
| 🔊 a 👂 | Vždy čtou celé zadání v aktuálním jazyce. |

Angličtina: čísla se vyslovují číslicemi (hlas je přečte), čas „half past 7“, peníze „crowns“, britské tvary („colours“, „ladybird“). Nadpisy: „Counting with Marianka“, „Playing with Rostík“.

## Kratší zadání
- Blok = úlohy stejného typu a varianty jdoucí v kole za sebou (`variantKey`: typ, úroveň a varianta, např. placení × vracení peněz, ručičky × výběr ciferníku). První úloha bloku má celé zadání, další krátké. Nové kolo začíná celým zadáním. V režimu „všechno“ se typ často mění, takže krátká zadání se tam uplatní méně.
- Pochvala s vysvětlením se v opakované úloze zkrátí, když dítě odpoví napoprvé. Po opravě (napodruhé) a po chybě zůstává celé vysvětlení.

| Typ | Celé zadání | Krátké |
|---|---|---|
| Hodiny 1 | Kolik je hodin? Malá ručička ukazuje hodiny, velká ručička je nahoře. | Kolik je hodin? |
| Hodiny – pochvala | Ano, je půl osmé. To je sedm hodin třicet minut. | Ano, je půl osmé. |
| Peníze – součet | Kolik je tu korun? Sečti mince. | Kolik je tu korun? (pochvala „Ano, šestnáct korun.“) |
| Peníze – placení | Lízátko stojí sedm korun. Kterými mincemi zaplatíš přesně? | Zaplať sedm korun. |
| Peníze – vracení | Máš dvacet korun. Knížka stojí třináct korun. Kolik korun ti zbyde? | Kolik korun ti zbyde? |
| Souměrnost | Obrázek má být souměrný podle červené čáry. Která polovina patří vpravo? | Která polovina patří vpravo? |
| Násobení s obrázky | Je tu pět skupinek. V každé jsou dva obrázky. Kolik je to dohromady? | Kolik je pět krát dva? |
| Sčítání s obrázky | Kolik je tři plus dva? Spočítej obrázky. | Kolik je tři plus dva? |
| Porovnávání | Porovnej devět a sedm. Které znaménko patří doprostřed? | Porovnej devět a sedm. |
| Řady | Co patří místo otazníku? Podívej se, jak se obrázky opakují. / Které číslo chybí v řadě? Čísla skáčou po dvou. | Co patří místo otazníku? / Které číslo chybí? |
| Tvary – počítání | Kolik je tu trojúhelníků? Spočítej je. | Kolik je tu trojúhelníků? |
| Kolik? (Rostík) | Kolik je tu jablíček? Spočítej je. | Kolik je tu jablíček? |
| Číslice (Rostík) | Které číslo patří k obrázkům? Spočítej je. | Které číslo patří k obrázkům? |
| Stejný tvar / obrázek, stín | Najdi stejný tvar, jako je nahoře. / Čí je to stín? Najdi obrázek, který k němu patří. | Najdi stejný tvar. / Čí je to stín? |
| Co zmizelo? | Dobře si prohlédni obrázky. Pak jeden zmizí. | Prohlédni si obrázky. |
| Zopakuj | Dívej se a poslouchej. Pak to zopakuj. | Dívej se a poslouchej. |
| Najdi rozdíl / Stejná řada | Obrázky jsou skoro stejné. Najdi, co je jinak. / Najdi úplně stejnou řadu, jako je nahoře. | Najdi, co je jinak. / Najdi stejnou řadu. |

Úlohy, jejichž zadání je už krátké („Kolik je osm plus pět?“, „Najdi kruh.“, „Co je pod stolem?“, „Kdo dělá bú?“), se nemění.

## Změny v kódu
| Oblast | Změna |
|---|---|
| Logika | `textEN(t)` – anglické texty ze strukturovaných dat úlohy; `textCS(t)` – české krátké tvary; `texts(t, lang)` s doplněním `short` / `okShort` / `introShort`; `variantKey(t)`; `posEN` (překlad polohy); `posTask` ukládá `phrase`; `PROFILES.titleEn`; `migrate()` doplní `lang`; `STATE_VER` 5. České generátory beze změny. |
| UI | slovník hlášek `TX.cs` / `TX.en`, `MODE_EN`; `say()` volí hlas podle jazyka; vlajky (`flagSVG`, `setLang`, `applyLang`); `data-en` u popisků; `nextTask` nastaví `useShort`; `scoreOk` používá kratší pochvalu; `sayFull` pro vlajky, 🔊 a 👂 |
| `sw.js` | cache `pocty-v5` |
| Testy | `tests/faze5.part.js` |

## Ověření
- `node tests/gen.test.js`:
  - Pro všechny typy úloh, úrovně a oba profily (1 500 úloh na kombinaci) existují oba jazyky: celé zadání, krátké (nikdy delší než celé), pochvala a vysvětlení. V textech není undefined/NaN a v angličtině žádné české znaky.
  - Konkrétní věty (hodiny, poloha, krátké zadání hodin), klíče variant (placení ≠ vracení), migrace v4 → v5, neznámý jazyk, záloha s jazykem.
  - Testy fází 1–4 beze změny. Vše OK.
- Headless Chromium:
  - Mariančin stav v4 → v5 (čeština, hvězdičky zůstaly).
  - Hodiny: první úloha celé zadání, druhá „Kolik je hodin?“ a kratší pochvala.
  - 🇬🇧 během úlohy přečte celé anglické zadání, další úloha je anglicky a krátce, 🇨🇿 vrátí celé české zadání.
  - Anglické popisky a nadpis, jazyk po reloadu, celé kolo „všechno“ a 9 dalších typů v angličtině bez jediné české věty.
  - Rostík v angličtině na telefonu (8 typů, úrovně 1 a 3, anglická nápověda po druhé chybě), návrat do češtiny.
  - Regresní test fáze 4 (všechny typy obou profilů, migrace, přepnutí profilu, záloha) prochází. Bez chyb v konzoli.
- Neověřeno: anglický hlas na tabletech (dostupnost en-GB, výslovnost).

## K ručnímu ověření
1. Na tabletu zkusit 🇬🇧: musí zaznít anglický hlas. Když se objeví upozornění na chybějící anglický hlas, doinstalovat angličtinu (UK) v nastavení převodu textu na řeč.
2. Hodiny nebo peníze: první úloha dlouze, další krátce. Při nejasnosti 🇨🇿 přečte celé zadání.
