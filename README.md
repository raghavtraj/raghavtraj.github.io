# Raghav &amp; Krishnapriya — wedding invitations

Two separate invitation sites, hosted free on GitHub Pages. A guest only ever
sees the function they were invited to: the pages do not link to each other,
and the root page reveals neither.

| Page | URL | When |
|---|---|---|
| Wedding — groom's side | `/wedding-62df5d1ad5/` | Saturday 21 November 2026, 11.45 – 12.30 PM |
| Wedding — bride's side | `/wedding-bride-fdf694a962/` | the same ceremony |
| Reception | `/reception-8b0696e3be/` | Sunday 22 November 2026, 5 PM onwards |
| Neutral front door | `/` | — |

The two wedding pages are the same ceremony invited from different sides.
Whoever is inviting comes first: on the groom's card his parents open and the
bride is introduced below the names as `D/O`; on the bride's card hers open,
the wording reads *our daughter's*, the groom is `S/O`, and the regards are
her side's. Everything else — date, venue, artwork, countdown, calendar — is
identical, so a change to the ceremony has to be made in both.

The random suffixes are deliberate. The site is public — free GitHub Pages
requires it — so the folder names are what keeps the two functions apart. A
guest who trims the address bar lands on the neutral page, and neither
`/wedding/` nor `/reception/` exists to be guessed. Do not rename them to
something memorable, and do not link one page from the other.

## What each invitation does

- An opening card that has to be tapped, so the invitation "opens"
- The full invitation wording, families and couple, as on the printed card
- The date, time, venue and a **View Location** link into Google Maps
- A live countdown to that function
- **Add to calendar** — a Google Calendar link and an `.ics` download for
  Apple Calendar and Outlook
- Falling petals, scroll-in animations, and a reduced-motion mode that turns
  them off for guests who ask their device for less movement

## Layout

```
index.html                          neutral front door — links to no function
wedding-62df5d1ad5/index.html       the wedding, from the groom's side
wedding-bride-fdf694a962/index.html the wedding, from the bride's side
reception-8b0696e3be/index.html     the reception
robots.txt                        keeps search engines off the whole site
assets/css/styles.css             both palettes; `data-theme` on <html> picks one
assets/js/main.js                 gate, petals, countdown, calendar buttons
assets/img/couple-*.webp          the artwork on each opening screen
assets/img/garland-wedding.svg    the hanging flowers over the wedding
assets/img/festoon-reception.svg  the party lights over the reception
assets/img/dancefloor.svg         the mirror ball and dancers
```

The two pages are deliberately different in mood: the wedding is daylight,
the reception is dusk, because the evening ends with a DJ. Nothing is
duplicated to achieve that — `[data-theme="reception"]` in the stylesheet
redefines the same colour tokens the layout already used, so one attribute on
`<html>` turns the whole page over. The reception also drops confetti instead
of petals, which the page asks for with `data-effect="confetti"` on the
falling-bits layer.

The wedding opening screen shows the supplied artwork full width. The picture
is named on the element itself, in `wedding-*/index.html`:

```html
<div class="gate gate--photo" style="--photo: url('/assets/img/couple-wedding.webp')">
```

Change that filename and the picture changes. The path is root-absolute on
purpose — a relative `url()` inside a custom property resolves against the
stylesheet, not against the page, and silently doubles the folder.

The motifs — the nilavilakku, the jasmine divider, the temple elephants — are
SVG `<symbol>`s defined once at the top of the wedding page and reused with
`<use>`. Every shape is `currentColor`, so each takes the colour of whatever it
sits in. The garlands were generated once and committed as plain SVG.

## Changing the details

All the wording lives in the two `index.html` files, in plain text. The one
thing to keep in step is each event's `<article data-event …>` block:

```html
data-start="2026-11-21T11:45"   local time at the venue
data-end="2026-11-21T12:30"
data-tz="+05:30"                the venue's UTC offset (IST)
data-location="…"               what appears in the guest's calendar
data-map="…"                    where View Location goes
```

Those attributes drive the countdown and both calendar buttons. If you change
the printed time on the page, change them too.

## Previewing locally

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/wedding-62df5d1ad5/>.

## Publishing

Push to `main`; GitHub Pages serves the site from the repository root.
No build step, no dependencies.

## A note on privacy

GitHub Pages sites are public, and the random folder names are the only thing
keeping each invitation to its own guest list. They are unguessable, the pages
ask search engines not to index them, and `robots.txt` repeats that for the
whole site — but anyone holding a link can pass it on. Treat the links as
semi-private, and do not put anything on these pages you would mind a stranger
reading.
