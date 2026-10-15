# Dreamworth website: working prototype (Direction 2)

A static, dependency-free build of the four pages in `Dreamworth_Website_Directions_2.zip`:

| Page | File |
|---|---|
| Homepage | `index.html` |
| About us | `about.html` |
| Service: Advertising Agency | `advertising-agency.html` |
| Service: Reputation Management | `reputation-management.html` |

## Run it

```
npx serve prototype
```

Then open the URL it prints. Any static server works. Opening the files directly from disk also mostly works, but a server is safer for fonts and video.

## Structure

```
css/tokens.css    colour, type, spacing, radius and motion tokens (4pt-snapped)
css/site.css      base, 4pt type mechanism, buttons, header, menu, contact, footer, certifications
css/home.css      homepage sections
css/about.css     About sections
css/service.css   service template
js/site.js        injects header / menu / contact / footer, runs all scroll motion
js/home.js        hero mask, services tabs, "what we solve" tracker, sector spotlight, city panels
js/certs.js       certification laurels (Home + About)
```

## The 4pt grid

Every box dimension, padding, margin, gap, radius, font-size and line-height is a multiple of 4px. An automated audit checked the computed styles of every element on all four pages at 390, 768, 1024, 1366, 1440 and 1920px, with the menu open and closed, and found 0 violations.

How it holds at every viewport width, not only at the clamp endpoints:

- **Fluid values are snapped.** Every `clamp()` is wrapped in `round(…, 4px)`, so a fluid gutter steps 20 → 24 → 28px instead of landing on 22.6px.
- **Type snaps automatically.** Any element that sets `--fs` (size) and `--lh` (ratio) gets a rounded font-size *and* a rounded line box (see the `*` rule in `site.css`).
- **Hairlines don't add a pixel.** Dividers are inset `box-shadow`s, and outlines sit inside `border-box` elements with fixed sizes. A 48px button stays 48px.
- **Rounding rule.** The handoff's off-grid values round to the nearest multiple of 4, ties round up (82px header → 80, 54px logo → 56, 17px body → 16, 90px section padding → 88). One exception: uppercase tracked labels (14px) round *down* to 12px, because caps read about 2px larger than mixed case.

What the grid deliberately does not govern:

- **Fluid widths.** A `1fr` column or a `%`-based card width depends on the viewport, so it can't be a multiple of 4 at every width. The grid governs spacing, fixed sizes and type metrics.
- **Aspect-ratio heights.** Heights such as a 21:9 image follow from fluid widths, for the same reason.
- **Word-reveal wrappers.** The spans the reveal motion inserts use `em` padding with equal negative margins, so they add nothing to layout.

Browser floor for `round()`: Chrome 125+, Safari 15.4+, Firefox 118+.

## Where this differs from the handoff, and why

| Change | Reason |
|---|---|
| Bold text is declared as weight **800** (Extrabold) | The approved `.dc.html` pages register both Bold and Extrabold as weight 700, so the later rule wins and every "bold" renders in Extrabold. `design-system/typography.css` maps 700 to Bold. I matched what the client approved. To get the design-system look instead, set `--w-display: 700` in `tokens.css`. |
| Hero has no 16:9 showreel frame | The handoff README describes one, but with `hero=Mask` the design file hides it (`showVideo` is false for Mask). The video plays through the word "impact." instead. |
| Sector spotlight has no "wave pattern" | The handoff README mentions one, but the Spotlight markup never renders it (its ref is unused). |
| Menu lists are top-anchored | With `space-between`, hovering a section changed the list height, moved the section list under the pointer, and caused a hover flicker loop. |
| Phones (< 480px) hide "Let's talk" in the header | Logo, "Let's talk" and "Menu" need about 480px. Below that, `overflow-x: clip` silently cut off the Menu button. The menu has its own "Get in touch" CTA. |
| City panels on phones show the city name | When the panels stack, the design shows only an initial, so you can't tell Thane from Mumbai's row. |
| Pause button on the showreel | Video that autoplays for more than 5 seconds needs a pause control (WCAG 2.2.2). |
| Sector spotlight pauses on keyboard focus and doesn't rotate under reduced motion | The design paused on hover only. |
| Reveals hand back to CSS after they finish | The design leaves inline `transform: none`, which silently disables hover lift on logo tiles, cards and the Let's-talk ring. |
| Dead links show a "not part of this prototype yet" toast | Clicking `#` would otherwise jump to the top. |
| "Online Reputation" in the menu links to the Reputation Management page | That page was otherwise unreachable from the menu. |

## Still placeholder (from the handoff, resolve before launch)

- All About and service-page copy is a draft.
- Case studies, FAQ timings and the four client quotes are placeholders.
- Team names read "Add name" and the portraits are empty frames.
- Photos are Unsplash stand-ins loaded by URL. If one fails to load, its navy frame shows instead.
- `media/short.mp4` is placeholder footage (6 MB, H.264 1080p). Host the real showreel on a video CDN.
- Careers, social, legal and case-study links go nowhere yet.
