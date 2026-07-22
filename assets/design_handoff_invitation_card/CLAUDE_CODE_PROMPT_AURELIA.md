# Paste this into Claude Code — Template 4: "Aurelia"

You are implementing a **guest-facing digital wedding invitation** into our existing app. This is the **fourth, modern treatment** — codename **Aurelia**: a kinetic gold-on-ink portal that opens into a cinematic scroll-story. It is **architecturally different** from the three classical treatments (envelope / doors / veil) — do not reuse their `<CoverReveal>` + `<InviteStory>` split. Read that folder's `README.md` for shared design tokens, but Aurelia's cover and story are **one unit**: the cover zooms and dissolves *into* the story that lives behind it.

The design reference is **`InviteAurelia.dc.html`** in this folder — open it in a browser to feel the exact look and motion. It is a **prototype format only**; do **not** copy its runtime, `DCLogic`, `<x-dc>`, `sc-if`, or `{{ }}` machinery into production code.

## Your task
Recreate Aurelia in **our existing codebase** using its framework, component conventions, styling system, and animation library. Match it precisely — the tokens, sizes, and motion timings below are final.

## Structure — a single `<AureliaInvite>` component
Two stacked full-screen layers inside one relative container (`overflow:hidden`), plus a one-shot light sweep:

1. **Story layer** (`z:1`, underneath) — a single internally-scrolling column, `100%` height, `overflow-y:auto`. Sections in order:
   - **Hero** — kicker "The Wedding Of", shimmering gold-gradient names (Isabella / italic `&` / James), diamond divider, matted couple **photo** placeholder, animated "Scroll" cue at the bottom.
   - **Our Story** — vertical timeline (2018 / 2021 / 2026) with rotated-diamond nodes on a hairline spine.
   - **Save the Date** — big `17 · 10`, and a **live countdown** (days / hrs / min / sec) to `2026-10-17T16:30:00`.
   - **The Ceremony** — "Half past four", venue name, italic reception note.
   - **Venue** — matted **map** placeholder + address + "Get Directions" button.
   - **Dress Code** — "Black Tie" + a row of five palette dots.
   - **RSVP** — see below.
   - **Footer** — "I & J" monogram + hashtag + date.
   - Behind the hero, a **giant monogram watermark** ("I&J", ~340px, `opacity:.05`) that **parallaxes** on scroll (`translateY = scrollTop * 0.9`). This is intentional, not a bug.
   - Each section below the hero starts `opacity:0; translateY(26px)` and **reveals on scroll** via IntersectionObserver (`threshold ~0.16`, root = the scroller), transition `.9s cubic-bezier(.2,.7,.2,1)`. Add a ~3.2s fallback timer that force-reveals all, so nothing can get stuck hidden.

2. **Cover layer** (`z:5`, on top) — deep radial near-black ground (`radial-gradient(125% 90% at 50% 8%, #26221d, #171513 58%, #100e0c)`), a thin inset gold frame, a drifting blurred **aurora** blob, six slowly **floating gold light particles**, the kicker "Together with their families", the shimmering **I&J** monogram, and a **rotating-ring portal button**: a conic-gradient gold ring (masked to a 2px ring) spinning `6s linear`, a pulsing radial glow behind it, and a dark bezel disc with an italic `&`. Labels "Open Invitation" and a pulsing "Tap to enter" hint.

3. **Light sweep** (`z:7`, `pointer-events:none`) — a single diagonal gold gleam that runs once across the screen on open.

## The open transition (this is the signature moment)
On tapping the portal button (`open = true`):
- **Cover**: `transform: scale(7)` from `transform-origin:50% 58%`, `opacity → 0`, `filter: blur(14px)`, over **~1.7s** `cubic-bezier(.7,0,.2,1)` (opacity ~1.22s eased, starting +.18s). Then `pointer-events:none`.
- **Story**: eases from `scale(1.05) → scale(1)` (origin `50% 56%`) over **~1.9s** `cubic-bezier(.2,0,0,1)` — it "settles" into place as the cover blows past.
- **Sweep**: `auSweep` runs once (~1.25s) — a skewed gold gleam translating left→right.
- A **replay (↺)** button fades in top-right (`.5s`, delayed `.5s`); tapping it reverses `open` and resets `scrollTop = 0`.

## Live behavior (prototype only fakes these)
- **Countdown**: tick every 1s to the real wedding datetime; clamp at 0; zero-pad hrs/min/sec.
- **RSVP form**: name field, a segmented **Joyfully accept / Regretfully decline** control, and (only when accepting) a **guest stepper** (1–9). On submit, show the animated heart + a thank-you message whose title/body differ for accept vs decline. **Wire submit to POST `{ inviteId, name, attending, guests }`** to our backend with loading / error / success states — the prototype only sets local state.

## Must do
- **Parameterize all content per invite**: couple names + monogram letters, wedding datetime, story timeline entries, ceremony copy, venue name/address/coordinates, dress-code palette, hashtag, and **accent color**. The prototype hardcodes placeholders ("Isabella & James", 17 Oct 2026, Villa del Balbianello, Lake Como) — replace with real data/props.
- Replace placeholders: couple **photo** and the **venue map** (real map library centered on the venue coords).
- Respect **`prefers-reduced-motion`**: shorten the open transition (~0.6s), and drop the ambient loops (aurora, particles, shimmer, spin) to static/near-static. The reference exposes a `reducedMotion` flag for exactly this.
- Keep the accent configurable via a CSS variable; every gold in the design derives from it.
- **Mobile-first**; center the column on desktop with a comfortable max-width. **Do not ship any phone bezel** — that's presentation chrome in the mock only.

## Design tokens (from the Classical system — see README for the full set)
- Ground `#f3f2f2`, text `#201f1d`, accent `#b68235` with its 100–900 ramp; surface + divider tokens for cards/rules.
- Type: **Cormorant Garamond** headings over **Lora** body; numerals tabular (`font-feature-settings:'tnum'`). Gold headline gradient uses accent-800 → accent-500 → `#e6b45f` → accent-500 → accent-800, shimmering via background-position.
- Motion easings are listed inline above — keep them; they carry the "weighted luxury" feel.

## Do not
- Do not use the `.dc.html` runtime, `DCLogic`, `sc-if`, or `{{ }}` in production.
- Do not invent new colors, fonts, or spacing — use the tokens.
- Do not remove the 5%-opacity parallax monogram watermark — it is intended.

Ask me for the backend RSVP endpoint shape and the invite-content data source if they're not already defined in the codebase.
