# Website-sjabloon

Statische website zonder bouwstap. Alle tekst en instellingen staan in `.md`-bestanden die je gewoon in GitHub bewerkt (potloodje → wijzigen → *Commit changes*). Binnen een minuut staat het online.

Deze repository is een **voorbeeldsite** voor de fictieve *Studio Lumen*. Hij laat zien wat het sjabloon kan, en met de **stijlkiezer** kan een klant zelf kleuren, letters, logo en vorm uitproberen en zijn keuze opsturen.

| Pagina | Laat zien |
|---|---|
| `index.html` | Een complete site: held met bewegend patroon, kaarten, tijdlijn, citaten, tarieven, foto, veelgestelde vragen, contact met formulier en een "nu open"-script |
| `bouwstenen.html` | Elk onderdeel van het sjabloon, met de markdown erbij. Elke sectie heeft een hartje |
| `stijl.html` | De stijlkiezer: 12 paletten, 14 lettercombinaties, 12 logo's, 14 patronen, vorm, wensen en een samenvatting |
| `voorwaarden.html` | Inhoudsopgave met ankers, en een eigen menu voor alleen deze pagina |

## Bestanden

| Bestand | Inhoud |
|---|---|
| `site.md` | Instellingen voor de hele site: naam, logo, kleuren, fonts, menu, footer |
| `index.md`, `bouwstenen.md`, `stijl.md`, `voorwaarden.md` | De inhoud van een pagina |
| `*.html` | Vaste HTML; zegt alleen welke `.md`-bestanden de pagina gebruikt |
| `images/` | Logo, foto's en patronen |
| `code/` | `script.js` (leest de `.md`-bestanden) en `styles.css`; `stijlkiezer.js` en `stijlkiezer.css` voor de stijlkiezer |
| `.nojekyll` | Leeg bestand; voorkomt dat GitHub de `.md`-bestanden zelf omzet |

Tekst vóór de eerste `[markering]` in een `.md`-bestand wordt niet getoond; handig voor notities.

## Site-instellingen

```
[site]
naam: Studio Lumen
logo: images/logo.svg
titel: Studio Lumen · coaching en workshops     ← tabblad en Google
beschrijving: Korte omschrijving voor Google.
font-koppen: Fraunces                           ← naam zoals op fonts.google.com
font-tekst: Manrope
thema: licht                                    ← thema van de pagina, menubalk en secties zonder thema

[kleuren]
licht: #F6F4EF          ← het palet: eigen namen, als #rrggbb
zacht: #E3ECEC
donker: #14232B
primair: #1F4E5F
secundair: #2F5D5C
accent: #E9A84C

[thema primair]         ← een thema koppelt paletkleuren aan rollen; alle vijf verplicht
achtergrond: primair
tekst: licht
koppen: licht
accent: accent          ← labels, ==accent==, opsommingstekens, citaatstreep, tijdlijn, knoppen, onderstreping van links
knoptekst: donker       ← tekst op een knop (die de accentkleur heeft)
```

**Tip:** geef kleuren een naam naar hun *rol* (licht, donker, primair …), niet naar hun tint (groen, rood …). Dan vervang je het hele palet zonder dat er een thema hoeft te veranderen. De stijlkiezer werkt zo.

Verplicht zijn `titel`, `thema`, `font-koppen` en `font-tekst`. Ontbreekt er één, of klopt er iets niet (onbekende kleurnaam, fout in de opbouw), dan staat er een rode foutmelding bovenaan de pagina. Het menu is een lijst met links; de footer is vrije tekst:

```
[menu]
- [Aanbod](./#aanbod)
- [Voorwaarden](voorwaarden.html)
- [Contact](./#contact){.knop}      ← als knop in de accentkleur

[footer]
[rij verhouding=2:1]
[sectie thema=donker]
**Studio Lumen** · coaching en workshops

[sectie thema=donker]
[Algemene voorwaarden](voorwaarden.html)
```

De footer bestaat uit gewone rijen en secties (zie hieronder), alleen met minder ruimte en een kleinere letter. Alles na `[footer]` hoort bij de footer, dus `[footer]` staat altijd als laatste in het bestand.

**Per pagina afwijken:** zet hetzelfde blok in de `.md` van die pagina. Bij `[site]` en `[kleuren]` gelden alleen de regels die je daar noemt; `[thema …]`, `[menu]` en `[footer]` worden in hun geheel vervangen. Zie `voorwaarden.md` voor een eigen menu.

## Rijen en secties

```
[rij verhouding=1:2]
[sectie thema=primair]
...tekst...
[sectie thema=accent koppen=donker patroon=images/stippen.svg schaal=2]
...tekst...
```

- Een `[rij]` heeft één of twee secties. Op mobiel staan ze onder elkaar.
- Bij twee secties blijft de kortste staan tijdens het scrollen (als hij op het scherm past).
- Opties schrijf je als `naam=waarde`, zonder spaties in de waarde, gescheiden door een spatie. Een onbekende waarde geeft een rode foutmelding bovenaan de pagina.

**Rij-opties**

| Optie | Mogelijke waarden | Zonder deze optie | Doet |
|---|---|---|---|
| `verhouding=` | twee getallen met `:`, bijv. `1:2`, `2:1`, `3:2` | `1:1` | Breedteverhouding van de linker en rechter sectie |

**Sectie-opties**

| Optie | Mogelijke waarden | Zonder deze optie | Doet |
|---|---|---|---|
| `thema=` | een thema uit `site.md`: `licht`, `zacht`, `donker`, `primair`, `secundair`, `accent` | het thema uit `[site]` | Alle kleuren van de sectie |
| `achtergrond=`, `tekst=`, `koppen=`, `accent=`, `knoptekst=` | een kleur uit `[kleuren]` | de kleur uit het thema | Eén rol van het thema overschrijven |
| `patroon=` | pad naar een SVG, zie de lijst hieronder | geen patroon | Herhaald patroon. Hetzelfde patroon in twee secties van een rij loopt naadloos door |
| `patroonkleur=` | een kleur uit `[kleuren]` | de achtergrondkleur, net iets donkerder (op licht) of lichter (op donker) | Kleur van het patroon |
| `sterkte=` | een getal groter dan 0, bijv. `0.5`, `2`, `4` | `1` | Hoe ver die automatische kleur van de achtergrond afwijkt. Doet niets samen met `patroonkleur=` |
| `schaal=` | een getal groter dan 0, bijv. `0.75`, `1.5`, `2` | `1` | Patroon kleiner of groter |
| `beweging=` | `drijven`, `pulseren` | stil | Patroon beweegt (alleen met `patroon=`): `drijven` schuift schuin op · `pulseren` komt op vanuit onzichtbaar en vervaagt weer. Alleen op een computer met muis (niet op telefoon of tablet), en niet voor bezoekers die minder beweging hebben ingesteld. Beweging kost rekenkracht: houd het bij één bewegende sectie per pagina |
| `tempo=` | seconden, een getal groter dan 0, bijv. `8`, `30`, `60` | `5` | Duur van één tegel opschuiven (`drijven`) of één puls (`pulseren`) |
| `uitlijning=` | `boven`, `midden`, `onder` | `boven` | Tekst verticaal uitlijnen; zichtbaar als de andere sectie in de rij hoger is |
| `id=` | een woord, bijv. `aanbod` | het `[label]` van de sectie | Anker om naartoe te linken (`#aanbod`) |

**Patronen in `images/`**

| Bestand | Vorm | Doorzichtigheid in het bestand |
|---|---|---|
| `stippen.svg` | Regelmatige stippen | geen |
| `raster.svg` | Ruitjespapier | geen |
| `lijnen.svg` | Schuine lijnen | geen |
| `plus.svg` | Kleine plusjes | geen |
| `ruit.svg` | Open ruiten | geen |
| `zigzag.svg` | Zigzaglijnen | geen |
| `schubben.svg` | Halve bogen in verspringende rijen | geen |
| `cirkels.svg` | Ringen rond een middelpunt | geen |
| `topografie.svg` | Hoogtelijnen zoals op een wandelkaart (detailrijk) | geen |
| `terrazzo.svg` | Grillige steenslag | deels (35–90%) |
| `zon.svg` | Kleine zonnetjes | 22% |
| `water.svg` | Golflijnen | 20% |
| `blad.svg` | Losse blaadjes | 35% |
| `kiezels.svg` | Steentjes | 22% |

De automatische patroonkleur is al subtiel. Bij een bestand dat zelf ook doorzichtig is (20–35%) blijft er dan bijna niets van over: gebruik daar `patroonkleur=` of een hoge `sterkte=`.

Een eigen patroon: een SVG met `width` en `height` (de tegelmaat), in één kleur. De kleur in het bestand doet er niet toe, alleen de vorm en de doorzichtigheid. Wat over de rand van de tegel steekt, moet aan de overkant terugkomen.

## Tekst binnen een sectie

| Je typt | Resultaat |
|---|---|
| `# Kop`, `## Kop`, `### Kop`, `#### Kop` | Koppen; de eerste alinea na `#` of `##` wordt iets groter |
| `**vet**`, `*cursief*`, `==accent==` | Opmaak |
| `[tekst](adres)` | Link |
| `[tekst](adres){.knop}` | Knop (alleen op een regel). Knoppen op opeenvolgende regels staan naast elkaar: de eerste in de accentkleur, de rest doorzichtig. Een lege regel ertussen zet ze onder elkaar, elk in de accentkleur |
| `![omschrijving](images/foto.jpg)` | Afbeelding |
| `- punt`, `1. punt` | Lijsten |
| `> tekst` | Citaat |
| `[label Diensten]` | Klein label boven een kop |
| `[kaart]` | Tegel. Zonder lege regel vóór de volgende `[kaart]` staan ze naast elkaar, met een lege regel onder elkaar. Op mobiel altijd onder elkaar |
| `[tijdlijn 2020 – heden]` | Item in een tijdlijn |
| `[html]` … `[/html]` | Gewone HTML, bijvoorbeeld een agenda of formulier van een andere website. Beide markeringen alleen op een regel. Scripts erin worden uitgevoerd |

Een kaart of tijdlijn-item loopt door tot de volgende `[markering]`.

In een `[html]`-blok kun je de kleuren van het palet gebruiken als CSS-variabele: `var(--kleur-primair)`, en de rollen van de sectie: `var(--accent)`, `var(--tekst)`. De tekening op de homepagina doet dat, en kleurt daardoor mee met de stijlkiezer. Let op: een regel die met `[sectie`, `[kaart` enz. begint, leest het script ook binnen `[html]` als markering; schrijf daar `&#91;` in plaats van `[`.

Regels en alinea's werken zoals gewone markdown:

| Je typt | Resultaat |
|---|---|
| Eén Enter | Tekst loopt door op dezelfde regel |
| `\` aan het eind van de regel, dan Enter | Nieuwe regel, geen nieuwe alinea. Twee spaties in plaats van `\` werkt ook, maar die zie je niet |
| Lege regel | Nieuwe alinea |

Elke kop krijgt een anker: kleine letters, streepjes in plaats van spaties: `## 1. Definities` → `#1-definities`.

Paden (`images/…`, `voorwaarden.html`) schrijf je vanaf de plek van het `.md`-bestand.

## Stijlkiezer

`code/stijlkiezer.js` en `code/stijlkiezer.css` werken bovenop het sjabloon; aan `script.js`, `styles.css` en de `.md`-bestanden verandert niets.

- **Op elke pagina** staat rechtsonder een knop *Stijl*. Daarmee wissel je palet, letters, logo, achtergrond, hoeken, ruimte en beweging, en typ je de naam van je eigen bedrijf. De hele site past zich meteen aan.
- **Op `stijl.html`** staat alles groot, met hartjes om favorieten te bewaren, een lijst met wensen, een opmerkingenveld en een samenvatting. Die kopieer je, mail je, of deel je als link: wie de link opent, ziet de site precies zo.
- **Hartjes per sectie:** met `data-hartjes` op de `<script>`-tag (zie `bouwstenen.html`) krijgt elke sectie met een label een knop *Mooi*.
- Het e-mailadres voor *Mail mijn keuze* zet je in `stijl.md`: `<div id="stijlkiezer" data-mail="jij@voorbeeld.nl">`.
- De keuze blijft bewaard in de browser van de bezoeker (localStorage).
- Paletten, fonts en logo's staan bovenaan `stijlkiezer.js` en zijn makkelijk aan te vullen. Elk palet gebruikt dezelfde zes kleurnamen als `site.md`.

**Voor de definitieve site van een klant:** neem de gekozen kleuren en fonts over in `site.md`, en haal de twee regels voor de stijlkiezer uit de `.html`-bestanden.

## Nieuwe pagina

1. Kopieer `voorwaarden.html` naar `nieuw.html` en zet daarin `data-md="nieuw.md"`.
2. Maak `nieuw.md` met rijen en secties.
3. Zet een link in `[menu]` in `site.md`.

## Lokaal bekijken

```powershell
python -m http.server 8000
```

Open http://localhost:8000. Dubbelklikken op een `.html`-bestand werkt niet: de `.md`-bestanden worden met `fetch()` geladen, en dat heeft een server nodig.

## Publiceren via GitHub Pages

1. **Settings → Pages →** *Deploy from a branch*, `main`, `/ (root)`.
2. Eigen domein: maak een `CNAME`-bestand met één regel (bijvoorbeeld `www.voorbeeld.nl`) en een DNS-record naar `<gebruiker>.github.io`.

## Animaties

Het invagen is in te stellen bovenaan `code/styles.css`: `--fade`, `--reveal-duration`, `--reveal-distance`, `--reveal-stagger`, `--reveal-ease` en `--font-wait`.

> De algemene voorwaarden zijn voorbeeldtekst. Laat ze controleren voordat je ze gebruikt.
