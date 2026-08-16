# KIOSK — handoff (2026-08-13)

Session hand-off for `kiosk-agency`. Read this top to bottom before touching anything.

---

## 0. The one-line summary

The **kioskoman.com homepage was rebuilt from scratch** (2026-08-06) as a black→**light** editorial one-pager,
then extended over the following week with a films page, a services page, an inquiry dialog and a WebGL glow.
**Production is live and healthy. Nothing since 2026-08-06 is committed to git.**

---

## 1. 🚨 State of play — read this first

| | |
|---|---|
| Live | **https://www.kioskoman.com** — last deploy `kiosk-agency-anyxkztoe` (services rebuilt section by section) |
| Git HEAD | `9bbfacd` — everything committed, tree clean |
| Deploy | `vercel --prod --yes` from the repo root. Auto-aliases `www.kioskoman.com`. **`git push` does NOT deploy.** |
| Local | `npm run dev` → the project's `.claude/launch.json` puts it on **:3010** |

### Which surface is which
- Homepage `#services` = an **accordion of index rows**: `.s-item` = a `.s-row` header (index,
  title, Inquiry pill, rotating plus) over a `.s-body` drawer holding the description. One open at
  a time, the first open on load. It went cards → plain rows → accordion → badges-out in a single
  day, so do not "simplify" it back. The row header is deliberately not a `<button>`: `.s-toggle`
  is a layer behind the contents, which pass clicks through to it, so the pill can live inside the
  row without nesting buttons.
- `/services` = the **full breakdown**, one `.sv3-sec` section per service.
- Homepage `#clients` = the **marquee wall**. `/clients` = the **honeycomb**.

### Caught up 2026-08-14
The August backlog is committed (`3da3ebb`) and deployed. Verified against production HTML:
the homepage services are the `.s-card` grid (0 old `.s-row`), and `/services` is 8 `.sv3-sec`
sections (0 `.sv2-item`). `origin/main` is still behind — push when the Mapbox false positive
is dealt with.

---

## 2. Where things live

```
src/app/
  layout.tsx          bare shell — Anton + Space Grotesk + Inter vars, metadata, JSON-LD
  page.tsx            the homepage, wraps everything in .ksite
  kiosk.css           ~2000 lines, EVERY rule scoped under .ksite
  films/page.tsx      /films
  services/page.tsx   /services
  clients/page.tsx    /clients — the honeycomb
  (legacy)/           pre-2026 pages + their own layout holding the old chrome
                      (about, case-studies, contact, industries, insights, packages,
                       process, services/[slug])
src/components/k/     the 2026 site. Chrome, Hero, Manifesto, Feed, Ivory, Ground,
                      Clients, Contact, StickyCta, Motion, Glow, InquiryForm,
                      FilmStage, ServiceStage, ClientHive
src/lib/kiosk.ts      SINGLE SOURCE OF TRUTH for copy, links, phone numbers, images
public/k/             28 build/number photos + public/k/feed/ (32 branded client cards)
```

`Motion.tsx` is one `gsap.context` holding every scroll/pointer behaviour on the homepage,
queried against the static markup the section components render. Each block guards on element
presence, so it is safe to mount on any page.

---

## 3. Design system

```
--bg      #ffffff     --ink/--text  #111110
--ivory   #ece8e1     --muted       #6b6860
--accent  #ff4b1f     --line        rgba(17,17,16,.16)
```
Anton (display, all-caps) + Space Grotesk (body), both via `next/font/google`.
Never use em/en dashes in client-facing copy.

---

## 4. 🚨 Traps — every one of these cost real debugging time

**Marquee tear.** The loop distance for a track rendered twice is the **`offsetLeft` of the middle
child**, NOT `scrollWidth/2`. With a gap, the old formula drops half a gap per lap (measured 7px)
— that was the visible break. `.b-row img` also needs `aspect-ratio` so width is reserved before
lazy images land.

**Percentage transforms.** `translateX(%)` resolves against the element's OWN width. The film reel
is one frame wide, so a percentage moved it 30px instead of 148. Use pixels.

**`offsetLeft` rounds to whole pixels** and the error compounds. Measure pitch from
`getBoundingClientRect()` (5px drift → 0.4px).

**CSS custom properties do not reach siblings.** `--fs-*` was declared on `.fs-viewport`; `.fs-head`
is its sibling, so its `calc()` silently collapsed and the title flew off-screen. Declare shared
vars on the common ancestor.

**Never let CSS hide something that only JS reveals.** The manifesto headline shipped invisible
because `.w > span` had `translateY(110%)` in CSS *and* a `dataset.split` guard that made a second
effect run skip setup after the first run's cleanup had killed the trigger. Words are now split in
React, the CSS no longer hides them, and there is a `clearProps` + immediate-reveal fallback.

**Two client surfaces, on purpose.** The homepage keeps the marquee wall (`Clients.tsx`, driven by
`Motion.tsx`). The Apple Watch honeycomb is the separate `/clients` page (`ClientHive.tsx`), which
owns its own pointer handling and `requestAnimationFrame` and is untouched by `Motion.tsx`. The
honeycomb was briefly on the homepage and was moved out; do not merge them back without asking.
Two things in it are deliberate and should not be "fixed": plain wheel does NOT zoom (it still
scrolls the page, so the section never hijacks scrolling) and `.aw-stage` uses `touch-action:
pan-y` so a finger can never get trapped on mobile.

**Tailwind preflight leaks into `.ksite`.** Two fixes must stay: the 10px custom scrollbar is scoped
to `body:has(.legacy-shell)` (it was stealing layout width) and `.ksite button { line-height: normal }`.

**`.display` sets `line-height:.88`,** which crops Anton's caps as soon as a reveal wrapper clips the
line box. `.sv-title` needs `line-height:1.16`.

**Anything above a pinned box pushes it down** until the pin engages. The back link lives INSIDE
`.fs-sticky` for exactly this reason.

**The nav lost `mix-blend-mode:difference`** — on white it flipped the accent to cyan. Nav colours are
explicit ink now, plus `.ksite:has(#menu.open) .logo i { color: var(--ink) }` so the dot survives the
orange menu.

---

## 5. Verifying in this environment

The preview pane is backgrounded, so **`requestAnimationFrame` is paused and scroll events never
fire**. Consequences:
- mid-page screenshots come back blank or stale — they are NOT evidence of a bug;
- anything animated with `gsap.from` sits frozen at its start state;
- `html { scroll-behavior: smooth }` freezes mid-scroll — set `scrollBehavior='auto'` first.

**Verify with DOM digests instead**: element counts, `getBoundingClientRect`, computed styles,
normalized `textContent`. To capture a real screenshot of a mid-page section, inject a style that
hides the sections above it and force `opacity:1; transform:none` on the frozen elements.

`ffmpeg` is NOT installed — extract video frames with `cv2` (installed).
**oryzo.ai is unreachable** from this machine (browser, curl and WebFetch all time out). Work from
screenshots.

---

## 6. Reference builds the design came from

- `https://endearing-cupcake-5bfdfa.netlify.app/` — the original one-to-one source for the homepage.
- `https://deft-crepe-3b15a5.netlify.app/` — a later iteration; source of the brand wall, the sticky
  CTA and the `/services` accordion pattern. It also has a FAB inquiry **form** we did not port.
- `~/Movies/TapRecord/Video/REC-20260811035105.mp4` — the recording that defined the `/films`
  magnifier behaviour.
- Originals for the client imagery: `~/Desktop/kiosk/pic/` (32 × 1080×1920 PNG).

---

## 7. Open items

1. **Push to GitHub.** Local is committed but `origin/main` is stale (see the Mapbox item below).
2. `/services` is now a section per service (`.sv3-*`), no accordion anywhere. The services data
   still has only `idx / title / body / img`, so each section is one paragraph. If the sections
   should carry more depth, get real copy from the client rather than inventing capability lists.
3. A sticky index rail down `/services` was offered and NOT built, to keep the change purely visual.
4. `/insights` (linked from the menu as **Blog**) is still the old dark design.
5. The inquiry form has **no backend** — it composes a WhatsApp message. Wire an endpoint if leads
   need storing.
6. `Start a project` CTAs still deep-link to WhatsApp; they could open `InquiryForm` instead.
7. Images are the reference build's compressed copies (460×818). Ask the client for originals.
8. Film→thumbnail mapping is a guess except `Zunairah`; swap in `src/lib/kiosk.ts`.
9. The brand tally claims **40** while the wall names **31** — get 9 more names or drop the number.
10. Vercel's build machine failed once fetching Space Grotesk from Google (`module-not-found`). A
    retry fixed it; if it recurs, self-host the fonts.
11. GitHub push protection flags the Mapbox **`pk.`** token in `src/components/dock/MapModal.tsx:7`
    (publishable, URL-restricted, false positive). Allow it again or move it to
    `NEXT_PUBLIC_MAPBOX_TOKEN`.

---

## 8. Commands

```bash
cd "/Users/amirshamsipur/Claude code/kiosk-agency"

npm run dev                 # :3010
npm run build               # always green before deploying
npm run lint                # 10 pre-existing errors in legacy components; new files are clean
vercel --prod --yes         # deploy + auto-alias www.kioskoman.com
```
