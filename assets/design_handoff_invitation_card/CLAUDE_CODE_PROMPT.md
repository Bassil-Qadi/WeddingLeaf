# Paste this into Claude Code

You are implementing a **guest-facing digital wedding invitation** into our existing app. A full spec and design references are in this folder — **read `README.md` first**, and look at the images in `screenshots/`. The two `.dc.html` files are **design references only** (a prototype format); open them in a browser to see the exact look and motion, but do **not** copy them verbatim.

## Your task
Recreate the design in **our existing codebase**, using its established framework, component patterns, styling system, and animation library. If no frontend exists yet, choose the most appropriate stack and set it up. Match the design pixel-perfectly (colors, typography, spacing, motion timings are all final — see README "Design Tokens" and "Interactions & Behavior").

## Build it as
1. A **`<CoverReveal>`** component with a `treatment` prop = `"envelope" | "doors" | "veil"` — each is a full-screen overlay with a single gold "seal" button that plays the reveal animation described in the README, then sets `pointer-events:none` so the story beneath scrolls. Include the replay (↺) affordance.
2. A **`<InviteStory>`** component: one vertically-scrolling column with the sections in README order (hero → our story → countdown → ceremony → venue/map → dress code → RSVP → footer). It must be **height-constrained to the viewport and scroll internally** on mobile (the prototype originally got this wrong — don't repeat it).
3. A **live countdown** to the wedding date and a **working RSVP form** (name, accept/decline, guest count) — wire submit to POST `{ inviteId, name, attending, guests }` to our backend, with loading + error + success states (the prototype only does local state).

## Must do
- **Parameterize all content** per invite (couple names, date/time, ceremony copy, venue name/address/coords, story timeline, dress code, hashtag, accent color, chosen `treatment`). The prototype hardcodes placeholder data ("Isabella & James", 17 Oct 2026, Villa del Balbianello) — replace with real data/props.
- Replace placeholders: the couple **photo** and the **venue map** (use a real map library centered on the venue coords).
- Respect `prefers-reduced-motion` (shorten/disable reveal animations).
- Make `accent` color configurable via a CSS variable as described in the README.
- Mobile-first; center the column on desktop. **Do not ship the phone bezel** — it's presentation chrome in the mock only.

## Do not
- Do not use the `.dc.html` runtime, `DCLogic`, or any of its machinery in production code.
- Do not invent new colors, fonts, or spacing — use the tokens in the README.

Ask me for the backend RSVP endpoint shape and the data source for invite content if they're not already defined in the codebase.
