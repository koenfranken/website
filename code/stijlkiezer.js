/*
 * Stijlkiezer: een klant probeert op de échte site kleuren, letters, logo en vorm uit,
 * en geeft met hartjes aan wat hij mooi vindt. Werkt bovenop script.js; de .md-bestanden
 * blijven zoals ze zijn.
 *
 *   - De gekozen paletkleuren en fonts worden CSS-variabelen met !important, zodat ze
 *     winnen van wat site.md instelt. Thema's verwijzen naar die kleuren, dus alles kleurt mee.
 *   - Het logo (images/logo.svg) wordt opnieuw getekend in de gekozen kleuren.
 *   - De keuze blijft bewaard in de browser, en is te delen als link (?stijl=…).
 *
 * Op elke pagina staat rechtsonder een knop "Stijl" met een paneel om snel te wisselen.
 * Op een pagina met <div id="stijlkiezer"></div> (zie stijl.md) komt het hele overzicht:
 * alle opties groot, hartjes, wensen en een samenvatting om te kopiëren of te mailen.
 * Met data-hartjes op de <script>-tag krijgt elke sectie met een [label] een hartje.
 *
 * Voor de definitieve site van een klant: haal stijlkiezer.css en stijlkiezer.js uit de .html-bestanden.
 */
(() => {
const scriptTag = document.currentScript;

/* ─── 1. De keuzes ────────────────────────────────────────────────────────── */

// Elk palet gebruikt dezelfde zes namen als [kleuren] in site.md.
// Getoetst op leesbaarheid: tekst op elke achtergrond die de thema's maken haalt minstens WCAG AA.
const PALETTEN = [
    { id: 'zeezout', naam: 'Zeezout', idee: 'Petrol en zand. Rustig, fris en betrouwbaar.', k: { licht: '#F6F4EF', zacht: '#E3ECEC', donker: '#14232B', primair: '#1F4E5F', secundair: '#2F5D5C', accent: '#E9A84C' } },
    { id: 'terracotta', naam: 'Terracotta', idee: 'Gebakken aarde en perzik. Warm en ambachtelijk.', k: { licht: '#FAF5EF', zacht: '#F2E4D7', donker: '#2A1E18', primair: '#9A3B22', secundair: '#5B4636', accent: '#EDB07A' } },
    { id: 'bosrijk', naam: 'Bosrijk', idee: 'Dennengroen met mosterd. Natuurlijk en stevig.', k: { licht: '#F4F3EC', zacht: '#E3E8DA', donker: '#1C231C', primair: '#2F5233', secundair: '#6B4F2E', accent: '#D9C25B' } },
    { id: 'pruim', naam: 'Pruim', idee: 'Diep paars met roze. Eigenwijs en zacht tegelijk.', k: { licht: '#FBF7F8', zacht: '#F2E5EB', donker: '#261823', primair: '#5E2750', secundair: '#3E3A6B', accent: '#F2A7B8' } },
    { id: 'noorderlicht', naam: 'Noorderlicht', idee: 'Koel blauw met mint. Helder en Scandinavisch.', k: { licht: '#F5F7FA', zacht: '#E3E9F2', donker: '#18202B', primair: '#2B4C7E', secundair: '#45526A', accent: '#8FD3C1' } },
    { id: 'citrus', naam: 'Citrus', idee: 'Groen, oranje en zonnig geel. Vrolijk en energiek.', k: { licht: '#FFFBF0', zacht: '#FFF0C9', donker: '#1F2421', primair: '#1E6B52', secundair: '#B93D0B', accent: '#FFC93C' } },
    { id: 'blush', naam: 'Blush', idee: 'Framboos en abrikoos. Persoonlijk en uitnodigend.', k: { licht: '#FFF8F5', zacht: '#FBE7E1', donker: '#2B2024', primair: '#A8323F', secundair: '#5C3D46', accent: '#F7C59F' } },
    { id: 'monochroom', naam: 'Monochroom', idee: 'Zwart, wit en een felle limoen. Strak en grafisch.', k: { licht: '#FAFAFA', zacht: '#ECECEC', donker: '#111111', primair: '#262626', secundair: '#4F4F4F', accent: '#D7F75B' } },
    { id: 'retro', naam: 'Retro', idee: 'Roest, olijf en oker. Jaren zeventig, maar fris.', k: { licht: '#FBF3E4', zacht: '#F3DFC1', donker: '#2D1B0E', primair: '#8C3B12', secundair: '#4F5D2F', accent: '#F2A33A' } },
    { id: 'klassiek', naam: 'Klassiek', idee: 'Marine, wijnrood en goud. Deftig en tijdloos.', k: { licht: '#F7F5F0', zacht: '#ECE7DC', donker: '#161B26', primair: '#1C2E4A', secundair: '#7A2E2E', accent: '#C9A45C' } },
    { id: 'lavendel', naam: 'Lavendel', idee: 'Lila met saliegroen. Kalm en zorgzaam.', k: { licht: '#F8F7FB', zacht: '#EAE6F3', donker: '#22202B', primair: '#4B3F72', secundair: '#4E6A58', accent: '#E1C2EE' } },
    { id: 'nacht', naam: 'Nacht', idee: 'Donker met ijsblauw en lila: de hele site in donkere modus.', k: { licht: '#121419', zacht: '#1C2029', donker: '#ECEEF2', primair: '#9BB8FF', secundair: '#E0B3FF', accent: '#5B3CC4' } },
];

// Kopfont + tekstfont, allemaal gratis van Google Fonts. Een tekstfont moet gewicht 600 hebben
// (script.js vraagt 400 en 600 op), een kopfont gewicht 400.
const FONTS = [
    { id: 'fraunces', naam: 'Zacht en eigentijds', kop: 'Fraunces', tekst: 'Manrope', soort: 'serif' },
    { id: 'dmserif', naam: 'Klassiek modern', kop: 'DM Serif Display', tekst: 'DM Sans', soort: 'serif' },
    { id: 'playfair', naam: 'Redactioneel', kop: 'Playfair Display', tekst: 'Source Sans 3', soort: 'serif' },
    { id: 'cormorant', naam: 'Luxe en licht', kop: 'Cormorant Garamond', tekst: 'Jost', soort: 'serif' },
    { id: 'baskerville', naam: 'Betrouwbaar', kop: 'Libre Baskerville', tekst: 'Mulish', soort: 'serif' },
    { id: 'gloock', naam: 'Krachtig', kop: 'Gloock', tekst: 'Figtree', soort: 'serif' },
    { id: 'italiana', naam: 'Luchtig en elegant', kop: 'Italiana', tekst: 'Nunito Sans', soort: 'serif' },
    { id: 'bricolage', naam: 'Speels modern', kop: 'Bricolage Grotesque', tekst: 'Source Serif 4', soort: 'sans-serif' },
    { id: 'space', naam: 'Technisch', kop: 'Space Grotesk', tekst: 'IBM Plex Sans', soort: 'sans-serif' },
    { id: 'syne', naam: 'Creatief en gedurfd', kop: 'Syne', tekst: 'Work Sans', soort: 'sans-serif' },
    { id: 'unbounded', naam: 'Rond en opvallend', kop: 'Unbounded', tekst: 'Karla', soort: 'sans-serif' },
    { id: 'outfit', naam: 'Vriendelijk', kop: 'Outfit', tekst: 'Lora', soort: 'sans-serif' },
    { id: 'archivo', naam: 'Stevig', kop: 'Archivo Black', tekst: 'Archivo', soort: 'sans-serif' },
    { id: 'caveat', naam: 'Handgeschreven', kop: 'Caveat', tekst: 'Nunito', soort: 'cursive' },
];

// Beeldmerken in een vlak van 100×100. P, S, A en L zijn de kleuren primair, secundair,
// accent en licht; {I} is de eerste letter van de naam, {F} het kopfont.
const LOGOS = [
    { id: 'vonk', naam: 'Vonk', idee: 'Een lichtpuntje met een kleine ster: het idee dat ontstaat.',
      svg: '<path d="M50 6C53 36 64 47 94 50C64 53 53 64 50 94C47 64 36 53 6 50C36 47 47 36 50 6Z" fill="P"/><path d="M80 8C81 17 83 19 92 20C83 21 81 23 80 32C79 23 77 21 68 20C77 19 79 17 80 8Z" fill="A"/>' },
    { id: 'baan', naam: 'Baan', idee: 'Een kern met iets dat eromheen draait: aandacht en beweging.',
      svg: '<circle cx="50" cy="50" r="34" fill="none" stroke="P" stroke-width="8"/><circle cx="50" cy="50" r="14" fill="A"/><circle cx="74" cy="26" r="11" fill="A" stroke="L" stroke-width="6"/>' },
    { id: 'lens', naam: 'Lens', idee: 'Een oog of lens: scherp kijken naar wat er echt is.',
      svg: '<path d="M6 50C24 22 76 22 94 50C76 78 24 78 6 50Z" fill="P"/><circle cx="50" cy="50" r="17" fill="A"/><circle cx="50" cy="50" r="6" fill="P"/>' },
    { id: 'vlam', naam: 'Vlam', idee: 'Een warme vlam met een rustige kern.',
      svg: '<path d="M50 6c4 18 26 30 26 56a26 26 0 0 1-52 0c0-14 8-22 14-30 1 8 4 12 8 14C46 34 46 20 50 6z" fill="A"/><path d="M50 52c6 6 12 12 12 20a12 12 0 0 1-24 0c0-8 6-14 12-20z" fill="P"/>' },
    { id: 'bauhaus', naam: 'Bauhaus', idee: 'Vier eenvoudige vormen in een vierkant. Grafisch en speels.',
      svg: '<path d="M12 50A38 38 0 0 1 50 12V50Z" fill="P"/><circle cx="69" cy="31" r="16" fill="A"/><rect x="12" y="50" width="38" height="38" fill="S"/><path d="M50 50H88A38 38 0 0 1 50 88Z" fill="P"/>' },
    { id: 'bloem', naam: 'Roos', idee: 'Zes bladen rond een hart: groei en samenhang.',
      svg: '<g fill="P"><path id="sk-blad" d="M50 48C41 37 41 17 50 7c9 10 9 30 0 41z"/><use href="#sk-blad" transform="rotate(120 50 50)"/><use href="#sk-blad" transform="rotate(240 50 50)"/></g><g fill="S"><use href="#sk-blad" transform="rotate(60 50 50)"/><use href="#sk-blad" transform="rotate(180 50 50)"/><use href="#sk-blad" transform="rotate(300 50 50)"/></g><circle cx="50" cy="50" r="9" fill="A"/>' },
    { id: 'golven', naam: 'Golven', idee: 'Drie golven: rust, ritme en een beetje beweging.',
      svg: '<g fill="none" stroke-width="8" stroke-linecap="round"><path d="M12 30q9.5-12 19 0t19 0 19 0 19 0" stroke="P"/><path d="M12 52q9.5-12 19 0t19 0 19 0 19 0" stroke="S"/><path d="M12 74q9.5-12 19 0t19 0 19 0 19 0" stroke="A"/></g>' },
    { id: 'monogram', naam: 'Monogram', idee: 'De eerste letter van de naam in een zacht vierkant.',
      svg: '<rect x="8" y="8" width="84" height="84" rx="24" fill="P"/><text x="50" y="69" text-anchor="middle" font-family="{F}" font-size="58" fill="L">{I}</text><circle cx="78" cy="22" r="8" fill="A"/>' },
    { id: 'kristal', naam: 'Kristal', idee: 'Een geslepen steen: helder, waardevol, met facetten.',
      svg: '<path d="M24 14h52l18 24-44 52L6 38z" fill="P"/><path d="M6 38h88L50 90z" fill="S"/><path d="M24 14 36 38h28l12-24z" fill="A"/>' },
    { id: 'lus', naam: 'Lus', idee: 'Een doorlopende lijn zonder begin of eind.',
      svg: '<path d="M50 50C40 36 30 30 22 30a20 20 0 0 0 0 40c8 0 18-6 28-20s20-20 28-20a20 20 0 0 1 0 40c-8 0-18-6-28-20z" fill="none" stroke="P" stroke-width="8"/><circle cx="78" cy="50" r="7" fill="A"/>' },
    { id: 'kubus', naam: 'Kubus', idee: 'Een blok met drie kanten: stevig en driedimensionaal.',
      svg: '<path d="M50 8 88 30 50 52 12 30z" fill="A"/><path d="M12 30 50 52v40L12 70z" fill="P"/><path d="M88 30 50 52v40l38-22z" fill="S"/>' },
    { id: 'prisma', naam: 'Prisma', idee: 'Licht gaat erin en komt er in kleuren weer uit.',
      svg: '<path d="M4 60 36 52" stroke="P" stroke-width="5" stroke-linecap="round"/><path d="M60 48 96 34" stroke="A" stroke-width="5" stroke-linecap="round"/><path d="M62 54 96 52" stroke="S" stroke-width="5" stroke-linecap="round"/><path d="M60 60 96 70" stroke="P" stroke-width="5" stroke-linecap="round" opacity=".6"/><path d="M48 16 80 78H16z" fill="none" stroke="P" stroke-width="7" stroke-linejoin="round"/>' },
    { id: 'geen', naam: 'Alleen de naam', idee: 'Geen beeldmerk: de naam in het kopfont is het logo.', svg: '' },
];

// De patronen in images/. Alleen om te bekijken en te bewaren met een hartje;
// welk patroon in welke sectie komt, staat in de .md-bestanden.
const PATRONEN = [
    ['stippen', 'Stippen'], ['raster', 'Raster'], ['lijnen', 'Lijnen'], ['plus', 'Plusjes'], ['ruit', 'Ruiten'],
    ['zigzag', 'Zigzag'], ['schubben', 'Schubben'], ['cirkels', 'Cirkels'], ['water', 'Water'], ['zon', 'Zonnetjes'],
    ['blad', 'Blaadjes'], ['kiezels', 'Kiezels'], ['terrazzo', 'Terrazzo'], ['topografie', 'Hoogtelijnen'],
];

const VORM = {
    basis: { naam: 'Achtergrond van de pagina', opties: { licht: 'Licht', zacht: 'Zacht getint', donker: 'Donker' } },
    rond: { naam: 'Hoeken', opties: { 0: 'Recht', 6: 'Licht rond', 12: 'Rond', 28: 'Heel rond' } },
    ruimte: { naam: 'Ruimte tussen secties', opties: { compact: 'Compact', normaal: 'Normaal', ruim: 'Ruim' } },
    beweging: { naam: 'Invagen bij scrollen', opties: { aan: 'Aan', uit: 'Uit' } },
};
// De rollen van de pagina per achtergrond; gelijk aan [thema licht|zacht|donker] in site.md
const BASIS = {
    zacht: { achtergrond: 'zacht', tekst: 'donker', koppen: 'donker', accent: 'primair', knoptekst: 'licht' },
    donker: { achtergrond: 'donker', tekst: 'licht', koppen: 'licht', accent: 'accent', knoptekst: 'donker' },
};
const RUIMTE = { compact: 'clamp(1.25rem, 3vw, 2rem)', ruim: 'clamp(3rem, 7vw, 5.5rem)' };

const WENSEN = [
    'Contactformulier', 'Online afspraken maken', 'Tarieven', 'Veelgestelde vragen', 'Ervaringen van klanten',
    'Tijdlijn of werkwijze', 'Fotogalerij', 'Nieuws of blog', 'Nieuwsbrief', 'Route en kaart', 'Meerdere talen', 'Link naar webshop',
];


/* ─── 2. Toestand: wat is er gekozen ──────────────────────────────────────── */

const SLEUTEL = 'stijlkiezer';
const STANDAARD = {
    palet: 'zeezout', font: 'fraunces', logo: 'vonk', naam: '',
    basis: 'licht', rond: '12', ruimte: 'normaal', beweging: 'aan',
    hart: { palet: [], font: [], logo: [], patroon: [], sectie: [] },
    wensen: [], notitie: '',
};
const kopie = o => JSON.parse(JSON.stringify(o));
let st = kopie(STANDAARD);
try { st = mengIn(st, JSON.parse(localStorage.getItem(SLEUTEL) || '{}')); } catch { /* geen opslag: dan maar zonder */ }

// Een gedeelde link (?stijl=…) gaat voor op wat er bewaard was
const gedeeld = new URLSearchParams(location.search).get('stijl');
let gedeeldeKeuze = false;
if (gedeeld) {
    try {
        st = mengIn(kopie(STANDAARD), JSON.parse(decodeURIComponent(escape(atob(gedeeld.replace(/-/g, '+').replace(/_/g, '/'))))));
        gedeeldeKeuze = true;
        history.replaceState(null, '', location.pathname + location.hash);
    } catch { /* kapotte link: negeren */ }
}

// Alleen bekende sleutels overnemen, zodat een oude of kapotte opslag niets breekt
function mengIn(doel, bron) {
    for (const k in STANDAARD) {
        if (!(k in bron)) continue;
        if (k === 'hart') for (const s in STANDAARD.hart) doel.hart[s] = Array.isArray(bron.hart?.[s]) ? bron.hart[s] : [];
        else doel[k] = bron[k];
    }
    if (!PALETTEN.some(p => p.id === doel.palet)) doel.palet = STANDAARD.palet;
    if (!FONTS.some(f => f.id === doel.font)) doel.font = STANDAARD.font;
    if (!LOGOS.some(l => l.id === doel.logo)) doel.logo = STANDAARD.logo;
    return doel;
}
const bewaar = () => { try { localStorage.setItem(SLEUTEL, JSON.stringify(st)); } catch { /* privémodus */ } };
const palet = (id = st.palet) => PALETTEN.find(p => p.id === id);
const font = (id = st.font) => FONTS.find(f => f.id === id);
const logo = (id = st.logo) => LOGOS.find(l => l.id === id);

function deelLink() {
    const anders = {};
    for (const k in STANDAARD) if (JSON.stringify(st[k]) !== JSON.stringify(STANDAARD[k])) anders[k] = st[k];
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(anders)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${location.origin}${location.pathname}?stijl=${code}`;
}


/* ─── 3. Toepassen op de pagina ───────────────────────────────────────────── */

const ontsnap = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stijlElement = document.head.appendChild(document.createElement('style'));
stijlElement.id = 'stijlkiezer-keuze';

// Fonts van Google Fonts laden; elk font maar één keer
const geladen = new Set();
function laadFonts(lijst) {
    const nieuw = lijst.filter(f => !geladen.has(f.id));
    if (!nieuw.length) return;
    nieuw.forEach(f => geladen.add(f.id));
    const families = nieuw.flatMap(f => [`family=${f.kop.replaceAll(' ', '+')}`, `family=${f.tekst.replaceAll(' ', '+')}:wght@400;600`]);
    document.head.append(Object.assign(document.createElement('link'), {
        rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${[...new Set(families)].join('&')}&display=swap`,
    }));
}
const fontStapel = f => `'${f.kop}', ${f.soort === 'sans-serif' ? 'system-ui, sans-serif' : 'Georgia, serif'}`;

// Tekent een beeldmerk. `kleuren` geeft per letter (P, S, A, L) een kleur: een #hex voor een
// losse afbeelding, of var(--kleur-…) voor een SVG in de pagina, die dan meekleurt.
function tekenMerk(l, kleuren, f = font()) {
    const initiaal = (huidigeNaam() || '?').trim().charAt(0).toUpperCase();
    return l.svg
        .replace(/="([PSAL])"/g, (_, k) => `="${kleuren[k]}"`)
        .replace('{I}', ontsnap(initiaal))
        .replace('{F}', ontsnap(fontStapel(f).replaceAll("'", '')));
}
const varKleuren = { P: 'var(--kleur-primair)', S: 'var(--kleur-secundair)', A: 'var(--kleur-accent)', L: 'var(--kleur-licht)' };
const varKleurenOpDonker = { P: 'var(--kleur-licht)', S: 'var(--kleur-zacht)', A: 'var(--kleur-accent)', L: 'var(--kleur-primair)' };
const merkSvg = (l, kleuren = varKleuren, f) =>
    `<svg viewBox="0 0 100 100" aria-hidden="true">${tekenMerk(l, kleuren, f)}</svg>`;

let origineleNaam = null;      // naam uit site.md, gelezen uit de menubalk
let titelSjabloon = '';        // de oorspronkelijke paginatitel
const huidigeNaam = () => st.naam.trim() || origineleNaam || 'Studio Lumen';

function pasToe() {
    const p = palet(), f = font();
    const regels = Object.entries(p.k).map(([naam, waarde]) => `--kleur-${naam}: ${waarde} !important;`);
    regels.push(`--font-koppen: '${f.kop}' !important;`, `--font-tekst: '${f.tekst}' !important;`, `--rond: ${Number(st.rond)}px !important;`);
    if (RUIMTE[st.ruimte]) regels.push(`--ruimte: ${RUIMTE[st.ruimte]} !important;`);
    if (BASIS[st.basis]) for (const [rol, kleur] of Object.entries(BASIS[st.basis])) regels.push(`--${rol}: var(--kleur-${kleur}) !important;`);
    if (st.beweging === 'uit') regels.push('--reveal-duration: 0s !important;', '--reveal-distance: 0px !important;');
    stijlElement.textContent = `:root { ${regels.join(' ')} color-scheme: ${st.palet === 'nacht' ? 'dark' : 'light'}; }`;
    laadFonts([f]);
    if (origineleNaam !== null) { tekenLogo(); zetNaam(); }
    bewaar();
}

// Het logo in de menubalk en het icoontje in het tabblad, in de gekozen kleuren
function tekenLogo() {
    const l = logo(), k = palet().k;
    const img = document.querySelector('.merk img');
    const icoon = document.querySelector('link[rel="icon"]');
    if (!l.svg) {
        if (img) img.style.display = 'none';   // niet img.hidden: de CSS zet img op display: block
        return;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${tekenMerk(l, { P: k.primair, S: k.secundair, A: k.accent, L: k.licht })}</svg>`;
    const adres = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    if (img) { img.style.display = ''; img.src = adres; }
    if (icoon) icoon.href = adres;
}

// Zet de naam uit site.md overal op de pagina in een <span class="sk-naamplek">, één keer.
// Daarna hoeft zetNaam alleen die spans bij te werken.
function markeerNaam() {
    titelSjabloon = document.title;
    const lopen = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: n => n.parentElement.closest('.sk, script, style, textarea, input') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const knopen = [];
    for (let n; (n = lopen.nextNode());) if (n.data.includes(origineleNaam)) knopen.push(n);
    for (const n of knopen) {
        const delen = n.data.split(origineleNaam);
        n.replaceWith(...delen.flatMap((deel, i) => i === 0 ? [deel]
            : [Object.assign(document.createElement('span'), { className: 'sk-naamplek', textContent: origineleNaam }), deel]));
    }
}
function zetNaam() {
    const nieuw = huidigeNaam();
    document.querySelectorAll('.sk-naamplek').forEach(s => s.textContent = nieuw);
    document.title = titelSjabloon.replaceAll(origineleNaam, nieuw);
}


/* ─── 4. Bouwstenen van de keuzelijsten ───────────────────────────────────── */

const hartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
const hartKnop = (soort, id, naam) =>
    `<button type="button" class="sk-hart" data-hart="${soort}" data-id="${ontsnap(id)}" aria-pressed="false" aria-label="Bewaar ${ontsnap(naam)}">${hartSvg}</button>`;
const kiesKnop = (soort, id) => `<button type="button" class="sk-kies" data-kies="${soort}" data-id="${id}">Kies</button>`;
const paletVars = p => Object.entries(p.k).map(([n, w]) => `--kleur-${n}:${w}`).join(';');
const tekstOp = (p, naam) => ['licht', 'zacht', 'accent'].includes(naam) ? p.k.donker : p.k.licht;

function voet(code, naam, idee, soort, id, metHart = true) {
    return `<div class="sk-voet"><div class="sk-meta"><div class="sk-code">${code}</div><div class="sk-naam">${ontsnap(naam)}</div><div class="sk-idee">${ontsnap(idee)}</div></div>
        ${metHart ? hartKnop(soort, id, naam) : ''}${kiesKnop(soort, id)}</div>`;
}

// Een mini-website in de kleuren van één palet (de variabelen gelden alleen binnen dit blok)
function miniSite(p) {
    return `<div class="sk-mini" style="${paletVars(p)}" aria-hidden="true">
        <div class="sk-mini-balk"><i></i><span></span><span></span><span></span><b></b></div>
        <div class="sk-mini-held"><div><strong>Helder denken</strong><p>Een korte zin over wat je doet.</p><em>Afspraak</em></div><div class="sk-mini-bol"></div></div>
        <div class="sk-mini-band"><span></span><span></span><span></span></div>
        <div class="sk-mini-voet"></div>
    </div>`;
}

function paletKaart(p, i) {
    const vlakken = Object.entries(p.k).map(([naam, waarde]) =>
        `<div style="background:${waarde};color:${tekstOp(p, naam)}"><span>${naam}</span><span>${waarde}</span></div>`).join('');
    return `<article class="sk-optie" data-soort="palet" data-id="${p.id}">
        <div class="sk-vlakken">${vlakken}</div>${miniSite(p)}
        ${voet(`Palet ${i + 1}`, p.naam, p.idee, 'palet', p.id)}</article>`;
}

function fontKaart(f, i) {
    return `<article class="sk-optie" data-soort="font" data-id="${f.id}">
        <div class="sk-fontdemo">
            <div class="sk-groot" style="font-family:${fontStapel(f)}" data-naam></div>
            <div class="sk-sub" style="font-family:${fontStapel(f)}">Ruimte om helder te denken</div>
            <p style="font-family:'${f.tekst}',system-ui,sans-serif">Een korte alinea om te zien hoe lopende tekst leest. Rustig, duidelijk en prettig op elk scherm, ook op een telefoon.</p>
            <div class="sk-abc" style="font-family:'${f.tekst}',system-ui,sans-serif">Kop: ${f.kop} · Tekst: ${f.tekst}</div>
        </div>
        ${voet(`Letters ${i + 1}`, f.naam, `${f.kop} met ${f.tekst}`, 'font', f.id)}</article>`;
}

function logoKaart(l, i) {
    const f = font();
    const merk = l.svg ? merkSvg(l) : '';
    const donker = l.svg ? merkSvg(l, varKleurenOpDonker) : '';
    const icoon = l.svg ? merkSvg(l) : `<b style="font-family:${fontStapel(f)}" data-initiaal></b>`;
    return `<article class="sk-optie" data-soort="logo" data-id="${l.id}">
        <div class="sk-tegel">${merk}<div class="sk-woord" style="font-family:${fontStapel(f)}" data-naam></div></div>
        <div class="sk-omgekeerd"><div class="sk-klein">${donker}<span style="font-family:${fontStapel(f)}" data-naam></span></div><div class="sk-favicon">tabblad <i>${icoon}</i></div></div>
        ${voet(`Logo ${i + 1}`, l.naam, l.idee, 'logo', l.id)}</article>`;
}

// Een url() in een variabele geldt vanaf het stylesheet dat hem gebruikt (code/); daarom een volledig adres
function patroonKaart([bestand, naam]) {
    return `<article class="sk-optie sk-patroon" data-soort="patroon" data-id="${bestand}">
        <div class="sk-patroonvlak" style="--patroon:url('${new URL(`images/${bestand}.svg`, location.href).href}')"></div>
        <div class="sk-voet"><div class="sk-meta"><div class="sk-naam">${naam}</div><div class="sk-code">${bestand}.svg</div></div>${hartKnop('patroon', bestand, naam)}</div></article>`;
}

function vormKeuze(sleutel) {
    const { naam, opties } = VORM[sleutel];
    return `<fieldset class="sk-segment"><legend>${naam}</legend>${Object.entries(opties).map(([w, t]) =>
        `<button type="button" data-vorm="${sleutel}" data-id="${w}" aria-pressed="false">${t}</button>`).join('')}</fieldset>`;
}


/* ─── 5. Het paneel (op elke pagina) ──────────────────────────────────────── */

function maakPaneel() {
    const knop = Object.assign(document.createElement('button'), { type: 'button', className: 'sk sk-open' });
    knop.setAttribute('aria-expanded', 'false');
    knop.setAttribute('aria-controls', 'sk-paneel');
    knop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-.5-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4.1-4-7.6-9-7.6z"/><circle cx="7.5" cy="11.5" r="1.4"/><circle cx="10.5" cy="7.5" r="1.4"/><circle cx="15" cy="7.8" r="1.4"/></svg><span>Stijl</span>';

    const paneel = Object.assign(document.createElement('aside'), { id: 'sk-paneel', className: 'sk sk-paneel', hidden: true });
    paneel.setAttribute('aria-label', 'Stijl uitproberen');
    const opStijlpagina = !!document.getElementById('stijlkiezer');
    paneel.innerHTML = `
        <header><div><strong>Probeer een stijl</strong><span>Je ziet het meteen op de hele site.</span></div>
            <button type="button" class="sk-sluit" aria-label="Sluiten">×</button></header>
        <div class="sk-tabs" role="tablist">${['Kleur', 'Letters', 'Logo', 'Vorm'].map((t, i) =>
            `<button type="button" role="tab" data-tab="${i}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
        <div class="sk-tabinhoud">
            <div data-paneel="0">${PALETTEN.map(p => `<button type="button" class="sk-rij" data-kies="palet" data-id="${p.id}">
                <span class="sk-strook">${['licht', 'zacht', 'primair', 'secundair', 'accent', 'donker'].map(n => `<i style="background:${p.k[n]}"></i>`).join('')}</span>
                <span><b>${p.naam}</b><small>${p.idee}</small></span></button>`).join('')}
                ${vormKeuze('basis')}</div>
            <div data-paneel="1" hidden>${FONTS.map(f => `<button type="button" class="sk-rij" data-kies="font" data-id="${f.id}">
                <span class="sk-aa" style="font-family:${fontStapel(f)}">Aa</span>
                <span><b style="font-family:${fontStapel(f)}">${f.naam}</b><small style="font-family:'${f.tekst}',sans-serif">${f.kop} + ${f.tekst}</small></span></button>`).join('')}</div>
            <div data-paneel="2" hidden>
                <label class="sk-naamveld">Naam van je bedrijf<input type="text" data-naamveld placeholder="${ontsnap(origineleNaam || '')}" maxlength="40"></label>
                <div class="sk-logos">${LOGOS.map(l => `<button type="button" class="sk-logo" data-kies="logo" data-id="${l.id}" title="${l.naam}">
                    ${l.svg ? merkSvg(l) : '<span class="sk-aa" data-initiaal></span>'}<small>${l.naam}</small></button>`).join('')}</div></div>
            <div data-paneel="3" hidden>${vormKeuze('rond')}${vormKeuze('ruimte')}${vormKeuze('beweging')}</div>
        </div>
        <footer><button type="button" class="sk-herstel">Herstel</button>
            ${opStijlpagina ? '<a href="#samenvatting">Naar de samenvatting ↓</a>' : '<a href="stijl.html">Alles bekijken en versturen →</a>'}</footer>`;

    document.body.append(knop, paneel);
    const zetOpen = open => {
        paneel.hidden = !open;
        knop.setAttribute('aria-expanded', open);
        if (open) laadFonts(FONTS);   // pas bij openen: dan hoeft een gewone bezoeker ze niet te laden
    };
    knop.addEventListener('click', () => zetOpen(paneel.hidden));
    paneel.querySelector('.sk-sluit').addEventListener('click', () => zetOpen(false));
    document.addEventListener('keydown', e => e.key === 'Escape' && !paneel.hidden && (zetOpen(false), knop.focus()));
    paneel.querySelector('footer a').addEventListener('click', () => zetOpen(false));
    paneel.querySelector('.sk-herstel').addEventListener('click', () => {
        const { hart, wensen, notitie } = st;   // hartjes en notities blijven staan
        st = { ...kopie(STANDAARD), hart, wensen, notitie };
        pasToe(); werkBij();
    });
    paneel.querySelectorAll('[role="tab"]').forEach(tab => tab.addEventListener('click', () => {
        paneel.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute('aria-selected', t === tab));
        paneel.querySelectorAll('[data-paneel]').forEach(p => p.hidden = p.dataset.paneel !== tab.dataset.tab);
    }));
}


/* ─── 6. Het complete overzicht (stijl.html) ──────────────────────────────── */

function maakOverzicht(plek) {
    laadFonts(FONTS);
    const blok = (id, nummer, titel, uitleg, inhoud) => `<section class="sk-blok" id="${id}">
        <p class="label">${nummer}</p><h2>${titel}</h2><p class="sk-uitleg">${uitleg}</p>${inhoud}</section>`;
    plek.classList.add('sk-overzicht');
    plek.innerHTML = [
        blok('kleur', '1 · Kleur', 'Twaalf paletten', 'Elk palet heeft dezelfde zes rollen: licht, zacht, donker, primair, secundair en accent. Daardoor past elk palet op elke pagina. Klik op <b>Kies</b> om het op de hele site te zien, of bewaar het met het hartje.',
            `<div class="sk-raster sk-r-palet">${PALETTEN.map(paletKaart).join('')}</div>`),
        blok('letters', '2 · Letters', 'Veertien lettercombinaties', 'Een letter met karakter voor de koppen en een rustige letter voor de lopende tekst. Allemaal gratis Google Fonts.',
            `<div class="sk-raster sk-r-font">${FONTS.map(fontKaart).join('')}</div>`),
        blok('logo', '3 · Logo', 'Twaalf beeldmerken', `Schetsen om een richting te kiezen, nog geen afgewerkte logo’s. Ze kleuren mee met het palet. Typ hier de naam van je bedrijf om hem overal op de site te zien:
            <label class="sk-naamveld sk-groot-veld"><span>Naam van je bedrijf</span><input type="text" data-naamveld placeholder="${ontsnap(origineleNaam || '')}" maxlength="40"></label>`,
            `<div class="sk-raster sk-r-logo">${LOGOS.map(logoKaart).join('')}</div>`),
        blok('patronen', '4 · Patronen', 'Veertien patronen', 'Patronen geven een sectie wat textuur. Ze nemen automatisch de kleur van de achtergrond aan, iets lichter of donkerder. Bewaar met het hartje wat je mooi vindt.',
            `<div class="sk-raster sk-r-patroon">${PATRONEN.map(patroonKaart).join('')}</div>`),
        blok('vorm', '5 · Vorm', 'Hoeken, ruimte en beweging', 'Kleine knoppen met groot effect. Scroll daarna gerust terug naar boven om het verschil te zien.',
            `<div class="sk-vormen">${Object.keys(VORM).map(vormKeuze).join('')}</div>`),
        blok('wensen', '6 · Wensen', 'Wat moet er op je site?', 'Vink aan wat je graag wilt. Twijfel je? Laat het dan open, we bespreken het samen.',
            `<div class="sk-wensen">${WENSEN.map(w => `<label><input type="checkbox" data-wens="${ontsnap(w)}"> ${ontsnap(w)}</label>`).join('')}</div>`),
        blok('samenvatting', '7 · Samen', 'Jouw keuze', 'Dit is wat je hebt gekozen en bewaard. Kopieer het, of stuur het direct per mail. Met de link ziet de ontvanger de site precies zoals jij hem nu ziet.',
            `<div class="sk-samenvatting kaart"><pre data-samenvatting></pre>
             <label class="sk-naamveld"><span>Opmerkingen (wat vind je mooi, wat juist niet?)</span><textarea data-notitie placeholder="Bijvoorbeeld: palet Bosrijk, maar dan met wat meer geel…"></textarea></label>
             <p class="knoppen"><button type="button" class="knop" data-actie="kopieer">Kopieer mijn keuze</button><button type="button" class="knop" data-actie="link">Kopieer de link</button><a class="knop" data-actie="mail" href="#">Mail mijn keuze</a></p>
             <p class="sk-melding" data-melding aria-live="polite"></p></div>`),
    ].join('');

    plek.querySelector('[data-notitie]').addEventListener('input', e => { st.notitie = e.target.value; bewaar(); werkSamenvattingBij(); });
    plek.addEventListener('change', e => {
        const wens = e.target.dataset.wens;
        if (wens === undefined) return;
        st.wensen = e.target.checked ? [...new Set([...st.wensen, wens])] : st.wensen.filter(w => w !== wens);
        bewaar(); werkSamenvattingBij();
    });
    plek.addEventListener('click', e => {
        const actie = e.target.closest('[data-actie]')?.dataset.actie;
        if (!actie) return;
        const melding = plek.querySelector('[data-melding]');
        const meld = tekst => { melding.textContent = tekst; clearTimeout(meld.t); meld.t = setTimeout(() => melding.textContent = '', 5000); };
        if (actie === 'mail') return;   // gewone link; href wordt bijgewerkt in werkSamenvattingBij
        const tekst = actie === 'link' ? deelLink() : samenvatting(true);
        navigator.clipboard?.writeText(tekst).then(
            () => meld(actie === 'link' ? 'Link gekopieerd. Plak hem in een mail of appje.' : 'Gekopieerd. Plak het in een mail of appje.'),
            () => meld('Kopiëren lukte niet; selecteer de tekst en kopieer met Ctrl+C.'));
    });
}

function samenvatting(compleet) {
    const p = palet(), f = font(), l = logo();
    const namen = (soort, lijst, naamVan) => st.hart[soort].map(id => naamVan(lijst.find(x => (x.id ?? x[0]) === id))).filter(Boolean);
    const regels = [
        `Naam: ${huidigeNaam()}`,
        `Palet: ${p.naam}`,
        `Letters: ${f.naam} (${f.kop} + ${f.tekst})`,
        `Logo: ${l.naam}`,
        `Vorm: ${VORM.basis.opties[st.basis]} · hoeken ${VORM.rond.opties[st.rond]?.toLowerCase()} · ruimte ${st.ruimte} · invagen ${st.beweging}`,
    ];
    const bewaard = [
        ['Paletten', namen('palet', PALETTEN, x => x?.naam)],
        ['Letters', namen('font', FONTS, x => x?.naam)],
        ['Logo’s', namen('logo', LOGOS, x => x?.naam)],
        ['Patronen', namen('patroon', PATRONEN, x => x?.[1])],
        ['Onderdelen', st.hart.sectie],
    ].filter(([, lijst]) => lijst.length);
    if (bewaard.length) regels.push('', '♥ Bewaard', ...bewaard.map(([s, lijst]) => `${s}: ${lijst.join(', ')}`));
    if (st.wensen.length) regels.push('', `Wensen: ${st.wensen.join(', ')}`);
    if (compleet && st.notitie.trim()) regels.push('', `Opmerkingen: ${st.notitie.trim()}`);
    if (compleet) regels.push('', `Bekijk het zelf: ${deelLink()}`);
    return regels.join('\n');
}

function werkSamenvattingBij() {
    const pre = document.querySelector('[data-samenvatting]');
    if (!pre) return;
    pre.textContent = samenvatting(false);
    const aan = document.getElementById('stijlkiezer').dataset.mail || '';
    const onderwerp = `Mijn stijlkeuze voor ${huidigeNaam()}`;
    document.querySelector('[data-actie="mail"]').href =
        `mailto:${aan}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(samenvatting(true))}`;
}


/* ─── 7. Hartjes bij secties (pagina's met data-hartjes) ──────────────────── */

function maakSectieHartjes() {
    document.querySelectorAll('main .sectie').forEach(sectie => {
        const kop = sectie.querySelector('.label, h1, h2');
        const inhoud = sectie.querySelector('.inhoud');
        if (!kop || !inhoud) return;
        const naam = kop.textContent.trim();
        inhoud.classList.add('sk-met-hart');
        inhoud.insertAdjacentHTML('beforeend',
            `<button type="button" class="sk sk-sectiehart" data-hart="sectie" data-id="${ontsnap(naam)}" aria-pressed="false" aria-label="Bewaar ${ontsnap(naam)}">${hartSvg}<span>Mooi</span></button>`);
    });
}


/* ─── 8. Alles bijwerken na een klik ──────────────────────────────────────── */

function werkBij() {
    const naam = huidigeNaam();
    document.querySelectorAll('[data-kies]').forEach(k => {
        const aan = st[k.dataset.kies] === k.dataset.id;
        k.setAttribute('aria-pressed', aan);
        if (k.classList.contains('sk-kies')) k.textContent = aan ? 'Gekozen' : 'Kies';
        k.closest('.sk-optie')?.classList.toggle('sk-gekozen', aan);
    });
    document.querySelectorAll('[data-vorm]').forEach(k => k.setAttribute('aria-pressed', String(st[k.dataset.vorm]) === k.dataset.id));
    document.querySelectorAll('[data-hart]').forEach(h => h.setAttribute('aria-pressed', st.hart[h.dataset.hart].includes(h.dataset.id)));
    document.querySelectorAll('[data-naam]').forEach(e => e.textContent = naam);
    document.querySelectorAll('[data-initiaal]').forEach(e => e.textContent = naam.charAt(0).toUpperCase());
    document.querySelectorAll('[data-naamveld]').forEach(v => { if (v !== document.activeElement) v.value = st.naam; });
    document.querySelectorAll('[data-wens]').forEach(v => v.checked = st.wensen.includes(v.dataset.wens));
    const notitie = document.querySelector('[data-notitie]');
    if (notitie && notitie !== document.activeElement) notitie.value = st.notitie;
    // Logo's met de eerste letter of het kopfont tekenen we opnieuw
    document.querySelectorAll('.sk-logo[data-id="monogram"] svg, .sk-optie[data-id="monogram"] svg').forEach(svg => {
        if (svg.closest('.sk-hart')) return; // het hartje is geen logo
        svg.innerHTML = tekenMerk(logo('monogram'), svg.closest('.sk-klein') ? varKleurenOpDonker : varKleuren);
    });
    document.querySelectorAll('.sk-r-logo [style*="font-family"]').forEach(e => e.style.fontFamily = fontStapel(font()));
    const telling = Object.values(st.hart).reduce((n, lijst) => n + lijst.length, 0);
    const openKnop = document.querySelector('.sk-open span');
    if (openKnop) openKnop.textContent = telling ? `Stijl · ♥ ${telling}` : 'Stijl';
    werkSamenvattingBij();
}

document.addEventListener('click', e => {
    const kies = e.target.closest('[data-kies]');
    const vorm = e.target.closest('[data-vorm]');
    const hart = e.target.closest('[data-hart]');
    if (kies) st[kies.dataset.kies] = kies.dataset.id;
    else if (vorm) st[vorm.dataset.vorm] = vorm.dataset.id;
    else if (hart) {
        const lijst = st.hart[hart.dataset.hart], id = hart.dataset.id;
        st.hart[hart.dataset.hart] = lijst.includes(id) ? lijst.filter(x => x !== id) : [...lijst, id];
    } else return;
    pasToe(); werkBij();
});
document.addEventListener('input', e => {
    if (!e.target.matches('[data-naamveld]')) return;
    st.naam = e.target.value;
    document.querySelectorAll('[data-naamveld]').forEach(v => v !== e.target && (v.value = st.naam));
    pasToe(); werkBij();
});


/* ─── 9. Opstarten ────────────────────────────────────────────────────────── */

pasToe();   // kleuren en fonts meteen, nog voordat de pagina zichtbaar wordt

function start() {
    origineleNaam = document.querySelector('.merk span')?.textContent.trim() || 'Studio Lumen';
    markeerNaam();
    const plek = document.getElementById('stijlkiezer');
    if (plek) maakOverzicht(plek);
    if (scriptTag?.hasAttribute('data-hartjes')) maakSectieHartjes();
    maakPaneel();
    pasToe(); werkBij();
    if (gedeeldeKeuze) {
        const melding = Object.assign(document.createElement('p'), { className: 'sk sk-gedeeld', textContent: 'Je bekijkt een gedeelde stijlkeuze. Wijzig gerust verder via de knop Stijl.' });
        document.body.append(melding);
        setTimeout(() => melding.remove(), 6000);
    }
}
// script.js zet de klasse .ready op <html> zodra de pagina er helemaal staat
const html = document.documentElement;
if (html.classList.contains('ready')) start();
else new MutationObserver((_, waarnemer) => {
    if (html.classList.contains('ready')) { waarnemer.disconnect(); start(); }
}).observe(html, { attributes: true, attributeFilter: ['class'] });
})();
