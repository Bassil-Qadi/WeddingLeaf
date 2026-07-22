# Handoff: Wedding Invitation Card — Guest View

## Overview
A mobile-first, luxury digital wedding invitation for the guest-facing view of a wedding-invitation web app. The experience has two acts:

1. **The cover / opening moment** — the guest lands on a closed cover with a single gold "seal" button. Tapping it plays a cinematic reveal animation.
2. **The story** — once open, the invitation reveals a single vertically-scrolling "story" containing all the wedding details, ending in a working RSVP form.

There are **three interchangeable opening treatments** for Act 1 (envelope, parting doors, veil). They all reveal the **exact same story** (Act 2). Treat the opening as a pluggable component and the story as a shared component reused by all three.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. They use a small proprietary component runtime (`.dc.html` + `DCLogic`) that is **not** part of your app and should be ignored as an implementation detail.

Your task: **recreate these designs in your app's existing environment** (React, Vue, Svelte, SwiftUI, etc.) using its established component patterns, styling approach, and animation library. If no frontend exists yet, pick the framework that best fits the project. Read the HTML for exact values; re-express the markup/logic idiomatically in your stack.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, motion timing, and interactions are final and intentional. Recreate the UI pixel-perfectly. The one deliberate placeholder is imagery (couple photo, map) — see **Assets**.

---

## Screens / Views

The whole experience lives on **one route** (e.g. `/i/:inviteId`) rendered inside a phone-width column. It is not multiple pages — it is one cover overlay on top of one scrollable story.

Design canvas: content is designed for a **360 × 740 px** screen (inside a phone frame in the mock; in production it's just a full-viewport mobile column, max-width ~430px, centered on desktop).

### View 1 — The Cover (Act 1)
- **Purpose**: Create anticipation; the guest taps once to "open" the invitation.
- **Layout**: A full-screen overlay (`position: absolute; inset: 0`) stacked ABOVE the story (higher z-index). Contents centered. When opened, the overlay animates away and sets `pointer-events: none` so the story beneath becomes scrollable.
- **Shared element — the gold button/seal** (identical across all three treatments):
  - 92 × 92 px circle.
  - Background: `radial-gradient(circle at 38% 32%, #e3c589, #a5762f 78%)`.
  - Shadow: `0 10px 24px rgba(74,50,15,.4), inset 0 2px 3px rgba(255,255,255,.45), inset 0 -3px 6px rgba(74,50,15,.4)`.
  - Label inside: monogram `I&J` in Cormorant Garamond italic, 30px, color `#4a3212` (envelope & doors). For the veil, the label is the word `OPEN` in Jost, 9px, weight 500, letter-spacing `.24em`, uppercase, `#4a3212`.
  - Two concentric **pulse rings** behind it: 92×92 circles, `1px solid rgba(176,137,79,.6)`, running `@keyframes ringP` (see Interactions), the second delayed 1.3s.
  - Below the button: a **tap hint** — Jost 9px, letter-spacing `.3em`, uppercase, pulsing opacity (`@keyframes tapH`). Copy varies per treatment (below). The hint is hidden while opening/opened and can be globally toggled off.
- **Replay button (`↺`)**: appears top-right (`top:46px; right:16px`) only after opening. 34×34 circle, `background: rgba(20,18,16,.5)`, `backdrop-filter: blur(4px)`, white `↺` glyph 15px. Resets the cover to closed so the opening can be replayed. Fades in with a 0.45s delay after the reveal.

#### Treatment 1a — Envelope & wax seal
- Cover background: `linear-gradient(158deg, #f4ecdd 0%, #ecdfc7 100%)` (warm ivory paper).
- Inset frame: `1px solid rgba(176,137,79,.45)`, inset 18px.
- Faint printed text near bottom: line 1 "The pleasure of your company" (Jost 9px, `.34em`, uppercase, `rgba(44,38,32,.4)`), line 2 "Isabella & James" (Cormorant Garamond italic, 26px, `rgba(154,114,60,.65)`).
- **Flap**: a downward-pointing CSS-border triangle spanning the full width at the top, height 172px, color `#ead9bc`, with a subtle drop shadow. `transform-origin: top center`.
- **Seal**: the shared gold button, positioned at the flap's tip (~150px from top, horizontally centered).
- Hint copy: **"Tap the seal to open"** (dark, `rgba(44,38,32,.55)`).
- **Open sequence**: (1) seal fades + scales to 0.2 over 0.5s; (2) flap rotates open `rotateX(-176deg)` over 0.95s starting at 0.12s; (3) the whole cover slides down `translateY(122%)` over 1.6s starting at ~0.95s, revealing the story.

#### Treatment 1b — Parting doors
- Two panels, each 50% width, full height, meeting at center.
  - Left panel: `linear-gradient(100deg, #232d27, #2e3a32)`, `border-right: 1px solid rgba(176,137,79,.55)`. Thin gold accent line inset from the inner edge. A giant faded monogram letter **I** (Cormorant Garamond italic, 150px, `rgba(176,137,79,.14)`) near the inner edge.
  - Right panel: mirrored gradient `linear-gradient(260deg, #232d27, #2e3a32)`, `border-left` gold, faded letter **J**.
- Center content (fades out on open): eyebrow "You are invited to the wedding of" (Jost 9px, `.4em`, uppercase, `rgba(246,241,233,.6)`); names "Isabella / and / James" (Cormorant Garamond 34px, the "and" italic 24px in `#d8b878`); the shared gold button; hint **"Tap to enter"** in `rgba(216,184,120,.85)`.
- **Open sequence**: center content fades/scales out over 0.5s; left panel slides `translateX(-101%)`, right panel `translateX(101%)`, both over 1.6s, revealing the story.

#### Treatment 1c — Veil lift
- Cover background: `linear-gradient(158deg, #2b2620, #201b16)` (dark), plus a diagonal sheen overlay `linear-gradient(105deg, transparent 30%, rgba(216,184,120,.09) 50%, transparent 70%)`, plus an inset gold frame `1px solid rgba(176,137,79,.35)` at 18px.
- Centered column (fades out on open): eyebrow "Together with their families"; large monogram `I & J` (Cormorant Garamond 72px, `#d8b878`, the `&` italic 44px); a gold diamond divider; the shared gold button (label "OPEN"); hint **"Tap to unveil"**.
- **Open sequence**: inner content fades out over 0.35s; the entire veil lifts `translateY(-102%)` over 1.6s, revealing the story.

### View 2 — The Story (Act 2, shared by all three)
A single scroll container: `height:100%; overflow-y:auto; background:#f6f1e9; color:#2c2620`. Scrollbar hidden. On reveal it eases from `scale(1.06)` → `scale(1)` over ~1.9s for a subtle "settle" (`cubic-bezier(.2,0,0,1)`).

Sections, in order (each `box-sizing:border-box`, generous vertical padding ~64–70px, centered text unless noted):

1. **Hero / couple intro** — `min-height:100%`, vertically centered.
   - Eyebrow "Together with their families" (label style, see tokens).
   - Gold diamond divider.
   - Names stacked: "Isabella" (Cormorant Garamond 56px, weight 500) / "&" (italic 38px, accent color) / "James" (56px).
   - Sub: "request the pleasure of your company as they celebrate their marriage" (EB Garamond italic 16px, `#6b6157`, max-width 238px).
   - Photo placeholder: 148×188px, `1px solid accent` frame with 7px padding (see Assets).
   - Scroll cue pinned bottom: "Scroll" + bouncing `↓` (`@keyframes stCue`).
2. **Our Story** (timeline) — top border `1px solid rgba(44,38,32,.09)`. Eyebrow "Our Story", heading "How it began" (Cormorant 30px). Three left-aligned rows (max-width 280px), each = big italic year (Cormorant 26px, accent) + a Jost uppercase label + an EB Garamond body line. Content:
   - **2018 — A chance meeting**: "A rainy evening in a Florence bookshop, two hands reaching for the same worn novel."
   - **2021 — The question**: "On the shores of Lake Como at golden hour, one knee, one ring, one certain yes."
   - **2026 — Forever begins**: "Returning to where it all felt inevitable, to promise the rest of our days."
3. **Save the Date / countdown** — background `#efe7d9`. Eyebrow "Save the Date"; "Saturday" (Cormorant italic 22px); "17 · 10" (Cormorant 52px); "October Two Thousand Twenty-Six" (Jost 11px, `.34em`, uppercase). **Live countdown** to `2026-10-17T16:30:00`: four boxes (Days / Hrs / Min / Sec), each `1px solid rgba(44,38,32,.14)`, number in Cormorant 30px (seconds box number uses accent color), label Jost 8px `.18em` uppercase.
4. **The Ceremony** — eyebrow "The Ceremony"; gold diamond divider; "Half past four / in the afternoon" (Cormorant 34px); "Villa del Balbianello" (Cormorant italic 24px, accent); "Lenno · Lake Como · Italy" (Jost 11px `.2em` uppercase); italic note "Reception & dinner to follow beneath the loggia, dancing until the stars."
5. **Venue / map** — a 210px-tall map placeholder band (see Assets) with a gold teardrop pin (26px, `border-radius:50% 50% 50% 0; transform:rotate(-45deg)`, accent bg). Below: address "Via Guido Comoedia 5 / 22016 Lenno CO, Italy" (Jost 11px `.2em` uppercase); a "Get Directions" outline pill button (Jost 10px, weight 500, `.2em` uppercase, `1px solid accent`, radius 999px, padding 12×26px).
6. **Dress Code** — background `#efe7d9`. Eyebrow "Dress Code"; "Black Tie" (Cormorant 38px); italic "Formal attire in a palette of dusk and gold"; a row of five 30px palette swatch circles: `#f6f1e9` (bordered), `#6f7d6a`, accent, `#3a3128`, `#7a5c56`.
7. **RSVP** — eyebrow "Will you join us"; "Kindly RSVP" (Cormorant 32px). See Interactions for form behavior.
8. **Footer** — top border. Monogram "I & J" (Cormorant italic 30px, accent); "#IsabellaAndJames · 17.10.26" (Jost 9px `.3em` uppercase, `#a89a84`).

---

## Interactions & Behavior

### Opening the cover
- Single click/tap anywhere on the gold button opens the cover (see per-treatment sequences above).
- All reveal transitions use easing `cubic-bezier(.7,0,.15,1)`.
- While closed, the cover captures pointer events; while open, `pointer-events:none` so the story scrolls.
- **Replay**: the `↺` button re-closes the cover (reverse of the reveal).

### Keyframes
- `ringP` (button pulse rings): `0%{transform:scale(1);opacity:.5} 70%{transform:scale(1.55);opacity:0} 100%{opacity:0}`, 2.6s ease-out infinite; second ring delayed 1.3s.
- `tapH` (hint): opacity `.5 → 1 → .5`, 2s ease-in-out infinite.
- `stCue` (scroll cue arrow): `translateY(0→7px→0)` + opacity `.45→1→.45`, 1.9s.
- `stHeart` (RSVP confirmation heart): `scale(1→1.14→1)`, 2.4s.

### Countdown
Recompute every 1s from `now` to the target date `2026-10-17T16:30:00`. Clamp to zero (no negatives). Two-digit pad hours/min/sec.

### RSVP form (working)
State: `name` (text), `attending` (`'yes' | 'no' | null`), `guests` (int, default 2, min 1 max 9), `submitted` (bool).
- **Name**: bottom-border-only text input (`1px solid rgba(44,38,32,.25)`), EB Garamond 17px, placeholder "First & last name".
- **Attending**: two pill buttons "Joyfully Accept" / "Regretfully Decline" (Jost 10.5px, weight 500, `.1em`, uppercase, radius 999px, `1px solid rgba(44,38,32,.2)`). Selected pill fills with accent color, text `#f6f1e9`. 0.3s transition.
- **Guest count** (only visible when attending = yes): a "− N +" stepper. Circular 32px `−`/`+` buttons (`1px solid rgba(44,38,32,.22)`), count in Cormorant 24px. Clamp 1–9.
- **Send Response** button: full-width, accent background, `#f6f1e9` text, Jost 11px, weight 500, `.24em`, uppercase, padding 15px, radius 999px.
- **On submit**: set `submitted=true`; if `attending` was still null, default to `'yes'`. Replace the form with a confirmation:
  - A 56px circle outline (`1px solid accent`) containing a heart `❤` (accent), animating `stHeart`.
  - If attending: title "We can't wait to celebrate", body "Your response is received. Details and a full schedule will arrive by post closer to the day."
  - If declining: title "You will be missed", body "Thank you for letting us know. We will be thinking of you on our special day."
- **Production note**: in the mock, submit is local state only. In your app, POST the RSVP `{ inviteId, name, attending, guests }` to your backend and show the confirmation on success (add loading + error states — not present in the mock).

### Configurable options (were "tweaks" in the mock — expose as props/config)
- `accent` (color) — the gold accent used throughout. Default `#b0894f`. Applied via a CSS variable `--a` on the story root with fallback `#b0894f`; every accent usage reads `var(--a, #b0894f)`. Suggested swatches: `#b0894f` (gold), `#8a7d63` (champagne taupe), `#6f7d6a` (sage), `#7a5c56` (rosewood). NOTE: the cover's fixed gold button/seal gradient is intentionally NOT driven by this variable in the mock — decide whether to tie it to `accent` in production.
- `showHint` (bool, default true) — show/hide the "tap to…" hint on the cover.
- `reducedMotion` (bool, default false) — when true, shorten reveal durations (main reveal 1.6s → 0.5s, flap 0.95s → 0.4s, fades 0.5s → 0.35s, story settle 1.9s → 0.6s). Also respect the user's OS `prefers-reduced-motion` in production.

### Responsive
Designed for mobile. On larger screens, center the ~360–430px column; the phone bezel in the mock is presentation chrome only — do not ship it.

---

## State Management
- `coverOpen: boolean` (per invitation) — drives the reveal + `pointer-events`. `openCover()` / `resetCover()`.
- `now: number` — ticked every 1s for the countdown (clear the interval on unmount).
- RSVP: `name`, `attending`, `guests`, `submitted` (+ production `loading`, `error`).
- Data to fetch/inject per invite: couple names, wedding date/time, ceremony copy, venue name + address + map coords, story timeline entries, dress code, hashtag, accent color, chosen opening treatment (a | b | c). The mock hardcodes placeholder content ("Isabella & James", 17 Oct 2026, Villa del Balbianello) — parameterize all of it.

## Design Tokens
**Colors**
- Ivory background: `#f6f1e9`; alt section background: `#efe7d9`
- Ink (text): `#2c2620`; soft ink: `#6b6157` / `#5d554b`; muted: `#a89a84`
- Accent gold (configurable): `#b0894f` (deep variant `#9a723c`)
- Button/seal gold gradient stops: `#e3c589` → `#a5762f`; seal text `#4a3212`; light gold `#d8b878`
- Dark cover tones: `#2b2620`, `#201b16`, `#232d27`, `#2e3a32`
- Phone bezel (mock only): `#141210`
- Hairlines: `rgba(44,38,32,.09–.25)`; gold hairline `rgba(176,137,79,.35–.6)`

**Typography**
- Display / serif: **Cormorant Garamond** (weights 400/500/600, has italics) — names, headings, numbers, monograms.
- Body serif: **EB Garamond** (regular + italic) — running prose, input text.
- Labels / UI: **Jost** (300/400/500) — eyebrows, buttons, uppercase micro-labels; letter-spacing `.1em`–`.4em`, uppercase.
- Load from Google Fonts (mock uses the standard CSS2 links); in production use your app's font pipeline.

**Radius**: pills `999px`; phone screen `35px` (mock); frames square-ish (`2px`).

**Shadows**: button `0 10px 24px rgba(74,50,15,.4)` + insets (above); phone bezel `0 26px 60px -18px rgba(0,0,0,.5)` (mock only).

**Motion**: reveal easing `cubic-bezier(.7,0,.15,1)`; story settle `cubic-bezier(.2,0,0,1)`; durations listed under Interactions.

## Assets
All imagery is **placeholder** (striped fills with a monospace caption) — replace with real assets:
- **Couple photo** (hero) — 148×188px framed. Supply a portrait image.
- **Venue map** (section 5) — 210px-tall band. Replace with a real interactive map (e.g. Mapbox/Google Maps/Leaflet) centered on the venue coords; keep the gold teardrop pin styling if you like.
- Icons used are plain unicode glyphs (`↓ ↺ ❤ − +`); swap for your icon set.
- No third-party brand assets are used.

## Screenshots
Reference renders are in `screenshots/`:
- `1a-envelope-closed.png` — Treatment 1a cover (closed).
- `1b-doors-closed.png` — Treatment 1b cover (closed).
- `1c-veil-closed.png` — Treatment 1c cover (closed).
- `story-1-hero.png` — Opened story, hero / couple intro.
- `story-2-countdown.png` — Save-the-date countdown + ceremony sections.
- `story-3-venue-dresscode.png` — Venue/map + dress code sections.
- `story-4-rsvp.png` — RSVP form (default state).

## Files
Design reference prototypes included in this bundle (proprietary `.dc.html` runtime — read for exact values, do not ship):
- `Wedding Invitation.dc.html` — the three cover treatments (1a envelope, 1b doors, 1c veil) + open/replay logic + config props. Mounts the story three times.
- `InviteStory.dc.html` — the shared scrollable story (hero → timeline → countdown → ceremony → map → dress code → RSVP → footer) + countdown and RSVP logic.

Open either file in a browser to see the live behavior.
