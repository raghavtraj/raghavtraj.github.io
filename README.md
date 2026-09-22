# Raghav &amp; Krishnapriya — wedding invitations

Two separate invitation sites, hosted free on GitHub Pages. A guest only ever
sees the function they were invited to: the pages do not link to each other,
and the root page reveals neither.

| Page | URL | When |
|---|---|---|
| Wedding ceremony | `/wedding-62df5d1ad5/` | Saturday 21 November 2026, 11.45 – 12.30 PM |
| Reception | `/reception-8b0696e3be/` | Sunday 22 November 2026, 5 PM onwards |
| Neutral front door | `/` | — |

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
index.html                        neutral front door — links to neither function
wedding-62df5d1ad5/index.html     the wedding ceremony
reception-8b0696e3be/index.html   the reception
robots.txt                        keeps search engines off the whole site
assets/css/styles.css             both palettes; `data-theme` on <html> picks one
assets/js/main.js                 gate, petals, countdown, calendar buttons
```

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
